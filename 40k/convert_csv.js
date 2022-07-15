const fs = require('fs');

const readCsv = async (file) => {
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
        obj[headers[i]] = val.replace("'", '').replace(/(<([^>]+)>)/gi, '');
      });
      return obj;
    })
    .slice(1)
    .map( (row) => row)
    .slice(0,-1);

  fs.writeFileSync(`40k/json/${file.replace('.csv', '')}.json`, JSON.stringify(res, null, 2));
};

fs.readdir("./", function (err, files) {

  files.forEach(function (file) {
    if(file.indexOf('.csv') > -1) {
      readCsv(file);
    }
  })
});
