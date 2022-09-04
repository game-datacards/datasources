const fs = require('fs');

var xml2js = require('xml2js');
var parser = new xml2js.Parser({ mergeAttrs: true, explicitArray: false });

const parseString = parser.parseString;

const readCsv = async (file) => {
  if (!file) {
    return;
  }
  let res = fs.readFileSync(`./cat/${file}`, 'utf8');

  res = res.toString('utf8').replace(/^\uFEFF/, '');

  parseString(res, function (err, result) {
    fs.writeFileSync(`cat/${file.replace('.cat', '')}.json`, JSON.stringify(result, null, 2));
  });
};

fs.readdir("./cat", function (err, files) {

  files.forEach(function (file) {
    if(file.indexOf('.cat') > -1) {
      readCsv(file);
    }
  })
});
