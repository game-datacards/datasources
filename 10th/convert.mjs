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
// pdfToText.info('./spacemarines_index.pdf', function (err, data) {
//   if (err) throw err;
//   for (let index = 6; index < data.pages; index++) {
//     if (index % 2 === 1) {
//       const options = { from: index, to: index + 1,  };

//       pdfToText.pdfToText('./spacemarines_index.pdf', options, function (err, data) {
//         if (err) throw err;
//         let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
//         fs.writeFileSync(`./spacemarines/spacemarines_index-${index}.text`, text);
//       });
//     }
//   }
// });
// pdfToText.info('./blacktemplar_index.pdf', function (err, data) {
//   if (err) throw err;
//   for (let index = 6; index < data.pages; index++) {
//     if (index % 2 === 1) {
//       const options = { from: index, to: index + 1 };

//       pdfToText.pdfToText('./blacktemplar_index.pdf', options, function (err, data) {
//         if (err) throw err;
//         let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
//         fs.writeFileSync(`./blacktemplar/blacktemplar_index.pdf-${index}.text`, text);
//       });
//     }
//   }
// });
// pdfToText.info('./bloodangels_index.pdf', function (err, data) {
//   if (err) throw err;
//   for (let index = 6; index < data.pages; index++) {
//     if (index % 2 === 1) {
//       const options = { from: index, to: index + 1 };

//       pdfToText.pdfToText('./bloodangels_index.pdf', options, function (err, data) {
//         if (err) throw err;
//         let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
//         fs.writeFileSync(`./bloodangels/bloodangels_index.pdf-${index}.text`, text);
//       });
//     }
//   }
// });
// pdfToText.info('./spacewolves_index.pdf', function (err, data) {
//   if (err) throw err;
//   for (let index = 6; index < data.pages; index++) {
//     if (index % 2 === 1) {
//       const options = { from: index, to: index + 1 };

//       pdfToText.pdfToText('./spacewolves_index.pdf', options, function (err, data) {
//         if (err) throw err;
//         let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
//         fs.writeFileSync(`./spacewolves/spacewolves_index.pdf-${index}.text`, text);
//       });
//     }
//   }
// });
// pdfToText.info('./darkangels_index.pdf', function (err, data) {
//   if (err) throw err;
//   for (let index = 6; index < data.pages; index++) {
//     if (index % 2 === 1) {
//       const options = { from: index, to: index + 1 };

//       pdfToText.pdfToText('./darkangels_index.pdf', options, function (err, data) {
//         if (err) throw err;
//         let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
//         fs.writeFileSync(`./darkangels/darkangels_index.pdf-${index}.text`, text);
//       });
//     }
//   }
// });

function extractPDF(name, max = 0) {
  if (fs.existsSync(`./${name}_index.pdf`)) {
    console.log('Found index, extracting sheets.');
    pdfToText.info(`./${name}_index.pdf`, function (err, data) {
      if (err) throw err;
      if (max === 0) {
        max = data.pages;
      }
      for (let index = 6; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(`./${name}_index.pdf`, options, function (err, data) {
            if (err) throw err;
            let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
            fs.writeFileSync(`./${name}/${name}_index.pdf-${index}.text`, text);
          });
        }
      }
    });
  }
  if (fs.existsSync(`./${name}_fw.pdf`)) {
    console.log('Found FW index, extracting sheets.');
    pdfToText.info(`./${name}_fw.pdf`, function (err, data) {
      if (err) throw err;
      max = data.pages;
      for (let index = 1; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(`./${name}_fw.pdf`, options, function (err, data) {
            if (err) throw err;
            let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
            fs.writeFileSync(`./${name}/${name}_fw.pdf-${index}.text`, text);
          });
        }
      }
    });
  }
  if (fs.existsSync(`./${name}_fw2.pdf`)) {
    console.log('Found FW index, extracting sheets.');
    pdfToText.info(`./${name}_fw2.pdf`, function (err, data) {
      if (err) throw err;
      max = data.pages;
      for (let index = 1; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(`./${name}_fw2.pdf`, options, function (err, data) {
            if (err) throw err;
            let text = data.toString('utf8').replaceAll('', '---PAGE 2---\n\r');
            fs.writeFileSync(`./${name}/${name}_fw2.pdf-${index}.text`, text);
          });
        }
      }
    });
  }
}

// // extractPDF('deathwatch');
// // extractPDF('deathguard');
// // extractPDF('thousandsons');
// // extractPDF('worldeaters');
// // extractPDF('chaosdaemons');
// // extractPDF('chaos_spacemarines');
// extractPDF('chaosknights');
// extractPDF('spacemarines');

// // // extractPDF('titanlegions');
// extractPDF('greyknights');
// // extractPDF('adeptasororitas');
// // extractPDF('adeptusmechanicus');
// extractPDF('adeptuscustodes');
// // extractPDF('agents');
extractPDF('astramilitarum');
// extractPDF('imperialknights', 29);

// extractPDF('tau');
// extractPDF('aeldari');
// extractPDF('drukhari');
// extractPDF('necrons');
// extractPDF('tyranids');
// // extractPDF('gsc');
// extractPDF('orks');
// // extractPDF('votann');
