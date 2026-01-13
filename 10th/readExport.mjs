import { v5 as uuidv5 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

import { sortObj } from 'jsonabc';

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

  // Clear line and write progress
  process.stdout.write(`\r[${bar}] ${percent}% (${currentFactionIndex}/${totalFactions}) ${status}: ${factionName.padEnd(25)}`);
}

function clearProgress() {
  process.stdout.write('\r' + ' '.repeat(100) + '\r');
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
      // Compare normalized JSON strings for accurate comparison
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

const dataExportPath = getNewestDataExport();
const newDataExportFile = readFile(dataExportPath);
const newDataExport = sortObj(JSON.parse(newDataExportFile).data);

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
    .trim(); // Trim whitespace
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

function parseDataExport(fileName, factionName, additionalFactions = []) {
  currentFactionIndex++;
  updateProgress(factionName, 'Reading');

  const oldParsedUnitsFile = readFile(fileName);
  const oldParsedUnits = sortObj(JSON.parse(oldParsedUnitsFile));

  // Store original file content for comparison (will compare after write+prettier)
  const originalFileContent = oldParsedUnitsFile;

  updateProgress(factionName, 'Parsing');

  let foundUnits = [];
  const missingUnits = [];

  const newFaction = newDataExport.faction_keyword.find((faction_keyword) => {
    return faction_keyword.name === factionName;
  });

  // Check if this faction is a child faction (has a parent)
  const isChildFaction = newFaction.parentFactionKeywordId !== null;
  const parentFaction = isChildFaction
    ? newDataExport.faction_keyword.find((fk) => fk.id === newFaction.parentFactionKeywordId)
    : null;

  // Get all child factions (factions that have this faction as their parent)
  const childFactions = newDataExport.faction_keyword
    .filter((fk) => fk.parentFactionKeywordId === newFaction.id);

  // Build faction ID to name mapping for detachment attribution
  const factionIdToName = new Map([
    [newFaction.id, newFaction.name],
    ...childFactions.map((fk) => [fk.id, fk.name])
  ]);

  // All faction IDs to include for detachment lookup
  // For child factions: only include own faction (not parent) to get chapter-specific detachments only
  // For parent factions: include self + children
  const detachmentFactionIds = isChildFaction
    ? [newFaction.id]
    : [newFaction.id, ...childFactions.map((fk) => fk.id)];

  // Chapter supplement publications to exclude from parent faction exports
  // These have their own dedicated export files
  const chapterSupplementPublications = [
    'Codex Supplement: Black Templars',
    'Codex Supplement: Space Wolves',
    'Codex Supplement: Dark Angels',
    'Codex Supplement: Blood Angels',
  ];

  // Child factions that have their own dedicated export files
  // Their detachments should be excluded from the parent faction export
  const childFactionsWithDedicatedFiles = [
    'Blood Angels',
    'Dark Angels',
    'Space Wolves',
    'Black Templars',
    'Deathwatch',
  ];

  const newPublication = newDataExport.publication.find((publication) => {
    return (
      publication.factionKeywordId === newFaction.id &&
      (publication.isCombatPatrol === 0 || publication.isCombatPatrol === false) &&
      !publication.name.includes('Imperial Armour')
    );
  });

  // Get detachments via detachment_faction_keyword (includes shared detachments from parent factions and child factions)
  const detachmentFactionLinks = newDataExport.detachment_faction_keyword.filter(
    (link) => detachmentFactionIds.includes(link.factionKeywordId)
  );

  // Build detachments with faction attribution, deduplicating by ID
  const detachmentsMap = new Map();
  for (const link of detachmentFactionLinks) {
    const detachment = newDataExport.detachment.find((d) => d.id === link.detachmentId);
    if (detachment && !detachmentsMap.has(detachment.id)) {
      detachmentsMap.set(detachment.id, {
        ...detachment,
        faction: factionIdToName.get(link.factionKeywordId) || factionName
      });
    }
  }

  let detachments = [...detachmentsMap.values()];

  // For child factions: exclude detachments that are also linked to the parent faction
  // These shared detachments should only appear in the parent's export
  if (isChildFaction && parentFaction) {
    const parentDetachmentIds = new Set(
      newDataExport.detachment_faction_keyword
        .filter((link) => link.factionKeywordId === parentFaction.id)
        .map((link) => link.detachmentId)
    );
    detachments = detachments.filter((d) => !parentDetachmentIds.has(d.id));
  }

  // For parent factions: filter out detachments from child factions that have their own dedicated files
  if (childFactions.length > 0) {
    detachments = detachments.filter(
      (d) => !childFactionsWithDedicatedFiles.includes(d.faction)
    );
  }

  const detachmentIds = detachments.map((d) => d.id);

  // Get stratagems from all detachments the faction can use
  const stratagems = newDataExport.stratagem.filter((stratagem) => {
    return detachmentIds.includes(stratagem.detachmentId);
  });

  // Get enhancements from all detachments the faction can use
  let enhancements = newDataExport.enhancement.filter((enhancement) => {
    return detachmentIds.includes(enhancement.detachmentId);
  });

  // Get army rules via army_rule_faction_keyword (includes parent faction rules)
  const armyRuleFactionLinks = newDataExport.army_rule_faction_keyword.filter(
    (link) => link.factionKeywordId === newFaction.id
  );
  let armyRules = armyRuleFactionLinks
    .map((link) => newDataExport.army_rule.find((r) => r.id === link.armyRuleId))
    .filter((r) => r !== undefined)
    // Filter out combat patrol rules
    .filter((rule) => {
      const publication = newDataExport.publication.find((p) => p.id === rule.publicationId);
      return publication && !publication.isCombatPatrol;
    })
    // Filter out chapter supplement rules when extracting parent faction (they duplicate main codex rules)
    // But allow them when extracting the chapter itself (e.g., Blood Angels extracting Blood Angels supplement)
    .filter((rule) => {
      const publication = newDataExport.publication.find((p) => p.id === rule.publicationId);
      if (!publication) return false;
      // Only filter supplements when extracting a parent faction that has children
      if (childFactions.length > 0 && chapterSupplementPublications.includes(publication.name)) {
        return false;
      }
      return true;
    })
    // Remove duplicates by id
    .filter((rule, index, self) => index === self.findIndex((r) => r.id === rule.id))
    // Remove duplicates by name (prefer first occurrence which is typically main codex)
    .filter((rule, index, self) => index === self.findIndex((r) => r.name === rule.name))
    .sort((a, b) => a.displayOrder - b.displayOrder);

  armyRules = armyRules.map((rule) => {
    const ruleSections = newDataExport.rule_container_component.filter((rule_container) => {
      return rule.id === rule_container.armyRuleId && rule_container.type !== "loreAccordion";
    }).sort((a, b) => a.displayOrder - b.displayOrder).map((rule_container) => {
      return {
        text: rule_container.textContent,
        order: rule_container.displayOrder,
        title: rule_container.title,
        subTitle: rule_container.subTitle,
        type: rule_container.type,
      };
    });

    return {
      name: rule.name,
      rules: ruleSections,
      source: "40k-10e",
      cardType: "armyRule",
    }
  });

  let detachmentRules = detachments.map((detachment) => {
    const detachmentRules = newDataExport.detachment_rule.filter((rule) => {
      return rule.detachmentId === detachment.id;
    }).sort((a, b) => a.displayOrder - b.displayOrder).map((rule) => {
      const ruleSections = newDataExport.rule_container_component.filter((rule_container) => {
        return rule.id === rule_container.detachmentRuleId && rule_container.type !== "loreAccordion";
      }).sort((a, b) => a.displayOrder - b.displayOrder).map((rule_container) => {
        return {
          text: rule_container.textContent,
          order: rule_container.displayOrder,
          title: rule_container.title,
          subTitle: rule_container.subTitle,
          type: rule_container.type,
        };
      });

      return {
        name: rule.name,
        rules: ruleSections,
        source: "40k-10e",
        cardType: "detachmentRule",
      }
    });



    return {
      detachment: detachment.name,
      faction: detachment.faction,
      rules: detachmentRules,
    }
  });

  oldParsedUnits.rules = { army: armyRules, detachment: detachmentRules };


  oldParsedUnits.detachments = detachments.map((detachment) => {
    return {
      name: detachment.name,
      faction: detachment.faction
    };
  });

  oldParsedUnits.stratagems = stratagems?.map(
    (newStratagem) => {
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
        faction_id: oldParsedUnits.id,
        fluff: removeMarkdown(newStratagem.lore) || '',
        detachment:
          detachments.find((detachment) => {
            return detachment.id === newStratagem.detachmentId;
          })?.name || '',
        detachment_faction:
          detachments.find((detachment) => {
            return detachment.id === newStratagem.detachmentId;
          })?.faction || factionName,
      };
    }
    // console.log('Not found old stratagem', oldStratagem.name);
  );
  enhancements.sort((a, b) => a.displayOrder - b.displayOrder);

  enhancements = enhancements.map((enhancement) => {
    const foundKeywordGroups = newDataExport.enhancement_required_keyword_group.filter((group) => {
      return group.enhancementId === enhancement.id;
    });

    // let foundKeywords = newDataExport.enhancement_required_keyword.filter((keyword) => {
    //   return keyword.enhancementId === enhancement.id;
    // });

    // foundKeywords = foundKeywords.map((kw) => {
    //   return kw.keywordId;
    // });
    let foundKeywords = [];

    foundKeywordGroups.forEach((group) => {
      // Get required unit keywords
      const foundKeywordGroupsKeyword = newDataExport.enhancement_required_keyword_group_keyword.filter(
        (groupKeyword) => {
          return groupKeyword.enhancementRequiredKeywordGroupId === group.id;
        }
      );

      foundKeywords = [...foundKeywords, ...foundKeywordGroupsKeyword.map((kw) => kw.keywordId)];

      // Get required faction keywords
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

    // console.log(enhancements);
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

    // Remove duplicates
    foundKeywords = [...new Set(foundKeywords)];

    return {
      ...enhancement,
      keywords: foundKeywords.map((keyword) => {
        const foundKeyword = newDataExport.keyword.find((kw) => kw.id === keyword);
        return foundKeyword ? foundKeyword.name : keyword; // If not found by ID, it's already a name (faction keyword)
      }),
      excluded: excludedKeywords.map((keyword) => {
        const foundKeyword = newDataExport.keyword.find((kw) => kw.id === keyword);
        return foundKeyword ? foundKeyword.name : '';
      }),
    };
  });

  oldParsedUnits.enhancements = enhancements?.map(
    (newEnhancement) => {
      return {
        name: newEnhancement.name,
        id: uuidv5(newEnhancement.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
        cost: newEnhancement.basePointsCost.toString(),
        keywords: newEnhancement.keywords,
        excludes: newEnhancement.excluded,
        description: removeMarkdown(newEnhancement.rules) || '',
        faction_id: oldParsedUnits.id,
        source: '40k-10e',
        cardType: "enhancement",
        detachment:
          detachments.find((detachment) => {
            return detachment.id === newEnhancement.detachmentId;
          })?.name || '',
        detachment_faction:
          detachments.find((detachment) => {
            return detachment.id === newEnhancement.detachmentId;
          })?.faction || factionName,
      };
    }
    // console.log('Not found old stratagem', oldStratagem.name);
  );

  // Collect all faction IDs to include (primary + additional factions)
  const factionIds = [newFaction.id];
  for (const additionalFactionName of additionalFactions) {
    const additionalFaction = newDataExport.faction_keyword.find((faction) => faction.name === additionalFactionName);
    if (additionalFaction) {
      factionIds.push(additionalFaction.id);
    }
  }

  const allDatasheetFactionKeywords = newDataExport.datasheet_faction_keyword.filter((datasheet_faction_keyword) => {
    return factionIds.includes(datasheet_faction_keyword.factionKeywordId);
  });

  let allDataSheets = newDataExport.datasheet.filter((datasheet) =>
    allDatasheetFactionKeywords.find(
      (datasheet_faction_keyword) => datasheet.id === datasheet_faction_keyword.datasheetId
    )
  );
  // console.log(allDataSheets);
  allDataSheets = allDataSheets.map((card, index) => {
    card.publication = newDataExport.publication.find((publication) => publication.id === card.publicationId);

    //Find all miniatures (stat lines)
    const miniatures = newDataExport.miniature
      .filter((miniature) => miniature.datasheetId === card.id)
      .map((miniature) => {
        const foundMiniatureKeywords = newDataExport.miniature_keyword
          .filter((kw) => kw.miniatureId === miniature.id)
          .map((kw) => {
            return newDataExport.keyword.find((keyword) => keyword.id === kw.keywordId).name;
          });
        // console.log(foundMiniatureKeywords);
        return { ...miniature, keywords: foundMiniatureKeywords };
      });
    miniatures.sort((a, b) => a.displayOrder - b.displayOrder);

    //Find all abilities connected to the datasheet
    let datasheetAbilities = newDataExport.datasheet_datasheet_ability.filter(
      (ability) => ability.datasheetId === card.id
    );

    datasheetAbilities.sort((a, b) => a.displayOrder - b.displayOrder);

    datasheetAbilities = datasheetAbilities.map((datasheetAbility) => {
      //Ability itself
      const foundAbility = newDataExport.datasheet_ability.find(
        (ability) => datasheetAbility.datasheetAbilityId === ability.id
      );

      //Potential sub abilities (such as primarch)
      const subAbilities = newDataExport.datasheet_sub_ability.filter(
        (subAbility) => subAbility.datasheetAbilityId === foundAbility.id
      );

      return { ...foundAbility, restriction: datasheetAbility.restriction, subAbilities: [...subAbilities] };
    });

    //Find all wargear options
    let wargearOptions = newDataExport.wargear_rule.filter((wargear) => wargear.datasheetId === card.id);

    wargearOptions.sort((a, b) => b.displayOrder - a.displayOrder);

    //Find all rules connected to the datasheet
    let datasheetRules = newDataExport.datasheet_rule.filter((ability) => ability.datasheetId === card.id);

    datasheetRules.sort((a, b) => b.displayOrder - a.displayOrder);

    //Find all wargear items connected to the datasheet
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

    //Find the damage ability
    let damageAbility = newDataExport.datasheet_damage.filter((ability) => ability.datasheetId === card.id);

    //Find the invul ability
    let invul = newDataExport.invulnerable_save.find((ability) => ability.datasheetId === card.id);

    //Find the points
    let points = newDataExport.unit_composition
      .filter((ability) => ability.datasheetId === card.id)
      .toSorted((a, b) => b.displayOrder - a.displayOrder)
      .map((point) => {
        const unitCompMini = newDataExport.unit_composition_miniature.filter(
          (pointComp) => pointComp.unitCompositionId === point.id
        );
        return {
          cost: point.points.toString(),
          keyword:
            point.referenceGroupingKeywordId !== null
              ? newDataExport.keyword.find((kw) => kw.id === point.referenceGroupingKeywordId).name
              : null,
          models: unitCompMini
            .reduce((acc, curr) => {
              return acc + curr.max;
            }, 0)
            .toString(),
          active: true,
        };
      });

    points = points.filter(
      (value, index, self) =>
        index ===
        self.findIndex((t) => t.cost === value.cost && t.models === value.models && t.keyword === value.keyword)
    );
    //And return the found datasheet
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
  // console.log(allDataSheets);
  allDataSheets = allDataSheets.filter(
    (card) => card.publication.isCombatPatrol === false || card.publication.isCombatPatrol === 0
  );

  // Filter out chapter supplement datasheets when extracting parent faction
  // These units have their own versions in dedicated chapter files
  // Only apply when extracting a parent faction that has children
  if (childFactions.length > 0) {
    allDataSheets = allDataSheets.filter(
      (card) => !chapterSupplementPublications.includes(card.publication.name)
    );
  }

  allDataSheets.map((card, index) => {
    let newUnit = {
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
      cardType: 'DataCard',
      composition: [],
      factions: [factionName],
      faction_id: oldParsedUnits.id,
      fluff: '',
      id: uuidv5(card.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
      imperialArmour: card.publication.name.includes('Imperial Armour') ? true : undefined,
      keywords: [],
      leader: '',
      loadout: '',
      meleeWeapons: [],
      name: '',
      points: [],
      rangedWeapons: [],
      source: '40k-10e',
      stats: [],
      transport: '',
      wargear: [],
    };

    //Faction abilities
    const factionAbilities = card.datasheetAbilities
      .filter((ability) => ability.abilityType === 'faction')
      .map((ability) => {
        let name = ability.name;
        if (ability.isAura || ability.isBondsman || ability.isPsychic) {
          const list = [];
          if (ability.isAura) {
            list.push('Aura');
          }
          if (ability.isBondsman) {
            list.push('Bondsman');
          }
          if (ability.isPsychic) {
            list.push('Psychic');
          }
          name = `${name} (${list.join(', ')})`;
        }
        if (ability.restriction !== null) {
          name = `${name} ${ability.restriction}`;
        }
        return name;
      });

    newUnit.abilities.faction = [...factionAbilities];
    //Core abilities
    const coreAbilities = card.datasheetAbilities
      .filter((ability) => ability.abilityType === 'core')
      .map((ability) => {
        if (ability.restriction !== null) {
          return `${ability.name} ${ability.restriction}`;
        }
        return ability.name;
      });

    newUnit.abilities.core = [...coreAbilities];

    //Other abilities
    const datasheetAbilities = card.datasheetAbilities
      .filter((ability) => ability.abilityType === 'datasheet')
      .map((ability) => {
        let name = ability.name;
        if (ability.isAura || ability.isBondsman || ability.isPsychic) {
          const list = [];
          if (ability.isAura) {
            list.push('Aura');
          }
          if (ability.isBondsman) {
            list.push('Bondsman');
          }
          if (ability.isPsychic) {
            list.push('Psychic');
          }
          name = `${name} (${list.join(', ')})`;
        }
        return { name: name, description: removeMarkdown(ability.rules), showAbility: true, showDescription: true };
      });
    newUnit.abilities.other = [...datasheetAbilities];
    //Other abilities
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
    //Primarch abilities
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

    //Damage ability
    const damageAbility = card.damageAbility.filter((ability) => ability !== undefined);
    let damageProfile = false;
    if (damageAbility.length > 0) {
      damageProfile = true;
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

    //invul ability
    if (card.invulAbility !== undefined) {
      newUnit.abilities.invul = {
        info: card.invulAbility.rules ? removeMarkdown(card.invulAbility.rules) : '',
        showAtTop: true,
        showInfo: card.invulAbility.rules !== null,
        showInvulnerableSave: true,
        value: card.invulAbility.save,
      };
    }

    //Check for leader rule
    const leaderAbility = card.datasheetRules.find((ability) => ability.name === 'Leader');

    if (leaderAbility !== undefined && leaderAbility.rules !== undefined) {
      newUnit.leader = removeMarkdown(leaderAbility.rules.replaceAll('\n\n', ' ').replaceAll('\n', ' ').trim());
    }

    //Check for transport rule
    const transportAbility = card.datasheetRules.find((ability) => ability.name === 'Transport');

    if (transportAbility !== undefined && transportAbility.rules !== undefined) {
      newUnit.transport = removeMarkdown(transportAbility.rules.trim());
    }

    //Check for other special rules
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

    //Fill datasheet keywords
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
          showDamagedMarker: card.abilities?.damaged?.showDamagedAbility ? true : false,
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
                keywords: [],
                name:
                  weapon.profiles.length > 1 && weapon.name !== profile.name
                    ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
                    : profile.name === 'ranged'
                      ? weapon.name
                      : profile.name,
                range: profile.range,
                skill: profile.ballisticSkill,
                strength: profile.strength,
                keywords: profile.keywords,
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
                keywords: [],
                name:
                  weapon.profiles.length > 1 && weapon.name !== profile.name
                    ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
                    : profile.name === 'melee'
                      ? weapon.name
                      : profile.name,
                range: profile.range,
                skill: profile.weaponSkill,
                strength: profile.strength,
                keywords: profile.keywords,
              };
            }),
        };
      });

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

    newUnit.composition = removeMarkdown(card.unitComposition
      .split('\n\n')[0])
      .split('\n')
      .map((unit) => {
        return unit.replaceAll('■', '').trim();
      });

    newUnit.wargear =
      card.wargearOptions?.length > 0
        ? card.wargearOptions.map((gear) => removeMarkdown(gear.rulesText.replaceAll('■', '').replaceAll('\n', ' ').trim()))
        : ['None'];

    newUnit.loadout = removeMarkdown(card.unitComposition.split('\n\n')[1]);
    newUnit.fluff = removeMarkdown(card.lore);

    newUnit.keywords = [...new Set(keywords)];

    newUnit.points = card.points;
    //And set the name
    newUnit.name = card.name;

    // Determine chapter/subfaction for this datasheet
    // Check which factions this datasheet is linked to
    const datasheetFactionLinks = newDataExport.datasheet_faction_keyword.filter(
      (link) => link.datasheetId === card.id
    );
    const linkedFactionIds = datasheetFactionLinks.map((link) => link.factionKeywordId);

    // Check for child faction links (e.g., Ultramarines, Space Wolves for Space Marines)
    let chapter = null;
    for (const childFaction of childFactions) {
      if (linkedFactionIds.includes(childFaction.id)) {
        chapter = childFaction.name;
        break;
      }
    }

    // Check for additionalFactions links (e.g., Harlequins, Ynnari for Aeldari)
    if (!chapter && additionalFactions.length > 0) {
      for (const addFactionName of additionalFactions) {
        const addFaction = newDataExport.faction_keyword.find((fk) => fk.name === addFactionName);
        if (addFaction && linkedFactionIds.includes(addFaction.id)) {
          chapter = addFactionName;
          break;
        }
      }
    }

    newUnit.chapter = chapter;

    newUnit.leadBy = undefined;
    newUnit.leads = undefined;

    foundUnits.push(newUnit);
  });

  for (let i = 0; i < foundUnits.length; i++) {
    const unit = foundUnits[i];

    if (unit.leader) {
      const parsed = parseLeaderRule(unit.leader);

      // Build leads object with all parsed data
      unit.leads = {
        units: parsed.units,
        extra: parsed.extra,
      };

      // Only include optional fields if they have values
      if (parsed.canAttachWith.length > 0) {
        unit.leads.canAttachWith = parsed.canAttachWith;
      }
      if (parsed.isBodyguard) {
        unit.leads.isBodyguard = true;
      }
      if (parsed.isMandatory) {
        unit.leads.isMandatory = true;
      }

      // Build bidirectional leadBy references
      if (parsed.units.length > 0) {
        parsed.units.forEach((atUnit) => {
          const foundUnitIndex = foundUnits.findIndex(
            (u) => u.name.toLowerCase().trim() === atUnit.toLowerCase().trim()
          );
          if (
            foundUnitIndex >= 0 &&
            foundUnits[foundUnitIndex].leadBy &&
            foundUnits[foundUnitIndex].leadBy.length > 0
          ) {
            foundUnits[foundUnitIndex].leadBy.push(unit.name);
          } else if (foundUnitIndex >= 0) {
            foundUnits[foundUnitIndex].leadBy = [unit.name];
          } else {
            // console.log(unit.name, 'not found:', atUnit);
          }
        });
      }
    }
  }

  const legendsUnits = oldParsedUnits.datasheets.filter((sheet) => sheet.legends === true);

  updateProgress(factionName, 'Writing');

  oldParsedUnits.datasheets = [...foundUnits, ...legendsUnits];
  oldParsedUnits.updated = new Date().toISOString();
  oldParsedUnits.compatibleDataVersion = JSON.parse(newDataExportFile).metadata.data_version;

  // Add parent faction reference for child factions
  // Frontend can use this to look up shared content (detachments, stratagems, etc.)
  // Map parent faction names to their output file IDs
  const parentFactionIdMap = {
    'Adeptus Astartes': 'SM',
  };

  if (isChildFaction && parentFaction) {
    oldParsedUnits.parent_id = parentFactionIdMap[parentFaction.name] || null;
    oldParsedUnits.parent_name = parentFaction.name;
  } else {
    oldParsedUnits.parent_id = null;
    oldParsedUnits.parent_name = null;
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, fileName);
  fs.writeFileSync(filePath, JSON.stringify(oldParsedUnits, null, 2));

  updateProgress(factionName, 'Formatting');

  // Run prettier on the output file
  try {
    execSync(`npx prettier --write "${filePath}"`, { stdio: 'pipe' });
  } catch (e) {
    // Prettier may not be available, continue without formatting
  }

  updateProgress(factionName, 'Comparing');

  // Read the new file content after prettier
  const newFileContent = readFile(fileName);

  // Parse both files
  const oldData = JSON.parse(originalFileContent);
  const newData = JSON.parse(newFileContent);

  // Check if data version changed BEFORE deleting the fields
  const oldVersion = oldData.compatibleDataVersion;
  const newVersion = newData.compatibleDataVersion;
  const versionChanged = oldVersion !== newVersion;

  // Remove fields that always change for data comparison
  delete oldData.updated;
  delete oldData.compatibleDataVersion;
  delete newData.updated;
  delete newData.compatibleDataVersion;

  // Compare by section
  const oldDatasheets = oldData.datasheets?.filter(s => !s.legends) || [];
  const newDatasheets = newData.datasheets?.filter(s => !s.legends) || [];
  const oldStratagems = oldData.stratagems || [];
  const newStratagems = newData.stratagems || [];
  const oldEnhancements = oldData.enhancements || [];
  const newEnhancements = newData.enhancements || [];
  const oldDetachments = oldData.detachments || [];
  const newDetachments = newData.detachments || [];
  const oldArmyRules = oldData.rules?.army || [];
  const newArmyRules = newData.rules?.army || [];

  // Compare using normalized JSON strings
  const datasheetChanges = compareByName(oldDatasheets, newDatasheets, 'datasheets');
  const stratagemChanges = compareByName(oldStratagems, newStratagems, 'stratagems');
  const enhancementChanges = compareByName(oldEnhancements, newEnhancements, 'enhancements');
  const armyRuleChanges = compareByName(oldArmyRules, newArmyRules, 'armyRules');

  // Track detachment changes (compare by name for object format)
  const oldDetachmentNames = oldDetachments?.map(d => typeof d === 'object' ? d.name : d) || [];
  const newDetachmentNames = newDetachments?.map(d => typeof d === 'object' ? d.name : d) || [];
  const detachmentChanges = {
    added: newDetachmentNames.filter(name => !oldDetachmentNames.includes(name)),
    removed: oldDetachmentNames.filter(name => !newDetachmentNames.includes(name)),
    modified: []
  };

  // Check for parent_id changes
  const parentIdChanged = oldData.parent_id !== newData.parent_id;

  // Check if there are any actual changes
  const hasChanges =
    datasheetChanges.added.length > 0 ||
    datasheetChanges.removed.length > 0 ||
    datasheetChanges.modified.length > 0 ||
    stratagemChanges.added.length > 0 ||
    stratagemChanges.removed.length > 0 ||
    stratagemChanges.modified.length > 0 ||
    enhancementChanges.added.length > 0 ||
    enhancementChanges.removed.length > 0 ||
    enhancementChanges.modified.length > 0 ||
    detachmentChanges.added.length > 0 ||
    detachmentChanges.removed.length > 0 ||
    armyRuleChanges.added.length > 0 ||
    armyRuleChanges.removed.length > 0 ||
    armyRuleChanges.modified.length > 0 ||
    parentIdChanged;

  // Store change report
  changeReports.push({
    faction: factionName,
    file: fileName,
    filePath: filePath,
    hasChanges,
    versionChanged,
    datasheets: datasheetChanges,
    stratagems: stratagemChanges,
    enhancements: enhancementChanges,
    detachments: detachmentChanges,
    armyRules: armyRuleChanges
  });
}

// Set total faction count for progress bar
totalFactions = 29;
console.log('Processing factions...\n');

parseDataExport('./gdc/darkangels.json', 'Dark Angels');

parseDataExport('./gdc/deathguard.json', 'Death Guard');
parseDataExport('./gdc/tyranids.json', 'Tyranids');
parseDataExport('./gdc/space_marines.json', 'Adeptus Astartes');

parseDataExport('./gdc/bloodangels.json', 'Blood Angels');
parseDataExport('./gdc/blacktemplar.json', 'Black Templars');
parseDataExport('./gdc/spacewolves.json', 'Space Wolves');
parseDataExport('./gdc/deathwatch.json', 'Deathwatch');
parseDataExport('./gdc/thousandsons.json', 'Thousand Sons');
parseDataExport('./gdc/worldeaters.json', 'World Eaters');
parseDataExport('./gdc/chaos_spacemarines.json', 'Heretic Astartes');
parseDataExport('./gdc/chaosdaemons.json', 'Legiones Daemonica');
parseDataExport('./gdc/chaosknights.json', 'Chaos Knights');

parseDataExport('./gdc/astramilitarum.json', 'Astra Militarum');
parseDataExport('./gdc/imperialknights.json', 'Imperial Knights');
parseDataExport('./gdc/greyknights.json', 'Grey Knights');
parseDataExport('./gdc/adeptasororitas.json', 'Adepta Sororitas');

parseDataExport('./gdc/adeptusmechanicus.json', 'Adeptus Mechanicus');
parseDataExport('./gdc/adeptuscustodes.json', 'Adeptus Custodes');
parseDataExport('./gdc/agents.json', 'Agents of the Imperium');
parseDataExport('./gdc/orks.json', 'Orks');
parseDataExport('./gdc/votann.json', 'Leagues of Votann');
parseDataExport('./gdc/tau.json', 'T’au Empire');
parseDataExport('./gdc/necrons.json', 'Necrons');
parseDataExport('./gdc/aeldari.json', 'Asuryani', ['Harlequins', 'Ynnari']);
parseDataExport('./gdc/drukhari.json', 'Drukhari');

parseDataExport('./gdc/gsc.json', 'Genestealer Cults');
parseDataExport('./gdc/emperors_children.json', 'Emperor’s Children');

parseDataExport('./gdc/titan.json', 'Adeptus Titanicus');

// parseDataExport('./gdc/space_marines.json', 'Salamanders');
// parseDataExport('./gdc/space_marines.json', 'Imperial Fists');
// parseDataExport('./gdc/space_marines.json', 'Iron Hands');
// parseDataExport('./gdc/space_marines.json', 'Ultramarines');
// parseDataExport('./gdc/space_marines.json', 'Raven Guard');
// parseDataExport('./gdc/space_marines.json', 'White Scars');

// parseDataExport('./gdc/unaligned.json', 'Unaligned Forces');

// Print summary report
function printSummaryReport() {
  // Clear progress bar and show completion
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

      // Datasheets
      if (report.datasheets.added.length > 0 || report.datasheets.removed.length > 0 || report.datasheets.modified.length > 0) {
        console.log('\n  DATASHEETS:');
        if (report.datasheets.added.length > 0) {
          console.log(`    Added (${report.datasheets.added.length}):`);
          report.datasheets.added.forEach(name => console.log(`      + ${name}`));
        }
        if (report.datasheets.removed.length > 0) {
          console.log(`    Removed (${report.datasheets.removed.length}):`);
          report.datasheets.removed.forEach(name => console.log(`      - ${name}`));
        }
        if (report.datasheets.modified.length > 0) {
          console.log(`    Modified (${report.datasheets.modified.length}):`);
          report.datasheets.modified.forEach(name => console.log(`      ~ ${name}`));
        }
      }

      // Stratagems
      if (report.stratagems.added.length > 0 || report.stratagems.removed.length > 0 || report.stratagems.modified.length > 0) {
        console.log('\n  STRATAGEMS:');
        if (report.stratagems.added.length > 0) {
          console.log(`    Added (${report.stratagems.added.length}):`);
          report.stratagems.added.forEach(name => console.log(`      + ${name}`));
        }
        if (report.stratagems.removed.length > 0) {
          console.log(`    Removed (${report.stratagems.removed.length}):`);
          report.stratagems.removed.forEach(name => console.log(`      - ${name}`));
        }
        if (report.stratagems.modified.length > 0) {
          console.log(`    Modified (${report.stratagems.modified.length}):`);
          report.stratagems.modified.forEach(name => console.log(`      ~ ${name}`));
        }
      }

      // Enhancements
      if (report.enhancements.added.length > 0 || report.enhancements.removed.length > 0 || report.enhancements.modified.length > 0) {
        console.log('\n  ENHANCEMENTS:');
        if (report.enhancements.added.length > 0) {
          console.log(`    Added (${report.enhancements.added.length}):`);
          report.enhancements.added.forEach(name => console.log(`      + ${name}`));
        }
        if (report.enhancements.removed.length > 0) {
          console.log(`    Removed (${report.enhancements.removed.length}):`);
          report.enhancements.removed.forEach(name => console.log(`      - ${name}`));
        }
        if (report.enhancements.modified.length > 0) {
          console.log(`    Modified (${report.enhancements.modified.length}):`);
          report.enhancements.modified.forEach(name => console.log(`      ~ ${name}`));
        }
      }

      // Detachments
      if (report.detachments.added.length > 0 || report.detachments.removed.length > 0) {
        console.log('\n  DETACHMENTS:');
        if (report.detachments.added.length > 0) {
          console.log(`    Added (${report.detachments.added.length}):`);
          report.detachments.added.forEach(name => console.log(`      + ${name}`));
        }
        if (report.detachments.removed.length > 0) {
          console.log(`    Removed (${report.detachments.removed.length}):`);
          report.detachments.removed.forEach(name => console.log(`      - ${name}`));
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
  let totalDatasheetsAdded = 0, totalDatasheetsRemoved = 0, totalDatasheetsModified = 0;
  let totalStratagemsAdded = 0, totalStratagemsRemoved = 0, totalStratagemsModified = 0;
  let totalEnhancementsAdded = 0, totalEnhancementsRemoved = 0, totalEnhancementsModified = 0;
  let totalDetachmentsAdded = 0, totalDetachmentsRemoved = 0;
  let totalArmyRulesAdded = 0, totalArmyRulesRemoved = 0, totalArmyRulesModified = 0;

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
    totalDetachmentsAdded += report.detachments.added.length;
    totalDetachmentsRemoved += report.detachments.removed.length;
    totalArmyRulesAdded += report.armyRules.added.length;
    totalArmyRulesRemoved += report.armyRules.removed.length;
    totalArmyRulesModified += report.armyRules.modified.length;
  }

  console.log(`\nDatasheets:    +${totalDatasheetsAdded} added, -${totalDatasheetsRemoved} removed, ~${totalDatasheetsModified} modified`);
  console.log(`Stratagems:    +${totalStratagemsAdded} added, -${totalStratagemsRemoved} removed, ~${totalStratagemsModified} modified`);
  console.log(`Enhancements:  +${totalEnhancementsAdded} added, -${totalEnhancementsRemoved} removed, ~${totalEnhancementsModified} modified`);
  console.log(`Detachments:   +${totalDetachmentsAdded} added, -${totalDetachmentsRemoved} removed`);
  console.log(`Army Rules:    +${totalArmyRulesAdded} added, -${totalArmyRulesRemoved} removed, ~${totalArmyRulesModified} modified`);
  console.log('='.repeat(80) + '\n');
}

// Handle git staging - only stage files with actual changes or version changes
function handleGitStaging() {
  console.log('='.repeat(80));
  console.log('GIT STAGING');
  console.log('='.repeat(80) + '\n');

  const toStage = [];
  const toRevert = [];

  for (const report of changeReports) {
    // Stage if there are actual data changes OR if the version changed
    if (report.hasChanges || report.versionChanged) {
      toStage.push(report);
    } else {
      // Only timestamp changed - revert
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

  // Summary
  console.log('-'.repeat(60));
  console.log(`Files staged: ${toStage.length}`);
  console.log(`Files reverted: ${toRevert.length}`);
  console.log('='.repeat(80) + '\n');
}

printSummaryReport();
handleGitStaging();