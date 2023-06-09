import fs from 'fs';
import pdfToText from 'pdf-to-text';

for (let index = 7; index < 95; index++) {
  if (index % 2 === 1) {
    const options = { from: index, to: index };

    pdfToText.pdfToText('./tyranids_index.pdf', options, function (err, data) {
      if (err) throw err;
      fs.writeFileSync(`./tyranids/tyranids-${index}.text`, data);
    });
  }
}

pdfToText.info('./marines_leviathan.pdf', function (err, data) {
  if (err) throw err;
  for (let index = 1; index < data.pages; index++) {
    if (index % 2 === 1) {
      const options = { from: index, to: index };

      pdfToText.pdfToText('./marines_leviathan.pdf', options, function (err, data) {
        if (err) throw err;
        fs.writeFileSync(`./marines_leviathan/marines_leviathan-${index}.text`, data);
      });
    }
  }
});
