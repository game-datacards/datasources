import { v5 as uuidv5 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { sortObj } from 'jsonabc';

const readFile = (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');
  return res;
};

function getPointsExport(fileName) {
  const oldParsedUnitsFile = readFile(fileName);
  const oldParsedUnits = sortObj(JSON.parse(oldParsedUnitsFile));

  let points = ['name, models, cost'];

  oldParsedUnits.datasheets.sort((a, b) => a.name.localeCompare(b.name));

  oldParsedUnits.datasheets.map((unit) => {
    unit.points.sort((a, b) => a.models - b.models);
    unit.points.map((point) => {
      points.push(`${unit.name}, ${point.models}, ${point.cost}`);
    });
  });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  fs.writeFileSync(path.resolve(__dirname, 'points.json'), points.map((p) => `${p}\n`).join(''));
}

// parseDataExport('./gdc/darkangels.json', 'Dark Angels');

// parseDataExport('./gdc/deathguard.json', 'Death Guard');
// parseDataExport('./gdc/tyranids.json', 'Tyranids');
// parseDataExport('./gdc/space_marines.json', 'Adeptus Astartes');

// parseDataExport('./gdc/bloodangels.json', 'Blood Angels');
// parseDataExport('./gdc/blacktemplar.json', 'Black Templars');
// parseDataExport('./gdc/spacewolves.json', 'Space Wolves');
// parseDataExport('./gdc/deathwatch.json', 'Deathwatch');
// parseDataExport('./gdc/thousandsons.json', 'Thousand Sons');
// parseDataExport('./gdc/worldeaters.json', 'World Eaters');
// parseDataExport('./gdc/chaos_spacemarines.json', 'Heretic Astartes');
// parseDataExport('./gdc/chaosdaemons.json', 'Legiones Daemonica');
// parseDataExport('./gdc/chaosknights.json', 'Chaos Knights');

// parseDataExport('./gdc/astramilitarum.json', 'Astra Militarum');
// parseDataExport('./gdc/imperialknights.json', 'Imperial Knights');
// parseDataExport('./gdc/greyknights.json', 'Grey Knights');
// parseDataExport('./gdc/adeptasororitas.json', 'Adepta Sororitas');

// parseDataExport('./gdc/adeptusmechanicus.json', 'Adeptus Mechanicus');
// parseDataExport('./gdc/adeptuscustodes.json', 'Adeptus Custodes');
// parseDataExport('./gdc/agents.json', 'Agents of the Imperium');
// parseDataExport('./gdc/orks.json', 'Orks');
// parseDataExport('./gdc/votann.json', 'Leagues of Votann');
getPointsExport('./gdc/tau.json', 'T’au Empire');
// parseDataExport('./gdc/necrons.json', 'Necrons');
// parseDataExport('./gdc/aeldari.json', 'Aeldari');
// parseDataExport('./gdc/drukhari.json', 'Drukhari');

// parseDataExport('./gdc/gsc.json', 'Genestealer Cults');

// parseDataExport('./gdc/titan.json', 'Adeptus Titanicus');

// parseDataExport('./gdc/space_marines.json', 'Salamanders');
// parseDataExport('./gdc/space_marines.json', 'Imperial Fists');
// parseDataExport('./gdc/space_marines.json', 'Iron Hands');
// parseDataExport('./gdc/space_marines.json', 'Ultramarines');
// parseDataExport('./gdc/space_marines.json', 'Raven Guard');
// parseDataExport('./gdc/space_marines.json', 'White Scars');

// parseDataExport('./gdc/unaligned.json', 'Unaligned Forces');
