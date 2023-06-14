const getKeywords = (lines, searchText) => {
  for (const [_index, line] of lines.entries()) {
    if (line.includes(searchText)) {
      return line
        .substring(line.indexOf(searchText) + searchText.length)
        .split(',')
        .map((val) => val.trim());
    }
  }
  return [];
};
const getInvulValue = (lines) => {
  for (const [_index, line] of lines.entries()) {
    if (line.includes('INVULNERABLE SAVE *')) {
      return line.substring(line.indexOf('INVULNERABLE SAVE *') + 1 + 'INVULNERABLE SAVE *'.length).trim();
    }
    if (line.includes('INVULNERABLE SAVE')) {
      return line.substring(line.indexOf('INVULNERABLE SAVE') + 1 + 'INVULNERABLE SAVE'.length).trim();
    }
  }
  return '';
};

const getInvulInfo = (lines) => {
  let invulInfo = '';
  let startOfInfo = 0;
  for (const [index, line] of lines.entries()) {
    if (startOfInfo > 0) {
      let textLine = line.substring(startOfInfo);

      if (textLine.length === 0) {
        continue;
      }
      if (textLine.includes('FACTION KEYWORDS')) {
        break;
      }

      invulInfo = invulInfo + ' ' + textLine.trim();
    }
    if (line.includes('INVULNERABLE SAVE*')) {
      startOfInfo = lines[index + 1].indexOf('*');
    }
    if (line.includes('INVULNERABLE SAVE *')) {
      startOfInfo = lines[index + 1].indexOf('*');
    }
  }

  return invulInfo.trim();
};

const getFactionName = (lines) => {
  let factionName = '';
  let startOfFaction = 0;
  for (const [_index, line] of lines.entries()) {
    if (startOfFaction > 0) {
      let factionLine = line.substring(startOfFaction);

      if (factionLine.length === 0) {
        continue;
      }

      factionName = factionName + ' ' + factionLine.trim();
    }
    if (line.includes('FACTION KEYWORDS:')) {
      startOfFaction = line.indexOf('FACTION KEYWORDS:');
    }
  }

  return factionName
    .trim()
    .split(',')
    .map((faction) => faction.trim());
};

const getUnitComposition = (lines) => {
  let value = '';
  let startOfBlock = 0;
  for (const [_index, line] of lines.entries()) {
    if (startOfBlock > 0) {
      let textLine = line.substring(startOfBlock).trim();

      if (
        textLine.includes('LEADER') ||
        textLine.includes('FACTION KEYWORDS') ||
        textLine.includes('TRANSPORT') ||
        textLine.includes('equipped with') ||
        textLine.includes('CASSIUS')
      ) {
        break;
      }

      if (textLine.length === 0) {
        continue;
      }
      if (textLine.trim().length > 0) {
        value = value + ' ' + textLine.trim();
      }
    }
    if (line.includes('UNIT COMPOSITION')) {
      startOfBlock = line.indexOf('UNIT COMPOSITION');
    }
  }

  return value
    .split('■')
    .map((unit) => unit.trim())
    .filter((unit) => unit);
};

const getUnitLoadout = (lines) => {
  const keywords = [
    'TANK COMMANDER',
    'SUPREME COMMANDER',
    'CRIMSON FISTS',
    'SERVITOR RETINUE',
    'HUNTER ORGANISM',
    'LAST SURVIVOR',
    'ATTACHED UNIT',
    'TYCHO',
    'DEATH COMPANY',
    'FLESH TEARERS',
    'LOGAN GRIMNAR',
    'MASTER OF MISCHIEF',
    'FORCE OF UNTAMED DESTRUCTION',
    'WOLFKIN',
    'LEADER',
    'FACTION KEYWORDS',
    'TRANSPORT',
    'CASSIUS',
    'AHRIMAN',
    'EMPEROR’S CHILDREN',
  ];

  let value = '';
  let startOfBlock = 0;
  let startOfEquipment = false;
  for (const [_index, line] of lines.slice(2).entries()) {
    if (includesString(line, keywords)) {
      break;
    }
    if (line.includes('equipped with:')) {
      startOfEquipment = true;
    }
    if (startOfEquipment && startOfBlock > 0) {
      let textLine = line.substring(startOfBlock).trim();

      if (textLine.length === 0) {
        continue;
      }
      if (textLine.trim().length > 0) {
        value = value + ' ' + textLine.trim();
      }
    }
    if (line.includes('UNIT COMPOSITION')) {
      startOfBlock = line.indexOf('UNIT COMPOSITION') - 1;
    }
  }

  return value.trim();
};

