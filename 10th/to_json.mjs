import fs from 'fs';

import { v4 as uuidv4 } from 'uuid';
import {
  getFactionName,
  getInvulValue,
  getKeywords,
  getLeader,
  getName,
  getStartOfBlock,
  getStartOfWeaponsBlock,
  getTransport,
  getUnitComposition,
  getUnitKeywords,
  getWargear,
  getWeaponEndline,
} from './conversion.helpers.js';

const readFile = async (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  return res;
};

const convertTextToJson = (inputFolder, outputFile, factionId, factionName, lineOfStats) => {
  const units = [];
  fs.readdir(inputFolder, function (err, files) {
    files.forEach(async function (file) {
      if (file.indexOf('.text') > -1) {
        let res = await readFile(inputFolder + file);
        let pages = res.split('---PAGE 2---');
        let splitText = pages[0].replaceAll('\u0007', '').split('\n');

        let name = getName(splitText[0].toLowerCase());

        const stats = splitText[lineOfStats].split(' ').filter((val) => val);

        let damageRange;
        let damageTableDescription = '';

        let startOfAbilities = getStartOfBlock(splitText, 'FACTION');
        let startOfDamage = getStartOfBlock(splitText, 'DAMAGED:');
        let startOfRanged = getStartOfWeaponsBlock(splitText, 'RANGED WEAPONS');
        let startOfMelee = getStartOfWeaponsBlock(splitText, 'MELEE WEAPONS');
        let coreKeywords = getKeywords(splitText, 'CORE:');
        let factionName = getFactionName(splitText);
        let factionKeywords = getKeywords(splitText, 'FACTION:');
        let invul = getInvulValue(splitText);
        let keywords = getUnitKeywords(splitText, startOfAbilities);

        if (startOfRanged.endLine > 0 && startOfMelee.line > 0) {
          startOfRanged.endLine = startOfMelee.line - 1;
        }
        if (startOfMelee.line > 0) {
          startOfMelee.endLine = getWeaponEndline(splitText);
        }

        splitText.forEach((line, index) => {
          const foundDamage = line.indexOf('DAMAGED:');
          if (foundDamage > -1) {
            damageRange = line.substring(foundDamage + 'DAMAGED:'.length).trim();
            startOfDamage = { line: index, pos: line.indexOf('DAMAGED:'), endLine: splitText.length };
          }
        });

        let abilities = [];
        for (let index = startOfAbilities.line + 1; index < splitText.length; index++) {
          let line = splitText[index].substring(startOfAbilities.pos);
          if (
            line.indexOf('INVULNERABLE SAVE') > -1 ||
            line.indexOf('FACTION KEYWORDS') > -1 ||
            line.indexOf('DAMAGED:') > -1 ||
            line.indexOf('Designer’s Note') > -1
          ) {
            break;
          }
          if (line.length === 0) {
            continue;
          }
          if (
            line.indexOf(':') > -1 &&
            line.indexOf('D6') === -1 &&
            line.indexOf('phase:') === -1 &&
            line.indexOf('model:') === -1 &&
            line.indexOf('following:') === -1
          ) {
            abilities.push({
              name: line.substring(0, line.indexOf(':')),
              description: line.substring(line.indexOf(':') + 1),
              showAbility: true,
              showDescription: true,
            });
          } else {
            const ab = abilities[abilities.length - 1];
            abilities[abilities.length - 1].description =
              abilities[abilities.length - 1].description + ' ' + line.trim();
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
                rangedWeapons[rangedWeapons.length - 1].profiles.push({
                  active: true,
                  name,
                  keywords,
                  range: stats[0],
                  attacks: stats[1],
                  skill: stats[2],
                  strength: stats[3],
                  ap: stats[4],
                  damage: stats[5],
                });
              } else {
                rangedWeapons.push({
                  active: true,
                  profiles: [
                    {
                      active: true,
                      name,
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
            } else {
              rangedWeapons.push({
                active: true,
                profiles: [
                  {
                    active: true,
                    name,
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
        }

        const meleeWeapons = [];
        multiLineWeapon = 0;

        for (let index = startOfMelee.line + 1; index < startOfMelee.endLine; index++) {
          let line = splitText[index].substring(0, startOfAbilities.pos);
          if (line.trim().length > 0) {
            let name = line.substring(0, startOfMelee.pos).trim();

            if (name.indexOf('Before selecting targets for this ') > -1) {
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
              if (meleeWeapons.length > 0 && meleeWeapons[meleeWeapons.length - 1].profiles[0].name.indexOf('–') > -1) {
                meleeWeapons[meleeWeapons.length - 1].profiles.push({
                  active: true,
                  name,
                  keywords,
                  range: stats[0],
                  attacks: stats[1],
                  skill: stats[2],
                  strength: stats[3],
                  ap: stats[4],
                  damage: stats[5],
                });
              } else {
                meleeWeapons.push({
                  active: true,
                  profiles: [
                    {
                      active: true,
                      name,
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
            } else {
              meleeWeapons.push({
                active: true,
                profiles: [
                  {
                    active: true,
                    name,
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
        }

        const secondPageLines = pages[1].replaceAll('\u0007', '').replaceAll('', '').split('\n');

        let unitComposition = getUnitComposition(secondPageLines);
        let unitLeader = getLeader(secondPageLines);
        let unitWargear = getWargear(secondPageLines);
        let unitTransport = getTransport(secondPageLines);

        const newUnit = {
          id: uuidv4(),
          name,
          source: '40k-10e',
          faction_id: factionId,
          cardType: 'DataCard',
          leader: unitLeader,
          composition: unitComposition,
          wargear: unitWargear,
          transport: unitTransport,
          abilities: {
            core: coreKeywords,
            faction: factionKeywords,
            invul: {
              value: invul,
              info: '',
              showInvulnerableSave: invul ? true : false,
              showInfo: false,
            },
            other: abilities,
            damaged: {
              showDamagedAbility: damageRange ? true : false,
              showDescription: damageTableDescription ? true : false,
              range: damageRange ? damageRange : '',
              description: damageRange ? damageTableDescription : '',
            },
          },
          stats: [
            {
              m: stats[0],
              t: stats[1],
              sv: stats[2],
              w: stats[3],
              ld: stats[4],
              oc: stats[5],
              name,
              showDamagedMarker: damageRange ? true : false,
              showName: false,
              active: true,
            },
          ],
          rangedWeapons,
          meleeWeapons,
          keywords,
          factions: [factionName],
        };
        units.push(newUnit);
      }
      units.sort((a, b) => a.name.localeCompare(b.name));

      const factions = {
        id: factionId,
        link: 'https://game-datacard.eu',
        name: factionName,
        is_subfaction: false,
        parent_id: '',
        datasheets: units,
      };

      fs.writeFileSync(`./json/${outputFile}.json`, JSON.stringify(factions, null, 2));
    });
  });
};

convertTextToJson('./marines_leviathan/', 'marines_leviathan', 'SMLV', 'Space Marines - Leviathan', 4);
convertTextToJson('./tyranids/', 'tyranids', 'TYR', 'Tyranids', 3);
