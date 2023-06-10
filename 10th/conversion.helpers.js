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
    if (
      line.includes('LEADER') ||
      line.includes('FACTION KEYWORDS') ||
      line.includes('TRANSPORT') ||
      line.includes('equipped with')
    ) {
      break;
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
    if (line.includes('UNIT COMPOSITION')) {
      startOfBlock = line.indexOf('UNIT COMPOSITION');
    }
  }

  return value.trim();
};
const getUnitLoadout = (lines) => {
  const keywords = [
    'TANK COMMANDER',
    'SUPREME COMMANDER',
    'CRIMSON FISTS',
    'SERVITOR RETINUE',
    'TRANSPORT',
    'FACTION KEYWORDS',
    'LEADER',
    'HUNTER ORGANISM',
    'LAST SURVIVOR',
  ];

  let value = '';
  let startOfBlock = 0;
  let startOfEquipment = false;
  for (const [_index, line] of lines.entries()) {
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
  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS') || line.includes('TRANSPORT')) {
      break;
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
    if (line.includes('LEADER')) {
      startOfBlock = line.indexOf('LEADER');
    }
  }

  return value.trim();
};

const getWargear = (lines) => {
  let value = '';
  let startOfBlock = 0;
  let endOfBlock = 0;

  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS')) {
      break;
    }
    if (startOfBlock > 0) {
      let textLine = line.substring(startOfBlock, endOfBlock).trim();

      if (textLine.length === 0) {
        continue;
      }
      value = value + ' ' + textLine;
    }
    if (line.includes('WARGEAR OPTIONS')) {
      startOfBlock = line.indexOf('WARGEAR OPTIONS');
      endOfBlock = line.indexOf('UNIT COMPOSITION') - startOfBlock - 2;
    }
  }

  return value.trim();
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
      if (line.includes('|')) {
        keyWordsLine = line
          .substring(line.indexOf('KEYWORDS – ALL MODELS:') + 'KEYWORDS – ALL MODELS:'.length, line.indexOf('|'))
          .trim();
      } else {
        keyWordsLine = line.substring(line.indexOf('KEYWORDS – ALL MODELS:') + 'KEYWORDS – ALL MODELS:'.length).trim();
      }

      return keyWordsLine.split(',').map((val) => val.trim().replace('\x07', ''));
    }
  }
  return [];
};

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
  ];

  let ability = { name: '', description: '' };
  let startOfBlock = 0;
  let startOfAbility = false;
  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS')) {
      break;
    }
    if (includesString(line, specialAbilityKeywords)) {
      startOfAbility = true;
      ability.name = line.substring(startOfBlock);
      continue;
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
    return [{ name: ability.name.trim(), description: ability.description.trim() }];
  }

  return [];
};

const checkForManualFixes = (unit) => {
  switch (unit.name) {
    case 'Marneus Calgar':
      unit.keywords = [
        'ALL MODELS',
        'Infantry',
        'Imperium',
        '|',
        'MARNEUS CALGAR',
        'Character',
        'Epic Hero',
        'Gravis',
        'Chapter Master',
        'Marneus Calgar',
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
};
