import { v5 as uuidv5 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { sortObj } from 'jsonabc';

// UUID namespace for AoS (different from 40K to avoid collisions)
const AOS_UUID_NAMESPACE = 'b8f3d2a1-5c4e-4f6a-9d8b-1e2f3a4b5c6d';

// Array to collect change reports for each faction
const changeReports = [];

// Progress tracking
let currentFactionIndex = 0;
let totalFactions = 0;

// Progress bar helper
function updateProgress(factionName, status = 'Processing') {
  const barWidth = 30;
  const progress = totalFactions > 0 ? currentFactionIndex / totalFactions : 0;
  const filled = Math.round(barWidth * progress);
  const empty = barWidth - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = Math.round(progress * 100);

  process.stdout.write(`\r[${bar}] ${percent}% (${currentFactionIndex}/${totalFactions}) ${status}: ${factionName.padEnd(30)}`);
}

function clearProgress() {
  process.stdout.write('\r' + ' '.repeat(120) + '\r');
}

// Helper function to deep compare two objects, ignoring specified keys
function deepEqual(obj1, obj2, ignoreKeys = []) {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return obj1 === obj2;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2;

  const keys1 = Object.keys(obj1).filter(k => !ignoreKeys.includes(k));
  const keys2 = Object.keys(obj2).filter(k => !ignoreKeys.includes(k));

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key], ignoreKeys)) return false;
  }

  return true;
}

// Helper function to sort object keys recursively (without sorting arrays)
function sortObjectKeys(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  const sorted = {};
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortObjectKeys(obj[key]);
  }
  return sorted;
}

// Helper function to normalize an item for comparison (sort keys only, stringify)
function normalizeForComparison(item) {
  return JSON.stringify(sortObjectKeys(JSON.parse(JSON.stringify(item))));
}

// Helper function to compare arrays of items by name
function compareByName(oldItems, newItems, itemType) {
  const changes = {
    added: [],
    removed: [],
    modified: []
  };

  const oldByName = new Map(oldItems?.map(item => [item.name, item]) || []);
  const newByName = new Map(newItems?.map(item => [item.name, item]) || []);

  // Find added and modified
  for (const [name, newItem] of newByName) {
    const oldItem = oldByName.get(name);
    if (!oldItem) {
      changes.added.push(name);
    } else {
      const oldNormalized = normalizeForComparison(oldItem);
      const newNormalized = normalizeForComparison(newItem);
      if (oldNormalized !== newNormalized) {
        changes.modified.push(name);
      }
    }
  }

  // Find removed
  for (const [name] of oldByName) {
    if (!newByName.has(name)) {
      changes.removed.push(name);
    }
  }

  return changes;
}

const readFile = (file) => {
  if (!file) {
    return;
  }
  try {
    let res = fs.readFileSync(file, 'utf8');
    return res;
  } catch (e) {
    return null;
  }
};

