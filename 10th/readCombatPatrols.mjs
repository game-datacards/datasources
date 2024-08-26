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

const newDataExportFile = readFile('./temp/data-export-434.json');
const newDataExport = sortObj(JSON.parse(newDataExportFile));

function readCombatPatrols() {
  let foundUnits = [];

  const combatPatrols = newDataExport.publication.filter(
    (publication) => publication.isCombatPatrol === true || publication.isCombatPatrol === 1
  );

  combatPatrols.map((combatPatrol) => {
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
    const detachmentName = newCombatPatrol.name
      .replaceAll('Combat Patrol: ', '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

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

    newCombatPatrol.stratagems = stratagems?.map(
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
          target: newStratagem.targetRules || '',
          when: newStratagem.whenRules || '',
          effect: newStratagem.effectRules || '',
          restrictions: newStratagem.restrictionRules || '',
          type: type,
          phase: phase,
          fluff: newStratagem.lore || '',
          detachment: detachmentName,
          faction_id: 'basic',
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
        const foundKeywordGroupsKeyword = newDataExport.enhancement_required_keyword_group_keyword.filter(
          (groupKeyword) => {
            return groupKeyword.enhancementRequiredKeywordGroupId === group.id;
          }
        );

        foundKeywords = [...foundKeywords, ...foundKeywordGroupsKeyword.map((kw) => kw.keywordId)];
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
            return newDataExport.keyword.find((kw) => kw.id === keyword).name || '';
          }),
        };
      }

      // Remove duplicates
      foundKeywords = [...new Set(foundKeywords)];

      return {
        ...enhancement,
        keywords: foundKeywords.map((keyword) => {
          return newDataExport.keyword.find((kw) => kw.id === keyword).name || '';
        }),
        excluded: excludedKeywords.map((keyword) => {
          return newDataExport.keyword.find((kw) => kw.id === keyword).name || '';
        }),
      };
    });

    newCombatPatrol.enhancements = enhancements?.map(
      (newEnhancement) => {
        return {
          name: newEnhancement.name,
          id: uuidv5(newEnhancement.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
          cost: newEnhancement?.basePointsCost?.toString(),
          keywords: newEnhancement.keywords,
          excludes: newEnhancement.excluded,
          description: newEnhancement.rules || '',
          detachment: detachmentName,
          faction_id: 'basic',
        };
      }
      // console.log('Not found old stratagem', oldStratagem.name);
    );

    let allDataSheets = newDataExport.datasheet.filter((datasheet) => datasheet.publicationId === combatPatrol.id);

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
        (value, index, self) => index === self.findIndex((t) => t.attacks === value.attacks && t.name === value.name)
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

    // allDataSheets = allDataSheets.filter((card) => card.publication.isCombatPatrol === false);
    allDataSheets.sort((a, b) => a.displayOrder - b.displayOrder);

    allDataSheets.map((card, index) => {
      let newUnit = {
        name: '',
        id: uuidv5(card.name + index.toString(), '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
        combatPatrol: true,
        source: '40k-10e',
        variant: 'full',
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
          return { name: name, description: ability.rules, showAbility: true, showDescription: true };
        });
      newUnit.abilities.other = [...datasheetAbilities];
      //Other abilities
      const wargearItems = card.wargearItems
        .filter((item) => item.wargearType === 'wargear')
        .map((item) => {
          let name = item.name;
          return {
            name: name,
            description: item.ruleText.split('\n\n')[0],
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
                description: subAbility.rules,
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
            .replaceAll('Damaged: ', '')
            .replaceAll('Damaged ', '')
            .toUpperCase(),
          description: damageAbility[0].rules,
          showDamagedAbility: true,
          showDescription: true,
        };
      }

      //invul ability
      if (card.invulAbility !== undefined) {
        newUnit.abilities.invul = {
          info: card.invulAbility.rules ? card.invulAbility.rules : '',
          showAtTop: true,
          showInfo: card.invulAbility.rules !== null,
          showInvulnerableSave: true,
          value: card.invulAbility.save,
        };
      }

      //Check for leader rule
      const leaderAbility = card.datasheetRules.find((ability) => ability.name === 'Leader');

      if (leaderAbility !== undefined && leaderAbility.rules !== undefined) {
        newUnit.leader = leaderAbility.rules.replaceAll('\n\n', ' ').replaceAll('\n', ' ').trim();
      }

      //Check for transport rule
      const transportAbility = card.datasheetRules.find((ability) => ability.name === 'Transport');

      if (transportAbility !== undefined && transportAbility.rules !== undefined) {
        newUnit.transport = transportAbility.rules.trim();
      }

      //Check for other special rules
      const specialAbilities = card.datasheetRules.filter(
        (ability) => ability.name !== 'Transport' && ability.name !== 'Leader'
      );
      if (specialAbilities !== undefined && specialAbilities.length > 0) {
        newUnit.abilities.special = specialAbilities.map((ability) => {
          return {
            description: ability.rules.trim(),
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
            showDamagedMarker: oldParsedUnits.datasheets[index].abilities?.damaged?.showDamagedAbility ? true : false,
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

      if (newUnit.leader) {
        // console.log(card.name, newUnit.leader);
        let assignedUnits = undefined;
        let extraText = '';

        if (newUnit.leader.includes('This unit can be attached to the following unit:')) {
          assignedUnits = newUnit.leader
            .substring(
              newUnit.leader.indexOf('This unit can be attached to the following unit:') +
                'This unit can be attached to the following unit:'.length
            )
            .replaceAll('■', '')
            .replaceAll('.', '')
            .split(',')
            .filter((v) => v)
            .map((v) => v.replaceAll('*', '').trim());
          console.log(assignedUnits);
        } else if (newUnit.leader.includes('This model can be attached to the following unit:')) {
          assignedUnits = newUnit.leader
            .substring(
              newUnit.leader.indexOf('This model can be attached to the following unit:') +
                'This model can be attached to the following unit:'.length
            )
            .replaceAll('■', '')
            .replaceAll('.', '')
            .split(',')
            .filter((v) => v)
            .map((v) => v.replaceAll('*', '').trim());
        } else if (newUnit.leader.includes('This model can be attached to the following units:')) {
          assignedUnits = newUnit.leader
            .substring(
              newUnit.leader.indexOf('This model can be attached to the following units:') +
                'This model can be attached to the following units:'.length
            )
            .replaceAll('■', '')
            .replaceAll('.', '')
            .split(',')
            .filter((v) => v)
            .map((v) => v.replaceAll('*', '').trim());
        }
        newUnit.leads = { units: assignedUnits, extra: '' };
      }

      newUnit.stats = [...statProfiles];
      newUnit.rangedWeapons = [...rangedWeapons];
      newUnit.meleeWeapons = [...meleeWeapons];

      newUnit.rangedWeapons?.forEach((wep) => {
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
      newUnit.meleeWeapons?.forEach((wep) => {
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

      if (card.unitComposition.charAt(0) !== '■') {
        newUnit.composition = card.unitComposition
          .split('\n\n')[0]
          .split('\n')
          .map((unit) => {
            return unit.replaceAll('■', '').trim();
          });

        newUnit.loadout = card.unitComposition.split('\n\n')[1];
      } else {
        newUnit.loadout = card.unitComposition;
      }

      newUnit.wargear =
        card.wargearOptions?.length > 0
          ? card.wargearOptions.map((gear) => gear.rulesText.replaceAll('■', '').replaceAll('\n', ' ').trim())
          : ['None'];

      newUnit.fluff = card.lore;

      newUnit.keywords = [...new Set(keywords)];

      newUnit.points = card.points;
      //And set the name
      newUnit.name = card.name;

      // newUnit.leads = undefined;

      newCombatPatrol.datasheets.push(newUnit);
    });

    newCombatPatrol.updated = new Date().toISOString();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    fs.writeFileSync(
      path.resolve(
        __dirname,
        `combatpatrol/${detachmentName.replaceAll(' ', '_').replaceAll('’', '').toLowerCase()}.json`
      ),
      JSON.stringify(newCombatPatrol, null, 2)
    );
  });
}

readCombatPatrols();
