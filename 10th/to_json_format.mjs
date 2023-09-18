import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
import data from './stratagems/index.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(path.resolve(__dirname, file), 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  return res;
};

function cleanForJson(name) {
  let lines = readFile(`./gdc/${name}.json`);
  lines = lines.replaceAll('"cardType": "DataCard",', '');
  lines = lines.replaceAll('"cardType": "DataCard",', '');
  lines = lines.replaceAll('"active": true,', '');
  lines = lines.replaceAll('"active": true', '');
  lines = lines.replaceAll('"showInvulnerableSave": true,', '');
  lines = lines.replaceAll('"showInvulnerableSave": false,', '');
  lines = lines.replaceAll('"showInfo": false', '');
  lines = lines.replaceAll('"showInfo": true', '');
  lines = lines.replaceAll('"showAbility": true,', '');
  lines = lines.replaceAll('"showAbility": true', '');
  lines = lines.replaceAll('"showDescription": false,', '');
  lines = lines.replaceAll('"showDescription": true,', '');
  lines = lines.replaceAll('"showDescription": false', '');
  lines = lines.replaceAll('"showDescription": true', '');
  lines = lines.replaceAll('"showDamagedAbility": false,', '');
  lines = lines.replaceAll('"showDamagedAbility": true,', '');
  lines = lines.replaceAll('"showDamagedMarker": false,', '');
  lines = lines.replaceAll('"showDamagedMarker": true,', '');
  lines = lines.replaceAll('"showName": false,', '');
  lines = lines.replaceAll('"showName": true,', '');
  lines = lines.replaceAll('"active": true,', '');
  lines = lines.replaceAll('"active": false,', '');
  lines = lines.replaceAll('"active": true', '');
  lines = lines.replaceAll('"active": false', '');

  fs.writeFileSync(path.resolve(__dirname, `json/${name}.json`), lines);
}

cleanForJson('deathguard');
cleanForJson('tyranids');
cleanForJson('space_marines');
cleanForJson('bloodangels');
cleanForJson('darkangels');
cleanForJson('blacktemplar');
cleanForJson('spacewolves');
cleanForJson('deathwatch');
cleanForJson('thousandsons');
cleanForJson('worldeaters');
cleanForJson('chaos_spacemarines');
cleanForJson('chaosdaemons');
cleanForJson('chaosknights');
cleanForJson('astramilitarum');
cleanForJson('imperialknights');
cleanForJson('greyknights');
cleanForJson('adeptasororitas');
cleanForJson('adeptusmechanicus');
cleanForJson('adeptuscustodes');
cleanForJson('agents');
cleanForJson('orks');
cleanForJson('votann');
cleanForJson('tau');
cleanForJson('necrons');
cleanForJson('aeldari');
cleanForJson('drukhari');
cleanForJson('gsc');
cleanForJson('titan');
cleanForJson('unaligned');
