const getKeywords = (lines, searchText) => {
  for (const [_index, line] of lines.entries()) {
    if (line.includes(searchText)) {
      return line
        .substring(line.indexOf(searchText) + searchText.length)
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val);
    }
  }
  return [];
};
const getInvulValueFw = (lines) => {
  for (const [_index, line] of lines.entries()) {
    if (line.includes('INVULNERABLE SAVE')) {
      return line.substring(0, line.indexOf('INVULNERABLE SAVE')).trim();
    }
  }
  return '';
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
const getInvulInfoFw = (lines) => {
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
        textLine.includes('The Master of Ordnance and Officer of the Fleet are both') ||
        textLine.includes('Every Corsair Voidscarred') ||
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
    'ATTACHÉS',
    'LONER',
    'This unit can have up to two Leader units attached',
    'BODYGUARD',
    'ENSLAVED STAR GOD',
    'DEPLOYMENT',
    'CRYPTEK RETINUE',
    'TRIARCHAL MENHIRS',
    'PATH OF DAMNATION',
    'TROUPE MASTER',
    'TEMPESTOR PRIME',
    'JETBIKE OUTRIDERS',
    'LIONS OF THE EMPEROR',
    'CUSTODIAN GUARD',
    'JUMP PACKS',
    'SPEED FREEKS MOB',
    'COMPACT',
    'SECUTARII',
  ];

  let value = '';
  let startOfBlock = 0;
  let startOfEquipment = false;
  for (const [_index, line] of lines.slice(2).entries()) {
    if (includesString(line, keywords)) {
      break;
    }

    if (
      line.substring(startOfBlock).includes('equipped with:') ||
      line.substring(startOfBlock).includes('The Master of Ordnance and Officer of the Fleet are both') ||
      line.substring(startOfBlock).includes('Every Corsair Voidscarred')
    ) {
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
    if (
      line.includes('FACTION KEYWORDS') ||
      line.includes('TRANSPORT') ||
      line.includes('SUPREME COMMANDER') ||
      line.includes('TROUPE MASTER') ||
      line.includes('TEMPESTOR PRIME') ||
      line.includes('EMPEROR’S CHILDREN') ||
      line.includes('MANIFESTATION OF DESTRUCTION') ||
      line.includes('AHRIMAN') ||
      line.includes('MASTER OF MISCHIEF') ||
      line.includes('LOGAN GRIMNAR') ||
      line.includes('FLESH TEARERS') ||
      line.includes('TYCHO') ||
      line.includes('CRIMSON FISTS') ||
      line.includes('LIONS OF THE EMPEROR') ||
      line.includes('JUMP PACKS') ||
      line.includes('SPEED FREEKS MOB') ||
      line.includes('COMPACT') ||
      line.includes('SECUTARII') ||
      line.includes('JETBIKE OUTRIDERS')
    ) {
      break;
    }
    if (startOfExtraBlock > 0 && line.includes('This unit can have up to two Leader')) {
      startOfBlock = line.indexOf('This unit can have up to two Leader');
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
    if (line.includes('FACTION KEYWORDS') || line.includes('KEYWORDS –')) {
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
    if (line.includes('KEYWORDS:') || line.includes('KEYWORDS –') || line.includes('Before selecting targets')) {
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
    if (line.includes('KEYWORDS –')) {
      let keyWordsLine;
      keyWordsLine = lines[index + 1]
        .substring(
          lines[index + 1].indexOf('ALL MODELS:') + 'ALL MODELS:'.length,
          startOfAbilities.pos - 'ALL MODELS:'.length
        )
        .trim();

      if (
        keyWordsLine.substring(keyWordsLine.length - 1) === ',' ||
        keyWordsLine.substring(keyWordsLine.length - 1) === '|' ||
        keyWordsLine.substring(keyWordsLine.length - 1) === '–'
      ) {
        keyWordsLine = keyWordsLine + lines[index + 2].substring(0, startOfAbilities.pos).trim();
        keyWordsLine = 'ALL MODELS: ' + keyWordsLine;
      }

      if (keyWordsLine.includes('|')) {
        const multiModelSplit = keyWordsLine.split('|').map((tempLine) => {
          const tempLines = tempLine.split(':');
          if (tempLines.length === 1) {
            return tempLines;
          }

          return [tempLines[0] + ':', ...tempLines.slice(1)];
        });
        keyWordsLine = multiModelSplit.join(',');
      }
      if (keyWordsLine.includes('–')) {
        const multiModelSplit = keyWordsLine.split('–').map((tempLine) => {
          const tempLines = tempLine.split(':');
          if (tempLines.length === 1) {
            return tempLines;
          }

          return [tempLines[0] + ':', ...tempLines.slice(1)];
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
    'ATTACHÉS',
    'LONER',
    'BODYGUARD',
    'ENSLAVED STAR GOD',
    'DEPLOYMENT',
    'CRYPTEK RETINUE',
    'TRIARCHAL MENHIRS',
    'PATH OF DAMNATION',
    'TROUPE MASTER',
    'ORDERS',
    'TEMPESTOR PRIME',
    'JETBIKE OUTRIDERS',
    'LIONS OF THE EMPEROR',
    'CUSTODIAN GUARD',
    'JUMP PACKS',
    'SPEED FREEKS MOB',
    'COMPACT',
    'SECUTARII',
  ];

  let ability = { name: '', description: '' };
  let abilities = [];
  let startOfBlock = 0;
  let startOfAbility = false;
  for (const [_index, line] of lines.entries()) {
    if (line.includes('FACTION KEYWORDS') || line.includes('* The profile for')) {
      break;
    }
    if (startOfBlock > 0) {
      if (includesString(line.substring(startOfBlock), specialAbilityKeywords)) {
        if (startOfAbility) {
          abilities.push({
            name: ability.name.trim(),
            description: ability.description.trim(),
            showAbility: true,
            showDescription: true,
          });
        }
        startOfAbility = true;
        ability.name = line.substring(startOfBlock);
        ability.description = '';
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
    if (startOfAbility) {
      abilities.push({
        name: ability.name.trim(),
        description: ability.description.trim(),
        showAbility: true,
        showDescription: true,
      });
    }
    return abilities;
  }

  return [];
};

const getPrimarchAbilities = (lines, blockStart, startOfAbilities, file = '') => {
  let primarchAbilities = [];
  let primarchAbility = { name: '', showAbility: true, abilities: [] };

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
            showAbility: true,
            showDescription: true,
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
    case 'Skathach Wraithknight':
      unit.abilities.wargear = {
        name: 'Scattershield',
        description: 'The bearer has a 4+ invulnerable save.',
        showAbility: true,
        showDescription: true,
      };
      break;
    case 'Skull Altar':
      unit.keywords = ['Fortification', 'Chaos', 'Daemon', 'Khorne', 'Skull Altar'];
      break;
    case 'Tiger Shark':
      unit.rangedWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Burst cannon',
              keywords: [],
              range: '18"',
              attacks: '4',
              skill: '4+',
              strength: '5',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Ion cannon – standard',
              keywords: ['blast'],
              range: '60"',
              attacks: 'D6+3',
              skill: '4+',
              strength: '7',
              ap: '-1',
              damage: '2',
            },
            {
              active: true,
              name: 'Ion cannon – overcharge',
              keywords: ['blast', 'hazardous'],
              range: '60"',
              attacks: 'D6+3',
              skill: '4+',
              strength: '8',
              ap: '-2',
              damage: '3',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Missile pod',
              keywords: [],
              range: '30"',
              attacks: '2',
              skill: '4+',
              strength: '7',
              ap: '-1',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Seeker missile',
              keywords: ['one shot'],
              range: '48"',
              attacks: '1',
              skill: '4+',
              strength: '14',
              ap: '-3',
              damage: 'D6+1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Skyspear missile rack',
              keywords: ['anti-fly 3+', 'blast'],
              range: '72"',
              attacks: 'D6+1',
              skill: '4+',
              strength: '6',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Swiftstrike burst cannon',
              keywords: [],
              range: '36"',
              attacks: '16',
              skill: '4+',
              strength: '6',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Swiftstrike railgun',
              keywords: ['devastating wounds'],
              range: '72"',
              attacks: '1',
              skill: '4+',
              strength: '20',
              ap: '-5',
              damage: 'D6+6',
            },
          ],
        },
      ];
      break;
    case 'Manta':
      unit.rangedWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Heavy rail cannon',
              keywords: ['devastating wounds'],
              range: '120"',
              attacks: '1',
              skill: '4+',
              strength: '26',
              ap: '-5',
              damage: '12',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Ion cannon – standard',
              keywords: ['blast'],
              range: '60"',
              attacks: 'D6+3',
              skill: '4+',
              strength: '7',
              ap: '-1',
              damage: '2',
            },
            {
              active: true,
              name: 'Ion cannon – overcharge',
              keywords: ['blast', 'hazardous'],
              range: '60"',
              attacks: 'D6+3',
              skill: '4+',
              strength: '8',
              ap: '-2',
              damage: '3',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Long-barrelled burst cannon array',
              keywords: [],
              range: '24"',
              attacks: '32',
              skill: '4+',
              strength: '6',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Missile pod',
              keywords: [],
              range: '30"',
              attacks: '2',
              skill: '4+',
              strength: '7',
              ap: '-1',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Seeker missile',
              keywords: ['one shot'],
              range: '48"',
              attacks: '1',
              skill: '4+',
              strength: '14',
              ap: '-3',
              damage: 'D6+1',
            },
          ],
        },
      ];
      break;
    case 'Aun’va':
      unit.keywords = ['ALL MODELS:', 'Infantry', "AUN'VA:", 'Character', 'Epic Hero', 'Ethereal', "Aun'Va"];
      break;
    case 'Space Wolves Venerable Dreadnought':
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Close combat weapon',
              keywords: [],
              range: 'Melee',
              attacks: '5',
              skill: '3+',
              strength: '6',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Dreadnought combat weapon',
              keywords: [],
              range: 'Melee',
              attacks: '5',
              skill: '3+',
              strength: '12',
              ap: '-2',
              damage: '3',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Fenrisian great axe – strike',
              keywords: [],
              range: 'Melee',
              attacks: '5',
              skill: '3+',
              strength: '10',
              ap: '-2',
              damage: 'D6+1',
            },
            {
              active: true,
              name: 'Fenrisian great axe – sweep',
              keywords: [],
              range: 'Melee',
              attacks: '10',
              skill: '3+',
              strength: '6',
              ap: '-2',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Wolf Scouts':
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Astartes chainsword',
              keywords: [],
              range: 'Melee',
              attacks: '4',
              skill: '3+',
              strength: '4',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Close combat weapon',
              keywords: [],
              range: 'Melee',
              attacks: '2',
              skill: '3+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Combat knife',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '5',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power fist',
              keywords: [],
              range: 'Melee',
              attacks: '2',
              skill: '3+',
              strength: '8',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power weapon',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Thunder hammer',
              keywords: ['devastating wounds'],
              range: 'Melee',
              attacks: '2',
              skill: '4+',
              strength: '8',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Twin lightning claws',
              keywords: ['twin-linked'],
              range: 'Melee',
              attacks: '4',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Long Fangs':
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Astartes chainsword',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '4',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Close combat weapon',
              keywords: [],
              range: 'Melee',
              attacks: '2',
              skill: '3+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power fist',
              keywords: [],
              range: 'Melee',
              attacks: '2',
              skill: '3+',
              strength: '8',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power weapon',
              keywords: [],
              range: 'Melee',
              attacks: '2',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Hunta Rig':
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Butcha boyz',
              keywords: ['extra attacks', 'anti-monster 4+', 'anti-vehicle 4+'],
              range: 'Melee',
              attacks: '4',
              skill: '3+',
              strength: '5',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Savage horns and hooves',
              keywords: ['extra attacks', 'lance'],
              range: 'Melee',
              attacks: '4',
              skill: '4+',
              strength: '8',
              ap: '-1',
              damage: '3',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Saw blades',
              keywords: [],
              range: 'Melee',
              attacks: '6',
              skill: '3+',
              strength: '10',
              ap: '-1',
              damage: '2',
            },
          ],
        },
      ];
      break;
    case 'Mek Gunz':
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Grot crew',
              keywords: [],
              range: 'Melee',
              attacks: '6',
              skill: '5+',
              strength: '2',
              ap: '0',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Razorwing Jetfighter':
      unit.rangedWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Dark Lance',
              keywords: [],
              range: '36"',
              attacks: '1',
              skill: '3+',
              strength: '12',
              ap: '-3',
              damage: 'D6+2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Disintegrator',
              keywords: [],
              range: '36"',
              attacks: '3',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Razorwing missiles – monoscythe missiles',
              keywords: ['blast'],
              range: '48"',
              attacks: 'D6',
              skill: '3+',
              strength: '6',
              ap: '-1',
              damage: '2',
            },
            {
              active: true,
              name: 'Razorwing missiles – nuerotoxin missiles',
              keywords: ['anti-infantry 2+', 'blast'],
              range: '48"',
              attacks: 'D6+3',
              skill: '3+',
              strength: '2',
              ap: '0',
              damage: '1',
            },
            {
              active: true,
              name: 'Razorwing missiles – shatterfield missiles',
              keywords: ['blast'],
              range: '48"',
              attacks: 'D6',
              skill: '3+',
              strength: '7',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Twin splinter rifle',
              keywords: ['anti-infantry 3+', 'assault', 'rapid fire 1', 'twin-linked'],
              range: '24"',
              attacks: '1',
              skill: '3+',
              strength: '2',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Splinter cannon',
              keywords: ['anti-infantry 3+', 'sustained hits 1'],
              range: '36"',
              attacks: '3',
              skill: '3+',
              strength: '3',
              ap: '-1',
              damage: '2',
            },
          ],
        },
      ];
      break;
    case 'Incubi':
      unit.stats = [
        {
          m: '7"',
          t: '3',
          sv: '3+',
          w: '1',
          ld: '6+',
          oc: '1',
          name: 'Incubi',
          showDamagedMarker: false,
          showName: false,
          active: true,
        },
        {
          m: '7"',
          t: '3',
          sv: '3+',
          w: '2',
          ld: '6+',
          oc: '1',
          name: 'KLAIVEX',
          showDamagedMarker: false,
          showName: true,
          active: true,
        },
      ];
      break;
    case 'Feculent Gnarlmaw':
      unit.keywords = ['Fortification', 'Chaos', 'Daemon', 'Nurgle', 'Feculent Gnarlmaw'];
      break;
    case 'Great Unclean One':
      unit.abilities.other = [
        ...unit.abilities.other,
        {
          name: 'Reverberating Summons',
          description:
            'Each time a model is destroyed by this weapon, you can select one friendly Plaguebearers unit within 12" of the bearer and return 1 destroyed Plaguebearer model to that unit.',
          showAbility: true,
          showDescription: true,
        },
      ];
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Bileblade',
              keywords: ['extra attacks', 'lethal hits'],
              range: 'Melee',
              attacks: '3',
              skill: '2+',
              strength: '6',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Bilesword – strike',
              keywords: ['lethal hits'],
              range: 'Melee',
              attacks: '6',
              skill: '2+',
              strength: '8',
              ap: '-2',
              damage: 'D6',
            },
            {
              active: true,
              name: 'Bilesword – sweep',
              keywords: ['lethal hits'],
              range: 'Melee',
              attacks: '12',
              skill: '2+',
              strength: '6',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Doomsday bell',
              keywords: ['lethal hits', 'reverberating summons'],
              range: 'Melee',
              attacks: '6',
              skill: '2+',
              strength: '7',
              ap: '-1',
              damage: '2',
            },
          ],
        },
      ];
      break;
    case 'Regimental Attachés':
      unit.keywords = ['ALL MODELS:', 'Infantry', 'Imperium', 'Regimental Attachés', 'ASTROPATH:', 'Psyker'];
      break;
    case 'Indomitor Kill Team':
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Close combat weapon',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power fists',
              keywords: ['twin-linked'],
              range: 'Melee',
              attacks: '3',
              skill: '4+',
              strength: '8',
              ap: '-2',
              damage: '2',
            },
          ],
        },
      ];
      break;
    case 'Fabius Bile':
      unit.keywords = [
        'ALL MODELS:',
        'Infantry',
        'Chaos',
        'Chaos Undivided',
        'FABIUS BILE ONLY:',
        'Character',
        'Epic Hero',
        'Fabius Bile',
      ];
      break;
    case 'Haarken Worldclaimer':
      unit.keywords = [
        'Infantry',
        'Character',
        'Epic Hero',
        'Fly',
        'Jump Pack',
        'Chaos',
        'Chaos Undivided',
        'Haarken Worldclaimer',
      ];
      break;
    case 'Crusader Squad':
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Astartes chainsword',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '4',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Combat knife',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Close combat weapon',
              keywords: [],
              range: 'Melee',
              attacks: '2',
              skill: '3+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power fist',
              keywords: [],
              range: 'Melee',
              attacks: '2',
              skill: '3+',
              strength: '8',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power weapon',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Thunder hammer',
              keywords: ['devastating wounds'],
              range: 'Melee',
              attacks: '2',
              skill: '4+',
              strength: '8',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Twin lightning claws',
              keywords: ['twin-linked'],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Gaunt’s Ghosts':
      unit.keywords = [
        'ALL MODELS:',
        'Infantry',
        'Imperium',
        'Grenades',
        'Gaunt’s Ghosts',
        'IBRAM GAUNT:',
        'Character',
        'Epic Hero',
        'Officer',
      ];
      break;
    case 'Wyvern':
      unit.rangedWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Heavy bolter',
              keywords: ['sustained hits 1'],
              range: '36"',
              attacks: '3',
              skill: '4+',
              strength: '5',
              ap: '-1',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Heavy flamer',
              keywords: ['ignores cover', 'torrent'],
              range: '12"',
              attacks: 'D6',
              skill: 'N/A',
              strength: '5',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Hunter-killer missile',
              keywords: ['one shot'],
              range: '48"',
              attacks: '1',
              skill: '4+',
              strength: '14',
              ap: '-3',
              damage: 'D6',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Wyvern quad stormshard mortar',
              keywords: ['blast', 'ignores cover', 'heavy', 'indirect fire', 'twin-linked'],
              range: '48"',
              attacks: '2D6',
              skill: '4+',
              strength: '5',
              ap: '0',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Fire Prism':
      unit.rangedWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Prism cannon – dispersed pulse',
              keywords: ['blast'],
              range: '60"',
              attacks: '2D6',
              skill: '3+',
              strength: '6',
              ap: '-1',
              damage: '2',
            },
            {
              active: true,
              name: 'Prism cannon – focused lances',
              keywords: ['linked fire'],
              range: '60"',
              attacks: '2',
              skill: '3+',
              strength: '18',
              ap: '-4',
              damage: '6',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Shuriken cannon',
              keywords: ['sustained hits 1'],
              range: '24"',
              attacks: '3',
              skill: '3+',
              strength: '6',
              ap: '-1',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Twin shuriken catapult',
              keywords: ['assault', 'twin-linked'],
              range: '18"',
              attacks: '2',
              skill: '3+',
              strength: '4',
              ap: '-1',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Canoness':
      unit.rangedWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Bolt pistol',
              keywords: ['pistol'],
              range: '12"',
              attacks: '1',
              skill: '2+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Brazier of holy fire',
              keywords: ['ignores cover', 'one shot', 'torrent'],
              range: '12"',
              attacks: 'D6',
              skill: 'N/A',
              strength: '6',
              ap: '-1',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Condemnor boltgun',
              keywords: ['anti-psyker 2+', 'devastating wounds', 'precision', 'rapid fire 1'],
              range: '24"',
              attacks: '1',
              skill: '2+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Inferno pistol',
              keywords: ['melta 2', 'pistol'],
              range: '6"',
              attacks: '1',
              skill: '2+',
              strength: '8',
              ap: '-4',
              damage: 'D3',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Plasma pistol – standard',
              keywords: ['pistol'],
              range: '12"',
              attacks: '1',
              skill: '2+',
              strength: '7',
              ap: '-2',
              damage: '1',
            },
            {
              active: true,
              name: 'Plasma pistol – supercharge',
              keywords: ['hazardous', 'pistol'],
              range: '12"',
              attacks: '1',
              skill: '2+',
              strength: '8',
              ap: '-3',
              damage: '2',
            },
          ],
        },
      ];
      break;
    case 'Zodgrod Wortsnagga':
      unit.abilities.other = [
        ...unit.abilities.other,
        {
          name: 'Super Runts',
          description:
            'While this model is leading a unit: ■ Models in that unit have the Scouts 9" ability. ■ Each time a model in that unit makes an attack, add 1 to the Hit roll and add 1 to the Wound roll. ■ Each time an attack targets that unit, subtract 1 from the Wound roll.',
          showAbility: true,
          showDescription: true,
        },
      ];
      break;
    case 'Shadow Spectres':
      unit.abilities.invul = {
        value: '5+',
        info: '',
        showInvulnerableSave: true,
        showInfo: false,
      };
      unit.stats = [
        ...unit.stats,
        {
          m: '12"',
          t: '3',
          sv: '5+',
          w: '2',
          ld: '6+',
          oc: '1',
          name: 'SHADOW SPECTRE EXARCH',
          showDamagedMarker: false,
          showName: true,
          active: true,
        },
      ];
      break;
    case 'Deathstrike':
      unit.abilities.other = [
        ...unit.abilities.other,
        {
          name: 'Plasma Warhead',
          description:
            'The bearer can only shoot with this weapon in your Shooting phase, and only if it Remained Stationary this turn and you did not use its Deathstrike Missile ability to Designate Target or Adjust Target this phase. When the bearer shoots with this weapon, do not select a target. Instead, resolve this weapon’s attacks, rolling for each unit within 6" of the centre of its Deathstrike Target marker individually.',
          showAbility: true,
          showDescription: true,
        },
      ];
      break;
    case 'Inquisitor Greyfax':
      unit.rangedWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Castigation',
              keywords: ['anti-character 4+', 'devastating wounds', 'precision', 'psychic'],
              range: '18"',
              attacks: '1',
              skill: '3+',
              strength: '8',
              ap: '-2',
              damage: '3',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Condemnor stake',
              keywords: ['anti-psyker 2+', 'devastating wounds', 'precision', 'rapid fire 1'],
              range: '24"',
              attacks: '1',
              skill: '3+',
              strength: '4',
              ap: '0',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Platoon Command Squad':
      unit.stats = [
        {
          m: '6"',
          t: '3',
          sv: '5+',
          w: '3',
          ld: '7+',
          oc: '1',
          name: 'PLATOON COMMANDER ',
          showDamagedMarker: false,
          showName: true,
          active: true,
        },
        {
          m: '6""',
          t: '3',
          sv: '5+',
          w: '2',
          ld: '7+',
          oc: '2',
          name: 'VETERAN HEAVY',
          showDamagedMarker: false,
          showName: true,
          active: true,
        },
        {
          m: '6"',
          t: '3',
          sv: '5+',
          w: '1',
          ld: '7+',
          oc: '1',
          name: 'VETERAN GUARDSMAN',
          showDamagedMarker: false,
          showName: true,
          active: true,
        },
      ];
      break;
    case 'Ghazghkull Thraka':
      unit.abilities.invul = {
        value: '4+',
        info: '',
        showInvulnerableSave: true,
        showInfo: false,
      };
      unit.abilities.special = [
        ...unit.abilities.special,
        {
          name: 'Invulnerable save: Makari 2+',
          description: '* You cannot re-roll invulnerable saving throws made for this model.',
          showAbility: true,
          showDescription: true,
        },
      ];
      break;
    case 'Culexus Assassin':
      unit.abilities.special = [
        ...unit.abilities.special,
        {
          name: 'Psychic Assassin',
          description:
            'Each time you select a Psyker unit as the target for this weapon, until those attacks are resolved, change the Attacks characteristic of this weapon to 6.',
          showAbility: true,
          showDescription: true,
        },
      ];
      break;
    case 'Adeptus Astartes Armoury':
      unit.abilities.special = [
        {
          name: 'WEAPON LISTS',
          description:
            'Several Adeptus Astartes models have the option to be equipped with one or more weapons whose profiles are not listed on their datasheet. The profiles for these weapons are instead listed on this card.',
          showAbility: true,
          showDescription: true,
        },
      ];
      unit.abilities.other = [
        {
          name: 'Special Weapons',
          description:
            '* If a Captain or Lieutenant model is equipped with this weapon, improve this weapon’s Ballistic Skill characteristic by 1.',
          showAbility: true,
          showDescription: true,
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
          active: true,
          showName: true,
        },
        {
          m: '5"',
          t: '5',
          sv: '2+',
          w: '3',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM TERMINATOR',
          active: true,
          showName: true,
        },
        {
          m: '6"',
          t: '4',
          sv: '3+',
          w: '2',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM VETERAN',
          active: true,
          showName: true,
        },
        {
          m: '12"',
          t: '5',
          sv: '3+',
          w: '3',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM BIKER',
          active: true,
          showName: true,
        },
      ];
      unit.meleeWeapons = [
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Artificer crozius',
              keywords: [],
              range: 'Melee',
              attacks: '5',
              skill: '2+',
              strength: '6',
              ap: '-1',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Close combat weapon',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Force weapon',
              keywords: ['psychic'],
              range: 'Melee',
              attacks: '5',
              skill: '2+',
              strength: '5',
              ap: '-3',
              damage: 'D3',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Long Vigil melee weapon',
              keywords: [],
              range: 'Melee',
              attacks: '4',
              skill: '3+',
              strength: '4',
              ap: '-1',
              damage: '1',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Power fist',
              keywords: [],
              range: 'Melee',
              attacks: '3',
              skill: '3+',
              strength: '8',
              ap: '-2',
              damage: '2',
            },
          ],
        },
        {
          active: true,
          profiles: [
            {
              active: true,
              name: 'Twin lightning claws',
              keywords: ['twin-linked'],
              range: 'Melee',
              attacks: '4',
              skill: '3+',
              strength: '5',
              ap: '-2',
              damage: '1',
            },
          ],
        },
      ];
      break;
    case 'Brôkhyr Iron-master':
      unit.stats = [
        {
          m: '5"',
          t: '5',
          sv: '4+',
          w: '4',
          ld: '7+',
          oc: '1',
          name: 'BRÔKHYR IRON-MASTER',
          showDamagedMarker: false,
          showName: true,
          active: true,
        },
        {
          m: '5"',
          t: '5',
          sv: '4+',
          w: '2',
          ld: '7+',
          oc: '1',
          name: 'IRONKIN ASSISTANT',
          showDamagedMarker: false,
          showName: true,
          active: true,
        },
        {
          m: '5"',
          t: '5',
          sv: '4+',
          w: '1',
          ld: '7+',
          oc: '1',
          name: 'E-COG',
          showDamagedMarker: false,
          showName: true,
          active: true,
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
          active: true,
          showName: true,
        },
        {
          m: '12"',
          t: '5',
          sv: '3+',
          w: '3',
          ld: '6+',
          oc: '2',
          name: 'KILL TEAM BIKER',
          active: true,
          showName: true,
        },
        {
          m: '5"',
          t: '5',
          sv: '2+',
          w: '3',
          ld: '6+',
          oc: '1',
          name: 'KILL TEAM TERMINATOR',
          active: true,
          showName: true,
        },
      ];
      break;
    case 'Canis Rex':
      unit = {
        ...unit,
        id: '0a2f0ee1-27c8-5342-b38e-e16b413456ef',
        name: 'Canis Rex',
        source: '40k-10e',
        faction_id: 'QI',
        cardType: 'DataCard',
        leader: '',
        composition: ['■ 1 Canis Rex – Epic Hero'],
        loadout: 'Canis Rex is equipped with: Chainbreaker las-impulsor; Chainbreaker multi-laser; Freedom’s Hand.',
        wargear: ['None'],
        transport: '',
        abilities: {
          wargear: [],
          core: ['Deadly Demise D6'],
          faction: ['Code Chivalric', 'Super-heavy Walker'],
          primarch: [],
          invul: {
            value: '5+',
            info: '* This model has a 5+ invulnerable save against ranged attacks.',
            showInvulnerableSave: true,
            showInfo: true,
          },
          other: [
            {
              name: 'Legendary Freeblade',
              description:
                'Once per turn, you can target this model with a Stratagem for 0CP, and can do so even if you have already targeted a different unit with that Stratagem in the same phase.',
              showAbility: true,
              showDescription: true,
            },
            {
              name: 'Chainbreaker',
              description:
                'Each time this model makes an attack, an unmodifed successful Hit roll of 5+ scores a Critical Hit.',
              showAbility: true,
              showDescription: true,
            },
          ],
          special: [
            {
              name: 'Sir Hekhtur',
              description:
                'If Canis Rex is destroyed, flip this card and follow the instructions for using Sir Hekhtur.',
              showAbility: true,
              showDescription: true,
            },
          ],
          damaged: {
            showDamagedAbility: true,
            showDescription: true,
            range: '1-7 WOUNDS REMAINING',
            description:
              'While this model has 1-7 wounds remaining, subtract 5 from this model’s Objective Control characteristic and each time this model makes an attack, subtract 1 from the Hit roll.',
          },
        },
        stats: [
          {
            m: '10"',
            t: '12',
            sv: '3+',
            w: '22',
            ld: '5+',
            oc: '10',
            name: 'Canis Rex',
            showDamagedMarker: true,
            showName: false,
            active: true,
          },
        ],
        rangedWeapons: [
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'Chainbreaker las-impulsor – high intensity',
                keywords: ['blast', 'sustained hits 1'],
                range: '24"',
                attacks: 'D6',
                skill: '2+',
                strength: '14',
                ap: '-3',
                damage: '4',
              },
              {
                active: true,
                name: 'Chainbreaker las-impulsor – low intensity',
                keywords: ['blast', 'sustained hits 1'],
                range: '36"',
                attacks: '2D6',
                skill: '2+',
                strength: '7',
                ap: '-1',
                damage: '2',
              },
            ],
          },
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'Chainbreaker multi-laser',
                keywords: ['sustained hits 1'],
                range: '36"',
                attacks: '4',
                skill: '2+',
                strength: '6',
                ap: '0',
                damage: '1',
              },
            ],
          },
        ],
        meleeWeapons: [
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'Freedom’s Hand – strike',
                keywords: ['sustained hits 1'],
                range: 'Melee',
                attacks: '5',
                skill: '2+',
                strength: '20',
                ap: '-3',
                damage: '9',
              },
              {
                active: true,
                name: 'Freedom’s Hand – sweep',
                keywords: ['sustained hits 1'],
                range: 'Melee',
                attacks: '10',
                skill: '2+',
                strength: '10',
                ap: '-2',
                damage: '3',
              },
            ],
          },
        ],
        keywords: [
          'Vehicle',
          'Walker',
          'Titanic',
          'Towering',
          'Questoris',
          'Character',
          'Epic Hero',
          'Imperium',
          'Canis Rex',
        ],
        factions: ['Imperial Knights'],
      };
      break;
    case 'Sir Hekhtur':
      unit = {
        ...unit,
        id: '4b339d48-cecd-5bd7-a49c-b6c808e008d4',
        name: 'Sir Hekhtur',
        source: '40k-10e',
        faction_id: 'QI',
        cardType: 'DataCard',
        leader: '',
        composition: ['■ 1 Sir Hekhtur – Epic Hero  '],
        loadout: 'Sir Hekhtur is equipped with: Hekhtur’s pistol; close combat weapon.',
        wargear: [],
        transport: '',
        abilities: {
          wargear: [],
          core: ['Lone Operative'],
          faction: [],
          primarch: [],
          invul: {
            value: '',
            info: '',
            showInvulnerableSave: false,
            showInfo: false,
          },
          other: [],
          special: [
            {
              name: 'USING SIR HEKHTUR',
              description:
                'When your Canis Rex model is destroyed, Sir Hekhtur is treated as a model disembarking from a destroyed Transport – set him up within 3" of your Canis Rex model before it is removed. Sir Hekhtur then uses the profile, wargear, abilities and keywords shown on this side of the card, but cannot be  selected as the target of any of your Stratagems other than Core Stratagems. Your Canis Rex unit is not considered to be destroyed until Sir Hekhtur is also destroyed.',
              showAbility: true,
              showDescription: true,
            },
          ],
          damaged: {
            showDamagedAbility: false,
            showDescription: true,
            range: '',
            description: '',
          },
        },
        stats: [
          {
            m: '6"',
            t: '3',
            sv: '4+',
            w: '3',
            ld: '5+',
            oc: '1',
            name: 'Sir Hekhtur',
            showDamagedMarker: false,
            showName: true,
            active: true,
          },
        ],
        rangedWeapons: [
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'Hekhtur’s pistol',
                keywords: ['pistol'],
                range: '12"',
                attacks: '1',
                skill: '2+',
                strength: '5',
                ap: '-1',
                damage: '2',
              },
            ],
          },
        ],
        meleeWeapons: [
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'Close combat weapon',
                keywords: [],
                range: 'Melee',
                attacks: '2',
                skill: '2+',
                strength: '3',
                ap: '0',
                damage: '1',
              },
            ],
          },
        ],
        keywords: ['Infantry', 'Character', 'Epic Hero', 'Imperium', 'Sir Hekhtur'],
        factions: ['Imperial Knights'],
      };
      break;
    case 'Triumph Of Saint Katherine':
      unit = {
        ...unit,
        id: 'f97d4991-a1f9-5474-9e27-ccfd37841c3c',
        name: 'Triumph Of Saint Katherine',
        source: '40k-10e',
        faction_id: 'AS',
        cardType: 'DataCard',
        leader: 'This model can be attached to the following unit: ■ Battle Sisters Squad',
        composition: ['1 Triumph of Saint Katherine – Epic Hero'],
        loadout: 'This model is equipped with: bolt pistols; relic weapons.',
        wargear: ['None'],
        transport: '',
        abilities: {
          wargear: [],
          core: ['Leader'],
          faction: ['Acts of Faith'],
          primarch: [
            {
              name: 'RELICS OF THE MATRIARCHS',
              showAbility: true,
              abilities: [
                {
                  name: 'The Fiery Heart (Aura)',
                  description:
                    'While a friendly Adepta Sororitas unit is within 6" of this model, if that unit is destroyed, the Miracle dice you gain as a result is automatically a 6.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'Censer of the Sacred Rose (Aura)',
                  description:
                    'While a friendly Adepta Sororitas unit is within 6" of this model, improve that unit’s Leadership characteristic by 1.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'Simulacrum of the Ebon Chalice (Aura)',
                  description:
                    'While a friendly Adepta Sororitas unit is within 6" of this model, that unit can perform any number of Acts of Faith per phase, instead of only one.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'Simulacrum of the Argent Shroud (Aura)',
                  description:
                    'While a friendly Adepta Sororitas unit is within 6" of this model, add 1 to the Attacks characteristic of Rapid Fire weapons equipped by models in that unit.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'Icon of the Valorous Heart (Aura)',
                  description:
                    'While a friendly Adepta Sororitas unit is within 6" of this model, that unit has the Feel No Pain 6+ ability.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'Petals of the Bloody Rose (Aura)',
                  description:
                    'While a friendly Adepta Sororitas unit is within 6" of this model, melee weapons equipped by models in that unit have the [LETHAL HITS] ability.',
                  showAbility: true,
                  showDescription: true,
                },
              ],
            },
          ],
          invul: {
            value: '4+',
            info: '',
            showInvulnerableSave: true,
            showInfo: false,
          },
          other: [
            {
              name: 'Relics of the Matriarchs',
              description:
                'At the start of the battle round, select up to two of the abilities in the Relics of the Matriarchs section (see left). Until the start of the next battle round, this model has those abilities.',
              showAbility: true,
              showDescription: true,
            },
          ],
          special: [],
          damaged: {
            showDamagedAbility: true,
            showDescription: true,
            range: '1-5 WOUNDS REMAINING',
            description:
              'While this model has 1-5 wounds remaining, the Attacks characteristics of all of its weapons are halved, and you can only select one ability when using its Relics of the Matriarchs ability, instead of up to two.',
          },
        },
        stats: [
          {
            m: '6"',
            t: '3',
            sv: '3+',
            w: '18',
            ld: '6+',
            oc: '6',
            name: 'Triumph Of Saint Katherine',
            showDamagedMarker: true,
            showName: false,
            active: true,
          },
        ],
        rangedWeapons: [
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'Bolt pistols',
                keywords: ['pistol'],
                range: '12"',
                attacks: '6',
                skill: '2+',
                strength: '4',
                ap: '0',
                damage: '1',
              },
            ],
          },
        ],
        meleeWeapons: [
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'Relic weapons',
                keywords: [],
                range: 'Melee',
                attacks: '18',
                skill: '2+',
                strength: '5',
                ap: '-2',
                damage: '1',
              },
            ],
          },
        ],
        keywords: ['Infantry', 'Grenades', 'Character', 'Epic Hero', 'Imperium', 'Triumph of Saint Katherine'],
        factions: ['Adepta Sororitas'],
      };
      break;
    case 'Tidewall Shieldline':
      unit = {
        ...unit,

        id: '461404f4-27f2-5e5d-a577-cc90fc70fbc8',
        name: 'Tidewall Shieldline',
        source: '40k-10e',
        faction_id: 'TAU',
        cardType: 'DataCard',
        leader: '',
        composition: ['1 Tidewall Shieldline'],
        loadout: '',
        wargear: ['This model can be equipped with 1 Tidewall defence platform.'],
        transport:
          'This model has a transport capacity of 11 T’au Empire Infantry models. It cannot transport Battlesuit, Kroot or Vespid Stingwings models. If this model is equipped with a Tidewall defence platform, it has a transport capacity of 22 T’au Infantry models instead.',
        points: [
          {
            models: '1',
            cost: '85',
          },
        ],
        abilities: {
          wargear: [],
          core: ['Deadly Demise D3', 'Firing Deck 20'],
          faction: [],
          primarch: [],
          invul: {
            value: '5+',
            info: '',
            showInvulnerableSave: true,
            showInfo: false,
          },
          other: [
            {
              name: 'Fortification',
              description:
                'While an enemy unit is only within Engagement Range of one or more Fortifications from your army: ■  That unit can still be selected as the target of ranged attacks, but each time such an attack is made, unless it is made with a Pistol, subtract 1 from the Hit roll. ■  Models in that unit do not need to take Desperate Escape tests due to Falling Back while Battle-shocked, except for those that will move over enemy models when doing so.',
              showAbility: true,
              showDescription: true,
            },
            {
              name: 'Tidewall Cover',
              description:
                'Each time a ranged attack is allocated to a model, if that model is not fully visible to every model in the attacking unit because of this Fortification, that model has the Benefit of Cover against that attack.',
              showAbility: true,
              showDescription: true,
            },
            {
              name: 'Tidewall Defence Platform',
              description:
                'If equipped with a Tidewall defence platform, this Fortification has a Wounds characteristic of 15.',
              showAbility: true,
              showDescription: true,
            },
          ],
          special: [],
          damaged: {
            showDamagedAbility: false,
            showDescription: true,
            range: '',
            description: '',
          },
        },
        stats: [
          {
            m: '4"',
            t: '8',
            sv: '3+',
            w: '10',
            ld: '7+',
            oc: '0',
            name: 'Tidewall Shieldline',
            showDamagedMarker: false,
            showName: false,
            active: true,
          },
        ],
        rangedWeapons: [],
        meleeWeapons: [],
        keywords: ['Fortification', 'Vehicle', 'Transport', 'Fly', 'Tidewall Shieldline'],
        factions: ['T’au Empire'],
      };
      break;
    case 'T’au Empire':
      unit = {
        id: 'ac3cd97b-2c73-5422-baf6-34be01cfd3b8',
        name: 'T’au Empire',
        source: '40k-10e',
        faction_id: 'TAU',
        cardType: 'DataCard',
        leader: '',
        composition: [],
        loadout: '',
        wargear: [],
        transport: '',
        points: [],
        abilities: {
          wargear: [],
          core: [],
          faction: [],
          primarch: [
            {
              name: 'T’au Empire',
              showAbility: true,
              abilities: [
                {
                  name: 'DRONES',
                  description:
                    'If you have upgraded a model to have a drone, place a Drone token next to your model as a reminder. These do not count as models for any rules purposes.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'GUARDIAN DRONE',
                  description:
                    'Each time a model makes a ranged attack that  targets the bearer’s unit, subtract 1 from the  Wound roll.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'MARKER DRONE',
                  description:
                    'The bearer’s unit has the Markerlight keyword  and can act as an Observer unit for another unit  even if it Advanced this turn.',
                  showAbility: true,
                  showDescription: true,
                },
                {
                  name: 'SHIELD DRONE',
                  description: 'Add 1 to the bearer’s Wounds characteristic.',
                  showAbility: true,
                  showDescription: true,
                },
              ],
            },
          ],
          invul: {
            value: '',
            info: '',
            showInvulnerableSave: false,
            showInfo: false,
          },
          other: [],
          special: [],
          damaged: {
            showDamagedAbility: false,
            showDescription: true,
            range: '',
            description: '',
          },
        },
        stats: [],
        rangedWeapons: [
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'GUN DRONE - Twin pulse carbine',
                keywords: ['assault', 'twin-linked'],
                range: '20"',
                attacks: '2',
                skill: '5+',
                strength: '5',
                ap: '0',
                damage: '1',
              },
            ],
          },
          {
            active: true,
            profiles: [
              {
                active: true,
                name: 'MISSILE DRONE - Missile pod',
                keywords: [],
                range: '30"',
                attacks: '2',
                skill: '5+',
                strength: '7',
                ap: '-2',
                damage: '2',
              },
            ],
          },
        ],
        meleeWeapons: [],
        keywords: [],
        factions: [''],
      };
      break;
    default:
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
  getInvulValueFw,
  getInvulInfoFw,
};
