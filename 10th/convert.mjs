import fs from 'fs';
import pdfToText from 'pdf-to-text';

for (let index = 7; index < 88; index++) {
  if (index % 2 === 1) {
    const options = { from: index, to: index };

    pdfToText.pdfToText('./tyranids_index.pdf', options, function (err, data) {
      if (err) throw err;
      fs.writeFileSync(`tyranids-${index}.text`, data);
    });
  }
}
