import fs from 'fs';

import { v5 as uuidv5 } from 'uuid';
import {
  checkForManualFixes,
  getFactionName,
  getInvulInfo,
  getInvulValue,
  getKeywords,
  getLeader,
  getName,
  getPrimarchAbilities,
  getSpecialAbilities,
  getStartOfBlock,
  getStartOfBlockList,
  getStartOfWeaponsBlock,
  getTransport,
  getUnitComposition,
  getUnitKeywords,
  getUnitLoadout,
  getWargear,
  getWeaponEndline,
  includesString,
} from './conversion.helpers.js';

const readFile = (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  return res;
};
const skippedNames = [];

const PRIMARCH_ABILITIES_LIST = [
  'AUTHOR OF THE CODEX',
  'RELICS OF THE EMPEROR ASCENDANT',
  'PRIMARCH OF THE FIRST LEGION',
  'CRIMSON KING',
  'WRATHFUL PRESENCE',
  'WARMASTER',
  'DAEMONIC ALLEGIANCE',
  'SHADOW FORM ABILITIES',
  'HOST OF PLAGUES',
];

const convertTextToJson = (inputFolder, outputFile, factionId, factionName, lineOfStats) => {
  const units = [];
  fs.readdir(inputFolder, function (err, files) {
    for (const [index, file] of files.entries()) {
      if (file.indexOf('.text') > -1) {
        let res = readFile(inputFolder + file);
        res = res.replaceAll('', ' ');
        let pages = res.split('---PAGE 2---');
        let splitText = pages[0].replaceAll('\u0007', '').split('\n');

        let name = getName(splitText[0].toLowerCase());

        if (skippedNames.includes(name.toLowerCase())) {
          continue;
        }

        let damageRange;
        let damageTableDescription = '';

        let startOfAbilities = getStartOfBlock(splitText, 'FACTION:');

        if (file === 'spacemarines_index-51.text') {
          startOfAbilities = { line: 8, pos: 118 };
        }
        if (file === 'spacemarines_index-217.text') {
          //ADEPTUS ASTARTES ARMOURY
          startOfAbilities = { line: -1, pos: 136 };
        }
        if (file === 'blacktemplar_index.pdf-35.text') {
          //BLACK TEMPLARS ARMOURY
          startOfAbilities = { line: -1, pos: 121 };
        }
        if (file === 'spacewolves_index.pdf-77.text') {
          //SPACE WOLVES ARMOURY
          startOfAbilities = { line: -1, pos: 118 };
        }
        if (file === 'deathwatch_index.pdf-29.text') {
          //DEATH WATCH ARMOURY
          startOfAbilities = { line: -1, pos: 118 };
        }
        if (file === 'chaos_spacemarines_index.pdf-105.text') {
          // HERETIC ASTARTES ARMOURY
          startOfAbilities = { line: -1, pos: 120 };
        }

        let startOfWargearAbilities = getStartOfBlock(splitText, 'WARGEAR ABILITIES');

        let startOfDamage = getStartOfBlock(splitText, 'DAMAGED:');
        let startOfRanged = getStartOfWeaponsBlock(splitText, 'RANGED WEAPONS');
        let startOfMelee = getStartOfWeaponsBlock(splitText, 'MELEE WEAPONS');
        let startOfPrimarch = getStartOfBlockList(splitText, PRIMARCH_ABILITIES_LIST);
        let coreKeywords = getKeywords(splitText, 'CORE:');
        let factionName = getFactionName(splitText);
        let factionKeywords = getKeywords(splitText, 'FACTION:');
        let invul = getInvulValue(splitText);
        let invulInfo = getInvulInfo(splitText);
        let keywords = getUnitKeywords(splitText, startOfAbilities);
        let endOfStats = 7;

        if (startOfRanged.line > 0) {
          endOfStats = startOfRanged.line;
        }
        if (startOfRanged.endLine > 0 && startOfMelee.line > 0) {
          startOfRanged.endLine = startOfMelee.line - 1;
        }
        if (startOfMelee.line > 0) {
          startOfMelee.endLine = getWeaponEndline(splitText);
        }
        const stats = [];

        for (let index = 2; index < endOfStats; index++) {
          const splitStats = splitText[index].split(' ').filter((val) => val);
          if (splitStats.length >= 7) {
            stats.push({
              m: splitStats[0],
              t: splitStats[1],
              sv: splitStats[2],
              w: splitStats[3],
              ld: splitStats[4],
              oc: splitStats[5],
              name: splitStats.slice(6).join(' '),
              // showDamagedMarker: false,
              // showName: true,
              // active: true,
            });
          }
          if (splitStats.length === 6) {
            stats.push({
              m: splitStats[0],
              t: splitStats[1],
              sv: splitStats[2],
              w: splitStats[3],
              ld: splitStats[4],
              oc: splitStats[5],
              name,
              // showDamagedMarker: false,
              // showName: false,
              // active: true,
            });
          }
        }

        splitText.forEach((line, index) => {
          const foundDamage = line.indexOf('DAMAGED:');
          if (foundDamage > -1) {
            damageRange = line.substring(foundDamage + 'DAMAGED:'.length).trim();
            startOfDamage = { line: index, pos: line.indexOf('DAMAGED:'), endLine: splitText.length };
          }
        });

        let abilities = [];

        try {
          if (startOfAbilities.line > 0) {
            for (let index = startOfAbilities.line + 1; index < splitText.length; index++) {
              let line = splitText[index].substring(startOfAbilities.pos);
              if (
                line.indexOf('INVULNERABLE SAVE') > -1 ||
                line.indexOf('FACTION KEYWORDS') > -1 ||
                line.indexOf('DAMAGED:') > -1 ||
                line.indexOf('WARGEAR ABILITIES') > -1
              ) {
                break;
              }
              if (line.length === 0) {
                continue;
              }
              // console.log(file, index, line);
              if (
                line.indexOf(':') > -1 &&
                !line.includes('D6') &&
                !line.includes('phase:') &&
                !line.includes('model:') &&
                !line.includes('following:') &&
                !line.includes('army:') &&
                !line.includes('(see reverse):') &&
                !line.includes('result:') &&
                !line.includes('0CP:') &&
                !line.includes('■') &&
                !line.includes('Designer’s Note') &&
                !line.includes('Warlord:')
              ) {
                abilities.push({
                  name: line.substring(0, line.indexOf(':')).trim(),
                  description: line.substring(line.indexOf(':') + 1).trim(),
                  // showAbility: true,
                  // showDescription: true,
                });
              } else {
                if (abilities.length > 0) {
                  abilities[abilities.length - 1].description =
                    abilities[abilities.length - 1].description + ' ' + line.trim();
                }
              }
            }
          }
        } catch (error) {
          console.log(file);
          console.log('error', error);
        }

        let wargearAbilities = [];
        if (startOfWargearAbilities.line > 0) {
          try {
            for (let index = startOfWargearAbilities.line + 1; index < splitText.length; index++) {
              let line = splitText[index].substring(startOfWargearAbilities.pos);
              if (
                line.indexOf('INVULNERABLE SAVE') > -1 ||
                line.indexOf('FACTION KEYWORDS') > -1 ||
                line.indexOf('DAMAGED:') > -1 ||
                line.indexOf('Designer’s Note') > -1 ||
                line.indexOf('WARGEAR ABILITIES') > -1
              ) {
                break;
              }
              if (line.length === 0) {
                continue;
              }
              // console.log(file, index, line);
              if (
                line.indexOf(':') > -1 &&
                !line.includes('D6') &&
                !line.includes('phase:') &&
                !line.includes('model:') &&
                !line.includes('following:') &&
                !line.includes('army:') &&
                !line.includes('result:') &&
                !line.includes('Warlord:')
              ) {
                wargearAbilities.push({
                  name: line.substring(0, line.indexOf(':')).trim(),
                  description: line.substring(line.indexOf(':') + 1).trim(),
                  // showAbility: true,
                  // showDescription: true,
                });
              } else {
                wargearAbilities[wargearAbilities.length - 1].description =
                  wargearAbilities[wargearAbilities.length - 1].description + ' ' + line.trim();
              }
            }
          } catch (error) {
            console.log(file);
            console.log('error', error);
          }
        }

        for (let index = startOfDamage.line + 1; index < splitText.length; index++) {
          let line = splitText[index].substring(startOfAbilities.pos);
          if (line.indexOf('INVULNERABLE SAVE') > -1 || line.indexOf('FACTION KEYWORDS') > -1) {
            break;
          }
          if (line.length === 0) {
            continue;
          }

          damageTableDescription = damageTableDescription + ' ' + line.trim();
        }
        const rangedWeapons = [];
        let multiLineWeapon = 0;
        for (let index = startOfRanged.line + 1; index < startOfRanged.endLine; index++) {
          let line = splitText[index].substring(0, startOfAbilities.pos);
          if (line.trim().length > 0) {
            if (line.includes('One Shot:')) {
              continue;
            }
            if (line.includes('Hive Defences:')) {
              index = index + 2;
              continue;
            }
            if (line.includes('Defensive Array:')) {
              break;
            }
            if (line.includes('KEYWORDS:') || line.includes('Before selecting targets for this ')) {
              break;
            }

            let name = line.substring(0, startOfRanged.pos).trim();
            let stats = line
              .substring(startOfRanged.pos)
              .split(' ')
              .filter((val) => val);

            if (multiLineWeapon === 1) {
              multiLineWeapon = 2;
              continue;
            }
            if (multiLineWeapon === 2) {
              multiLineWeapon = 0;
              continue;
            }

            let keywords = [];
            if (name.length > 0 && stats.length === 0) {
              //probably a multiple line weapon, so get those lines here.
              multiLineWeapon = 1;
              stats = splitText[index + 1]
                .substring(0, startOfAbilities.pos)
                .substring(startOfRanged.pos, startOfAbilities.pos)
                .split(' ')
                .filter((val) => val);

              if (splitText[index + 2].indexOf('[') > -1) {
                keywords = splitText[index + 2]
                  .substring(splitText[index + 2].indexOf('[') + 1, splitText[index + 2].indexOf(']'))
                  .toLowerCase()
                  .split(',')
                  .map((val) => val.trim());
              }
            } else {
              if (name.indexOf('[') > -1) {
                keywords = name
                  .substring(name.indexOf('[') + 1, name.length - 1)
                  .toLowerCase()
                  .split(',')
                  .map((val) => val.trim());
                name = name.substring(0, name.indexOf('['));
              }
            }
            if (name.indexOf('–') > -1) {
              if (
                rangedWeapons.length > 0 &&
                rangedWeapons[rangedWeapons.length - 1].profiles[0].name.indexOf('–') > -1
              ) {
                //Check if previous multi-line weapon has the same name...
                const prevWeaponName = rangedWeapons[rangedWeapons.length - 1].profiles[0].name.split('–')[0].trim();
                const newWeaponName = name.split('–')[0].trim();

                if (prevWeaponName === newWeaponName) {
                  rangedWeapons[rangedWeapons.length - 1].profiles.push({
                    // active: true,
                    name: name.trim(),
                    keywords,
                    range: stats[0],
                    attacks: stats[1],
                    skill: stats[2],
                    strength: stats[3],
                    ap: stats[4],
                    damage: stats[5],
                  });
                  continue;
                }
              }
            }
            rangedWeapons.push({
              // active: true,
              profiles: [
                {
                  // active: true,
                  name: name.trim(),
                  keywords,
                  range: stats[0],
                  attacks: stats[1],
                  skill: stats[2],
                  strength: stats[3],
                  ap: stats[4],
                  damage: stats[5],
                },
              ],
            });
          }
        }

        const meleeWeapons = [];
        multiLineWeapon = 0;

        for (let index = startOfMelee.line + 1; index < startOfMelee.endLine; index++) {
          let line = splitText[index].substring(0, startOfAbilities.pos);
          if (line.trim().length > 0) {
            let name = line.substring(0, startOfMelee.pos).trim();

            if (
              name.includes('Before selecting targets for this ') ||
              name.includes('Reverberating Summons:') ||
              includesString(name, PRIMARCH_ABILITIES_LIST)
            ) {
              break;
            }

            if (multiLineWeapon === 1) {
              multiLineWeapon = 2;
              continue;
            }
            if (multiLineWeapon === 2) {
              multiLineWeapon = 0;
              continue;
            }

            let stats = line
              .substring(startOfMelee.pos, startOfAbilities.pos)
              .split(' ')
              .filter((val) => val);

            let keywords = [];

            if (name.length > 0 && stats.length === 0) {
              //probably a multiple line weapon, so get those lines here.
              multiLineWeapon = 1;
              stats = splitText[index + 1]
                .substring(0, startOfAbilities.pos)
                .substring(startOfMelee.pos, startOfAbilities.pos)
                .split(' ')
                .filter((val) => val);

              if (splitText[index + 2].indexOf('[') > -1) {
                keywords = splitText[index + 2]
                  .substring(splitText[index + 2].indexOf('[') + 1, splitText[index + 2].indexOf(']'))
                  .toLowerCase()
                  .split(',')
                  .map((val) => val.trim());
              }
            } else {
              if (name.indexOf('[') > -1) {
                keywords = name
                  .substring(name.indexOf('[') + 1, name.length - 1)
                  .toLowerCase()
                  .split(',')
                  .map((val) => val.trim());
                name = name.substring(0, name.indexOf('['));
              }
            }

            if (name.indexOf('–') > -1) {
              if (
                meleeWeapons.length > 0 &&
                meleeWeapons[meleeWeapons.length - 1].profiles[0].name.indexOf('–') > -1
              ) {
                //Check if previous multi-line weapon has the same name...
                const prevWeaponName = meleeWeapons[meleeWeapons.length - 1].profiles[0].name.split('–')[0].trim();
                const newWeaponName = name.split('–')[0].trim();

                if (prevWeaponName === newWeaponName) {
                  meleeWeapons[meleeWeapons.length - 1].profiles.push({
                    // active: true,
                    name: name.trim(),
                    keywords,
                    range: stats[0],
                    attacks: stats[1],
                    skill: stats[2],
                    strength: stats[3],
                    ap: stats[4],
                    damage: stats[5],
                  });
                  continue;
                }
              }
            }
            meleeWeapons.push({
              // active: true,
              profiles: [
                {
                  // active: true,
                  name: name.trim(),
                  keywords,
                  range: stats[0],
                  attacks: stats[1],
                  skill: stats[2],
                  strength: stats[3],
                  ap: stats[4],
                  damage: stats[5],
                },
              ],
            });
          }
        }
        const firstPagePrimarch = getPrimarchAbilities(splitText, startOfPrimarch, startOfAbilities);

        const secondPageLines = pages[1].replaceAll('\u0007', '').replaceAll('', '').split('\n');

        startOfPrimarch = getStartOfBlockList(secondPageLines, PRIMARCH_ABILITIES_LIST);

        const secondPagePrimarch = getPrimarchAbilities(
          secondPageLines,
          startOfPrimarch,
          getStartOfBlock(secondPageLines, 'UNIT COMPOSITION'),
          file
        );

        let unitComposition = getUnitComposition(secondPageLines);
        let unitLeader = getLeader(secondPageLines);
        let unitWargear = getWargear(secondPageLines);
        let unitTransport = getTransport(secondPageLines);
        let unitLoadout = getUnitLoadout(secondPageLines);
        let specialAbilities = getSpecialAbilities(secondPageLines);

        // if (damageRange) {
        //   stats[0].showDamagedMarker = true;
        // }

        let newUnit = {
          id: uuidv5(name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e'),
          name,
          // source: '40k-10e',
          faction_id: factionId,
          // cardType: 'DataCard',
          leader: unitLeader,
          composition: unitComposition,
          loadout: unitLoadout,
          wargear: unitWargear,
          transport: unitTransport,
          abilities: {
            wargear: wargearAbilities,
            core: coreKeywords,
            faction: factionKeywords,
            primarch: [...firstPagePrimarch, ...secondPagePrimarch],
            invul: {
              value: invul,
              info: invulInfo,
              // showInvulnerableSave: invul ? true : false,
              // showInfo: invulInfo ? true : false,
            },
            other: abilities,
            special: specialAbilities,
            damaged: {
              // showDamagedAbility: damageRange ? true : false,
              // showDescription: damageTableDescription ? true : false,
              range: damageRange ? damageRange : '',
              description: damageRange ? damageTableDescription.trim() : '',
            },
          },
          stats,
          rangedWeapons,
          meleeWeapons,
          keywords,
          factions: factionName,
        };

        newUnit = checkForManualFixes(newUnit);
        units.push(newUnit);
      }
      units.sort((a, b) => a.name.localeCompare(b.name));

      const factions = {
        id: factionId,
        link: 'https://game-datacards.eu',
        name: factionName,
        // is_subfaction: false,
        // parent_id: '',
        datasheets: units,
      };

      fs.writeFileSync(`./json/${outputFile}.json`, JSON.stringify(factions, null, 2));
    }
  });
};

// convertTextToJson('./marines_leviathan/', 'marines_leviathan', 'SMLV', 'Space Marines - Leviathan', 4);
/*convertTextToJson('./tyranids/', 'tyranids', 'TYR', 'Tyranids', 3);
convertTextToJson('./spacemarines/', 'space_marines', 'SM', 'Space Marines', 3);
convertTextToJson('./bloodangels/', 'bloodangels', 'CHBA', 'Blood Angels', 3);
convertTextToJson('./darkangels/', 'darkangels', 'CHDA', 'Dark Angels', 3);
convertTextToJson('./blacktemplar/', 'blacktemplar', 'CHBT', 'Black Templar', 3);
convertTextToJson('./spacewolves/', 'spacewolves', 'CHSW', 'Space Wolves', 3);
convertTextToJson('./deathwatch/', 'deathwatch', 'CHDW', 'Death Watch', 3);
convertTextToJson('./thousandsons/', 'thousandsons', 'TS', 'Thousand Sons', 3);
convertTextToJson('./worldeaters/', 'worldeaters', 'WE', 'World Eaters', 3);*/
convertTextToJson('./chaos_spacemarines/', 'chaos_spacemarines', 'CSM', 'Chaos Space Marines', 3);
/*convertTextToJson('./chaosdaemons/', 'chaosdaemons', 'CD', 'Chaos Daemons', 3);
convertTextToJson('./deathguard/', 'deathguard', 'DG', 'Death Guard', 3);
convertTextToJson('./chaosknights/', 'chaosknights', 'CK', 'Chaos Knights', 3);*/
convertTextToJson('./imperialknights/', 'imperialknights', 'IK', 'Imperial Knights', 3);
convertTextToJson('./adeptasororitas/', 'adeptasororitas', 'AS', 'Adepta Sororitas', 3);
convertTextToJson('./adeptuscustodes/', 'adeptuscustodes', 'AC', 'Adeptus Custodes', 3);
convertTextToJson('./adeptusmechanicus/', 'adeptusmechanicus', 'ADM', 'Adeptus Mechanicus', 3);
convertTextToJson('./astramilitarum/', 'astramilitarum', 'ASM', 'Astra Militarum', 3);
convertTextToJson('./greyknights/', 'greyknights', 'GK', 'Grey Knights', 3);
convertTextToJson('./imperialagents/', 'imperialagents', 'IA', 'Imperial Agents', 3);