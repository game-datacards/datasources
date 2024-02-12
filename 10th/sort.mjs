import fs from 'fs';

import { sortObj } from 'jsonabc';

import path from 'path';
import { fileURLToPath } from 'url';

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

const enhancements = JSON.parse(readFile('./enhancements/enhancements.json'));

// const sorted = enhancements.sort( () => { return { faction_id: e.faction_id, detachments: [] } });

enhancements.sort((a, b) => {
  b.faction_id.localeCompare(a.faction_id);
});
enhancements.map((e) => {
  e.enhancements.sort((a, b) => {
    a.detachment?.localeCompare(b.detachment);
  });
});

fs.writeFileSync(
  path.resolve(__dirname, `enhancements/enhancements_sorted.json`),
  JSON.stringify(enhancements, null, 2)
);
