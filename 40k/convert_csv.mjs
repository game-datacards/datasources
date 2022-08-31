import fs from 'fs';

import { stripHtml } from 'string-strip-html';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const readCsv = async (file, cleanTags = true) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  const cleanFields = [
    'name',
    'description',
    'type',
    'model',
    'base_size_descr',
    'unit_composition',
    'transport',
    'faction_name',
    'role',
    'game',
    'faction_type',
    'category',
    'legend',
    'phase',
    'abilities',
    'psyker',
    'priest',
  ];

  res = res
    .split('\r\n')
    .map((row, _index, allRows) => {
      const headers = allRows[0]
        .split('|')
        .slice(0, -1)
        .filter((h) => h);
      const obj = {};
      row
        .split('|')
        .slice(0, -1)
        .forEach((val, i) => {
          val = val.replace("'", '');

          if (cleanFields.includes(headers[i])) {
            val = stripHtml(val, {
              ignoreTags: ['table', 'tbody', 'td', 'th', 'tr', 'b', 'i', 'u', 'ul', 'li', 'br'],
            }).result;
            val = NodeHtmlMarkdown.translate(val);
          }

          obj[headers[i]] = val;
        });
      return obj;
    })
    .slice(1)
    .map((row) => row)
    .sort((a, b) => {
      if (a.hasOwnProperty('id')) {
        return a.id.localeCompare(b.id);
      }
      if (a.hasOwnProperty('faction_id')) {
        return a.faction_id.localeCompare(b.faction_id);
      }
      if (a.hasOwnProperty('wargear_id')) {
        return a.wargear_id.localeCompare(b.wargear_id);
      }
      if (a.hasOwnProperty('datasheet_id')) {
        return a.datasheet_id.localeCompare(b.datasheet_id);
      }
      if (a.hasOwnProperty('stratagem_id')) {
        return a.stratagem_id.localeCompare(b.stratagem_id);
      }
      return 1;
    })
    .slice(0, -1);

  fs.writeFileSync(`./json/${file.replace('.csv', '')}.json`, JSON.stringify(res, null, 2));
};

fs.readdir('./', function (err, files) {
  files.forEach(function (file) {
    if (file.indexOf('.csv') > -1) {
      if (file === 'Datasheets_keywords.csv') {
        readCsv(file, false);
      } else {
        readCsv(file);
      }
    }
  });
});