// Find the newest data-export file in temp folder
function getNewestDataExport() {
  const tempDir = './temp';
  const files = fs.readdirSync(tempDir)
    .filter(f => f.startsWith('data-export-') && f.endsWith('.json'))
    .map(f => ({
      name: f,
      path: path.join(tempDir, f),
      mtime: fs.statSync(path.join(tempDir, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error('No data-export files found in temp folder');
  }

  console.log(`Using data export: ${files[0].name}\n`);
  return files[0].path;
}

const dataExportPath = getNewestDataExport();
const newDataExportFile = readFile(dataExportPath);
const newDataExport = sortObj(JSON.parse(newDataExportFile).data);
const dataVersion = JSON.parse(newDataExportFile).metadata.data_version;

// Function to remove markdown from a string
function removeMarkdown(str) {
  if (!str) return str;
  return str
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
    .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```(.*?)```/gs, '$1') // Remove code blocks
    .replace(/#+\s?(.*?)\s*$/gm, '$1') // Remove headers
    .replace(/>\s?(.*?)\s*$/gm, '$1') // Remove blockquotes
    .replace(/^-{3,}\s*$/gm, '') // Remove horizontal rules
    .replace(/^( *[-*+] +.*)$/gm, '$1') // Remove unordered list items
    .replace(/^( *\d+\. +.*)$/gm, '$1') // Remove ordered list items
    .trim();
}

// Get grand alliance name for a faction
function getGrandAlliance(faction, data) {
  if (!faction.parentFactionKeywordId) {
    // This IS a grand alliance
    return faction.name;
  }

  let current = faction;
  while (current.parentFactionKeywordId) {
    const parent = data.faction_keyword.find(f => f.id === current.parentFactionKeywordId);
    if (!parent) break;
    current = parent;
  }

  // Map grand alliance names to shorter versions
  const gaMap = {
    'Grand Alliance Order': 'Order',
    'Grand Alliance Chaos': 'Chaos',
    'Grand Alliance Death': 'Death',
    'Grand Alliance Destruction': 'Destruction'
  };

  return gaMap[current.name] || current.name;
}

// Get parent faction name
function getParentFactionName(faction, data) {
  if (!faction.parentFactionKeywordId) return null;

  const parent = data.faction_keyword.find(f => f.id === faction.parentFactionKeywordId);
  if (!parent) return null;

  // Don't return grand alliances as parent
  if (parent.name.startsWith('Grand Alliance')) return null;

  return parent.name;
}

// Generate faction ID from name
function generateFactionId(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

// Get warscrolls for a faction
function getWarscrollsForFaction(factionId, data) {
  const warscrollFactionLinks = data.warscroll_faction_keyword.filter(
    link => link.factionKeywordId === factionId
  );

  return warscrollFactionLinks
    .map(link => data.warscroll.find(w => w.id === link.warscrollId))
    .filter(w => w !== undefined);
}

// Get weapons for a warscroll
function getWeaponsForWarscroll(warscrollId, data) {
  const weapons = data.warscroll_weapon
    .filter(w => w.warscrollId === warscrollId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return weapons.map(weapon => {
    // Get weapon abilities
    const weaponAbilityLinks = data.warscroll_weapon_weapon_ability.filter(
      link => link.warscrollWeaponId === weapon.id
    );

    const abilities = weaponAbilityLinks
      .map(link => {
        const ability = data.weapon_ability.find(a => a.id === link.weaponAbilityId);
        return ability ? ability.name : null;
      })
      .filter(a => a !== null);

    return {
      name: weapon.name,
      type: weapon.type, // 'melee' or 'ranged'
      range: weapon.range || null,
      attacks: weapon.attacks,
      hit: weapon.hit,
      wound: weapon.wound,
      rend: weapon.rend,
      damage: weapon.damage,
      abilities: abilities
    };
  });
}

// Get abilities for a warscroll
function getAbilitiesForWarscroll(warscrollId, data) {
  const abilities = data.warscroll_ability
    .filter(a => a.warscrollId === warscrollId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return abilities.map(ability => {
    // Get keywords for this ability
    const abilityKeywordLinks = data.warscroll_ability_keyword.filter(
      link => link.warscrollAbilityId === ability.id
    );

    const keywords = abilityKeywordLinks
      .map(link => {
        const kw = data.keyword.find(k => k.id === link.keywordId);
        return kw ? kw.name : null;
      })
      .filter(k => k !== null);

    return {
      name: ability.name,
      phase: ability.phase,
      phaseDetails: ability.phaseDetails,
      icon: ability.abilityAndCommandIcon,
      castingValue: ability.castingValue || null,
      chantValue: ability.chantValue || null,
      cpCost: ability.cpCost || null,
      isReaction: ability.reaction || false,
      declare: ability.declare || null,
      effect: ability.effect,
      keywords: keywords.length > 0 ? keywords : undefined
    };
  });
}

// Extract keyword value (e.g., "4" from "Wizard (4)") from referenceKeywords
function extractKeywordValue(referenceKeywords, keywordName) {
  if (!referenceKeywords) return null;
  const regex = new RegExp(`${keywordName}\\s*\\((\\d+)\\)`);
  const match = referenceKeywords.match(regex);
  return match ? match[1] : null;
}

// Get keywords for a warscroll
function getKeywordsForWarscroll(warscrollId, data, referenceKeywords) {
  const keywordLinks = data.warscroll_keyword.filter(
    link => link.warscrollId === warscrollId
  );

  return keywordLinks
    .map(link => {
      const kw = data.keyword.find(k => k.id === link.keywordId);
      if (!kw) return null;

      // Enhance Wizard and Priest keywords with their values from referenceKeywords
      if (kw.name === 'Wizard' || kw.name === 'Priest') {
        const value = extractKeywordValue(referenceKeywords, kw.name);
        if (value) return `${kw.name} (${value})`;
      }

      return kw.name;
    })
    .filter(k => k !== null);
}

// Get faction keywords for a warscroll
function getFactionKeywordsForWarscroll(warscrollId, data) {
  const factionKeywordLinks = data.warscroll_faction_keyword
    .filter(link => link.warscrollId === warscrollId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return factionKeywordLinks
    .map(link => {
      const fk = data.faction_keyword.find(f => f.id === link.factionKeywordId);
      return fk ? fk.name : null;
    })
    .filter(fk => fk !== null);
}

// Transform a warscroll to output format
function transformWarscroll(warscroll, data, factionName, factionId) {
  const weapons = getWeaponsForWarscroll(warscroll.id, data);
  const abilities = getAbilitiesForWarscroll(warscroll.id, data);
  const keywords = getKeywordsForWarscroll(warscroll.id, data, warscroll.referenceKeywords);
  const factionKeywords = getFactionKeywordsForWarscroll(warscroll.id, data);

  // Separate weapons by type
  const rangedWeapons = weapons.filter(w => w.type === 'ranged');
  const meleeWeapons = weapons.filter(w => w.type === 'melee');

  return {
    id: uuidv5(warscroll.name, AOS_UUID_NAMESPACE),
    name: warscroll.name,
    subname: warscroll.subname || null,
    cardType: 'Warscroll',
    source: 'aos-4e',
    faction_id: factionId,
    factions: [factionName],
    keywords: keywords,
    factionKeywords: factionKeywords,
    referenceKeywords: warscroll.referenceKeywords || null,

    stats: {
      move: warscroll.move,
      save: warscroll.save,
      control: warscroll.control,
      health: warscroll.health,
      ward: warscroll.wardSave || null,
      wizard: extractKeywordValue(warscroll.referenceKeywords, 'Wizard'),
      priest: extractKeywordValue(warscroll.referenceKeywords, 'Priest')
    },

    points: warscroll.points,
    modelCount: warscroll.modelCount,
    cannotBeReinforced: warscroll.cannotBeReinforced || false,
    isSpearhead: warscroll.isSpearhead || false,
    isLegends: warscroll.hiddenFromReference || false,

    weapons: {
      ranged: rangedWeapons.length > 0 ? rangedWeapons : undefined,
      melee: meleeWeapons.length > 0 ? meleeWeapons : undefined
    },

    abilities: abilities,

    notes: null
  };
}

// Get battle formations for a faction
function getBattleFormationsForFaction(factionId, data) {
  return data.battle_formation
    .filter(bf => bf.factionId === factionId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
}

// Get battle formation rules
function getBattleFormationRules(formationId, data) {
  const rules = data.battle_formation_rule
    .filter(r => r.battleFormationId === formationId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return rules.map(rule => {
    // Get keywords for this rule
    const ruleKeywordLinks = data.battle_formation_rule_keyword?.filter(
      link => link.battleFormationRuleId === rule.id
    ) || [];

    const keywords = ruleKeywordLinks
      .map(link => {
        const kw = data.keyword.find(k => k.id === link.keywordId);
        return kw ? kw.name : null;
      })
      .filter(k => k !== null);

    return {
      name: rule.name,
      phase: rule.phase,
      phaseDetails: rule.phaseDetails,
      icon: rule.abilityAndCommandIcon,
      declare: rule.declare || null,
      effect: rule.effect,
      cpCost: rule.cpCost || null,
      isReaction: rule.reaction || false,
      keywords: keywords.length > 0 ? keywords : undefined
    };
  });
}

// Transform battle formation to output format
function transformBattleFormation(formation, data, factionId) {
  const rules = getBattleFormationRules(formation.id, data);

  return {
    id: uuidv5(formation.name, AOS_UUID_NAMESPACE),
    name: formation.name,
    cardType: 'BattleFormation',
    source: 'aos-4e',
    faction_id: factionId,
    factionTerrainLimit: formation.factionTerrainLimit || null,
    isLegends: formation.isLegends || false,
    points: formation.points || null,
    rules: rules
  };
}

// Check if a lore is a manifestation lore (all its abilities summon manifestations)
function isManifestationLore(loreId, data) {
  const abilities = data.lore_ability.filter(a => a.loreId === loreId);
  if (abilities.length === 0) return false;

  // A lore is a manifestation lore if ALL its abilities have linkedWarscrollId
  return abilities.every(a => a.linkedWarscrollId !== null);
}

// Get lores for a faction
function getLoresForFaction(factionId, data) {
  // Lores can be linked via lore_faction_keyword or directly via factionId on lore table
  const loreFactionLinks = data.lore_faction_keyword?.filter(
    link => link.factionKeywordId === factionId
  ) || [];

  const loresFromLinks = loreFactionLinks
    .map(link => data.lore.find(l => l.id === link.loreId))
    .filter(l => l !== undefined);

  // Also get lores directly linked via factionId on the lore table
  const factionPublications = data.publication.filter(
    p => p.factionKeywordId === factionId && !p.spearheadName
  );
  const factionPubIds = factionPublications.map(p => p.id);

  const loresFromFactionId = data.lore.filter(
    l => l.factionId === factionId && factionPubIds.includes(l.publicationId)
  );

  // Combine and deduplicate
  const allLores = [...loresFromLinks, ...loresFromFactionId];
  const uniqueLores = [...new Map(allLores.map(l => [l.id, l])).values()];

  // Separate spell lores from manifestation lores
  const spellLores = uniqueLores.filter(l => !isManifestationLore(l.id, data));
  const manifestationLores = uniqueLores.filter(l => isManifestationLore(l.id, data));

  return { spellLores, manifestationLores };
}

// Get lore abilities (spells) for a lore
function getLoreAbilities(loreId, data) {
  const abilities = data.lore_ability
    .filter(a => a.loreId === loreId)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return abilities.map(ability => {
    // Get keywords for this spell
    const abilityKeywordLinks = data.lore_ability_keyword?.filter(
      link => link.loreAbilityId === ability.id
    ) || [];

    const keywords = abilityKeywordLinks
      .map(link => {
        const kw = data.keyword.find(k => k.id === link.keywordId);
        return kw ? kw.name : null;
      })
      .filter(k => k !== null);

    return {
      id: uuidv5(ability.name, AOS_UUID_NAMESPACE),
      name: ability.name,
      castingValue: ability.castingValue || null,
      chantValue: ability.chantValue || null,
      phase: ability.phase,
      phaseDetails: ability.phaseDetails,
      icon: ability.abilityAndCommandIcon,
      declare: ability.declare || null,
      effect: ability.effect,
      keywords: keywords.length > 0 ? keywords : undefined
    };
  });
}

// Transform lore to output format
function transformLore(lore, data, factionId) {
  const spells = getLoreAbilities(lore.id, data);

  return {
    id: uuidv5(lore.name, AOS_UUID_NAMESPACE),
    name: lore.name,
    cardType: 'Lore',
    source: 'aos-4e',
    faction_id: factionId,
    restrictionText: lore.restrictionText || null,
    spells: spells
  };
}

// Get enhancements for a faction grouped by type
function getEnhancementsForFaction(factionId, data) {
  // Get ability groups that are linked to this faction via ability_group_publication
  const factionPublications = data.publication.filter(
    p => p.factionKeywordId === factionId && !p.spearheadName
  );
  const factionPubIds = factionPublications.map(p => p.id);

  const abilityGroupPubLinks = data.ability_group_publication.filter(
    link => factionPubIds.includes(link.publicationId)
  );

  const abilityGroupIds = abilityGroupPubLinks.map(link => link.abilityGroupId);

  const abilityGroups = data.ability_group.filter(
    ag => abilityGroupIds.includes(ag.id) && ag.abilityGroupType !== null
  );

  // Group by type
  const artefacts = [];
  const heroicTraits = [];
  const other = [];

  abilityGroups.forEach(group => {
    const abilities = data.ability
      .filter(a => a.abilityGroupId === group.id)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(ability => {
        // Get keywords for this ability
        const abilityKeywordLinks = data.ability_keyword?.filter(
          link => link.abilityId === ability.id
        ) || [];

        const keywords = abilityKeywordLinks
          .map(link => {
            const kw = data.keyword.find(k => k.id === link.keywordId);
            return kw ? kw.name : null;
          })
          .filter(k => k !== null);

        return {
          id: uuidv5(ability.name, AOS_UUID_NAMESPACE),
          name: ability.name,
          cardType: 'Enhancement',
          enhancementType: group.abilityGroupType,
          source: 'aos-4e',
          points: ability.points || null,
          phase: ability.phase,
          phaseDetails: ability.phaseDetails,
          icon: ability.abilityAndCommandIcon,
          declare: ability.declare || null,
          effect: ability.effect,
          cpCost: ability.cpCost || null,
          keywords: keywords.length > 0 ? keywords : undefined
        };
      });

    switch (group.abilityGroupType) {
      case 'artefactsOfPower':
        artefacts.push(...abilities);
        break;
      case 'heroicTraits':
        heroicTraits.push(...abilities);
        break;
      case 'battleTraits':
        // Skip battle traits - they go in rules section
        break;
      case 'spearheadEnhancements':
        // Skip spearhead enhancements
        break;
      default:
        other.push(...abilities);
    }
  });

  return {
    artefacts: artefacts.length > 0 ? artefacts : [],
    heroicTraits: heroicTraits.length > 0 ? heroicTraits : [],
    other: other.length > 0 ? other : []
  };
}

// Get battle traits for a faction
function getBattleTraitsForFaction(factionId, data) {
  const factionPublications = data.publication.filter(
    p => p.factionKeywordId === factionId && !p.spearheadName
  );
  const factionPubIds = factionPublications.map(p => p.id);

  const abilityGroupPubLinks = data.ability_group_publication.filter(
    link => factionPubIds.includes(link.publicationId)
  );

  const abilityGroupIds = abilityGroupPubLinks.map(link => link.abilityGroupId);

  const battleTraitGroups = data.ability_group.filter(
    ag => abilityGroupIds.includes(ag.id) && ag.abilityGroupType === 'battleTraits'
  );

  const battleTraits = [];

  battleTraitGroups.forEach(group => {
    const abilities = data.ability
      .filter(a => a.abilityGroupId === group.id)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .map(ability => ({
        name: ability.name,
        phase: ability.phase,
        phaseDetails: ability.phaseDetails,
        icon: ability.abilityAndCommandIcon,
        declare: ability.declare || null,
        effect: ability.effect
      }));

    battleTraits.push(...abilities);
  });

  return battleTraits;
}

// Get terrain for a faction
function getTerrainForFaction(factionId, data) {
  // Get warscrolls that are faction terrain via warscroll_terrain_ability
  const factionWarscrolls = getWarscrollsForFaction(factionId, data);
  const factionWarscrollIds = factionWarscrolls.map(w => w.id);

  const terrainAbilityLinks = data.warscroll_terrain_ability?.filter(
    link => factionWarscrollIds.includes(link.warscrollId)
  ) || [];

  // Group by warscroll to build terrain objects
  const terrainMap = new Map();

  terrainAbilityLinks.forEach(link => {
    const warscroll = factionWarscrolls.find(w => w.id === link.warscrollId);
    if (!warscroll) return;

    if (!terrainMap.has(warscroll.id)) {
      terrainMap.set(warscroll.id, {
        id: uuidv5(warscroll.name + '-terrain', AOS_UUID_NAMESPACE),
        name: warscroll.name,
        cardType: 'FactionTerrain',
        source: 'aos-4e',
        abilities: []
      });
    }

    // Find the terrain ability details
    // Note: terrain abilities are stored differently, may need adjustment
  });

  return Array.from(terrainMap.values());
}

// Default faction colours based on Grand Alliance
const defaultColours = {
  'Order': { banner: '#0f2b38', header: '#0f2b38' },
  'Chaos': { banner: '#2a1a1a', header: '#2a1a1a' },
  'Death': { banner: '#1a1a2a', header: '#1a1a2a' },
  'Destruction': { banner: '#2a2a1a', header: '#2a2a1a' }
};

// Main processing function
function processAoSFaction(outputFileName, factionName) {
  currentFactionIndex++;
  updateProgress(factionName, 'Reading');

  const faction = newDataExport.faction_keyword.find(f => f.name === factionName);
  if (!faction) {
    console.error(`\nFaction not found: ${factionName}`);
    return;
  }

  const factionId = generateFactionId(factionName);
  const grandAlliance = getGrandAlliance(faction, newDataExport);
  const parentFaction = getParentFactionName(faction, newDataExport);

  // Read existing file if it exists
  const existingFile = readFile(outputFileName);
  const existingData = existingFile ? JSON.parse(existingFile) : null;
  const originalFileContent = existingFile;

  updateProgress(factionName, 'Warscrolls');

  // Get all warscrolls for the faction
  let warscrolls = getWarscrollsForFaction(faction.id, newDataExport);

  // Filter out spearhead warscrolls
  warscrolls = warscrolls.filter(w => !w.isSpearhead);

  // Transform warscrolls
  const transformedWarscrolls = warscrolls.map(w =>
    transformWarscroll(w, newDataExport, factionName, factionId)
  ).sort((a, b) => a.name.localeCompare(b.name));

  updateProgress(factionName, 'Formations');

  // Get battle formations
  const battleFormations = getBattleFormationsForFaction(faction.id, newDataExport)
    .filter(bf => !bf.isLegends)
    .map(bf => transformBattleFormation(bf, newDataExport, factionId));

  updateProgress(factionName, 'Lores');

  // Get lores (spell lores and manifestation lores)
  const { spellLores, manifestationLores: rawManifestationLores } = getLoresForFaction(faction.id, newDataExport);
  const lores = spellLores.map(l => transformLore(l, newDataExport, factionId));
  const manifestationLores = rawManifestationLores.map(l => transformLore(l, newDataExport, factionId));

  updateProgress(factionName, 'Enhancements');

  // Get enhancements
  const enhancements = getEnhancementsForFaction(faction.id, newDataExport);

  updateProgress(factionName, 'Terrain');

  // Get terrain
  const terrain = getTerrainForFaction(faction.id, newDataExport);

  updateProgress(factionName, 'Rules');

  // Get battle traits
  const battleTraits = getBattleTraitsForFaction(faction.id, newDataExport);

  // Build output object
  const output = {
    id: factionId,
    name: factionName,
    grandAlliance: grandAlliance,
    parentFaction: parentFaction,
    isLegends: faction.isLegends || false,
    colours: defaultColours[grandAlliance] || defaultColours['Order'],
    updated: new Date().toISOString(),
    compatibleDataVersion: dataVersion,

    warscrolls: transformedWarscrolls,
    battleFormations: battleFormations,
    lores: lores,
    manifestationLores: manifestationLores,
    enhancements: enhancements,
    terrain: terrain,
    rules: {
      battleTraits: battleTraits
    }
  };

  updateProgress(factionName, 'Writing');

  // Ensure output directory exists
  const outputDir = path.dirname(outputFileName);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, outputFileName);
  fs.writeFileSync(filePath, JSON.stringify(output, null, 2));

  updateProgress(factionName, 'Formatting');

  // Run prettier on the output file
  try {
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'pipe' });
  } catch (e) {
    // Prettier may not be available, continue without formatting
  }

  updateProgress(factionName, 'Comparing');

  // Read the new file content after prettier
  const newFileContent = readFile(outputFileName);

  // Compare changes
  let hasChanges = true;
  let versionChanged = true;

  if (originalFileContent) {
    const oldData = JSON.parse(originalFileContent);
    const newData = JSON.parse(newFileContent);

    const oldVersion = oldData.compatibleDataVersion;
    const newVersion = newData.compatibleDataVersion;
    versionChanged = oldVersion !== newVersion;

    // Remove fields that always change for data comparison
    delete oldData.updated;
    delete oldData.compatibleDataVersion;
    delete newData.updated;
    delete newData.compatibleDataVersion;

    // Compare by section
    const warscrollChanges = compareByName(oldData.warscrolls || [], newData.warscrolls || [], 'warscrolls');
    const formationChanges = compareByName(oldData.battleFormations || [], newData.battleFormations || [], 'battleFormations');
    const loreChanges = compareByName(oldData.lores || [], newData.lores || [], 'lores');
    const manifestationLoreChanges = compareByName(oldData.manifestationLores || [], newData.manifestationLores || [], 'manifestationLores');

    // Check for colour changes
    const coloursChanged = JSON.stringify(oldData.colours) !== JSON.stringify(newData.colours);

    hasChanges =
      coloursChanged ||
      warscrollChanges.added.length > 0 ||
      warscrollChanges.removed.length > 0 ||
      warscrollChanges.modified.length > 0 ||
      formationChanges.added.length > 0 ||
      formationChanges.removed.length > 0 ||
      formationChanges.modified.length > 0 ||
      loreChanges.added.length > 0 ||
      loreChanges.removed.length > 0 ||
      loreChanges.modified.length > 0 ||
      manifestationLoreChanges.added.length > 0 ||
      manifestationLoreChanges.removed.length > 0 ||
      manifestationLoreChanges.modified.length > 0;

    // Store change report
    changeReports.push({
      faction: factionName,
      file: outputFileName,
      filePath: filePath,
      hasChanges,
      versionChanged,
      warscrolls: warscrollChanges,
      battleFormations: formationChanges,
      lores: loreChanges,
      manifestationLores: manifestationLoreChanges
    });
  } else {
    // New file
    changeReports.push({
      faction: factionName,
      file: outputFileName,
      filePath: filePath,
      hasChanges: true,
      versionChanged: true,
      warscrolls: { added: transformedWarscrolls.map(w => w.name), removed: [], modified: [] },
      battleFormations: { added: battleFormations.map(bf => bf.name), removed: [], modified: [] },
      lores: { added: lores.map(l => l.name), removed: [], modified: [] },
      manifestationLores: { added: manifestationLores.map(l => l.name), removed: [], modified: [] }
    });
  }
}

// Print summary report
function printSummaryReport() {
  clearProgress();
  console.log('\n✓ Processing complete!\n');
  console.log('='.repeat(80));
  console.log('CHANGE SUMMARY REPORT');
  console.log('='.repeat(80) + '\n');

  const factionsWithChanges = changeReports.filter(r => r.hasChanges);
  const factionsWithoutChanges = changeReports.filter(r => !r.hasChanges);

  if (factionsWithChanges.length === 0) {
    console.log('No changes detected in any faction (besides data version and timestamp).\n');
  } else {
    console.log(`Factions with changes: ${factionsWithChanges.length}/${changeReports.length}\n`);

    for (const report of factionsWithChanges) {
      console.log('-'.repeat(60));
      console.log(`FACTION: ${report.faction}`);
      console.log('-'.repeat(60));

      // Warscrolls
      if (report.warscrolls.added.length > 0 || report.warscrolls.removed.length > 0 || report.warscrolls.modified.length > 0) {
        console.log('\n  WARSCROLLS:');
        if (report.warscrolls.added.length > 0) {
          console.log(`    Added (${report.warscrolls.added.length}):`);
          report.warscrolls.added.slice(0, 10).forEach(name => console.log(`      + ${name}`));
          if (report.warscrolls.added.length > 10) {
            console.log(`      ... and ${report.warscrolls.added.length - 10} more`);
          }
        }
        if (report.warscrolls.removed.length > 0) {
          console.log(`    Removed (${report.warscrolls.removed.length}):`);
          report.warscrolls.removed.forEach(name => console.log(`      - ${name}`));
        }
        if (report.warscrolls.modified.length > 0) {
          console.log(`    Modified (${report.warscrolls.modified.length}):`);
          report.warscrolls.modified.slice(0, 10).forEach(name => console.log(`      ~ ${name}`));
          if (report.warscrolls.modified.length > 10) {
            console.log(`      ... and ${report.warscrolls.modified.length - 10} more`);
          }
        }
      }

      // Battle Formations
      if (report.battleFormations.added.length > 0 || report.battleFormations.removed.length > 0 || report.battleFormations.modified.length > 0) {
        console.log('\n  BATTLE FORMATIONS:');
        if (report.battleFormations.added.length > 0) {
          console.log(`    Added (${report.battleFormations.added.length}):`);
          report.battleFormations.added.forEach(name => console.log(`      + ${name}`));
        }
        if (report.battleFormations.removed.length > 0) {
          console.log(`    Removed (${report.battleFormations.removed.length}):`);
          report.battleFormations.removed.forEach(name => console.log(`      - ${name}`));
        }
        if (report.battleFormations.modified.length > 0) {
          console.log(`    Modified (${report.battleFormations.modified.length}):`);
          report.battleFormations.modified.forEach(name => console.log(`      ~ ${name}`));
        }
      }

      // Lores
      if (report.lores.added.length > 0 || report.lores.removed.length > 0 || report.lores.modified.length > 0) {
        console.log('\n  LORES:');
        if (report.lores.added.length > 0) {
          console.log(`    Added (${report.lores.added.length}):`);
          report.lores.added.forEach(name => console.log(`      + ${name}`));
        }
        if (report.lores.removed.length > 0) {
          console.log(`    Removed (${report.lores.removed.length}):`);
          report.lores.removed.forEach(name => console.log(`      - ${name}`));
        }
        if (report.lores.modified.length > 0) {
          console.log(`    Modified (${report.lores.modified.length}):`);
          report.lores.modified.forEach(name => console.log(`      ~ ${name}`));
        }
      }

      // Manifestation Lores
      if (report.manifestationLores.added.length > 0 || report.manifestationLores.removed.length > 0 || report.manifestationLores.modified.length > 0) {
        console.log('\n  MANIFESTATION LORES:');
        if (report.manifestationLores.added.length > 0) {
          console.log(`    Added (${report.manifestationLores.added.length}):`);
          report.manifestationLores.added.forEach(name => console.log(`      + ${name}`));
        }
        if (report.manifestationLores.removed.length > 0) {
          console.log(`    Removed (${report.manifestationLores.removed.length}):`);
          report.manifestationLores.removed.forEach(name => console.log(`      - ${name}`));
        }
        if (report.manifestationLores.modified.length > 0) {
          console.log(`    Modified (${report.manifestationLores.modified.length}):`);
          report.manifestationLores.modified.forEach(name => console.log(`      ~ ${name}`));
        }
      }

      console.log('\n');
    }
  }

  // List factions without changes
  if (factionsWithoutChanges.length > 0) {
    console.log('-'.repeat(60));
    console.log('FACTIONS WITHOUT CHANGES:');
    console.log('-'.repeat(60));
    factionsWithoutChanges.forEach(r => console.log(`  - ${r.faction}`));
    console.log('\n');
  }

  // Summary statistics
  console.log('='.repeat(80));
  console.log('STATISTICS');
  console.log('='.repeat(80));
  console.log(`Total factions processed: ${changeReports.length}`);
  console.log(`Factions with changes: ${factionsWithChanges.length}`);
  console.log(`Factions without changes: ${factionsWithoutChanges.length}`);

  // Calculate totals
  let totalWarscrollsAdded = 0, totalWarscrollsRemoved = 0, totalWarscrollsModified = 0;
  let totalFormationsAdded = 0, totalFormationsRemoved = 0, totalFormationsModified = 0;
  let totalLoresAdded = 0, totalLoresRemoved = 0, totalLoresModified = 0;
  let totalManifestationLoresAdded = 0, totalManifestationLoresRemoved = 0, totalManifestationLoresModified = 0;

  for (const report of changeReports) {
    totalWarscrollsAdded += report.warscrolls.added.length;
    totalWarscrollsRemoved += report.warscrolls.removed.length;
    totalWarscrollsModified += report.warscrolls.modified.length;
    totalFormationsAdded += report.battleFormations.added.length;
    totalFormationsRemoved += report.battleFormations.removed.length;
    totalFormationsModified += report.battleFormations.modified.length;
    totalLoresAdded += report.lores.added.length;
    totalLoresRemoved += report.lores.removed.length;
    totalLoresModified += report.lores.modified.length;
    totalManifestationLoresAdded += report.manifestationLores.added.length;
    totalManifestationLoresRemoved += report.manifestationLores.removed.length;
    totalManifestationLoresModified += report.manifestationLores.modified.length;
  }

  console.log(`\nWarscrolls:          +${totalWarscrollsAdded} added, -${totalWarscrollsRemoved} removed, ~${totalWarscrollsModified} modified`);
  console.log(`Battle Formations:   +${totalFormationsAdded} added, -${totalFormationsRemoved} removed, ~${totalFormationsModified} modified`);
  console.log(`Lores:               +${totalLoresAdded} added, -${totalLoresRemoved} removed, ~${totalLoresModified} modified`);
  console.log(`Manifestation Lores: +${totalManifestationLoresAdded} added, -${totalManifestationLoresRemoved} removed, ~${totalManifestationLoresModified} modified`);
  console.log('='.repeat(80) + '\n');
}

// Handle git staging
function handleGitStaging() {
  console.log('='.repeat(80));
  console.log('GIT STAGING');
  console.log('='.repeat(80) + '\n');

  const toStage = [];
  const toRevert = [];

  for (const report of changeReports) {
    if (report.hasChanges || report.versionChanged) {
      toStage.push(report);
    } else {
      toRevert.push(report);
    }
  }

  // Revert files with only timestamp changes
  if (toRevert.length > 0) {
    console.log(`Reverting ${toRevert.length} file(s) with only timestamp changes:`);
    for (const report of toRevert) {
      try {
        execSync(`git checkout -- "${report.filePath}"`, { stdio: 'pipe' });
        console.log(`  ↩ ${report.faction}`);
      } catch (e) {
        console.log(`  ✗ ${report.faction} (failed to revert)`);
      }
    }
    console.log('');
  }

  // Stage files with actual changes
  if (toStage.length > 0) {
    console.log(`Staging ${toStage.length} file(s) with changes:`);
    for (const report of toStage) {
      const reasons = [];
      if (report.hasChanges) reasons.push('data changes');
      if (report.versionChanged) reasons.push('version update');

      try {
        execSync(`git add "${report.filePath}"`, { stdio: 'pipe' });
        console.log(`  ✓ ${report.faction} (${reasons.join(', ')})`);
      } catch (e) {
        console.log(`  ✗ ${report.faction} (failed to stage)`);
      }
    }
    console.log('');
  }

  console.log('-'.repeat(60));
  console.log(`Files staged: ${toStage.length}`);
  console.log(`Files reverted: ${toRevert.length}`);
  console.log('='.repeat(80) + '\n');
}

// Define all factions to process
const factions = [
  // Order
  ['./gdc/stormcast_eternals.json', 'Stormcast Eternals'],
  ['./gdc/cities_of_sigmar.json', 'Cities of Sigmar'],
  ['./gdc/daughters_of_khaine.json', 'Daughters of Khaine'],
  ['./gdc/fyreslayers.json', 'Fyreslayers'],
  ['./gdc/idoneth_deepkin.json', 'Idoneth Deepkin'],
  ['./gdc/kharadron_overlords.json', 'Kharadron Overlords'],
  ['./gdc/lumineth_realmlords.json', 'Lumineth Realm-lords'],
  ['./gdc/seraphon.json', 'Seraphon'],
  ['./gdc/sylvaneth.json', 'Sylvaneth'],

  // Chaos
  ['./gdc/blades_of_khorne.json', 'Blades of Khorne'],
  ['./gdc/disciples_of_tzeentch.json', 'Disciples of Tzeentch'],
  ['./gdc/hedonites_of_slaanesh.json', 'Hedonites of Slaanesh'],
  ['./gdc/maggotkin_of_nurgle.json', 'Maggotkin of Nurgle'],
  ['./gdc/skaven.json', 'Skaven'],
  ['./gdc/slaves_to_darkness.json', 'Slaves to Darkness'],
  ['./gdc/beasts_of_chaos.json', 'Beasts of Chaos'], // Legends
  ['./gdc/helsmiths_of_hashut.json', 'Helsmiths of Hashut'],

  // Death
  ['./gdc/flesh_eater_courts.json', 'Flesh-eater Courts'],
  ['./gdc/nighthaunt.json', 'Nighthaunt'],
  ['./gdc/ossiarch_bonereapers.json', 'Ossiarch Bonereapers'],
  ['./gdc/soulblight_gravelords.json', 'Soulblight Gravelords'],

  // Destruction
  ['./gdc/gloomspite_gitz.json', 'Gloomspite Gitz'],
  ['./gdc/ironjawz.json', 'Ironjawz'],
  ['./gdc/kruleboyz.json', 'Kruleboyz'],
  ['./gdc/ogor_mawtribes.json', 'Ogor Mawtribes'],
  ['./gdc/sons_of_behemat.json', 'Sons of Behemat'],
  ['./gdc/bonesplitterz.json', 'Bonesplitterz'], // Legends
];

// Set total faction count for progress bar
totalFactions = factions.length;
console.log('Processing AoS factions...\n');

// Process all factions
for (const [fileName, factionName] of factions) {
  processAoSFaction(fileName, factionName);
}

printSummaryReport();
handleGitStaging();