const getLeader = (lines) => {
  let value = '';
  let startOfBlock = 0;
  let startOfExtraBlock = 0;
  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS') || line.includes('TRANSPORT')) {
      break;
    }
    if (line.includes('UNIT COMPOSITION')) {
      startOfExtraBlock = line.indexOf('UNIT COMPOSITION') - 1;
    }
    if (startOfBlock > 0) {
      let textLine = line.substring(startOfBlock).trim();

      if (textLine.length === 0) {
        continue;
      }

      if (textLine.trim().length > 0) {
        value = value + ' ' + textLine.trim();
      }
    }

    if (startOfExtraBlock > 0 && line.includes('LEADER')) {
      startOfBlock = line.indexOf('LEADER');
    }
  }

  return value.trim();
};

const getWargear = (lines) => {
  let value = '';
  let startOfBlock = 0;
  let endOfBlock = 0;
  let multiColumn = false;
  let columnStart = 0;
  let secondColumnValue = '';

  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS')) {
      break;
    }
    if (startOfBlock > 0) {
      let textLine = line.substring(startOfBlock, endOfBlock).trim();

      if (textLine.includes('ATTACHED UNIT') || textLine.includes('DAEMONIC ALLEGIANCE')) {
        break;
      }
      if (textLine.length === 0) {
        continue;
      }
      let count = countSubstringOccurrences(textLine, '■');
      if (count > 1) {
        multiColumn = true;
        columnStart = textLine.lastIndexOf('■');
      }
      if (multiColumn) {
        value = value + ' ' + line.substring(startOfBlock, endOfBlock).substring(0, columnStart).trim();
        secondColumnValue =
          secondColumnValue + ' ' + line.substring(startOfBlock, endOfBlock).substring(columnStart, endOfBlock).trim();
      } else {
        value = value + ' ' + textLine;
      }
    }
    if (line.includes('WARGEAR OPTIONS')) {
      startOfBlock = line.indexOf('WARGEAR OPTIONS');
      endOfBlock = line.indexOf('UNIT COMPOSITION') - startOfBlock;
      continue;
    }
    if (line.includes('WARGEAR')) {
      startOfBlock = line.indexOf('WARGEAR');
      endOfBlock = line.indexOf('UNIT COMPOSITION') - startOfBlock;
    }
  }

  const fullGear = value.trim() + secondColumnValue.trim();
  return fullGear
    .split('■')
    .map((gear) => gear.trim())
    .filter((gear) => gear);
};

const getTransport = (lines) => {
  let value = '';
  let startOfBlock = 0;

  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS')) {
      break;
    }
    if (startOfBlock > 0) {
      let textLine = line.substring(startOfBlock).trim();

      if (textLine.length === 0) {
        continue;
      }
      value = value + ' ' + textLine;
    }
    if (line.includes('TRANSPORT')) {
      startOfBlock = line.indexOf('TRANSPORT');
    }
  }

  return value.trim();
};

const getStartOfBlock = (lines, block) => {
  for (const [index, line] of lines.entries()) {
    if (line.includes(block)) {
      return { line: index, pos: line.indexOf(block) - 1 };
    }
  }
  return { line: 0, pos: 0 };
};
const getStartOfBlockList = (lines, blockList) => {
  for (const [index, line] of lines.entries()) {
    for (const [_bIndex, block] of blockList.entries()) {
      if (line.includes(block)) {
        return { line: index, pos: line.indexOf(block) - 1 };
      }
    }
  }
  return { line: 0, pos: 0 };
};

const getWeaponEndline = (lines) => {
  for (const [index, line] of lines.entries()) {
    if (line.includes('KEYWORDS:')) {
      return index;
    }
  }
  return 0;
};

const getStartOfWeaponsBlock = (lines, block) => {
  for (const [index, line] of lines.entries()) {
    if (line.includes(block)) {
      return { line: index, pos: line.indexOf('RANGE '), endLine: lines.length };
    }
  }
  return { line: 0, pos: 0 };
};

