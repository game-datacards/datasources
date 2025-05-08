import { v5 as uuidv5 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const newDataExportFile = readFile('./temp/data-export-609.json');
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

function parseDataExport(fileName, factionName) {
  const oldParsedUnitsFile = readFile(fileName);
  const oldParsedUnits = sortObj(JSON.parse(oldParsedUnitsFile));

  let foundUnits = [];
  const missingUnits = [];

  const newFaction = newDataExport.faction_keyword.find((faction_keyword) => {
    return faction_keyword.name === factionName;
  });

  const newPublication = newDataExport.publication.find((publication) => {
    return (
      publication.factionKeywordId === newFaction.id &&
      (publication.isCombatPatrol === 0 || publication.isCombatPatrol === false) &&
      !publication.name.includes('Imperial Armour')
    );
  });

  const stratagems = newDataExport.stratagem.filter((stratagem) => {
    return stratagem.publicationId === newPublication?.id;
  });

  let enhancements = newDataExport.enhancement.filter((enhancement) => {
    return enhancement.publicationId === newPublication?.id;
  });
  console.log(newPublication);
  const detachments = newDataExport.detachment.filter((detachment) => {
    return detachment.publicationId === newPublication?.id;
  });

  oldParsedUnits.detachments = detachments.map((detachment) => {
    return detachment.name;
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
        detachment:
          detachments.find((detachment) => {
            return detachment.id === newEnhancement.detachmentId;
          })?.name || '',
      };
    }
    // console.log('Not found old stratagem', oldStratagem.name);
  );

  const allDatasheetFactionKeywords = newDataExport.datasheet_faction_keyword.filter((datasheet_faction_keyword) => {
    return datasheet_faction_keyword.factionKeywordId === newFaction.id;
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

    newUnit.leadBy = undefined;
    newUnit.leads = undefined;

    foundUnits.push(newUnit);
  });

  for (let i = 0; i < foundUnits.length; i++) {
    const unit = foundUnits[i];

    if (unit.leader) {
      // console.log(i, unit.name, unit.leader);
      let assignedUnits = undefined;
      let extraText = '';

      if (unit.leader.includes('You can attach')) {
        assignedUnits = removeMarkdown(unit.leader
          .substring(unit.leader.indexOf('■'), unit.leader.indexOf('You can attach')))
          .split('■')
          .filter((v) => v)
          .map((v) => v.replaceAll('*', '').trim());
        extraText = unit.leader.substring(unit.leader.indexOf('You can attach'));
      } else if (unit.leader.includes('You must attach')) {
        assignedUnits = removeMarkdown(unit.leader
          .substring(unit.leader.indexOf('■'), unit.leader.indexOf('You must attach')))
          .split('■')
          .filter((v) => v)
          .map((v) => v.replaceAll('*', '').trim());
        extraText = unit.leader.substring(unit.leader.indexOf('You must attach'));
      } else if (unit.leader.includes('This model can be attached to a')) {
        assignedUnits = removeMarkdown(unit.leader
          .substring(unit.leader.indexOf('■'), unit.leader.indexOf('This model can be attached to a')))
          .split('■')
          .filter((v) => v)
          .map((v) => v.replaceAll('*', '').trim());
        extraText = unit.leader.substring(unit.leader.indexOf('This model can be attached to a'));
      } else if (unit.leader.includes('This model cannot be attached to a')) {
        assignedUnits = removeMarkdown(unit.leader
          .substring(unit.leader.indexOf('■'), unit.leader.indexOf('This model cannot be attached to a')))
          .split('■')
          .filter((v) => v)
          .map((v) => v.replaceAll('*', '').trim());
        extraText = unit.leader.substring(unit.leader.indexOf('This model cannot be attached to a'));
      } else if (unit.leader.includes('If this unit’s Bodyguard')) {
        assignedUnits = removeMarkdown(unit.leader
          .substring(unit.leader.indexOf('■'), unit.leader.indexOf('If this unit’s')))
          .split('■')
          .filter((v) => v)
          .map((v) => v.replaceAll('*', '').trim());
        extraText = unit.leader.substring(unit.leader.indexOf('If this unit’s'));
      } else {
        assignedUnits = removeMarkdown(unit.leader
          .substring(unit.leader.indexOf('■')))
          .split('■')
          .filter((v) => v)
          .map((v) => v.replaceAll('*', '').trim());
      }
      unit.leads = { units: assignedUnits, extra: extraText };
      if (assignedUnits.length > 0) {
        assignedUnits.forEach((atUnit) => {
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
  oldParsedUnits.datasheets = [...foundUnits, ...legendsUnits];
  oldParsedUnits.updated = new Date().toISOString();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  fs.writeFileSync(path.resolve(__dirname, fileName), JSON.stringify(oldParsedUnits, null, 2));
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
parseDataExport('./gdc/emperors_children.json', 'Emperor’s Children');

parseDataExport('./gdc/titan.json', 'Adeptus Titanicus');

// parseDataExport('./gdc/space_marines.json', 'Salamanders');
// parseDataExport('./gdc/space_marines.json', 'Imperial Fists');
// parseDataExport('./gdc/space_marines.json', 'Iron Hands');
// parseDataExport('./gdc/space_marines.json', 'Ultramarines');
// parseDataExport('./gdc/space_marines.json', 'Raven Guard');
// parseDataExport('./gdc/space_marines.json', 'White Scars');

// parseDataExport('./gdc/unaligned.json', 'Unaligned Forces');