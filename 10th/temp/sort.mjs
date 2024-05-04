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

const file = JSON.parse(readFile('data-export-373.json'));

fs.writeFileSync(
  path.resolve(__dirname, `data-export-373.json`),
  JSON.stringify(sortObj(file), null, 2)
);
