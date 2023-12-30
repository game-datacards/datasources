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
  let res = fs.readFileSync(path.resolve(__dirname, file), "utf8");

  res = res.toString("utf8").replace(/^\uFEFF/, "");

  return res;
};

const enhancements = JSON.parse(readFile("./enhancements/enhancements.json"));

const stripped = enhancements.map( (e) => { return { faction_id: e.faction_id, detachments: [] } });

fs.writeFileSync(
  path.resolve(__dirname, `enhancements/enhancements_sorted.json`),
  JSON.stringify(sortObj(stripped), null, 2),
);