import fs from 'fs';

import pdfToText from 'pdf-to-text';

import { v4 as uuidv4 } from 'uuid';

for (let index = 7; index < 88; index++) {
  if (index % 2 === 1) {
    const options = { from: index, to: index };

    pdfToText.pdfToText('./tyranids_index.pdf', options, function (err, data) {
      if (err) throw err;
      fs.writeFileSync(`tyranids-${index}.text`, data);
    });
  }
}

const readFile = async (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  return res;
};

const units = [];
fs.readdir('./', function (err, files) {
  files.forEach(async function (file) {
    if (file.indexOf('.text') > -1) {
      let res = await readFile(file);
      let splitText = res.split('\n');

      let name = splitText[0].toLowerCase();
      console.log(name);
      const stats = splitText[3].split(' ').filter((val) => val);

      let coreKeywords = [];
      let factionKeywords = [];
      let invul;
      let damageRange;
      let damageTableDescription = "";
      let startOfAbilities = { line: 0, pos: 0 };
      let startOfRanged = { line: 0, pos: 0 };
      let startOfMelee = { line: 0, pos: 0 };
      let startOfKeywords = { line: 0, pos: 0 };
      let startOfDamage = { line: 0, pos: 0 };

      splitText.forEach((line, index) => {
        const foundCoreKeywords = line.indexOf('CORE:');
        if (foundCoreKeywords > -1) {
          coreKeywords = line
            .substring(foundCoreKeywords + 'CORE:'.length)
            .split(',')
            .map((val) => val.trim());
        }
        const foundFactionKeywords = line.indexOf('FACTION:');
        if (foundFactionKeywords > -1) {
          factionKeywords = line
            .substring(foundFactionKeywords + 'FACTION:'.length)
            .split(',')
            .map((val) => val.trim());

          startOfAbilities = { line: index, pos: line.indexOf('FACTION') };
        }

        const foundKeywords = line.indexOf('KEYWORDS:');
        if (foundKeywords > -1) {
          startOfKeywords = { line: index, pos: line.indexOf('KEYWORDS:') + 'KEYWORDS:'.length };

          if (startOfMelee.line > 0) {
            startOfMelee.endLine = index - 1;
          }
        }

        const foundInvul = line.indexOf('INVULNERABLE SAVE');
        if (foundInvul > -1) {
          invul = line.substring(foundInvul + 'INVULNERABLE SAVE'.length).trim();
        }

        const foundDamage = line.indexOf('DAMAGED:');
        if (foundDamage > -1) {
          damageRange = line.substring(foundDamage + 'DAMAGED:'.length).trim();
          startOfDamage = { line: index, pos: line.indexOf('DAMAGED:'), endLine: splitText.length };
        }

        const foundRanged = line.indexOf('RANGED WEAPONS');
        if (foundRanged > -1) {
          startOfRanged = { line: index, pos: line.indexOf('RANGE '), endLine: splitText.length };
        }

        const foundMelee = line.indexOf('MELEE WEAPONS');
        if (foundMelee > -1) {
          startOfMelee = { line: index, pos: line.indexOf('RANGE ') };
          if (startOfRanged.line > 0) {
            startOfRanged.endLine = index - 1;
          }
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
          abilities[abilities.length - 1].description = abilities[abilities.length - 1].description + ' ' + line.trim();
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
      for (let index = startOfRanged.line + 1; index < startOfRanged.endLine; index++) {
        let line = splitText[index].substring(0, startOfAbilities.pos);
        if (line.trim().length > 0) {
          let name = line.substring(0, startOfRanged.pos).trim();
          const stats = line
            .substring(startOfRanged.pos)
            .split(' ')
            .filter((val) => val);

          let keywords = [];
          if (name.indexOf('[') > -1) {
            keywords = name
              .substring(name.indexOf('[') + 1, name.length - 1)
              .toLowerCase()
              .split(',')
              .map((val) => val.trim());
            name = name.substring(0, name.indexOf('['));
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
      for (let index = startOfMelee.line + 1; index < startOfMelee.endLine; index++) {
        let line = splitText[index].substring(0, startOfAbilities.pos);
        if (line.trim().length > 0) {
          let name = line.substring(0, startOfMelee.pos).trim();

          if (name.indexOf('Before selecting targets for this ') > -1) {
            continue;
          }

          const stats = line
            .substring(startOfMelee.pos)
            .split(' ')
            .filter((val) => val);

          let keywords = [];
          if (name.indexOf('[') > -1) {
            keywords = name
              .substring(name.indexOf('[') + 1, name.length - 1)
              .toLowerCase()
              .split(',')
              .map((val) => val.trim());
            name = name.substring(0, name.indexOf('['));
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

      let keywordsLine = splitText[startOfKeywords.line]
        .substring(startOfKeywords.pos + 1, startOfAbilities.pos)
        .trim();

      if (keywordsLine.substring(keywordsLine.length - 1) === ',') {
        keywordsLine =
          keywordsLine +
          splitText[startOfKeywords.line + 1].substring(startOfKeywords.pos, startOfAbilities.pos).trim();
      }

      const keywords = keywordsLine.split(',').map((val) => val.trim().replace('\x07', ''));

      // console.log(keywords);
      // console.log(meleeWeapons);
      // console.log(abilities);
      // console.log(coreKeywords);
      // console.log(factionKeywords);
      // console.log(invul);
      // console.log(stats);
      //console.log(damageRange);
      const nameArray = name.split(' ');
      for (var i = 0; i < nameArray.length; i++) {
        nameArray[i] = nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1);
      }
      name = nameArray.join(" ");
      const newUnit = {
        id: uuidv4(),
        name,
        source: '40k-10e',
        faction_id: 'TYR',
        cardType: 'DataCard',
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
        factions: ['Tyranids'],
      };
      units.push(newUnit);
    }
    units.sort( (a, b) => a.name.localeCompare(b.name));
    fs.writeFileSync(`./json/tyranids.json`, JSON.stringify(units, null, 2));
  });
});
