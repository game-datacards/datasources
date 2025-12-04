import { v5 as uuidv5 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { sortObj } from 'jsonabc';

// Array to collect change reports for each combat patrol
const changeReports = [];

// Progress tracking
let currentPatrolIndex = 0;
let totalPatrols = 0;

// Progress bar helper
function updateProgress(patrolName, status = 'Processing') {
  const barWidth = 30;
  const progress = totalPatrols > 0 ? currentPatrolIndex / totalPatrols : 0;
  const filled = Math.round(barWidth * progress);
  const empty = barWidth - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = Math.round(progress * 100);

  process.stdout.write(`\r[${bar}] ${percent}% (${currentPatrolIndex}/${totalPatrols}) ${status}: ${patrolName.padEnd(30)}`);
}

function clearProgress() {
  process.stdout.write('\r' + ' '.repeat(100) + '\r');
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
  let res = fs.readFileSync(file, 'utf8');
  return res;
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

// Function to remove markdown from a string
function removeMarkdown(str) {
  if (!str) return str;
  return str
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/~~(.*?)~~/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .replace(/```(.*?)```/gs, '$1')
    .replace(/#+\s?(.*?)\s*$/gm, '$1')
    .replace(/>\s?(.*?)\s*$/gm, '$1')
    .replace(/^-{3,}\s*$/gm, '')
    .replace(/^( *[-*+] +.*)$/gm, '$1')
    .replace(/^( *\d+\. +.*)$/gm, '$1')
    .trim();
}

// Function to parse leader rules and extract structured data
// Note: ruleText is already processed with removeMarkdown(), so no ** markers
function parseLeaderRule(ruleText) {
  const result = {
    units: [],
    extra: '',
    canAttachWith: [],
    isBodyguard: false,
    isMandatory: false,
  };

  if (!ruleText) return result;

  // Pattern 1: "Before the battle" format (no bullets, inline unit name after "unit:")
  if (ruleText.includes('Before the battle')) {
    // Match "unit: UNIT NAME." or "unit: UNIT NAME" at end
    const match = ruleText.match(/unit:\s*([A-Z][A-Z\s''-]+)\.?$/i);
    if (match) {
      result.units.push(match[1].replace(/\.$/, '').trim());
    }
    result.isMandatory = true;
    result.extra = ruleText;
    return result;
  }

  // Determine where the unit list ends and extra text begins
  const extraPatterns = [
    'You can attach',
    'You must attach',
    'This model can be attached to a',
    'This model cannot be attached to a',
    "If this unit's Bodyguard",
    "If this unit's Bodyguard",
  ];

  let extraStartIdx = ruleText.length;
  let foundPattern = null;
  for (const pattern of extraPatterns) {
    const idx = ruleText.indexOf(pattern);
    if (idx > 0 && idx < extraStartIdx) {
      extraStartIdx = idx;
      foundPattern = pattern;
    }
  }

  // Pattern 2: Standard bullet format (■ UNIT NAME)
  // Extract text from first ■ to where extra text begins
  const bulletStart = ruleText.indexOf('■');
  if (bulletStart >= 0) {
    const unitSection = ruleText.substring(bulletStart, extraStartIdx);
    const units = unitSection
      .split('■')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    result.units = units;
  }

  // Pattern 3: Extract extra text
  if (foundPattern && extraStartIdx < ruleText.length) {
    result.extra = ruleText.substring(extraStartIdx).trim();
  }

  // Pattern 4: "even if one" with other leaders - extract co-attachable leader types
  // Format after removeMarkdown: "even if one CAPTAIN, CHAPTER MASTER or LIEUTENANT model/unit"
  if (ruleText.includes('even if one')) {
    const leaderMatch = ruleText.match(/even if one\s+(.*?)\s*(?:model|unit) has already/i);
    if (leaderMatch) {
      const leaderText = leaderMatch[1];
      // Split by comma and "or"
      const leaders = leaderText
        .split(/,\s*|\s+or\s+/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && l !== 'or');
      result.canAttachWith = leaders;
    }
  }

  // Pattern 5: Bodyguard detection
  if (ruleText.includes('Bodyguard')) {
    result.isBodyguard = true;
  }

  // Pattern 6: Mandatory attachment detection
  if (ruleText.includes('must be attached') || ruleText.includes('You must attach')) {
    result.isMandatory = true;
  }

  return result;
}

const dataExportPath = getNewestDataExport();
const newDataExportFile = readFile(dataExportPath);
const newDataExport = sortObj(JSON.parse(newDataExportFile).data);

// Generate specialWeaponKeywords dynamically from the data source
// Only include abilities without lore (unique abilities, not core rules like Pistol, Lethal Hits, etc.)
// Also exclude "Psychic" and "Anti-*" abilities (core rules with inconsistent lore data)
const specialWeaponKeywords = newDataExport.wargear_ability
  .filter((ability) => !ability.lore && ability.name !== 'Psychic' && !ability.name.startsWith('Anti-'))
  .map((ability) => ({
    name: ability.name,
    description: removeMarkdown(ability.rules || ''),
    showAbility: true,
    showDescription: true,
  }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processCombatPatrol(combatPatrol) {
  currentPatrolIndex++;
  const detachmentName = combatPatrol.name
    .replaceAll('Combat Patrol: ', '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  updateProgress(detachmentName, 'Reading');

  const fileName = `combatpatrol/${detachmentName.replaceAll(' ', '_').replace(/[''\u2019\u2018`]/g, '').toLowerCase()}.json`;
  const filePath = path.resolve(__dirname, fileName);

  // Try to read existing file for comparison
  let originalFileContent = null;
  try {
    originalFileContent = readFile(filePath);
  } catch (e) {
    // File doesn't exist yet, that's okay
  }

  updateProgress(detachmentName, 'Parsing');

  let newCombatPatrol = {
    name: combatPatrol.name,
    id: uuidv5(combatPatrol.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
    isCombatPatrol: true,
    faction_id: 'basic',
    detachments: [],
    datasheets: [],
    stratagems: [],
    enhancements: [],
  };

  newCombatPatrol.detachments.push(detachmentName);

  const newFaction = newDataExport.faction_keyword.find((faction_keyword) => {
    return faction_keyword.id === combatPatrol.factionKeywordId;
  });

  const stratagems = newDataExport.stratagem.filter((stratagem) => {
    return stratagem.publicationId === combatPatrol?.id;
  });

  let enhancements = newDataExport.enhancement.filter((enhancement) => {
    return enhancement.publicationId === combatPatrol?.id;
  });

  newCombatPatrol.stratagems = stratagems?.map((newStratagem) => {
    let turn = '';
    switch (newStratagem?.key) {
      case 'yourTurn':
        turn = 'your';
        break;
      case 'opponentsTurn':
        turn = 'opponents';
        break;
      case 'eitherPlayer':
        turn = 'either';
        break;
    }
    let type = '';
    switch (newStratagem?.category) {
      case 'strategicPloy':
        type = 'Strategic Ploy';
        break;
      case 'battleTactic':
        type = 'Battle Tactic';
        break;
      case 'epicDeed':
        type = 'Epic Deed';
        break;
      case 'wargear':
        type = 'Wargear';
        break;
    }
    let phase = [];
    const phases = newDataExport.stratagem_phase.filter((strat_phase) => {
      return strat_phase.stratagemId === newStratagem?.id;
    });
    phases.forEach((strat_phase) => {
      phase.push(strat_phase.phase.replaceAll('Phase', '').trim());
    });
    if (newStratagem.whenRules.toLowerCase().includes('any phase')) {
      phase = ['any'];
    }
    return {
      name: newStratagem.name,
      id: uuidv5(newStratagem.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
      cost: Number(newStratagem.cpCost),
      turn: turn,
      target: removeMarkdown(newStratagem.targetRules) || '',
      when: removeMarkdown(newStratagem.whenRules) || '',
      effect: removeMarkdown(newStratagem.effectRules) || '',
      restrictions: removeMarkdown(newStratagem.restrictionRules) || '',
      type: type,
      phase: phase,
      fluff: removeMarkdown(newStratagem.lore) || '',
      detachment: detachmentName,
      faction_id: 'basic',
    };
  });

  enhancements.sort((a, b) => a.displayOrder - b.displayOrder);

  enhancements = enhancements.map((enhancement) => {
    const foundKeywordGroups = newDataExport.enhancement_required_keyword_group.filter((group) => {
      return group.enhancementId === enhancement.id;
    });

    let foundKeywords = [];

    foundKeywordGroups.forEach((group) => {
      const foundKeywordGroupsKeyword = newDataExport.enhancement_required_keyword_group_keyword.filter(
        (groupKeyword) => {
          return groupKeyword.enhancementRequiredKeywordGroupId === group.id;
        }
      );

      foundKeywords = [...foundKeywords, ...foundKeywordGroupsKeyword.map((kw) => kw.keywordId)];

      const foundFactionKeywords = newDataExport.enhancement_required_keyword_group_faction_keyword.filter(
        (fkReq) => {
          return fkReq.enhancementRequiredKeywordGroupId === group.id;
        }
      );

      foundFactionKeywords.forEach((fkReq) => {
        const factionKw = newDataExport.faction_keyword.find((fk) => fk.id === fkReq.factionKeywordId);
        if (factionKw) {
          foundKeywords.push(factionKw.name);
        }
      });
    });

    let excludedKeywords = newDataExport.enhancement_excluded_keyword.filter((keyword) => {
      return keyword.enhancementId === enhancement.id;
    });

    excludedKeywords = excludedKeywords.map((kw) => {
      return kw.keywordId;
    });

    if (!foundKeywords || foundKeywords.length === 0) {
      return {
        ...enhancement,
        keywords: [newFaction.name],
        excluded: excludedKeywords.map((keyword) => {
          const foundKeyword = newDataExport.keyword.find((kw) => kw.id === keyword);
          return foundKeyword ? foundKeyword.name : '';
        }),
      };
    }

    foundKeywords = [...new Set(foundKeywords)];

    return {
      ...enhancement,
      keywords: foundKeywords.map((keyword) => {
        const foundKeyword = newDataExport.keyword.find((kw) => kw.id === keyword);
        return foundKeyword ? foundKeyword.name : keyword;
      }),
      excluded: excludedKeywords.map((keyword) => {
        const foundKeyword = newDataExport.keyword.find((kw) => kw.id === keyword);
        return foundKeyword ? foundKeyword.name : '';
      }),
    };
  });

  newCombatPatrol.enhancements = enhancements?.map((newEnhancement) => {
    return {
      name: newEnhancement.name,
      id: uuidv5(newEnhancement.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
      cost: newEnhancement?.basePointsCost?.toString(),
      keywords: newEnhancement.keywords,
      excludes: newEnhancement.excluded,
      description: removeMarkdown(newEnhancement.rules) || '',
      detachment: detachmentName,
      faction_id: 'basic',
    };
  });

  let allDataSheets = newDataExport.datasheet.filter((datasheet) => datasheet.publicationId === combatPatrol.id);

  allDataSheets = allDataSheets.map((card, index) => {
    card.publication = newDataExport.publication.find((publication) => publication.id === card.publicationId);

    const miniatures = newDataExport.miniature
      .filter((miniature) => miniature.datasheetId === card.id)
      .map((miniature) => {
        const foundMiniatureKeywords = newDataExport.miniature_keyword
          .filter((kw) => kw.miniatureId === miniature.id)
          .map((kw) => {
            return newDataExport.keyword.find((keyword) => keyword.id === kw.keywordId).name;
          });
        return { ...miniature, keywords: foundMiniatureKeywords };
      });
    miniatures.sort((a, b) => a.displayOrder - b.displayOrder);

    let datasheetAbilities = newDataExport.datasheet_datasheet_ability.filter(
      (ability) => ability.datasheetId === card.id
    );

    datasheetAbilities.sort((a, b) => a.displayOrder - b.displayOrder);

    datasheetAbilities = datasheetAbilities.map((datasheetAbility) => {
      const foundAbility = newDataExport.datasheet_ability.find(
        (ability) => datasheetAbility.datasheetAbilityId === ability.id
      );

      const subAbilities = newDataExport.datasheet_sub_ability.filter(
        (subAbility) => subAbility.datasheetAbilityId === foundAbility.id
      );

      return { ...foundAbility, restriction: datasheetAbility.restriction, subAbilities: [...subAbilities] };
    });

    let wargearOptions = newDataExport.wargear_rule.filter((wargear) => wargear.datasheetId === card.id);
    wargearOptions.sort((a, b) => b.displayOrder - a.displayOrder);

    let datasheetRules = newDataExport.datasheet_rule.filter((ability) => ability.datasheetId === card.id);
    datasheetRules.sort((a, b) => b.displayOrder - a.displayOrder);

    const wargearOptionsGroups = newDataExport.wargear_option_group.filter(
      (wargear) => wargear.datasheetId === card.id
    );

    let wargearOpts = [];
    wargearOptionsGroups.map((wargearOptionGroup) => {
      wargearOpts = [
        ...wargearOpts,
        ...newDataExport.wargear_option.filter((wargear) => wargear.wargearOptionGroupId === wargearOptionGroup.id),
      ];
    });

    let wargearItems = [];
    wargearOpts.map((wargearOption) => {
      wargearItems = [
        ...wargearItems,
        ...newDataExport.wargear_item.filter((wargear) => wargear.id === wargearOption.wargearItemId),
      ];
    });
    wargearItems.sort((a, b) => b.displayOrder - a.displayOrder);

    let weapons = wargearItems
      .filter((item) => item.wargearType === 'weapon')
      .map((item) => {
        return {
          name: item.name,
          id: item.id,
          profiles: newDataExport.wargear_item_profile
            .filter((profile) => profile.wargearItemId === item.id)
            .map((profile) => {
              return {
                ...profile,
                keywords: newDataExport.wargear_item_profile_wargear_ability
                  .filter((ability) => ability.wargearItemProfileId === profile.id)
                  .toSorted((a, b) => b.displayOrder - a.displayOrder)
                  .map((ability) => {
                    return newDataExport.wargear_ability.find((wargearAbility) => {
                      return wargearAbility.id === ability.wargearAbilityId;
                    }).name;
                  }),
              };
            }),
        };
      });

    weapons = weapons.filter(
      (value, index, self) => index === self.findIndex((t) => t.id === value.id)
    );

    let damageAbility = newDataExport.datasheet_damage.filter((ability) => ability.datasheetId === card.id);
    let invul = newDataExport.invulnerable_save.find((ability) => ability.datasheetId === card.id);

    let points = newDataExport.unit_composition
      .filter((ability) => ability.datasheetId === card.id)
      .toSorted((a, b) => b.displayOrder - a.displayOrder)
      .map((point) => {
        const unitCompMini = newDataExport.unit_composition_miniature.filter(
          (pointComp) => pointComp.unitCompositionId === point.id
        );
        return {
          cost: point.points.toString(),
          models: unitCompMini
            .reduce((acc, curr) => {
              return acc + curr.max;
            }, 0)
            .toString(),
          active: true,
        };
      });

    points = points.filter(
      (value, index, self) => index === self.findIndex((t) => t.cost === value.cost && t.models === value.models)
    );

    return {
      ...card,
      miniatures: [...miniatures],
      datasheetAbilities: [...datasheetAbilities],
      damageAbility: [...damageAbility],
      datasheetRules: [...datasheetRules],
      wargearOptions: [...wargearOptions],
      wargearItems: [...wargearItems],
      invulAbility: invul,
      weapons,
      points,
    };
  });

  allDataSheets.sort((a, b) => a.displayOrder - b.displayOrder);

  allDataSheets.map((card, index) => {
    let newUnit = {
      name: '',
      id: uuidv5(card.name + index.toString(), '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
      combatPatrol: true,
      source: '40k-10e',
      faction_id: 'basic',
      cardType: 'DataCard',
      abilities: {
        core: [],
        damaged: {
          description: '',
          range: '',
          showDamagedAbility: false,
          showDescription: true,
        },
        faction: [],
        invul: {
          info: '',
          showAtTop: true,
          showInfo: false,
          showInvulnerableSave: false,
          value: '',
        },
        other: [],
        primarch: [],
        special: [],
        wargear: [],
      },
      composition: [],
      factions: [newFaction.name],
      fluff: '',
      keywords: [],
      leader: '',
      loadout: '',
      meleeWeapons: [],
      points: [],
      rangedWeapons: [],
      stats: [],
      transport: '',
      wargear: [],
    };

    const factionAbilities = card.datasheetAbilities
      .filter((ability) => ability.abilityType === 'faction')
      .map((ability) => {
        let name = ability.name;
        if (ability.isAura || ability.isBondsman || ability.isPsychic) {
          const list = [];
          if (ability.isAura) list.push('Aura');
          if (ability.isBondsman) list.push('Bondsman');
          if (ability.isPsychic) list.push('Psychic');
          name = `${name} (${list.join(', ')})`;
        }
        if (ability.restriction !== null) {
          name = `${name} ${ability.restriction}`;
        }
        return name;
      });

    newUnit.abilities.faction = [...factionAbilities];

    const coreAbilities = card.datasheetAbilities
      .filter((ability) => ability.abilityType === 'core')
      .map((ability) => {
        if (ability.restriction !== null) {
          return `${ability.name} ${ability.restriction}`;
        }
        return ability.name;
      });

    newUnit.abilities.core = [...coreAbilities];

    const datasheetAbilities = card.datasheetAbilities
      .filter((ability) => ability.abilityType === 'datasheet')
      .map((ability) => {
        let name = ability.name;
        if (ability.isAura || ability.isBondsman || ability.isPsychic) {
          const list = [];
          if (ability.isAura) list.push('Aura');
          if (ability.isBondsman) list.push('Bondsman');
          if (ability.isPsychic) list.push('Psychic');
          name = `${name} (${list.join(', ')})`;
        }
        return { name: name, description: removeMarkdown(ability.rules), showAbility: true, showDescription: true };
      });
    newUnit.abilities.other = [...datasheetAbilities];

    const wargearItems = card.wargearItems
      .filter((item) => item.wargearType === 'wargear')
      .map((item) => {
        let name = item.name;
        return {
          name: name,
          description: removeMarkdown(item.ruleText.split('\n\n')[0]),
          showAbility: true,
          showDescription: true,
        };
      });

    newUnit.abilities.wargear = [...wargearItems];

    const primarchAbility = card.datasheetAbilities
      .map((ability) => {
        if (ability.subAbilities.length > 0) {
          const abilities = ability.subAbilities.map((subAbility) => {
            return {
              name: subAbility.name,
              description: removeMarkdown(subAbility.rules),
              showAbility: true,
              showDescription: true,
            };
          });
          return { name: ability.name, abilities: abilities, showAbility: true };
        }
        return undefined;
      })
      .filter((ability) => ability !== undefined);

    if (primarchAbility.length > 0) {
      newUnit.abilities.primarch = [...primarchAbility];
    }

    const damageAbility = card.damageAbility.filter((ability) => ability !== undefined);
    if (damageAbility.length > 0) {
      newUnit.abilities.damaged = {
        range: damageAbility[0].name
          .replaceAll('DAMAGED: ', '')
          .replaceAll('DAMAGED:', '')
          .replaceAll('Damaged: ', '')
          .replaceAll('Damaged:', '')
          .replaceAll('Damaged ', '')
          .toUpperCase(),
        description: removeMarkdown(damageAbility[0].rules),
        showDamagedAbility: true,
        showDescription: true,
      };
    }

    if (card.invulAbility !== undefined) {
      newUnit.abilities.invul = {
        info: card.invulAbility.rules ? removeMarkdown(card.invulAbility.rules) : '',
        showAtTop: true,
        showInfo: card.invulAbility.rules !== null,
        showInvulnerableSave: true,
        value: card.invulAbility.save,
      };
    }

    const leaderAbility = card.datasheetRules.find((ability) => ability.name === 'Leader');
    if (leaderAbility !== undefined && leaderAbility.rules !== undefined) {
      newUnit.leader = removeMarkdown(leaderAbility.rules.replaceAll('\n\n', ' ').replaceAll('\n', ' ').trim());
    }

    const transportAbility = card.datasheetRules.find((ability) => ability.name === 'Transport');
    if (transportAbility !== undefined && transportAbility.rules !== undefined) {
      newUnit.transport = removeMarkdown(transportAbility.rules.trim());
    }

    const specialAbilities = card.datasheetRules.filter(
      (ability) => ability.name !== 'Transport' && ability.name !== 'Leader'
    );
    if (specialAbilities !== undefined && specialAbilities.length > 0) {
      newUnit.abilities.special = specialAbilities.map((ability) => {
        return {
          description: removeMarkdown(ability.rules.trim()),
          name: ability.name,
          showAbility: true,
          showDescription: true,
        };
      });
    }

    let keywords = [];

    let statProfiles = card.miniatures
      .filter((miniature) => miniature.statlineHidden === false || miniature.statlineHidden === 0)
      .map((miniature) => {
        keywords.push(...miniature.keywords);

        return {
          active: true,
          ld: miniature.leadership,
          m: miniature.movement,
          name: card.miniatures.length > 1 ? miniature.name : card.name,
          oc: miniature.objectiveControl,
          showDamagedMarker: newUnit.abilities?.damaged?.showDamagedAbility ? true : false,
          showName: card.miniatures.length > 1,
          sv: miniature.save,
          t: miniature.toughness,
          w: miniature.wounds,
        };
      });

    if (
      card.miniatures.filter((miniature) => miniature.statlineHidden === false || miniature.statlineHidden === 0)
        .length === 0
    ) {
      statProfiles = [
        {
          active: true,
          ld: card.miniatures[0].leadership,
          m: card.miniatures[0].movement,
          name: card.miniatures[0].name,
          oc: card.miniatures[0].objectiveControl,
          showDamagedMarker: newUnit.abilities?.damaged?.showDamagedAbility ? true : false,
          showName: false,
          sv: card.miniatures[0].save,
          t: card.miniatures[0].toughness,
          w: card.miniatures[0].wounds,
        },
      ];
      keywords.push(...card.miniatures[0].keywords);
    }

    const rangedWeapons = card.weapons
      .filter((weapon) => {
        return weapon.profiles.some((p) => p.type === 'ranged');
      })
      .map((weapon) => {
        return {
          active: true,
          profiles: weapon.profiles
            .filter((p) => p.type === 'ranged')
            .map((profile) => {
              return {
                active: true,
                ap: profile.armourPenetration,
                attacks: profile.attacks,
                damage: profile.damage,
                keywords: profile.keywords,
                name:
                  weapon.profiles.length > 1 && weapon.name !== profile.name
                    ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
                    : profile.name === 'ranged'
                      ? weapon.name
                      : profile.name,
                range: profile.range,
                skill: profile.ballisticSkill,
                strength: profile.strength,
              };
            }),
        };
      });

    const meleeWeapons = card.weapons
      .filter((weapon) => {
        return weapon.profiles.some((p) => p.type === 'melee');
      })
      .map((weapon) => {
        return {
          active: true,
          profiles: weapon.profiles
            .filter((p) => p.type === 'melee')
            .map((profile) => {
              return {
                active: true,
                ap: profile.armourPenetration,
                attacks: profile.attacks,
                damage: profile.damage,
                keywords: profile.keywords,
                name:
                  weapon.profiles.length > 1 && weapon.name !== profile.name
                    ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
                    : profile.name === 'melee'
                      ? weapon.name
                      : profile.name,
                range: profile.range,
                skill: profile.weaponSkill,
                strength: profile.strength,
              };
            }),
        };
      });

    if (newUnit.leader) {
      const parsed = parseLeaderRule(newUnit.leader);

      // Build leads object with all parsed data
      newUnit.leads = {
        units: parsed.units,
        extra: parsed.extra,
      };

      // Only include optional fields if they have values
      if (parsed.canAttachWith.length > 0) {
        newUnit.leads.canAttachWith = parsed.canAttachWith;
      }
      if (parsed.isBodyguard) {
        newUnit.leads.isBodyguard = true;
      }
      if (parsed.isMandatory) {
        newUnit.leads.isMandatory = true;
      }
    }

    newUnit.stats = [...statProfiles];
    newUnit.rangedWeapons = [...rangedWeapons];
    newUnit.meleeWeapons = [...meleeWeapons];

    newUnit.rangedWeapons?.forEach((wep) => {
      let abilities = [];
      wep?.profiles?.forEach((prof) => {
        specialWeaponKeywords.forEach((val) => {
          if (prof.keywords.some((keyword) => val.name.toLowerCase() === keyword.toLowerCase())) {
            if (!abilities.some((a) => a.name === val.name)) {
              abilities.push(val);
            }
          }
        });
      });
      wep.abilities = abilities.length > 0 ? abilities : undefined;
    });

    newUnit.meleeWeapons?.forEach((wep) => {
      let abilities = [];
      wep?.profiles?.forEach((prof) => {
        specialWeaponKeywords.forEach((val) => {
          if (prof.keywords.some((keyword) => val.name.toLowerCase() === keyword.toLowerCase())) {
            if (!abilities.some((a) => a.name === val.name)) {
              abilities.push(val);
            }
          }
        });
      });
      wep.abilities = abilities.length > 0 ? abilities : undefined;
    });

    if (card.unitComposition.charAt(0) !== '■') {
      newUnit.composition = removeMarkdown(card.unitComposition.split('\n\n')[0])
        .split('\n')
        .map((unit) => {
          return unit.replaceAll('■', '').trim();
        });

      newUnit.loadout = removeMarkdown(card.unitComposition.split('\n\n')[1]);
    } else {
      newUnit.loadout = removeMarkdown(card.unitComposition);
    }

    newUnit.wargear =
      card.wargearOptions?.length > 0
        ? card.wargearOptions.map((gear) => removeMarkdown(gear.rulesText.replaceAll('■', '').replaceAll('\n', ' ').trim()))
        : ['None'];

    newUnit.fluff = removeMarkdown(card.lore);
    newUnit.keywords = [...new Set(keywords)];
    newUnit.points = card.points;
    newUnit.name = card.name;

    newCombatPatrol.datasheets.push(newUnit);
  });

  updateProgress(detachmentName, 'Writing');

  newCombatPatrol.updated = new Date().toISOString();
  newCombatPatrol.compatibleDataVersion = JSON.parse(newDataExportFile).metadata.data_version;

  // Ensure combatpatrol directory exists
  const combatPatrolDir = path.resolve(__dirname, 'combatpatrol');
  if (!fs.existsSync(combatPatrolDir)) {
    fs.mkdirSync(combatPatrolDir, { recursive: true });
  }

  fs.writeFileSync(filePath, JSON.stringify(newCombatPatrol, null, 2));

  updateProgress(detachmentName, 'Formatting');

  // Run prettier on the output file
  try {
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'pipe' });
  } catch (e) {
    // Prettier may not be available, continue without formatting
  }

  updateProgress(detachmentName, 'Comparing');

  // Read the new file content after prettier
  const newFileContent = readFile(filePath);

  // Compare if we have original content
  let hasChanges = false;
  let versionChanged = false;
  let datasheetChanges = { added: [], removed: [], modified: [] };
  let stratagemChanges = { added: [], removed: [], modified: [] };
  let enhancementChanges = { added: [], removed: [], modified: [] };

  if (originalFileContent) {
    const oldData = JSON.parse(originalFileContent);
    const newData = JSON.parse(newFileContent);

    const oldVersion = oldData.compatibleDataVersion;
    const newVersion = newData.compatibleDataVersion;
    versionChanged = oldVersion !== newVersion;

    delete oldData.updated;
    delete oldData.compatibleDataVersion;
    delete newData.updated;
    delete newData.compatibleDataVersion;

    const oldDatasheets = oldData.datasheets || [];
    const newDatasheets = newData.datasheets || [];
    const oldStratagems = oldData.stratagems || [];
    const newStratagems = newData.stratagems || [];
    const oldEnhancements = oldData.enhancements || [];
    const newEnhancements = newData.enhancements || [];

    datasheetChanges = compareByName(oldDatasheets, newDatasheets, 'datasheets');
    stratagemChanges = compareByName(oldStratagems, newStratagems, 'stratagems');
    enhancementChanges = compareByName(oldEnhancements, newEnhancements, 'enhancements');

    hasChanges =
      datasheetChanges.added.length > 0 ||
      datasheetChanges.removed.length > 0 ||
      datasheetChanges.modified.length > 0 ||
      stratagemChanges.added.length > 0 ||
      stratagemChanges.removed.length > 0 ||
      stratagemChanges.modified.length > 0 ||
      enhancementChanges.added.length > 0 ||
      enhancementChanges.removed.length > 0 ||
      enhancementChanges.modified.length > 0;
  } else {
    // New file, count as having changes
    hasChanges = true;
    versionChanged = true;
  }

  changeReports.push({
    patrol: detachmentName,
    file: fileName,
    filePath: filePath,
    hasChanges,
    versionChanged,
    datasheets: datasheetChanges,
    stratagems: stratagemChanges,
    enhancements: enhancementChanges,
  });
}

function readCombatPatrols() {
  const combatPatrols = newDataExport.publication.filter(
    (publication) => publication.isCombatPatrol === true || publication.isCombatPatrol === 1
  );

  totalPatrols = combatPatrols.length;
  console.log('Processing combat patrols...\n');

  combatPatrols.forEach((combatPatrol) => {
    processCombatPatrol(combatPatrol);
  });
}

// Print summary report
function printSummaryReport() {
  clearProgress();
  console.log('\n✓ Processing complete!\n');
  console.log('='.repeat(80));
  console.log('COMBAT PATROL CHANGE SUMMARY REPORT');
  console.log('='.repeat(80) + '\n');

  const patrolsWithChanges = changeReports.filter((r) => r.hasChanges);
  const patrolsWithoutChanges = changeReports.filter((r) => !r.hasChanges);

  if (patrolsWithChanges.length === 0) {
    console.log('No changes detected in any combat patrol (besides data version and timestamp).\n');
  } else {
    console.log(`Combat patrols with changes: ${patrolsWithChanges.length}/${changeReports.length}\n`);

    for (const report of patrolsWithChanges) {
      console.log('-'.repeat(60));
      console.log(`PATROL: ${report.patrol}`);
      console.log('-'.repeat(60));

      if (report.datasheets.added.length > 0 || report.datasheets.removed.length > 0 || report.datasheets.modified.length > 0) {
        console.log('\n  DATASHEETS:');
        if (report.datasheets.added.length > 0) {
          console.log(`    Added (${report.datasheets.added.length}):`);
          report.datasheets.added.forEach((name) => console.log(`      + ${name}`));
        }
        if (report.datasheets.removed.length > 0) {
          console.log(`    Removed (${report.datasheets.removed.length}):`);
          report.datasheets.removed.forEach((name) => console.log(`      - ${name}`));
        }
        if (report.datasheets.modified.length > 0) {
          console.log(`    Modified (${report.datasheets.modified.length}):`);
          report.datasheets.modified.forEach((name) => console.log(`      ~ ${name}`));
        }
      }

      if (report.stratagems.added.length > 0 || report.stratagems.removed.length > 0 || report.stratagems.modified.length > 0) {
        console.log('\n  STRATAGEMS:');
        if (report.stratagems.added.length > 0) {
          console.log(`    Added (${report.stratagems.added.length}):`);
          report.stratagems.added.forEach((name) => console.log(`      + ${name}`));
        }
        if (report.stratagems.removed.length > 0) {
          console.log(`    Removed (${report.stratagems.removed.length}):`);
          report.stratagems.removed.forEach((name) => console.log(`      - ${name}`));
        }
        if (report.stratagems.modified.length > 0) {
          console.log(`    Modified (${report.stratagems.modified.length}):`);
          report.stratagems.modified.forEach((name) => console.log(`      ~ ${name}`));
        }
      }

      if (report.enhancements.added.length > 0 || report.enhancements.removed.length > 0 || report.enhancements.modified.length > 0) {
        console.log('\n  ENHANCEMENTS:');
        if (report.enhancements.added.length > 0) {
          console.log(`    Added (${report.enhancements.added.length}):`);
          report.enhancements.added.forEach((name) => console.log(`      + ${name}`));
        }
        if (report.enhancements.removed.length > 0) {
          console.log(`    Removed (${report.enhancements.removed.length}):`);
          report.enhancements.removed.forEach((name) => console.log(`      - ${name}`));
        }
        if (report.enhancements.modified.length > 0) {
          console.log(`    Modified (${report.enhancements.modified.length}):`);
          report.enhancements.modified.forEach((name) => console.log(`      ~ ${name}`));
        }
      }

      console.log('\n');
    }
  }

  if (patrolsWithoutChanges.length > 0) {
    console.log('-'.repeat(60));
    console.log('PATROLS WITHOUT CHANGES:');
    console.log('-'.repeat(60));
    patrolsWithoutChanges.forEach((r) => console.log(`  - ${r.patrol}`));
    console.log('\n');
  }

  console.log('='.repeat(80));
  console.log('STATISTICS');
  console.log('='.repeat(80));
  console.log(`Total patrols processed: ${changeReports.length}`);
  console.log(`Patrols with changes: ${patrolsWithChanges.length}`);
  console.log(`Patrols without changes: ${patrolsWithoutChanges.length}`);

  let totalDatasheetsAdded = 0, totalDatasheetsRemoved = 0, totalDatasheetsModified = 0;
  let totalStratagemsAdded = 0, totalStratagemsRemoved = 0, totalStratagemsModified = 0;
  let totalEnhancementsAdded = 0, totalEnhancementsRemoved = 0, totalEnhancementsModified = 0;

  for (const report of changeReports) {
    totalDatasheetsAdded += report.datasheets.added.length;
    totalDatasheetsRemoved += report.datasheets.removed.length;
    totalDatasheetsModified += report.datasheets.modified.length;
    totalStratagemsAdded += report.stratagems.added.length;
    totalStratagemsRemoved += report.stratagems.removed.length;
    totalStratagemsModified += report.stratagems.modified.length;
    totalEnhancementsAdded += report.enhancements.added.length;
    totalEnhancementsRemoved += report.enhancements.removed.length;
    totalEnhancementsModified += report.enhancements.modified.length;
  }

  console.log(`\nDatasheets:    +${totalDatasheetsAdded} added, -${totalDatasheetsRemoved} removed, ~${totalDatasheetsModified} modified`);
  console.log(`Stratagems:    +${totalStratagemsAdded} added, -${totalStratagemsRemoved} removed, ~${totalStratagemsModified} modified`);
  console.log(`Enhancements:  +${totalEnhancementsAdded} added, -${totalEnhancementsRemoved} removed, ~${totalEnhancementsModified} modified`);
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

  if (toRevert.length > 0) {
    console.log(`Reverting ${toRevert.length} file(s) with only timestamp changes:`);
    for (const report of toRevert) {
      try {
        execSync(`git checkout -- "${report.filePath}"`, { stdio: 'pipe' });
        console.log(`  ↩ ${report.patrol}`);
      } catch (e) {
        console.log(`  ✗ ${report.patrol} (failed to revert)`);
      }
    }
    console.log('');
  }

  if (toStage.length > 0) {
    console.log(`Staging ${toStage.length} file(s) with changes:`);
    for (const report of toStage) {
      const reasons = [];
      if (report.hasChanges) reasons.push('data changes');
      if (report.versionChanged) reasons.push('version update');

      try {
        execSync(`git add "${report.filePath}"`, { stdio: 'pipe' });
        console.log(`  ✓ ${report.patrol} (${reasons.join(', ')})`);
      } catch (e) {
        console.log(`  ✗ ${report.patrol} (failed to stage)`);
      }
    }
    console.log('');
  }

  console.log('-'.repeat(60));
  console.log(`Files staged: ${toStage.length}`);
  console.log(`Files reverted: ${toRevert.length}`);
  console.log('='.repeat(80) + '\n');
}

readCombatPatrols();
printSummaryReport();
handleGitStaging();
