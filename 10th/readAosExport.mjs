import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { v5 as uuidv5 } from 'uuid';

import { sortObj } from 'jsonabc';

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
];

const newDataExportFile = readFile('./temp/aos-export-122.json');
const newDataExport = sortObj(JSON.parse(newDataExportFile));

function readAosArmies() {
  let foundUnits = [];

  const armies = newDataExport.publication.filter((publication) => publication.publicationGroupId === null);

  armies.map((army) => {
    const armyName = army.name
      .replaceAll('Army of Renown: ', '')
      .replaceAll('Faction Pack: ', '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    let newArmy = {
      name: armyName,
      id: uuidv5(armyName, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
      faction_id: 'unknown',
      factions: [],
      battle_traits: [],
      heroic_traits: [],
      artefacts: [],
      spells: [],
      prayer: [],
      formations: [],
      warscrolls: [],
    };

    // newArmy.detachments.push(detachmentName);

    const newFaction = newDataExport.faction_keyword.find((faction_keyword) => {
      return faction_keyword.id === army.factionKeywordId;
    });

    const lore = newDataExport.lore.filter((spell) => {
      return spell.publicationId === army?.id;
    });
    //Find all lore abilities
    newArmy.lore = lore?.map((newLore) => {
      let lore_abilities = newDataExport.lore_ability.filter((lore_ability) => {
        return lore_ability.loreId === newLore?.id;
      });
      lore_abilities = lore_abilities.map((lore_ability) => {
        const foundKeywords = newDataExport.lore_ability_keyword
          .filter((lore_ability_keyword) => {
            return lore_ability_keyword.loreAbilityId === lore_ability?.id;
          })
          .map((kw) => kw.keywordId);

        const lore_ability_keywords = newDataExport.keyword.filter((keyword) => {
          return foundKeywords.includes(keyword.id);
        });

        return {
          name: lore_ability.name,
          id: uuidv5(lore_ability.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
          cost: Number(lore_ability.cpCost),
          castingValue: Number(lore_ability.castingValue),
          declare: lore_ability.declare || '',
          effect: lore_ability.effect || '',
          phase: lore_ability.phase,
          phaseDetails: lore_ability.phaseDetails,
          fluff: lore_ability.lore || '',
          keywords: lore_ability_keywords.map((keyword) => {
            return keyword.name;
          }),
        };
      });

      return {
        name: newLore.name,
        id: uuidv5(newLore.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
        abilities: lore_abilities,
      };
    });

    //Find all faction abilities
    const abilitygroups = newDataExport.ability_group.filter((group) => {
      return group.publicationId === army?.id;
    });

    // let enhancements = newDataExport.enhancement.filter((enhancement) => {
    //   return enhancement.publicationId === army?.id;
    // });

    newArmy.abilities = abilitygroups?.map((newGroup) => {
      let group_abilities = newDataExport.ability.filter((ability) => {
        return ability.abilityGroupId === newGroup?.id;
      });
      group_abilities = group_abilities.map((ability) => {
        return {
          name: ability.name,
          id: uuidv5(ability.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
          cost: Number(ability.cpCost),
          declare: ability.declare || '',
          effect: ability.effect || '',
          fluff: ability.lore || '',
          phase: ability.phase || '',
          phaseDetails: ability.phaseDetails || '',
          subsectionName: ability.subsectionName || '',
          subsectionText: ability.subsectionRulesText || '',
          // keywords: lore_ability_keywords.map((keyword) => {
          //   return keyword.name;
          // }),
        };
      });

      return {
        name: newGroup.name,
        restriction: newGroup.restrictionText,
        group: newGroup.abilityGroupType,
        subsectionName: newGroup.subsectionName || '',
        subsectionText: newGroup.subsectionRulesText || '',
        id: uuidv5(newGroup.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
        abilities: group_abilities,
      };
    });

    newArmy.warscrolls = newDataExport.warscroll.filter((warscroll) => warscroll.publicationId === army.id);

    newArmy.warscrolls = newArmy.warscrolls.map((card, index) => {
      card.publication = newDataExport.publication.find((publication) => publication.id === card.publicationId);

      //Get keywords from warscroll
      const foundKeywords = newDataExport.warscroll_keyword
        .filter((warscroll_keyword) => {
          return warscroll_keyword.warscrollId === card?.id;
        })
        .map((kw) => kw.keywordId);

      const warscroll_keywords = newDataExport.keyword.filter((keyword) => {
        return foundKeywords.includes(keyword.id);
      });

      //Get keywords from warscroll
      const foundFactionKeywords = newDataExport.warscroll_faction_keyword
        .filter((warscroll_keyword) => {
          return warscroll_keyword.warscrollId === card?.id;
        })
        .map((kw) => kw.factionKeywordId);

      foundFactionKeywords.sort((a, b) => a.displayOrder - b.displayOrder);

      const faction_keywords = newDataExport.faction_keyword.filter((keyword) => {
        return foundFactionKeywords.includes(keyword.id);
      });

      //Find all abilities connected to the datasheet
      let warscrollAbilities = newDataExport.warscroll_ability.filter((ability) => ability.warscrollId === card.id);

      warscrollAbilities = warscrollAbilities.map((ability) => {
        const foundKeywords = newDataExport.warscroll_ability_keyword
          .filter((warscroll_ability_keyword) => {
            return warscroll_ability_keyword.warscrollAbilityId === ability?.id;
          })
          .map((kw) => kw.keywordId);

        const warscroll_ability_keywords = newDataExport.keyword.filter((keyword) => {
          return foundKeywords.includes(keyword.id);
        });

        return {
          name: ability.name,
          id: uuidv5(ability.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
          cost: Number(ability.cpCost),
          castingValue: Number(ability.castingValue),
          declare: ability.declare || '',
          effect: ability.effect || '',
          phase: ability.phase,
          phaseDetails: ability.phaseDetails,
          fluff: ability.lore || '',
          usedBy: ability.usedBy || '',
          type: ability.abilityAndCommandIcon,
          keywords: warscroll_ability_keywords.map((keyword) => {
            return keyword.name;
          }),
        };
      });

      //Find all terrain abilities connected to the datasheet
      const warscrollTerrainAbilitiesIds = newDataExport.warscroll_terrain_ability
        .filter((ability) => ability.warscrollId === card.id)
        .map((kw) => kw.terrainAbilityId);

      //Get keywords from warscroll
      let warscrollTerrainAbilities = newDataExport.terrain_ability.filter((terrain_ability) => {
        return warscrollTerrainAbilitiesIds.includes(terrain_ability.id);
      });

      warscrollTerrainAbilities = warscrollTerrainAbilities.map((ability) => {
        return {
          name: ability.name,
          rules: ability.rules,
        };
      });

      //Find all weapons connected to the datasheet
      let warscrollWeapons = newDataExport.warscroll_weapon.filter((weapon) => weapon.warscrollId === card.id);

      warscrollWeapons = warscrollWeapons.map((weapon) => {
        const warscrollWeaponAbilitiesIds = newDataExport.warscroll_weapon_weapon_ability
          .filter((weapon_ability) => weapon_ability.warscrollWeaponId === weapon.id)
          .map((weapon_ability) => weapon_ability.weaponAbilityId);

        console.log(warscrollWeaponAbilitiesIds);

        let warscrollWeaponAbilities = newDataExport.weapon_ability.filter((ability) => {
          return warscrollWeaponAbilitiesIds.includes(ability.id);
        });

        return {
          ...weapon,
          abilities: [
            ...warscrollWeaponAbilities.map((ability) => {
              return { name: ability.name, rules: ability.rules };
            }),
          ],
        };
      });

      //   datasheetAbilities.sort((a, b) => a.displayOrder - b.displayOrder);

      //   datasheetAbilities = datasheetAbilities.map((datasheetAbility) => {
      //     //Ability itself
      //     const foundAbility = newDataExport.datasheet_ability.find(
      //       (ability) => datasheetAbility.datasheetAbilityId === ability.id
      //     );

      //     //Potential sub abilities (such as primarch)
      //     const subAbilities = newDataExport.datasheet_sub_ability.filter(
      //       (subAbility) => subAbility.datasheetAbilityId === foundAbility.id
      //     );

      //     return { ...foundAbility, restriction: datasheetAbility.restriction, subAbilities: [...subAbilities] };
      //   });

      //   //Find all wargear options
      //   let wargearOptions = newDataExport.wargear_rule.filter((wargear) => wargear.datasheetId === card.id);

      //   wargearOptions.sort((a, b) => b.displayOrder - a.displayOrder);

      //   //Find all rules connected to the datasheet
      //   let datasheetRules = newDataExport.datasheet_rule.filter((ability) => ability.datasheetId === card.id);

      //   datasheetRules.sort((a, b) => b.displayOrder - a.displayOrder);

      //   //Find all wargear items connected to the datasheet
      //   const wargearOptionsGroups = newDataExport.wargear_option_group.filter(
      //     (wargear) => wargear.datasheetId === card.id
      //   );

      //   let wargearOpts = [];

      //   wargearOptionsGroups.map((wargearOptionGroup) => {
      //     wargearOpts = [
      //       ...wargearOpts,
      //       ...newDataExport.wargear_option.filter((wargear) => wargear.wargearOptionGroupId === wargearOptionGroup.id),
      //     ];
      //   });

      //   let wargearItems = [];

      //   wargearOpts.map((wargearOption) => {
      //     wargearItems = [
      //       ...wargearItems,
      //       ...newDataExport.wargear_item.filter((wargear) => wargear.id === wargearOption.wargearItemId),
      //     ];
      //   });
      //   wargearItems.sort((a, b) => b.displayOrder - a.displayOrder);

      //   let weapons = wargearItems
      //     .filter((item) => item.wargearType === 'weapon')
      //     .map((item) => {
      //       return {
      //         name: item.name,
      //         id: item.id,
      //         profiles: newDataExport.wargear_item_profile
      //           .filter((profile) => profile.wargearItemId === item.id)
      //           .map((profile) => {
      //             return {
      //               ...profile,
      //               keywords: newDataExport.wargear_item_profile_wargear_ability
      //                 .filter((ability) => ability.wargearItemProfileId === profile.id)
      //                 .toSorted((a, b) => b.displayOrder - a.displayOrder)
      //                 .map((ability) => {
      //                   return newDataExport.wargear_ability.find((wargearAbility) => {
      //                     return wargearAbility.id === ability.wargearAbilityId;
      //                   }).name;
      //                 }),
      //             };
      //           }),
      //       };
      //     });

      //   weapons = weapons.filter(
      //     (value, index, self) => index === self.findIndex((t) => t.attacks === value.attacks && t.name === value.name)
      //   );

      //   //Find the damage ability
      //   let damageAbility = newDataExport.datasheet_damage.filter((ability) => ability.datasheetId === card.id);

      //   //Find the invul ability
      //   let invul = newDataExport.invulnerable_save.find((ability) => ability.datasheetId === card.id);

      //   //Find the points
      //   let points = newDataExport.unit_composition
      //     .filter((ability) => ability.datasheetId === card.id)
      //     .toSorted((a, b) => b.displayOrder - a.displayOrder)
      //     .map((point) => {
      //       const unitCompMini = newDataExport.unit_composition_miniature.filter(
      //         (pointComp) => pointComp.unitCompositionId === point.id
      //       );
      //       return {
      //         cost: point.points.toString(),
      //         models: unitCompMini
      //           .reduce((acc, curr) => {
      //             return acc + curr.max;
      //           }, 0)
      //           .toString(),
      //         active: true,
      //       };
      //     });

      //   points = points.filter(
      //     (value, index, self) => index === self.findIndex((t) => t.cost === value.cost && t.models === value.models)
      //   );

      //   //And return the found datasheet
      return {
        ...card,
        weapons: [...warscrollWeapons],
        abilities: [...warscrollAbilities],
        terrain: [...warscrollTerrainAbilities],
        keywords: {
          basic: warscroll_keywords.map((keyword) => {
            return keyword.name;
          }),
          faction: faction_keywords.map((keyword) => {
            return keyword.name;
          }),
        },
      };
    });

    // // allDataSheets = allDataSheets.filter((card) => card.publication.isCombatPatrol === false);
    // allDataSheets.sort((a, b) => a.displayOrder - b.displayOrder);

    // allDataSheets.map((card, index) => {
    //   let newUnit = {
    //     name: '',
    //     id: uuidv5(card.name + index.toString(), '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
    //     combatPatrol: true,
    //     source: '40k-10e',
    //     variant: 'full',
    //     faction_id: 'basic',
    //     cardType: 'DataCard',
    //     abilities: {
    //       core: [],
    //       damaged: {
    //         description: '',
    //         range: '',
    //         showDamagedAbility: false,
    //         showDescription: true,
    //       },
    //       faction: [],
    //       invul: {
    //         info: '',
    //         showAtTop: true,
    //         showInfo: false,
    //         showInvulnerableSave: false,
    //         value: '',
    //       },
    //       other: [],
    //       primarch: [],
    //       special: [],
    //       wargear: [],
    //     },
    //     composition: [],
    //     factions: [newFaction.name],
    //     fluff: '',
    //     keywords: [],
    //     leader: '',
    //     loadout: '',
    //     meleeWeapons: [],
    //     points: [],
    //     rangedWeapons: [],
    //     stats: [],
    //     transport: '',
    //     wargear: [],
    //   };

    //   //Faction abilities
    //   const factionAbilities = card.datasheetAbilities
    //     .filter((ability) => ability.abilityType === 'faction')
    //     .map((ability) => {
    //       let name = ability.name;
    //       if (ability.isAura || ability.isBondsman || ability.isPsychic) {
    //         const list = [];
    //         if (ability.isAura) {
    //           list.push('Aura');
    //         }
    //         if (ability.isBondsman) {
    //           list.push('Bondsman');
    //         }
    //         if (ability.isPsychic) {
    //           list.push('Psychic');
    //         }
    //         name = `${name} (${list.join(', ')})`;
    //       }
    //       if (ability.restriction !== null) {
    //         name = `${name} ${ability.restriction}`;
    //       }
    //       return name;
    //     });

    //   newUnit.abilities.faction = [...factionAbilities];
    //   //Core abilities
    //   const coreAbilities = card.datasheetAbilities
    //     .filter((ability) => ability.abilityType === 'core')
    //     .map((ability) => {
    //       if (ability.restriction !== null) {
    //         return `${ability.name} ${ability.restriction}`;
    //       }
    //       return ability.name;
    //     });

    //   newUnit.abilities.core = [...coreAbilities];

    //   //Other abilities
    //   const datasheetAbilities = card.datasheetAbilities
    //     .filter((ability) => ability.abilityType === 'datasheet')
    //     .map((ability) => {
    //       let name = ability.name;
    //       if (ability.isAura || ability.isBondsman || ability.isPsychic) {
    //         const list = [];
    //         if (ability.isAura) {
    //           list.push('Aura');
    //         }
    //         if (ability.isBondsman) {
    //           list.push('Bondsman');
    //         }
    //         if (ability.isPsychic) {
    //           list.push('Psychic');
    //         }
    //         name = `${name} (${list.join(', ')})`;
    //       }
    //       return { name: name, description: ability.rules, showAbility: true, showDescription: true };
    //     });
    //   newUnit.abilities.other = [...datasheetAbilities];
    //   //Other abilities
    //   const wargearItems = card.wargearItems
    //     .filter((item) => item.wargearType === 'wargear')
    //     .map((item) => {
    //       let name = item.name;
    //       return {
    //         name: name,
    //         description: item.ruleText.split('\n\n')[0],
    //         showAbility: true,
    //         showDescription: true,
    //       };
    //     });

    //   newUnit.abilities.wargear = [...wargearItems];
    //   //Primarch abilities
    //   const primarchAbility = card.datasheetAbilities
    //     .map((ability) => {
    //       if (ability.subAbilities.length > 0) {
    //         const abilities = ability.subAbilities.map((subAbility) => {
    //           return {
    //             name: subAbility.name,
    //             description: subAbility.rules,
    //             showAbility: true,
    //             showDescription: true,
    //           };
    //         });
    //         return { name: ability.name, abilities: abilities, showAbility: true };
    //       }
    //       return undefined;
    //     })
    //     .filter((ability) => ability !== undefined);

    //   if (primarchAbility.length > 0) {
    //     newUnit.abilities.primarch = [...primarchAbility];
    //   }

    //   //Damage ability
    //   const damageAbility = card.damageAbility.filter((ability) => ability !== undefined);
    //   let damageProfile = false;
    //   if (damageAbility.length > 0) {
    //     damageProfile = true;
    //     newUnit.abilities.damaged = {
    //       range: damageAbility[0].name
    //         .replaceAll('DAMAGED: ', '')
    //         .replaceAll('Damaged: ', '')
    //         .replaceAll('Damaged ', '')
    //         .toUpperCase(),
    //       description: damageAbility[0].rules,
    //       showDamagedAbility: true,
    //       showDescription: true,
    //     };
    //   }

    //   //invul ability
    //   if (card.invulAbility !== undefined) {
    //     newUnit.abilities.invul = {
    //       info: card.invulAbility.rules ? card.invulAbility.rules : '',
    //       showAtTop: true,
    //       showInfo: card.invulAbility.rules !== null,
    //       showInvulnerableSave: true,
    //       value: card.invulAbility.save,
    //     };
    //   }

    //   //Check for leader rule
    //   const leaderAbility = card.datasheetRules.find((ability) => ability.name === 'Leader');

    //   if (leaderAbility !== undefined && leaderAbility.rules !== undefined) {
    //     newUnit.leader = leaderAbility.rules.replaceAll('\n\n', ' ').replaceAll('\n', ' ').trim();
    //   }

    //   //Check for transport rule
    //   const transportAbility = card.datasheetRules.find((ability) => ability.name === 'Transport');

    //   if (transportAbility !== undefined && transportAbility.rules !== undefined) {
    //     newUnit.transport = transportAbility.rules.trim();
    //   }

    //   //Check for other special rules
    //   const specialAbilities = card.datasheetRules.filter(
    //     (ability) => ability.name !== 'Transport' && ability.name !== 'Leader'
    //   );
    //   if (specialAbilities !== undefined && specialAbilities.length > 0) {
    //     newUnit.abilities.special = specialAbilities.map((ability) => {
    //       return {
    //         description: ability.rules.trim(),
    //         name: ability.name,
    //         showAbility: true,
    //         showDescription: true,
    //       };
    //     });
    //   }

    //   //Fill datasheet keywords
    //   let keywords = [];

    //   let statProfiles = card.miniatures
    //     .filter((miniature) => miniature.statlineHidden === false || miniature.statlineHidden === 0)
    //     .map((miniature) => {
    //       keywords.push(...miniature.keywords);

    //       return {
    //         active: true,
    //         ld: miniature.leadership,
    //         m: miniature.movement,
    //         name: card.miniatures.length > 1 ? miniature.name : card.name,
    //         oc: miniature.objectiveControl,
    //         showDamagedMarker: newUnit.abilities?.damaged?.showDamagedAbility ? true : false,
    //         showName: card.miniatures.length > 1,
    //         sv: miniature.save,
    //         t: miniature.toughness,
    //         w: miniature.wounds,
    //       };
    //     });

    //   if (
    //     card.miniatures.filter((miniature) => miniature.statlineHidden === false || miniature.statlineHidden === 0)
    //       .length === 0
    //   ) {
    //     statProfiles = [
    //       {
    //         active: true,
    //         ld: card.miniatures[0].leadership,
    //         m: card.miniatures[0].movement,
    //         name: card.miniatures[0].name,
    //         oc: card.miniatures[0].objectiveControl,
    //         showDamagedMarker: oldParsedUnits.datasheets[index].abilities?.damaged?.showDamagedAbility ? true : false,
    //         showName: false,
    //         sv: card.miniatures[0].save,
    //         t: card.miniatures[0].toughness,
    //         w: card.miniatures[0].wounds,
    //       },
    //     ];
    //     keywords.push(...card.miniatures[0].keywords);
    //   }

    //   const rangedWeapons = card.weapons
    //     .filter((weapon) => {
    //       return weapon.profiles.some((p) => p.type === 'ranged');
    //     })
    //     .map((weapon) => {
    //       return {
    //         active: true,
    //         profiles: weapon.profiles
    //           .filter((p) => p.type === 'ranged')
    //           .map((profile) => {
    //             return {
    //               active: true,
    //               ap: profile.armourPenetration,
    //               attacks: profile.attacks,
    //               damage: profile.damage,
    //               keywords: [],
    //               name:
    //                 weapon.profiles.length > 1 && weapon.name !== profile.name
    //                   ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
    //                   : profile.name === 'ranged'
    //                   ? weapon.name
    //                   : profile.name,
    //               range: profile.range,
    //               skill: profile.ballisticSkill,
    //               strength: profile.strength,
    //               keywords: profile.keywords,
    //             };
    //           }),
    //       };
    //     });
    //   const meleeWeapons = card.weapons
    //     .filter((weapon) => {
    //       return weapon.profiles.some((p) => p.type === 'melee');
    //     })
    //     .map((weapon) => {
    //       return {
    //         active: true,
    //         profiles: weapon.profiles
    //           .filter((p) => p.type === 'melee')
    //           .map((profile) => {
    //             return {
    //               active: true,
    //               ap: profile.armourPenetration,
    //               attacks: profile.attacks,
    //               damage: profile.damage,
    //               keywords: [],
    //               name:
    //                 weapon.profiles.length > 1 && weapon.name !== profile.name
    //                   ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
    //                   : profile.name === 'melee'
    //                   ? weapon.name
    //                   : profile.name,
    //               range: profile.range,
    //               skill: profile.weaponSkill,
    //               strength: profile.strength,
    //               keywords: profile.keywords,
    //             };
    //           }),
    //       };
    //     });

    //   if (newUnit.leader) {
    //     // console.log(card.name, newUnit.leader);
    //     let assignedUnits = undefined;
    //     let extraText = '';

    //     if (newUnit.leader.includes('This unit can be attached to the following unit:')) {
    //       assignedUnits = newUnit.leader
    //         .substring(
    //           newUnit.leader.indexOf('This unit can be attached to the following unit:') +
    //             'This unit can be attached to the following unit:'.length
    //         )
    //         .replaceAll('■', '')
    //         .replaceAll('.', '')
    //         .split(',')
    //         .filter((v) => v)
    //         .map((v) => v.replaceAll('*', '').trim());
    //       console.log(assignedUnits);
    //     } else if (newUnit.leader.includes('This model can be attached to the following unit:')) {
    //       assignedUnits = newUnit.leader
    //         .substring(
    //           newUnit.leader.indexOf('This model can be attached to the following unit:') +
    //             'This model can be attached to the following unit:'.length
    //         )
    //         .replaceAll('■', '')
    //         .replaceAll('.', '')
    //         .split(',')
    //         .filter((v) => v)
    //         .map((v) => v.replaceAll('*', '').trim());
    //     } else if (newUnit.leader.includes('This model can be attached to the following units:')) {
    //       assignedUnits = newUnit.leader
    //         .substring(
    //           newUnit.leader.indexOf('This model can be attached to the following units:') +
    //             'This model can be attached to the following units:'.length
    //         )
    //         .replaceAll('■', '')
    //         .replaceAll('.', '')
    //         .split(',')
    //         .filter((v) => v)
    //         .map((v) => v.replaceAll('*', '').trim());
    //     }
    //     newUnit.leads = { units: assignedUnits, extra: '' };
    //   }

    //   newUnit.stats = [...statProfiles];
    //   newUnit.rangedWeapons = [...rangedWeapons];
    //   newUnit.meleeWeapons = [...meleeWeapons];

    //   newUnit.rangedWeapons?.forEach((wep) => {
    //     let abilities = undefined;
    //     wep?.profiles?.forEach((prof) => {
    //       specialWeaponKeywords.forEach((val) => {
    //         if (prof.keywords.some((keyword) => val.name.toLowerCase() === keyword.toLowerCase())) {
    //           abilities = [val];
    //         }
    //       });
    //     });
    //     wep.abilities = abilities;
    //   });
    //   newUnit.meleeWeapons?.forEach((wep) => {
    //     let abilities = undefined;
    //     wep?.profiles?.forEach((prof) => {
    //       specialWeaponKeywords.forEach((val) => {
    //         if (prof.keywords.some((keyword) => val.name.toLowerCase() === keyword.toLowerCase())) {
    //           abilities = [val];
    //         }
    //       });
    //     });
    //     wep.abilities = abilities;
    //   });

    //   if (card.unitComposition.charAt(0) !== '■') {
    //     newUnit.composition = card.unitComposition
    //       .split('\n\n')[0]
    //       .split('\n')
    //       .map((unit) => {
    //         return unit.replaceAll('■', '').trim();
    //       });

    //     newUnit.loadout = card.unitComposition.split('\n\n')[1];
    //   } else {
    //     newUnit.loadout = card.unitComposition;
    //   }

    //   newUnit.wargear =
    //     card.wargearOptions?.length > 0
    //       ? card.wargearOptions.map((gear) => gear.rulesText.replaceAll('■', '').replaceAll('\n', ' ').trim())
    //       : ['None'];

    //   newUnit.fluff = card.lore;

    //   newUnit.keywords = [...new Set(keywords)];

    //   newUnit.points = card.points;
    //   //And set the name
    //   newUnit.name = card.name;

    //   // newUnit.leads = undefined;

    //   newArmy.datasheets.push(newUnit);
    // });

    newArmy.updated = new Date().toISOString();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    fs.writeFileSync(
      path.resolve(__dirname, `aos/${newArmy.name.replaceAll(' ', '_').replaceAll('’', '').toLowerCase()}.json`),
      JSON.stringify(newArmy, null, 2)
    );
  });
}

readAosArmies();
