import fs from 'fs';
import pdfToText from 'pdf-to-text';

// for (let index = 7; index < 95; index++) {
//   if (index % 2 === 1) {
//     const options = { from: index, to: index + 1 };

//     pdfToText.pdfToText('./tyranids_index.pdf', options, function (err, data) {
//       if (err) throw err;
//       let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
//       fs.writeFileSync(`./tyranids/tyranids-${index}.text`, text);
//     });
//   }
// }

// pdfToText.info('./marines_leviathan.pdf', function (err, data) {
//   if (err) throw err;
//   for (let index = 1; index < data.pages; index++) {
//     if (index % 2 === 1) {
//       const options = { from: index, to: index + 1 };

//       pdfToText.pdfToText('./marines_leviathan.pdf', options, function (err, data) {
//         if (err) throw err;
//         let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
//         fs.writeFileSync(`./marines_leviathan/marines_leviathan-${index}.text`, text);
//       });
//     }
//   }
// });
pdfToText.info('./spacemarines_index.pdf', function (err, data) {
  if (err) throw err;
  for (let index = 6; index < data.pages; index++) {
    if (index % 2 === 1) {
      const options = { from: index, to: index + 1,  };

      pdfToText.pdfToText('./spacemarines_index.pdf', options, function (err, data) {
        if (err) throw err;
        let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
        fs.writeFileSync(`./spacemarines/spacemarines_index-${index}.text`, text);
      });
    }
  }
});
