import fs from 'fs';
import clone from 'just-clone';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const readJson = async (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  return JSON.parse(res);
};

const lastUpdated = await readJson('./json/Last_update.json');

const dataDatasheetAbilities = await readJson('./json/Datasheets_abilities.json');
const dataStratagems = await readJson('./json/Stratagems.json');
const dataAbilities = await readJson('./json/Abilities.json');
const dataDatasheetWargear = await readJson('./json/Datasheets_wargear.json');
const dataWargearList = await readJson('./json/Wargear_list.json');
const dataWargear = await readJson('./json/Wargear.json');
const dataModels = await readJson('./json/Datasheets_models.json');
const dataKeywords = await readJson('./json/Datasheets_keywords.json');
const dataDamage = await readJson('./json/Datasheets_damage.json');
const dataFactions = await readJson('./json/Factions.json');
const sheets = await readJson('./json/Datasheets.json');
const dataSecondaries = await readJson('./json/Secondaries.json');
const dataPsychic = await readJson('./json/PsychicPowers.json');

dataFactions.sort((a, b) => a.name.localeCompare(b.name));

const mainFactions = dataFactions.filter((faction) => faction.is_subfaction === 'false');

const mappedStratagems = dataStratagems.map((stratagem) => {
  stratagem['cardType'] = 'stratagem';
  stratagem['source'] = '40k';
  if (stratagem.faction_id === stratagem.subfaction_id) {
    stratagem['subfaction_id'] = undefined;
  }
  return stratagem;
});

const mappedSecondaries = dataSecondaries.map((secondary) => {
  secondary['cardType'] = 'secondary';
  secondary['source'] = '40k';
  return secondary;
});

const mappedPsychicPowers = dataPsychic.map((power) => {
  power['cardType'] = 'psychic';
  power['source'] = '40k';
  return power;
});

mappedSecondaries.sort((a, b) => a.category.localeCompare(b.category));

const mappedSheets = sheets.map((row) => {
  row['cardType'] = 'datasheet';
  row['source'] = '40k';
  row['keywords'] = [
    ...new Map(
      dataKeywords
        .filter((keyword) => keyword.datasheet_id === row.id)
        .map((model) => {
          return { ...model, active: true };
        })
        .map((item) => [item['keyword'], item])
    ).values(),
  ];
  row['datasheet'] = dataModels
    .filter((model) => model.datasheet_id === row.id)
    .filter(onlyUnique)
    .map((model, index) => {
      return { ...model, active: index === 0 ? true : false };
    });

  const linkedDamageTable = dataDamage.filter((damage) => damage.datasheet_id === row.id);
  for (let index = 1; index < linkedDamageTable.length; index++) {
    const cols = linkedDamageTable[0];
    const newRow = {};

    newRow['W'] = linkedDamageTable[index]['Col1'];
    newRow[cols['Col2']] = linkedDamageTable[index]['Col2'];
    newRow[cols['Col3']] = linkedDamageTable[index]['Col3'];
    newRow[cols['Col4']] = linkedDamageTable[index]['Col4'];
    if (cols['Col5']) {
      newRow[cols['Col5']] = linkedDamageTable[index]['Col5'];
    }
    newRow['name'] = `Wound profile ${linkedDamageTable[index]['Col1']}`;
    row['datasheet'].push(newRow);
  }

  const linkedWargear = [
    ...new Map(
      dataDatasheetWargear
        .filter((wargear) => wargear.datasheet_id === row.id && wargear.is_index_wargear === 'false')
        .map((item) => [item['wargear_id'], item])
    ).values(),
  ];

  row['wargear'] = [];
  linkedWargear.forEach((wargear, index) => {
    row['wargear'][index] = clone(dataWargear.find((gear) => gear.id === wargear.wargear_id));
    if (row['wargear'][index]) {
      row['wargear'][index]['active'] = index === 0 ? true : false;
      row['wargear'][index]['profiles'] = clone(
        dataWargearList.filter((wargearList) => wargearList.wargear_id === wargear.wargear_id)
      );
    }
  });
  const linkedAbilities = dataDatasheetAbilities.filter((ability) => ability.datasheet_id === row.id);
  row['abilities'] = [];
  linkedAbilities.forEach((ability, index) => {
    row['abilities'].push(dataAbilities.find((abilityInfo) => abilityInfo.id === ability.ability_id));
  });
  row['abilities'] = row['abilities'].map((ability, index) => {
    return {
      ...ability,
      showDescription: false,
      showAbility: index === 0 ? true : false,
    };
  });
  return row;
});
mappedSheets.shift();
mainFactions.map((faction) => {
  faction['subfactions'] = dataFactions.filter((subfaction) => subfaction.parent_id === faction.id);

  faction['datasheets'] = mappedSheets
    .filter((datasheet) => datasheet.faction_id === faction.id)
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  faction['stratagems'] = mappedStratagems
    .filter((stratagem) => stratagem.faction_id === faction.id)
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  faction['psychicpowers'] = mappedPsychicPowers
    .filter((power) => power.faction_id === faction.id)
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  faction['secondaries'] = mappedSecondaries.filter((secondary) => {
    return (
      secondary.game === 'War Zone Nephilim: Grand Tournament' &&
      (secondary.faction_id === '' ||
        secondary.faction_id === faction.id ||
        faction.subfactions.map((subfaction) => subfaction.id).includes(secondary.faction_id))
    );
  });

  return faction;
});

fs.writeFileSync(
  `./json/mapped_factions.json`,
  JSON.stringify(
    {
      data: mainFactions,
      version: process.env.REACT_APP_VERSION,
      lastUpdated: lastUpdated[0].last_update,
      lastCheckedForUpdate: new Date().toISOString(),
    },
    null,
    2
  )
);
