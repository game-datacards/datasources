import fs from "fs";
import pdfToText from "pdf-to-text";

function extractPDF(name, max = 0, start = 6) {
  if (fs.existsSync(`./${name}_index.pdf`)) {
    if (!fs.existsSync(`./${name}`)) {
      fs.mkdirSync(`./${name}`);
    }
    console.log(`Found index, extracting sheets. ${name}`);
    pdfToText.info(`./${name}_index.pdf`, function (err, data) {
      if (err) throw err;
      if (max === 0) {
        max = data.pages;
      }
      for (let index = start; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(
            `./${name}_index.pdf`,
            options,
            function (err, data) {
              if (err) throw err;
              let text = data
                .toString("utf8")
                .replaceAll("", "---PAGE 2---\n\r");
              fs.writeFileSync(
                `./${name}/${name}_index.pdf-${index}.text`,
                text,
              );
            },
          );
        }
      }
    });
  }
  if (fs.existsSync(`./${name}_fw.pdf`)) {
    console.log("Found FW 1 index, extracting sheets.");
    pdfToText.info(`./${name}_fw.pdf`, function (err, data) {
      if (err) throw err;
      max = data.pages;
      for (let index = 0; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(
            `./${name}_fw.pdf`,
            options,
            function (err, data) {
              if (err) throw err;
              let text = data
                .toString("utf8")
                .replaceAll("", "---PAGE 2---\n\r");
              fs.writeFileSync(`./${name}/${name}_fw.pdf-${index}.text`, text);
            },
          );
        }
      }
    });
  }
  if (fs.existsSync(`./${name}_fw2.pdf`)) {
    console.log("Found FW 2 index, extracting sheets.");
    pdfToText.info(`./${name}_fw2.pdf`, function (err, data) {
      if (err) throw err;
      max = data.pages;
      for (let index = 1; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(
            `./${name}_fw2.pdf`,
            options,
            function (err, data) {
              if (err) throw err;
              let text = data
                .toString("utf8")
                .replaceAll("", "---PAGE 2---\n\r");
              fs.writeFileSync(`./${name}/${name}_fw2.pdf-${index}.text`, text);
            },
          );
        }
      }
    });
  }
  if (fs.existsSync(`./${name}_legends.pdf`)) {
    console.log("Found Legends 1 index, extracting sheets.");
    pdfToText.info(`./${name}_legends.pdf`, function (err, data) {
      if (err) throw err;
      max = data.pages;
      for (let index = 1; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(
            `./${name}_legends.pdf`,
            options,
            function (err, data) {
              if (err) throw err;
              let text = data
                .toString("utf8")
                .replaceAll("", "---PAGE 2---\n\r");
              fs.writeFileSync(
                `./${name}/${name}_legends.pdf-${index}.text`,
                text,
              );
            },
          );
        }
      }
    });
  }
  if (fs.existsSync(`./${name}_legends_02.pdf`)) {
    console.log("Found Legends 2 index, extracting sheets.");
    pdfToText.info(`./${name}_legends_02.pdf`, function (err, data) {
      if (err) throw err;
      max = data.pages;
      for (let index = 1; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(
            `./${name}_legends_02.pdf`,
            options,
            function (err, data) {
              if (err) throw err;
              let text = data
                .toString("utf8")
                .replaceAll("", "---PAGE 2---\n\r");
              fs.writeFileSync(
                `./${name}/${name}_legends2.pdf-${index}.text`,
                text,
              );
            },
          );
        }
      }
    });
  }
  if (fs.existsSync(`./${name}_legends_03.pdf`)) {
    console.log("Found Legends 03 index, extracting sheets.");
    pdfToText.info(`./${name}_legends_03.pdf`, function (err, data) {
      if (err) throw err;
      max = data.pages;
      for (let index = 1; index < max; index++) {
        if (index % 2 === 1) {
          const options = { from: index, to: index + 1 };

          pdfToText.pdfToText(
            `./${name}_legends_03.pdf`,
            options,
            function (err, data) {
              if (err) throw err;
              let text = data
                .toString("utf8")
                .replaceAll("", "---PAGE 2---\n\r");
              fs.writeFileSync(
                `./${name}/${name}_legends3.pdf-${index}.text`,
                text,
              );
            },
          );
        }
      }
    });
  }
}

// extractPDF('deathwatch');
// extractPDF('deathguard');
// extractPDF('thousandsons');
// extractPDF('worldeaters');
// extractPDF('chaosdaemons');
// extractPDF('chaos_spacemarines');
// extractPDF('chaosknights');
// extractPDF('spacemarines', 0, 218);

// extractPDF('bloodangels');
// extractPDF('darkangels');
// extractPDF('blacktemplar');
// extractPDF('spacewolves');

// // // extractPDF('titanlegions');
// extractPDF('greyknights');
// extractPDF('adeptasororitas');
// extractPDF('adeptusmechanicus');
// extractPDF('adeptuscustodes');
// extractPDF('agents', 0, 2);
// extractPDF('astramilitarum');
// extractPDF('imperialknights', 29);

// extractPDF('tau');
// extractPDF('aeldari');
// extractPDF('drukhari');
// extractPDF('necrons');
// extractPDF('tyranids');
// extractPDF('gsc');
// extractPDF('orks');
// extractPDF('votann');
// extractPDF('titan', 0, 2);
extractPDF("unaligned", 0, 0);
