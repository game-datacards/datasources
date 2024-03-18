import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { v5 as uuidv5 } from 'uuid';

import { sortObj } from 'jsonabc';
import { profile } from 'console';

const readFile = (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');
  return res;
};

const specialWeaponKeywords = [
  {
    description:
      'After the bearer has shot with this weapon, select one enemy Monster or Vehicle unit hit by one or more of those attacks. Until the end of the turn, each time the bearer selects that unit as a target of a charge, add 2 to the Charge roll.',
    name: 'Harpooned',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Reverberating Summons',
    description:
      'Each time a model is destroyed by this weapon, you can select one friendly Plaguebearers unit within 12" of the bearer and return 1 destroyed Plaguebearer model to that unit.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Dead Choppy',
    description:
      'The Attacks characteristic of this weapon is increased by 1 for each additional dread klaw this model is equipped with.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Snagged',
    description:
      'Each time this weapon scores a hit against an enemy Monster or Vehicle unit, until the end of the turn, if the bearer selects that unit as a target of a charge, add 2 to Charge rolls made for the bearer.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Impaled',
    description:
      'Each time this weapon scores a hit against an enemy Monster or Vehicle unit, until the end of the turn, if the bearer selects that unit as a target of a charge, add 2 to Charge rolls made for the bearer',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Conversion',
    description:
      'Each time an attack made with this weapon targets a unit more than 12" from the bearer, an unmodified successful Hit roll of 4+ scores a Critical Hit.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Hive Defences',
    description:
      'Each time an enemy unit is set up or ends a Normal, Advance or Fall Back move within range of this weapon, if that enemy unit is an eligible target, the bearer can shoot with this weapon at that unit as if it were your Shooting phase (the bearer can do so up to four times per phase).',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'One Shot',
    description: 'The bearer can only shoot with this weapon once per battle.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Hooked',
    description:
      'Each time the bearer makes an attack with this weapon that targets a Monster or Vehicle unit, if a hit is scored, until the end of the turn, if the bearer selects that unit as a target of a charge, add 2 to Charge rolls made for the bearer and enemy units cannot use the Fire Overwatch Stratagem to shoot at the bearer.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Linked Fire',
    description:
      'When selecting targets for this weapon, you can measure range and determine visibility from another friendly Fire Prism model that is visible to the bearer.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Psychic Assassin',
    description:
      'Each time you select a Psyker unit as the target for this weapon, until those attacks are resolved, change the Attacks characteristic of this weapon to 6.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Plasma Warhead',
    description:
      'The bearer can only shoot with this weapon in your Shooting phase, and only if it  this model is selected to shoot, if it has not shot with its Remained Stationary this turn and you did not use its Deathstrike Missile ability to Designate Target',
    showAbility: true,
    showDescription: true,
  },
  {
    name: 'Defensive Array',
    description:
      'Each time an enemy unit is set up or ends a Normal, Advance or Fall Back move within range of this weapon, if that enemy unit is an eligible target, the bearer can shoot this weapon at that target as if it were your Shooting phase. The bearer can shoot up to four times in this way in your opponent’s Movement phase.',
    showAbility: true,
    showDescription: true,
  },
];

const newDataExportFile = readFile('./temp/data-export.json');
const newDataExport = sortObj(JSON.parse(newDataExportFile));

