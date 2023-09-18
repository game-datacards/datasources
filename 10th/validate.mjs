import fs from 'fs';

import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}

const readFile = (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  return res;
};

const schema = JSON.parse(readFile('./10th/validation/faction.scheme.json'));

const validate = ajv.compile(schema);

function parseAndLog(json) {
  const data = validate(json);
  console.log('Startin validation of: ', json.name);
  if (!data) {
    console.log(validate.errors); // error message from the last parse call
    fs.writeFileSync(`./validation/errors/${json.name}-errors.json`, JSON.stringify(validate.errors));
  } else {
    console.log('No errors');
    if (fs.existsSync(`./validation/errors/${json.name}-errors.json`)) {
      fs.unlinkSync(`./validation/errors/${json.name}-errors.json`);
    }
  }
}

function validateJson(name) {
  let json = readFile(`./10th/gdc/${name}.json`);
  parseAndLog(JSON.parse(json));
}

validateJson('deathguard');
validateJson('tyranids');
validateJson('space_marines');
validateJson('bloodangels');
validateJson('darkangels');
validateJson('blacktemplar');
validateJson('spacewolves');
validateJson('deathwatch');
validateJson('thousandsons');
validateJson('worldeaters');
validateJson('chaos_spacemarines');
validateJson('chaosdaemons');
validateJson('chaosknights');
validateJson('astramilitarum');
validateJson('imperialknights');
validateJson('greyknights');
validateJson('adeptasororitas');
validateJson('adeptusmechanicus');
validateJson('adeptuscustodes');
validateJson('agents');
validateJson('orks');
validateJson('votann');
validateJson('tau');
validateJson('necrons');
validateJson('aeldari');
validateJson('drukhari');
validateJson('gsc');
validateJson('titan');
validateJson('unaligned');
