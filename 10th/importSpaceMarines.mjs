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

const newMarinesFile = readFile("./10th/imports/imported_spacemarines.json");
const newMarines = sortObj(JSON.parse(newMarinesFile));

const oldMarinesFile = readFile("./10th/gdc/space_marines.json");
const oldMarines = sortObj(JSON.parse(oldMarinesFile));

let foundUnits = [];
let units = [];

newMarines.category.cards.map((card, index) => {
    delete card.isCustom;
    delete card.uuid;
    delete card.print_side;

    card.id = uuidv5(card.name, "142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e");

    units.push(card);
});

// for (var i = 0; i <= newMarines.category.cards.length - 1; i++) {
//   if (foundUnits.indexOf(i) == -1) {
//     missingUnits.push(newMarines.category.cards.slice(i, i + 1)[0]);
//   }
// }

// missingUnits.forEach((u) => {
//   u.id = uuidv5(u.name, "142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e");
//   console.log(u.name);
// });

const legendDatasheets = oldMarines.datasheets.filter((unit) => {
  if (unit.imperialArmour || unit.legends) {
    return true;
  }
  return false;
});
oldMarines.datasheets = [ ...units, ...legendDatasheets];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
fs.writeFileSync(
  path.resolve(__dirname, `gdc/space_marines.json`),
  JSON.stringify(sortObj(oldMarines), null, 2),
);
