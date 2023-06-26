import fs from 'fs';

const readFile = (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');
  return res;
};

const pointsFile = readFile('points.txt');
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
    console.log('faction:', currentFaction);
  }

  return parsedData;
}

const points = parse40kData(pointsLines);

console.log(points);