const getPrimarchBlock = (lines, block) => {
  for (const [index, line] of lines.entries()) {
    if (line.includes(block)) {
      return { line: index, pos: line.indexOf(block), endLine: lines.length };
    }
  }
  return { line: 0, pos: 0 };
};

const getUnitKeywords = (lines, startOfAbilities) => {
  for (const [index, l] of lines.entries()) {
    const line = l.substring(0, startOfAbilities.pos);
    if (line.includes('KEYWORDS:')) {
      let keyWordsLine = line.substring(line.indexOf('KEYWORDS:') + 'KEYWORDS:'.length).trim();
      if (keyWordsLine.substring(keyWordsLine.length - 1) === ',') {
        keyWordsLine =
          keyWordsLine + lines[index + 1].substring(line.indexOf('KEYWORDS:') + 1, startOfAbilities.pos).trim();
      }
      return keyWordsLine.split(',').map((val) => val.trim().replace('\x07', ''));
    }
    if (line.includes('KEYWORDS – ALL MODELS:')) {
      let keyWordsLine;
      keyWordsLine = line.substring(line.indexOf('KEYWORDS – ALL MODELS:') + 'KEYWORDS – ALL MODELS:'.length).trim();

      if (
        keyWordsLine.substring(keyWordsLine.length - 1) === ',' ||
        keyWordsLine.substring(keyWordsLine.length - 1) === '|' ||
        keyWordsLine.substring(keyWordsLine.length - 1) === '–'
      ) {
        keyWordsLine =
          keyWordsLine +
          lines[index + 1].substring(line.indexOf('KEYWORDS – ALL MODELS:'), startOfAbilities.pos).trim();

        keyWordsLine = 'ALL MODELS: ' + keyWordsLine;
      }

      if (keyWordsLine.includes('|')) {
        const multiModelSplit = keyWordsLine.split('|').map((line) => {
          const lines = line.split(':');
          if (lines.length === 1) {
            return lines;
          }

          return [lines[0] + ':', ...lines.slice(1)];
        });
        keyWordsLine = multiModelSplit.join(',');
      }
      if (keyWordsLine.includes('–')) {
        const multiModelSplit = keyWordsLine.split('–').map((line) => {
          const lines = line.split(':');
          if (lines.length === 1) {
            return lines;
          }

          return [lines[0] + ':', ...lines.slice(1)];
        });
        keyWordsLine = multiModelSplit.join(',');
      }

      return keyWordsLine.split(',').map((val) => val.trim().replace('\x07', ''));
    }
  }
  return [];
};
function countSubstringOccurrences(longString, substring) {
  const regex = new RegExp(substring, 'g');
  const matches = longString.match(regex);
  return matches ? matches.length : 0;
}
const getName = (name) => {
  const nameArray = name.split(' ');
  for (var i = 0; i < nameArray.length; i++) {
    nameArray[i] = nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1);
  }
  return nameArray.join(' ');
};
const getSpecialAbilities = (lines) => {
  const specialAbilityKeywords = [
    'TANK COMMANDER',
    'SUPREME COMMANDER',
    'CRIMSON FISTS',
    'SERVITOR RETINUE',
    'HUNTER ORGANISM',
    'LAST SURVIVOR',
    'ATTACHED UNIT',
    'TYCHO',
    'DEATH COMPANY',
    'FLESH TEARERS',
    'LOGAN GRIMNAR',
    'MASTER OF MISCHIEF',
    'FORCE OF UNTAMED DESTRUCTION',
    'WOLFKIN',
    'CASSIUS',
    'AHRIMAN',
    'EMPEROR’S CHILDREN',
  ];

  let ability = { name: '', description: '' };
  let startOfBlock = 0;
  let startOfAbility = false;
  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS') || line.includes('* The profile for')) {
      break;
    }
    if (startOfBlock > 0) {
      if (includesString(line.substring(startOfBlock), specialAbilityKeywords)) {
        startOfAbility = true;
        ability.name = line.substring(startOfBlock);
        continue;
      }
    }
    if (startOfAbility && startOfBlock > 0) {
      let textLine = line.substring(startOfBlock).trim();

      if (textLine.length === 0) {
        continue;
      }
      if (textLine.trim().length > 0) {
        ability.description = ability.description + ' ' + textLine.trim();
      }
    }
    if (line.includes('UNIT COMPOSITION')) {
      startOfBlock = line.indexOf('UNIT COMPOSITION') - 1;
    }
  }
  if (startOfAbility) {
    return [
      {
        name: ability.name.trim(),
        description: ability.description.trim(),
        // showAbility: true,
        // showDescription: true,
      },
    ];
  }

  return [];
};

