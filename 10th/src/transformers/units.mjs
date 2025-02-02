import { v5 as uuidv5 } from 'uuid';
import { removeMarkdown } from '../utils.mjs';
import { UUID_NAMESPACE } from '../constants.mjs';
import { processWeapons, processWargearOptions } from './weapons.mjs';
import {
  processFactionAbilities,
  processCoreAbilities,
  processDatasheetAbilities,
  processWargearAbilities,
  processPrimarchAbilities,
  processDamageAbility,
  processInvulAbility,
  processSpecialRules,
} from './abilities.mjs';

export const processUnit = (card, factionName, oldParsedUnits) => {
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
    id: uuidv5(card.name, UUID_NAMESPACE),
    imperialArmour: card.publication.name.includes('Imperial Armour') ? true : undefined,
    keywords: [],
    leader: '',
    loadout: '',
    meleeWeapons: [],
    name: card.name,
    points: [],
    rangedWeapons: [],
    source: '40k-10e',
    stats: [],
    transport: '',
    wargear: [],
  };

  // Process abilities
  newUnit.abilities.faction = processFactionAbilities(card.datasheetAbilities);
  newUnit.abilities.core = processCoreAbilities(card.datasheetAbilities);
  newUnit.abilities.other = processDatasheetAbilities(card.datasheetAbilities);
  newUnit.abilities.wargear = processWargearAbilities(card.wargearItems);
  
  const primarchAbilities = processPrimarchAbilities(card.datasheetAbilities);
  if (primarchAbilities.length > 0) {
    newUnit.abilities.primarch = primarchAbilities;
  }

  newUnit.abilities.damaged = processDamageAbility(card.damageAbility);
  newUnit.abilities.invul = processInvulAbility(card.invulAbility);
  newUnit.abilities.special = processSpecialRules(card.datasheetRules);

  // Process leader and transport rules
  const leaderAbility = card.datasheetRules.find((ability) => ability.name === 'Leader');
  if (leaderAbility?.rules) {
    newUnit.leader = removeMarkdown(leaderAbility.rules.replaceAll('\n\n', ' ').replaceAll('\n', ' ').trim());
  }

  const transportAbility = card.datasheetRules.find((ability) => ability.name === 'Transport');
  if (transportAbility?.rules) {
    newUnit.transport = removeMarkdown(transportAbility.rules.trim());
  }

  // Process stats
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

  if (statProfiles.length === 0) {
    statProfiles = [{
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
    }];
    keywords.push(...card.miniatures[0].keywords);
  }

  newUnit.stats = statProfiles;
  newUnit.keywords = [...new Set(keywords)];

  // Process weapons
  const { rangedWeapons, meleeWeapons } = processWeapons(card.weapons);
  newUnit.rangedWeapons = rangedWeapons;
  newUnit.meleeWeapons = meleeWeapons;

  // Process composition and wargear
  newUnit.composition = removeMarkdown(card.unitComposition.split('\n\n')[0])
    .split('\n')
    .map((unit) => unit.replaceAll('■', '').trim());

  newUnit.wargear = processWargearOptions(card.wargearOptions);
  newUnit.loadout = removeMarkdown(card.unitComposition.split('\n\n')[1]);
  newUnit.fluff = removeMarkdown(card.lore);
  newUnit.points = card.points;

  return newUnit;
};

export const processLeadershipConnections = (units) => {
  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    if (unit.leader) {
      let assignedUnits = undefined;
      let extraText = '';

      const leaderTextPatterns = [
        { start: 'You can attach', extract: true },
        { start: 'You must attach', extract: true },
        { start: 'This model can be attached to a', extract: true },
        { start: 'This model cannot be attached to a', extract: true },
        { start: 'If this unit’s Bodyguard', extract: true },
      ];

      for (const pattern of leaderTextPatterns) {
        const startIndex = unit.leader.indexOf(pattern.start);
        if (startIndex !== -1) {
          assignedUnits = removeMarkdown(unit.leader
            .substring(unit.leader.indexOf('■'), startIndex))
            .split('■')
            .filter((v) => v)
            .map((v) => v.replaceAll('*', '').trim());
          
          if (pattern.extract) {
            extraText = unit.leader.substring(startIndex);
          }
          break;
        }
      }

      // If no pattern matched, take everything after ■
      if (!assignedUnits) {
        assignedUnits = removeMarkdown(unit.leader
          .substring(unit.leader.indexOf('■')))
          .split('■')
          .filter((v) => v)
          .map((v) => v.replaceAll('*', '').trim());
      }

      unit.leads = { units: assignedUnits, extra: extraText };

      if (assignedUnits.length > 0) {
        assignedUnits.forEach((atUnit) => {
          const foundUnitIndex = units.findIndex(
            (u) => u.name.toLowerCase().trim() === atUnit.toLowerCase().trim()
          );
          if (foundUnitIndex >= 0) {
            if (units[foundUnitIndex].leadBy) {
              units[foundUnitIndex].leadBy.push(unit.name);
            } else {
              units[foundUnitIndex].leadBy = [unit.name];
            }
          }
        });
      }
    }
  }

  return units;
};