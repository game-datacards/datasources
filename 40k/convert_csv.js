const fs = require('fs');

const readCsv = async (file, cleanTags = true) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(file, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  res = res
    .split('\r\n')
    .map((row, _index, allRows) => {
      const headers = allRows[0].split('|').slice(0, -1).filter( h => h);
      const obj = {};
      row.split('|').slice(0, -1).forEach((val, i) => {
        val = val.replace("'", '');

        if(cleanTags) {
          val = val.replace(/(<([^>]+)>)/gi, '');
        } else {
          val = val.replace("<", '&#60;').replace(">", '&#62;');
        }

        obj[headers[i]] = val;
      });
      return obj;
    })
    .slice(1)
    .map( (row) => row)
    .slice(0,-1);

  fs.writeFileSync(`./json/${file.replace('.csv', '')}.json`, JSON.stringify(res, null, 2));
};

fs.readdir("./", function (err, files) {

  files.forEach(function (file) {
    if(file.indexOf('.csv') > -1) {
      if(file === "Datasheets_keywords.csv") {
        readCsv(file, false);
      } else {
        readCsv(file);
      }
    }
  })
});