const getPrimarchAbilities = (lines, blockStart, startOfAbilities, file = '') => {
  let primarchAbilities = [];
  let primarchAbility = { name: '', /* showAbility: true, */ abilities: [] };

  if (blockStart.line > 0) {
    try {
      primarchAbility.name = lines[blockStart.line].substring(blockStart.pos, startOfAbilities.pos).trim();

      for (let index = blockStart.line + 1; index < lines.length; index++) {
        if (lines[index].includes('KEYWORDS:') || lines[index].includes('Before selecting')) {
          break;
        }

        let line = lines[index].substring(blockStart.pos, startOfAbilities.pos);

        if (line.trim().length === 0) {
          continue;
        }
        if (line.includes(':')) {
          primarchAbility.abilities.push({
            name: line.substring(0, line.indexOf(':')).trim(),
            description: line.substring(line.indexOf(':') + 1).trim(),
            // showAbility: true,
            // showDescription: true,
          });
        } else {
          if (primarchAbility.abilities.length === 0) {
            primarchAbility.abilities.push({
              name: primarchAbility.name,
              description: '',
            });
          }
          primarchAbility.abilities[primarchAbility.abilities.length - 1].description =
            primarchAbility.abilities[primarchAbility.abilities.length - 1].description + ' ' + line.trim();
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  if (primarchAbility.name !== '') {
    primarchAbilities.push(primarchAbility);
  }
  return primarchAbilities;
};

const checkForManualFixes = (unit) => {
  switch (unit.name) {
    case 'Adeptus Astartes Armoury':
      unit.abilities.special = [
        {
          name: 'WEAPON LISTS',
          description:
            'Several Adeptus Astartes models have the option to be equipped with one or more weapons whose profiles are not listed on their datasheet. The profiles for these weapons are instead listed on this card.',
          // showAbility: true,
          // showDescription: true,
        },
      ];
      unit.abilities.other = [
        {
          name: 'Special Weapons',
          description:
            '* If a Captain or Lieutenant model is equipped with this weapon, improve this weapon’s Ballistic Skill characteristic by 1.',
          // showAbility: true,
          // showDescription: true,
        },
      ];
      break;
    case 'Kill Team Cassius':
      unit.stats = [
        {
          m: '6"',
          t: '4',
          sv: '3+',
          w: '4',
          ld: '5+',
          oc: '2',
          name: 'CHAPLAIN CASSIUS',
        },
        {
          m: '5"',
          t: '5',
          sv: '2+',
          w: '3',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM TERMINATOR',
        },
        {
          m: '6"',
          t: '4',
          sv: '3+',
          w: '2',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM VETERAN',
        },
        {
          m: '12"',
          t: '5',
          sv: '3+',
          w: '3',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM BIKER',
        },
      ];
      break;
    case 'Proteus Kill Team':
      unit.stats = [
        {
          m: '6"',
          t: '4',
          sv: '3+',
          w: '2',
          ld: '6+',
          oc: '1',
          name: 'KILL TEAM VETERANS',
        },
        {
          m: '12"',
          t: '5',
          sv: '3+',
          w: '3',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM BIKER',
        },
        {
          m: '5"',
          t: '5',
          sv: '2+',
          w: '3',
          ld: '6+',
          oc: '1',
          name: 'KILL TEAM TERMINATOR',
        },
      ];
      break;
    default:
      unit = unit;
      break;
  }
  return unit;
};

function includesString(longString, specialAbilityKeywords) {
  let containsKeyword = false;
  specialAbilityKeywords.forEach((keyword) => {
    if (longString.includes(keyword)) {
      containsKeyword = true;
    }
  });

  return containsKeyword;
}
module.exports = {
  getKeywords,
  getInvulValue,
  getUnitKeywords,
  getStartOfWeaponsBlock,
  getStartOfBlock,
  getStartOfBlockList,
  getFactionName,
  getWeaponEndline,
  getName,
  getUnitComposition,
  getLeader,
  getWargear,
  getTransport,
  getInvulInfo,
  getUnitLoadout,
  getSpecialAbilities,
  checkForManualFixes,
  includesString,
  getPrimarchAbilities,
};
