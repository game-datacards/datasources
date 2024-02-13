import fs from "fs";
import { sortObj } from "jsonabc";
import path from "path";

import { fileURLToPath } from "url";

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

const pointsFile = readFile('./points/points_for_extract1.3.val');
const pointsLines = pointsFile.split(/\r?\n/);

function parse40kData(lines) {
  let currentFaction = null;
  let currentUnit = null;
  const parsedData = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    if (line.includes('pts')) {
      let match = line.match(/(\d+) models?.*?(\d+) pts/);
      let numModels, cost;

      if (match) {
        [, numModels, cost] = match;
      } else {
        match = line.match(/(.*?)(\d+) pts/);
        numModels = '1';
        [, currentUnit, cost] = match;
        currentUnit = currentUnit.trim();
      }

      parsedData.push([currentFaction, currentUnit.toLowerCase(), numModels, cost]);
    } else {
      if (currentFaction === null) {
        currentFaction = line;
      } else if (i + 1 < lines.length && !lines[i + 1].includes('pts')) {
        currentFaction = line;
      } else {
        currentUnit = line;
      }
    }
  }

  return parsedData;
}

const points = parse40kData(pointsLines);

function updatePoints(name) {
  let json = readFile(`./gdc/${name}.json`);

  const data = JSON.parse(json);

  data.datasheets.map((card, index) => {
    const unitPoints = points
      .filter((pointsLine) => {
        return pointsLine[1].toLowerCase() === (card.subname ? card.name + ' ' + card.subname : card.name).toLowerCase();
      })
      .map((pointsLine) => {
        let numModels, cost;
        [, , numModels, cost] = pointsLine;
        return { models: numModels, cost, active: true };
      });

    data.datasheets[index] = { ...card, points: unitPoints };
  });
  
  fs.writeFileSync(`./10th/gdc/${name}.json`,JSON.stringify(sortObj(data), null, 2));
}

updatePoints('deathguard');
updatePoints('tyranids');
updatePoints('space_marines');
updatePoints('bloodangels');
updatePoints('darkangels');
updatePoints('blacktemplar');
updatePoints('spacewolves');
updatePoints('deathwatch');
updatePoints('thousandsons');
updatePoints('worldeaters');
updatePoints('chaos_spacemarines');
updatePoints('chaosdaemons');
updatePoints('chaosknights');
updatePoints('astramilitarum');
updatePoints('imperialknights');
updatePoints('greyknights');
updatePoints('adeptasororitas');
updatePoints('adeptusmechanicus');
updatePoints('adeptuscustodes');
updatePoints('agents');
updatePoints('orks');
updatePoints('votann');
updatePoints('tau');
updatePoints('necrons');
updatePoints('aeldari');
updatePoints('drukhari');
updatePoints('gsc');
updatePoints('titan');
updatePoints('unaligned');
