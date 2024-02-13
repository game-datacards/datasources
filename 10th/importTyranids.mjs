import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { v5 as uuidv5 } from "uuid";

import { sortObj } from "jsonabc";

const readFile = (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, "utf8");
  return res;
};

const newTyranidsFile = readFile("./10th/imports/imported_tyranids.json");
const newTyranids = sortObj(JSON.parse(newTyranidsFile));

const oldTyranidsFile = readFile("./10th/gdc/tyranids.json");
const oldTyranids = sortObj(JSON.parse(oldTyranidsFile));

let foundUnits = [];
let missingUnits = [];

newTyranids.category.cards.map((card, index) => {
  const foundNid = oldTyranids.datasheets.findIndex(
    (oldCard) => oldCard.name === card.name,
  );

  if (foundNid > -1) {
    delete card.isCustom;
    delete card.uuid;
    delete card.print_side;

    foundUnits.push(index);
    oldTyranids.datasheets[foundNid] = card;
  }
});
for (var i = 0; i <= newTyranids.category.cards.length - 1; i++) {
  if (foundUnits.indexOf(i) == -1) {
    missingUnits.push(newTyranids.category.cards.slice(i, i + 1)[0]);
  }
}

missingUnits.forEach((u) => {
  u.id = uuidv5(u.name, "142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e");
  console.log(u.name);
});

oldTyranids.datasheets = [...oldTyranids.datasheets, ...missingUnits];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
fs.writeFileSync(
  path.resolve(__dirname, `gdc/tyranids.json`),
  JSON.stringify(sortObj(oldTyranids), null, 2),
);