function parseDataExport(fileName, factionName) {
  const oldParsedUnitsFile = readFile(fileName);
  const oldParsedUnits = sortObj(JSON.parse(oldParsedUnitsFile));

  let foundUnits = [];
  const missingUnits = [];

  const newFaction = newDataExport.faction_keyword.find((faction_keyword) => {
    return faction_keyword.name === factionName;
  });

  const allDatasheetFactionKeywords = newDataExport.datasheet_faction_keyword.filter((datasheet_faction_keyword) => {
    return datasheet_faction_keyword.factionKeywordId === newFaction.id;
  });

  let allDataSheets = newDataExport.datasheet.filter((datasheet) =>
    allDatasheetFactionKeywords.find(
      (datasheet_faction_keyword) => datasheet.id === datasheet_faction_keyword.datasheetId
    )
  );

  allDataSheets = allDataSheets.map((card, index) => {
    card.publication = newDataExport.publication.find((publication) => publication.id === card.publicationId);

    //Find all miniatures (stat lines)
    const miniatures = newDataExport.miniature.filter(
      (miniature) => miniature.datasheetId === card.id && miniature.statlineHidden === false
    );
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
      (value, index, self) => index === self.findIndex((t) => t.place === value.place && t.name === value.name)
    );
    console.log(weapons);
    //Find the damage ability
    let damageAbility = newDataExport.datasheet_damage.filter((ability) => ability.datasheetId === card.id);

    //Find the invul ability
    let invul = newDataExport.invulnerable_save.find((ability) => ability.datasheetId === card.id);

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
    };
  });
  allDataSheets = allDataSheets.filter((card) => card.publication.isCombatPatrol === false);

  oldParsedUnits.datasheets.map((card, index) => {
    const foundUnit = allDataSheets.find(
      (newCard) =>
        newCard.name.toLowerCase().trim() === card.name.toLowerCase().trim() ||
        newCard.name.toLowerCase().trim() === `${card.name.toLowerCase().trim()} ${card?.subname?.toLowerCase().trim()}`
    );

    if (foundUnit !== undefined) {
      foundUnits.push(foundUnit.name);

      //Faction abilities
      const factionAbilities = foundUnit.datasheetAbilities
        .filter((ability) => ability.abilityType === 'faction')
        .map((ability) => {
          if (ability.restriction !== null) {
            return `${ability.name} ${ability.restriction}`;
          }
          return ability.name;
        });

      oldParsedUnits.datasheets[index].abilities.faction = [...factionAbilities];
      //Core abilities
      const coreAbilities = foundUnit.datasheetAbilities
        .filter((ability) => ability.abilityType === 'core')
        .map((ability) => {
          if (ability.restriction !== null) {
            return `${ability.name} ${ability.restriction}`;
          }
          return ability.name;
        });

      oldParsedUnits.datasheets[index].abilities.core = [...coreAbilities];

      //Other abilities
      const datasheet = foundUnit.datasheetAbilities
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
          return { name: name, description: ability.rules, showAbility: true, showDescription: true };
        });

      //Other abilities
      const wargearItems = foundUnit.wargearItems
        .filter((item) => item.wargearType === 'wargear')
        .map((item) => {
          let name = item.name;
          return { name: name, description: item.ruleText.split('\n\n')[0], showAbility: true, showDescription: true };
        });

      oldParsedUnits.datasheets[index].abilities.wargear = [...wargearItems];
      //Primarch abilities
      const primarchAbility = foundUnit.datasheetAbilities
        .map((ability) => {
          if (ability.subAbilities.length > 0) {
            const abilities = ability.subAbilities.map((subAbility) => {
              return { name: subAbility.name, description: subAbility.rules, showAbility: true, showDescription: true };
            });
            return { name: ability.name, abilities: abilities, showAbility: true };
          }
          return undefined;
        })
        .filter((ability) => ability !== undefined);

      if (primarchAbility.length > 0) {
        oldParsedUnits.datasheets[index].abilities.primarch = [...primarchAbility];
      }

      //Damage ability
      const damageAbility = foundUnit.damageAbility.filter((ability) => ability !== undefined);
      let damageProfile = false;
      if (damageAbility.length > 0) {
        damageProfile = true;
        oldParsedUnits.datasheets[index].abilities.damaged = {
          range: damageAbility[0].name
            .replaceAll('DAMAGED: ', '')
            .replaceAll('Damaged: ', '')
            .replaceAll('Damaged ', '')
            .toUpperCase(),
          description: damageAbility[0].rules,
          showDamagedAbility: true,
          showDescription: true,
        };
      }

      //invul ability
      if (foundUnit.invulAbility !== undefined) {
        oldParsedUnits.datasheets[index].abilities.invul = {
          info: foundUnit.invulAbility.rules ? foundUnit.invulAbility.rules : '',
          showAtTop: true,
          showInfo: foundUnit.invulAbility.rules !== null,
          showInvulnerableSave: true,
          value: foundUnit.invulAbility.save,
        };
      }

      //Check for leader rule
      const leaderAbility = foundUnit.datasheetRules.find((ability) => ability.name === 'Leader');

      if (leaderAbility !== undefined && leaderAbility.rules !== undefined) {
        oldParsedUnits.datasheets[index].leader = leaderAbility.rules
          .replaceAll('\n\n', ' ')
          .replaceAll('\n', ' ')
          .trim();
      }

      //Check for transport rule
      const transportAbility = foundUnit.datasheetRules.find((ability) => ability.name === 'Transport');

      if (transportAbility !== undefined && transportAbility.rules !== undefined) {
        oldParsedUnits.datasheets[index].transport = transportAbility.rules.trim();
      }

      //Check for other special rules
      const specialAbilities = foundUnit.datasheetRules.filter(
        (ability) => ability.name !== 'Transport' && ability.name !== 'Leader'
      );
      if (specialAbilities !== undefined && specialAbilities.length > 0) {
        oldParsedUnits.datasheets[index].abilities.special = specialAbilities.map((ability) => {
          return {
            description: ability.rules.trim(),
            name: ability.name,
            showAbility: true,
            showDescription: true,
          };
        });
      }

      const statProfiles = foundUnit.miniatures.map((miniature) => {
        return {
          active: true,
          ld: miniature.leadership,
          m: miniature.movement,
          name: foundUnit.miniatures.length > 1 ? miniature.name : foundUnit.name,
          oc: miniature.objectiveControl,
          showDamagedMarker: oldParsedUnits.datasheets[index].abilities?.damaged?.showDamagedAbility ? true : false,
          showName: foundUnit.miniatures.length > 1,
          sv: miniature.save,
          t: miniature.toughness,
          w: miniature.wounds,
        };
      });

      const rangedWeapons = foundUnit.weapons
        .filter((weapon) => {
          return weapon.profiles[0].type === 'ranged';
        })
        .map((weapon) => {
          return {
            active: true,
            profiles: weapon.profiles.map((profile) => {
              return {
                active: true,
                ap: profile.armourPenetration,
                attacks: profile.attacks,
                damage: profile.damage,
                keywords: [],
                name: weapon.profiles.length > 1 ? weapon.name + ' – ' + profile.name : profile.name,
                range: profile.range,
                skill: profile.ballisticSkill,
                strength: profile.strength,
                keywords: profile.keywords,
              };
            }),
          };
        });
      const meleeWeapons = foundUnit.weapons
        .filter((weapon) => {
          return weapon.profiles[0].type === 'melee';
        })
        .map((weapon) => {
          return {
            active: true,
            profiles: weapon.profiles.map((profile) => {
              return {
                active: true,
                ap: profile.armourPenetration,
                attacks: profile.attacks,
                damage: profile.damage,
                keywords: [],
                name: weapon.profiles.length > 1 ? weapon.name + ' – ' + profile.name : profile.name,
                range: profile.range,
                skill: profile.weaponSkill,
                strength: profile.strength,
                keywords: profile.keywords,
              };
            }),
          };
        });

      oldParsedUnits.datasheets[index].stats = [...statProfiles];
      oldParsedUnits.datasheets[index].rangedWeapons = [...rangedWeapons];
      oldParsedUnits.datasheets[index].meleeWeapons = [...meleeWeapons];

      oldParsedUnits.datasheets[index].rangedWeapons?.forEach((wep) => {
        let abilities = undefined;
        wep?.profiles?.forEach((prof) => {
          specialWeaponKeywords.forEach((val) => {
            if (prof.keywords.some((keyword) => val.name.toLowerCase() === keyword.toLowerCase())) {
              abilities = [val];
            }
          });
        });
        wep.abilities = abilities;
      });
      oldParsedUnits.datasheets[index].meleeWeapons?.forEach((wep) => {
        let abilities = undefined;
        wep?.profiles?.forEach((prof) => {
          specialWeaponKeywords.forEach((val) => {
            if (prof.keywords.some((keyword) => val.name.toLowerCase() === keyword.toLowerCase())) {
              abilities = [val];
            }
          });
        });
        wep.abilities = abilities;
      });

      oldParsedUnits.datasheets[index].composition = foundUnit.unitComposition
        .split('\n\n')[0]
        .split('\n')
        .map((unit) => {
          return unit.replaceAll('■', '').trim();
        });

      oldParsedUnits.datasheets[index].wargear =
        foundUnit.wargearOptions?.length > 0
          ? foundUnit.wargearOptions.map((gear) => gear.rulesText.replaceAll('■', '').replaceAll('\n', ' ').trim())
          : ['None'];

      oldParsedUnits.datasheets[index].loadout = foundUnit.unitComposition.split('\n\n')[1];
      oldParsedUnits.datasheets[index].fluff = foundUnit.lore;

      //And set the name
      oldParsedUnits.datasheets[index].name = foundUnit.name;
    } else {
      // console.log('Not found unit', card.name);
    }
  });
  let notFoundunits = oldParsedUnits.datasheets.filter((unit) => !foundUnits.includes(unit.name));

  notFoundunits = notFoundunits.filter((unit) => unit.legends === false || unit.legends === undefined);

  const unitnames = notFoundunits.map((unit) => unit.name);

  console.log(`Not found units for ${factionName}:`, unitnames.join(', '));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  fs.writeFileSync(path.resolve(__dirname, fileName), JSON.stringify(sortObj(oldParsedUnits), null, 2));
}

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
parseDataExport('./gdc/aeldari.json', 'Aeldari');
parseDataExport('./gdc/drukhari.json', 'Drukhari');

parseDataExport('./gdc/gsc.json', 'Genestealer Cults');

parseDataExport('./gdc/titan.json', 'Adeptus Titanicus');

// parseDataExport('./gdc/space_marines.json', 'Salamanders');
// parseDataExport('./gdc/unaligned.json', 'Unaligned Forces');
