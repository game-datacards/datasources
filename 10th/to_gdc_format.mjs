import fs from "fs";

import { sortObj } from "jsonabc";

import { v5 as uuidv5 } from "uuid";
import {
  checkForManualFixes,
  fixFactionKeywords,
  getAlliedInfo,
  getFactionName,
  getInvulInfo,
  getInvulInfoFw,
  getInvulValue,
  getInvulValueFw,
  getKeywords,
  getLeader,
  getName,
  getPrimarchAbilities,
  getSpecialAbilities,
  getStartOfBlock,
  getStartOfBlockList,
  getStartOfWeaponsBlock,
  getTransport,
  getUnitComposition,
  getUnitFluff,
  getUnitKeywords,
  getUnitLoadout,
  getWargear,
  getWeaponEndline,
  includesString,
} from "./conversion.helpers.js";

import path from "path";
import { fileURLToPath } from "url";
import data from "./stratagems/index.mjs";

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
const skippedNames = ["aegis defence line", "mekboy workshop", "webway gate"];

const PRIMARCH_ABILITIES_LIST = [
  "AUTHOR OF THE CODEX",
  "RELICS OF THE EMPEROR ASCENDANT",
  "PRIMARCH OF THE FIRST LEGION",
  "CRIMSON KING",
  "WRATHFUL PRESENCE",
  "WARMASTER",
  "DAEMONIC ALLEGIANCE",
  "SHADOW FORM ABILITIES",
  "HOST OF PLAGUES",
  "RELICS OF THE MATRIARCHS",
  "CANTICLES OF THE OMNISSIAH",
  "TRIARCH ABILITIES",
  "FORTIFICATION",
  "MIGHTY EDIFICE",
];

const specialWeaponKeywords = [
  {
    name: "Reverberating Summons",
    description:
      'Each time a model is destroyed by this weapon, you can select one friendly Plaguebearers unit within 12" of the bearer and return 1 destroyed Plaguebearer model to that unit.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Dead Choppy",
    description:
      "The Attacks characteristic of this weapon is increased by 1 for each additional dread klaw this model is equipped with.",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Snagged",
    description:
      "Each time this weapon scores a hit against an enemy Monster or Vehicle unit, until the end of the turn, if the bearer selects that unit as a target of a charge, add 2 to Charge rolls made for the bearer.",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Impaled",
    description:
      "Each time this weapon scores a hit against an enemy Monster or Vehicle unit, until the end of the turn, if the bearer selects that unit as a target of a charge, add 2 to Charge rolls made for the bearer",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Conversion",
    description:
      'Each time an attack made with this weapon targets a unit more than 12" from the bearer, an unmodified successful Hit roll of 4+ scores a Critical Hit.',
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Hive Defences",
    description:
      "Each time an enemy unit is set up or ends a Normal, Advance or Fall Back move within range of this weapon, if that enemy unit is an eligible target, the bearer can shoot with this weapon at that unit as if it were your Shooting phase (the bearer can do so up to four times per phase).",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "One Shot",
    description: "The bearer can only shoot with this weapon once per battle.",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Hooked",
    description:
      "Each time the bearer makes an attack with this weapon that targets a Monster or Vehicle unit, if a hit is scored, until the end of the turn, if the bearer selects that unit as a target of a charge, add 2 to Charge rolls made for the bearer and enemy units cannot use the Fire Overwatch Stratagem to shoot at the bearer.",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Linked Fire",
    description:
      "When selecting targets for this weapon, you can measure range and determine visibility from another friendly Fire Prism model that is visible to the bearer.",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Psychic Assassin",
    description:
      "Each time you select a Psyker unit as the target for this weapon, until those attacks are resolved, change the Attacks characteristic of this weapon to 6.",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Plasma Warhead",
    description:
      "The bearer can only shoot with this weapon in your Shooting phase, and only if it  this model is selected to shoot, if it has not shot with its Remained Stationary this turn and you did not use its Deathstrike Missile ability to Designate Target",
    showAbility: true,
    showDescription: true,
  },
  {
    name: "Defensive Array",
    description:
      "Each time an enemy unit is set up or ends a Normal, Advance or Fall Back move within range of this weapon, if that enemy unit is an eligible target, the bearer can shoot this weapon at that target as if it were your Shooting phase. The bearer can shoot up to four times in this way in your opponent’s Movement phase.",
    showAbility: true,
    showDescription: true,
  },
];

const pointsFile = readFile("./points/points_for_extract1.2.val");
const pointsLines = pointsFile.split(/\r?\n/);
const enhancements = JSON.parse(readFile("./enhancements/enhancements.json"));
const detachments = JSON.parse(readFile("./detachments/detachments.json"));

function parse40kData(lines) {
  let currentFaction = null;
  let currentUnit = null;
  const parsedData = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      continue;
    }

    if (line.includes("pts")) {
      let match = line.match(/(\d+) models?.*?(\d+) pts/);
      let numModels, cost;

      if (match) {
        [, numModels, cost] = match;
      } else {
        match = line.match(/(.*?)(\d+) pts/);
        numModels = "1";
        [, currentUnit, cost] = match;
        currentUnit = currentUnit.trim();
      }

      parsedData.push([
        currentFaction,
        currentUnit.toLowerCase(),
        numModels,
        cost,
      ]);
    } else {
      if (currentFaction === null) {
        currentFaction = line;
      } else if (i + 1 < lines.length && !lines[i + 1].includes("pts")) {
        currentFaction = line;
      } else {
        currentUnit = line;
      }
    }
  }

  return parsedData;
}

const points = parse40kData(pointsLines);

const convertTextToJson = (
  inputFolder,
  outputFile,
  factionId,
  factionName,
  header,
  banner,
  lineOfStats,
) => {
  const units = [];
  if (!inputFolder) {
    return;
  }

  inputFolder = path.resolve(__dirname, `./conversion${inputFolder}`);
  fs.readdir(inputFolder, function (err, files) {
    console.log(inputFolder);
    for (const [index, file] of files.entries()) {
      if (file.indexOf(".text") > -1) {
        console.log(file);
        let res = readFile(inputFolder + "/" + file);
        res = res.replaceAll("", " ");
        res = res.replaceAll("I  nfantry", "Infantry");
        res = res.replaceAll("V  ehicle", "Vehicle");
        res = res.replaceAll(
          "IGNORES COVER. TORRENT",
          "IGNORES COVER, TORRENT",
        );
        res = res.replaceAll("TWIN -LINKED", "TWIN-LINKED");
        res = res.replaceAll("DEVESTATING WOUNDS", "DEVASTATING WOUNDS");
        res = res.replaceAll("DEVASTATIG WOUNDS", "DEVASTATING WOUNDS");
        res = res.replaceAll("ANTI-VECHILE 3+", "ANTI-VEHICLE 3+");
        res = res.replaceAll("Walker Smoke", "Walker,Smoke");
        let pages = res.split("---PAGE 2---");
        let splitText = pages[0].replaceAll("\u0007", "").split("\n");

        let name = getName(splitText[0].toLowerCase());
        let legends = false;
        let imperialArmour = file.indexOf("_fw") > -1;
        if (name.includes("Wa R Ha M M E R L E G E N D S")) {
          name = name.split("Wa R Ha M M E R L E G E N D S")[0].trim();
          legends = true;
        }

        if (skippedNames.includes(name.toLowerCase())) {
          continue;
        }

        let damageRange;
        let damageTableDescription = "";
        let ordersDescription = "";

        let startOfAbilities = getStartOfBlock(splitText, "FACTION:");

        if (startOfAbilities.line === 0) {
          startOfAbilities = getStartOfBlock(splitText, "CORE:");
        }
        if (startOfAbilities.line === 0) {
          startOfAbilities = getStartOfBlock(splitText, "ABILITIES");
        }

        if (file === "spacemarines_index-51.text") {
          startOfAbilities = { line: 8, pos: 118 };
        }
        if (file === "spacemarines_index-217.text") {
          //ADEPTUS ASTARTES ARMOURY
          startOfAbilities = { line: -1, pos: 136 };
        }
        if (file === "blacktemplar_index.pdf-35.text") {
          //BLACK TEMPLARS ARMOURY
          startOfAbilities = { line: -1, pos: 121 };
        }
        if (file === "spacewolves_index.pdf-77.text") {
          //SPACE WOLVES ARMOURY
          startOfAbilities = { line: -1, pos: 118 };
        }
        if (file === "deathwatch_index.pdf-29.text") {
          //DEATH WATCH ARMOURY
          startOfAbilities = { line: -1, pos: 118 };
        }
        if (file === "chaos_spacemarines_index.pdf-105.text") {
          //HERETIC ASTARTES ARMOURY
          startOfAbilities = { line: -1, pos: 120 };
        }
        if (file === "astramilitarum_index.pdf-127.text") {
          //Astra Militarum Infantry Armoury
          startOfAbilities = { line: -1, pos: 127 };
        }
        if (file === "adeptasororitas_index.pdf-71.text") {
          //ADEPTA SORORITAS ARMOURY
          startOfAbilities = { line: -1, pos: 118 };
        }

        let startOfWargearAbilities = getStartOfBlock(
          splitText,
          "WARGEAR ABILITIES",
        );

        let startOfDamage = getStartOfBlock(splitText, "DAMAGED:");

        let startOfOrders = getStartOfBlock(splitText, "ORDERS");
        let startOfRanged = getStartOfWeaponsBlock(splitText, "RANGED WEAPONS");
        let startOfMelee = getStartOfWeaponsBlock(splitText, "MELEE WEAPONS");
        let startOfPrimarch = getStartOfBlockList(
          splitText,
          PRIMARCH_ABILITIES_LIST,
        );
        let coreKeywords = getKeywords(splitText, "CORE:");
        let factionName = getFactionName(splitText);
        let factionKeywords = getKeywords(splitText, "FACTION:");
        let invul = getInvulValue(splitText);
        let invulInfo = getInvulInfo(splitText);
        let keywords = getUnitKeywords(splitText, startOfAbilities);
        let endOfStats = 7;

        if (file.includes("_fw") || file.includes("_legends")) {
          let startOfInvul = getStartOfBlock(splitText, "INVULNERABLE SAVE");
          startOfRanged = getStartOfWeaponsBlock(splitText, "RANGED WEAPON");
          startOfMelee = getStartOfWeaponsBlock(splitText, "MELEE WEAPON");
          if (startOfInvul.line > 0) {
            endOfStats = startOfInvul.line;
          } else {
            if (startOfRanged.line > 0) {
              endOfStats = startOfRanged.line;
            }
          }

          invulInfo = getInvulInfoFw(splitText);
          invul = getInvulValueFw(splitText);
        } else {
          if (startOfRanged.line > 0) {
            endOfStats = startOfRanged.line;
          }
        }
        if (startOfRanged.endLine > 0 && startOfMelee.line > 0) {
          startOfRanged.endLine = startOfMelee.line - 1;
        }
        if (startOfMelee.line > 0) {
          startOfMelee.endLine = getWeaponEndline(splitText);
        }
        const stats = [];

        for (let index = 2; index < endOfStats; index++) {
          const splitStats = splitText[index].split(" ").filter((val) => val);
          if (splitStats.length >= 7) {
            stats.push({
              m: splitStats[0],
              t: splitStats[1],
              sv: splitStats[2],
              w: splitStats[3],
              ld: splitStats[4],
              oc: splitStats[5],
              name: splitStats.slice(6).join(" "),
              showDamagedMarker: false,
              showName: true,
              active: true,
            });
          }
          if (splitStats.length === 6) {
            stats.push({
              m: splitStats[0],
              t: splitStats[1],
              sv: splitStats[2],
              w: splitStats[3],
              ld: splitStats[4],
              oc: splitStats[5],
              name,
              showDamagedMarker: false,
              showName: false,
              active: true,
            });
          }
        }

        splitText.forEach((line, index) => {
          const foundDamage = line.indexOf("DAMAGED:");
          if (foundDamage > -1) {
            damageRange = line
              .substring(foundDamage + "DAMAGED:".length)
              .trim();
            startOfDamage = {
              line: index,
              pos: line.indexOf("DAMAGED:"),
              endLine: splitText.length,
            };
          }
        });

        let abilities = [];

        try {
          if (startOfAbilities.line > 0) {
            for (
              let index = startOfAbilities.line + 1;
              index < splitText.length;
              index++
            ) {
              let line = splitText[index].substring(startOfAbilities.pos);

              if (
                line.indexOf("INVULNERABLE SAVE") > -1 ||
                line.indexOf("FACTION KEYWORDS") > -1 ||
                line.indexOf("DAMAGED:") > -1 ||
                line.indexOf("WARGEAR ABILITIES") > -1 ||
                line.indexOf("ORDERS") > -1
              ) {
                break;
              }
              if (line.length === 0) {
                continue;
              }

              if (
                line.includes(":") &&
                !line.includes("D6") &&
                !line.includes("phase:") &&
                !line.includes("model:") &&
                !line.includes("following:") &&
                !line.includes("army:") &&
                !line.includes("(see reverse):") &&
                !line.includes("result:") &&
                !line.includes("0CP:") &&
                !line.includes("■") &&
                !line.includes("Designer’s Note") &&
                !line.includes("Warlord:") &&
                !line.includes("that unit:") &&
                !line.includes("Daemon keyword:") &&
                !line.includes(" attacks:") &&
                !line.includes("unit:") &&
                !line.includes("shrieker cannon:") &&
                !line.includes("this turn:") &&
                !line.includes("Leadership test:") &&
                !line.includes("abilities:") &&
                !line.includes("range of it:")
              ) {
                abilities.push({
                  name: line.substring(0, line.indexOf(":")).trim(),
                  description: line.substring(line.indexOf(":") + 1).trim(),
                  showAbility: true,
                  showDescription: true,
                });
              } else {
                if (abilities.length > 0) {
                  abilities[abilities.length - 1].description =
                    abilities[abilities.length - 1].description +
                    " " +
                    line.trim();
                }
              }
            }
          }
        } catch (error) {
          console.log("error", error);
        }

        let wargearAbilities = [];
        if (startOfWargearAbilities.line > 0) {
          try {
            for (
              let index = startOfWargearAbilities.line + 1;
              index < splitText.length;
              index++
            ) {
              let line = splitText[index].substring(
                startOfWargearAbilities.pos,
              );
              if (
                line.indexOf("INVULNERABLE SAVE") > -1 ||
                line.indexOf("FACTION KEYWORDS") > -1 ||
                line.indexOf("DAMAGED:") > -1 ||
                line.indexOf("Designer’s Note") > -1 ||
                line.indexOf("WARGEAR ABILITIES") > -1
              ) {
                break;
              }
              if (line.length === 0) {
                continue;
              }

              if (
                line.indexOf(":") > -1 &&
                !line.includes("D6") &&
                !line.includes("phase:") &&
                !line.includes("model:") &&
                !line.includes("following:") &&
                !line.includes("army:") &&
                !line.includes("result:") &&
                !line.includes("Warlord:") &&
                !line.includes("this turn:") &&
                !line.includes("Vehicle:") &&
                !line.includes("Leadership test:") &&
                !line.includes('within 6":')
              ) {
                wargearAbilities.push({
                  name: line.substring(0, line.indexOf(":")).trim(),
                  description: line.substring(line.indexOf(":") + 1).trim(),
                  showAbility: true,
                  showDescription: true,
                });
              } else {
                wargearAbilities[wargearAbilities.length - 1].description =
                  wargearAbilities[wargearAbilities.length - 1].description +
                  " " +
                  line.trim();
              }
            }
          } catch (error) {
            console.log("error", error);
          }
        }
        //DAMAGE TABLE BLOCK
        for (
          let index = startOfDamage.line + 1;
          index < splitText.length;
          index++
        ) {
          let line = splitText[index].substring(startOfAbilities.pos);
          if (
            line.indexOf("INVULNERABLE SAVE") > -1 ||
            line.indexOf("FACTION KEYWORDS") > -1
          ) {
            break;
          }
          if (line.length === 0) {
            continue;
          }

          damageTableDescription = damageTableDescription + " " + line.trim();
        }

        if (startOfOrders.line > 0) {
          //ORDERS BLOCK
          for (
            let index = startOfOrders.line + 1;
            index < splitText.length;
            index++
          ) {
            let line = splitText[index].substring(startOfAbilities.pos);
            if (
              line.indexOf("INVULNERABLE SAVE") > -1 ||
              line.indexOf("FACTION KEYWORDS") > -1
            ) {
              break;
            }
            if (line.length === 0) {
              continue;
            }

            ordersDescription = ordersDescription + " " + line.trim();
          }
        }
        //RANGED WEAPON BLOCK
        const rangedWeapons = [];
        let multiLineWeapon = 0;
        let ctan = false;
        for (
          let index = startOfRanged.line + 1;
          index < startOfRanged.endLine;
          index++
        ) {
          let line = splitText[index].substring(0, startOfAbilities.pos);
          if (line.trim().length > 0) {
            if (
              line.toLowerCase().includes("one shot:") ||
              line.toLowerCase().includes("[one shot]:")
            ) {
              continue;
            }
            if (line.includes("FORTIFICATION")) {
              break;
            }
            if (line.includes("C’TAN POWERS")) {
              ctan = true;
              continue;
            }
            if (line.includes("Snagged:")) {
              index = index + 2;
              continue;
            }
            if (line.includes("Hooked:")) {
              index = index + 3;
              continue;
            }
            if (line.includes("[IMPALED]:")) {
              index = index + 2;
              continue;
            }
            if (
              line.includes("Conversion:") ||
              line.toLowerCase().includes("[conversion:]") ||
              line.toLowerCase().includes("[conversion]:")
            ) {
              index = index + 2;
              continue;
            }

            if (line.includes("Hive Defences:")) {
              index = index + 2;
              continue;
            }
            if (line.includes("Linked Fire:")) {
              index = index + 1;
              continue;
            }
            if (line.includes("Psychic Assassin:")) {
              index = index + 1;
              continue;
            }
            if (line.includes("Dead Choppy:")) {
              index = index + 2;
              continue;
            }
            if (line.includes("Plasma Warhead:")) {
              index = index + 7;
              continue;
            }

            if (line.includes("Defensive Array:")) {
              break;
            }
            if (
              line.includes("KEYWORDS:") ||
              line.includes("Before selecting targets for this ")
            ) {
              break;
            }
            if (line.includes("* If this weapon is")) {
              break;
            }

            let name = line.substring(0, startOfRanged.pos).trim();
            let stats = line
              .substring(startOfRanged.pos)
              .split(" ")
              .filter((val) => val);

            if (multiLineWeapon === 1) {
              multiLineWeapon = 2;
              continue;
            }
            if (multiLineWeapon === 2) {
              multiLineWeapon = 0;
              continue;
            }

            let keywords = [];
            if (name.length > 0 && stats.length === 0) {
              //probably a multiple line weapon, so get those lines here.
              multiLineWeapon = 1;
              stats = splitText[index + 1]
                .substring(0, startOfAbilities.pos)
                .substring(startOfRanged.pos, startOfAbilities.pos)
                .split(" ")
                .filter((val) => val);

              if (
                splitText[index]
                  .substring(0, startOfAbilities.pos)
                  .includes("[")
              ) {
                keywords = splitText[index]
                  .substring(
                    splitText[index]
                      .substring(0, startOfAbilities.pos)
                      .indexOf("[") + 1,
                    startOfAbilities.pos,
                  )
                  .toLowerCase()
                  .split(",")
                  .map((val) => val.trim())
                  .filter((val) => val);

                name = splitText[index]
                  .substring(0, startOfAbilities.pos)
                  .substring(0, splitText[index].indexOf("["))
                  .trim();
              }
              if (
                splitText[index + 1]
                  .substring(0, startOfAbilities.pos)
                  .includes("[") &&
                !splitText[index + 1]
                  .substring(0, startOfAbilities.pos)
                  .includes("]")
              ) {
                keywords = [
                  ...keywords,
                  ...splitText[index + 1]
                    .substring(0, startOfAbilities.pos)
                    .substring(
                      splitText[index + 1]
                        .substring(0, startOfAbilities.pos)
                        .indexOf("[") + 1,
                      startOfAbilities.pos,
                    )
                    .toLowerCase()
                    .split(",")
                    .map((val) => val.trim())
                    .filter((val) => val),
                ];
              }
              if (
                splitText[index + 2]
                  .substring(0, startOfAbilities.pos)
                  .includes("[") ||
                splitText[index + 2]
                  .substring(0, startOfAbilities.pos)
                  .includes("]")
              ) {
                keywords = [
                  ...keywords,
                  ...splitText[index + 2]
                    .substring(0, startOfAbilities.pos)
                    .substring(
                      splitText[index + 2]
                        .substring(0, startOfAbilities.pos)
                        .indexOf("[") + 1,
                      splitText[index + 2]
                        .substring(0, startOfAbilities.pos)
                        .indexOf("]"),
                    )
                    .toLowerCase()
                    .split(",")
                    .map((val) => val.trim())
                    .filter((val) => val),
                ];
              }
            } else {
              if (name.indexOf("[") > -1) {
                keywords = name
                  .substring(name.indexOf("[") + 1, name.indexOf("]"))
                  .toLowerCase()
                  .split(",")
                  .map((val) => val.trim());

                name = name.substring(0, name.indexOf("["));
              }
              if (name.includes("(")) {
                keywords = name
                  .substring(name.indexOf("(") + 1, name.indexOf("]"))
                  .toLowerCase()
                  .split(",")
                  .map((val) => val.trim());
                name = name.substring(0, name.indexOf("("));
              }
            }
            if (ctan) {
              keywords.push("c'tan power");
            }
            if (name.indexOf("–") > -1) {
              if (
                rangedWeapons.length > 0 &&
                rangedWeapons[
                  rangedWeapons.length - 1
                ].profiles[0].name.indexOf("–") > -1
              ) {
                //Check if previous multi-line weapon has the same name...
                const prevWeaponName = rangedWeapons[
                  rangedWeapons.length - 1
                ].profiles[0].name
                  .split("–")[0]
                  .trim();
                const newWeaponName = name.split("–")[0].trim();

                if (prevWeaponName === newWeaponName) {
                  rangedWeapons[rangedWeapons.length - 1].profiles.push({
                    active: true,
                    name: name.trim(),
                    keywords,
                    range: stats[0],
                    attacks: stats[1],
                    skill: stats[2],
                    strength: stats[3],
                    ap: stats[4],
                    damage: stats[5],
                  });
                  continue;
                }
              }
            }

            rangedWeapons.push({
              active: true,
              profiles: [
                {
                  active: true,
                  name: name.trim(),
                  keywords,
                  range: stats[0],
                  attacks: stats[1],
                  skill: stats[2],
                  strength: stats[3],
                  ap: stats[4],
                  damage: stats[5],
                },
              ],
            });
          }
        }
        //MELEE WEAPON BLOCK
        const meleeWeapons = [];
        multiLineWeapon = 0;

        for (
          let index = startOfMelee.line + 1;
          index < startOfMelee.endLine;
          index++
        ) {
          let line = splitText[index].substring(0, startOfAbilities.pos);
          if (line.trim().length > 0) {
            let name = line.substring(0, startOfMelee.pos).trim();

            if (
              name.includes("Before selecting targets for this ") ||
              name.includes("Reverberating Summons:") ||
              name.includes("WARGEAR ABILITIES") ||
              includesString(name, PRIMARCH_ABILITIES_LIST)
            ) {
              break;
            }
            if (
              line.includes("KEYWORDS:") ||
              line.includes("Before selecting targets for this ")
            ) {
              break;
            }
            if (line.includes("Dead Choppy:")) {
              index = index + 2;
              continue;
            }
            if (multiLineWeapon === 1) {
              multiLineWeapon = 2;
              continue;
            }
            if (multiLineWeapon === 2) {
              multiLineWeapon = 0;
              continue;
            }

            let stats = line
              .substring(startOfMelee.pos, startOfAbilities.pos)
              .split(" ")
              .filter((val) => val);

            let keywords = [];

            if (name.length > 0 && stats.length === 0) {
              //probably a multiple line weapon, so get those lines here.
              multiLineWeapon = 1;
              stats = splitText[index + 1]
                .substring(0, startOfAbilities.pos)
                .substring(startOfMelee.pos, startOfAbilities.pos)
                .split(" ")
                .filter((val) => val);

              if (splitText[index].includes("[")) {
                keywords = splitText[index]
                  .substring(
                    splitText[index].indexOf("[") + 1,
                    startOfAbilities.pos,
                  )
                  .toLowerCase()
                  .split(",")
                  .map((val) => val.trim())
                  .filter((val) => val);

                name = splitText[index]
                  .substring(0, splitText[index].indexOf("["))
                  .trim();
              }
              if (
                splitText[index + 2].includes("[") ||
                splitText[index + 2].includes("]")
              ) {
                keywords = [
                  ...keywords,
                  ...splitText[index + 2]
                    .substring(
                      splitText[index + 2].indexOf("[") + 1,
                      splitText[index + 2].indexOf("]"),
                    )
                    .toLowerCase()
                    .split(",")
                    .map((val) => val.trim())
                    .filter((val) => val),
                ];
              }
            } else {
              if (name.indexOf("[") > -1) {
                keywords = name
                  .substring(name.indexOf("[") + 1, name.length - 1)
                  .toLowerCase()
                  .split(",")
                  .map((val) => val.trim());
                name = name.substring(0, name.indexOf("["));
              }
              if (name.includes("(")) {
                keywords = name
                  .substring(name.indexOf("(") + 1, name.length - 1)
                  .toLowerCase()
                  .split(",")
                  .map((val) => val.trim());
                name = name.substring(0, name.indexOf("("));
              }
            }

            if (name.indexOf("–") > -1) {
              if (
                meleeWeapons.length > 0 &&
                meleeWeapons[meleeWeapons.length - 1].profiles[0].name.indexOf(
                  "–",
                ) > -1
              ) {
                //Check if previous multi-line weapon has the same name...
                const prevWeaponName = meleeWeapons[
                  meleeWeapons.length - 1
                ].profiles[0].name
                  .split("–")[0]
                  .trim();
                const newWeaponName = name.split("–")[0].trim();

                if (prevWeaponName === newWeaponName) {
                  meleeWeapons[meleeWeapons.length - 1].profiles.push({
                    active: true,
                    name: name.trim(),
                    keywords,
                    range: stats[0],
                    attacks: stats[1],
                    skill: stats[2],
                    strength: stats[3],
                    ap: stats[4],
                    damage: stats[5],
                  });
                  continue;
                }
              }
            }
            meleeWeapons.push({
              active: true,
              profiles: [
                {
                  active: true,
                  name: name.trim(),
                  keywords,
                  range: stats[0],
                  attacks: stats[1],
                  skill: stats[2],
                  strength: stats[3],
                  ap: stats[4],
                  damage: stats[5],
                },
              ],
            });
          }
        }
        const firstPagePrimarch = getPrimarchAbilities(
          splitText,
          startOfPrimarch,
          startOfAbilities,
        );

        const secondPageLines = pages[1]
          .replaceAll("\u0007", "")
          .replaceAll("", "")
          .split("\n");

        startOfPrimarch = getStartOfBlockList(
          secondPageLines,
          PRIMARCH_ABILITIES_LIST,
        );

        const secondPagePrimarch = getPrimarchAbilities(
          secondPageLines,
          startOfPrimarch,
          getStartOfBlock(secondPageLines, "UNIT COMPOSITION"),
          file,
        );

        let fluff = getUnitFluff(secondPageLines);

        let unitComposition = getUnitComposition(secondPageLines);
        let unitLeader = getLeader(secondPageLines);
        let unitWargear = getWargear(secondPageLines);
        let unitTransport = getTransport(secondPageLines);
        let unitLoadout = getUnitLoadout(secondPageLines);
        let specialAbilities = getSpecialAbilities(secondPageLines);

        if (damageRange) {
          stats[0].showDamagedMarker = true;
        }
        let ordersAbility = undefined;
        if (ordersDescription.length > 0) {
          ordersAbility = {
            name: "ORDERS",
            description: ordersDescription,
            showAbility: true,
            showDescription: true,
          };
          specialAbilities = [...specialAbilities, ordersAbility];
        }
        const unitPoints = points
          .filter((pointsLine) => {
            return pointsLine[1].toLowerCase() === name.toLowerCase();
          })
          .map((pointsLine) => {
            let numModels, cost;
            [, , numModels, cost] = pointsLine;
            return { models: numModels, cost, active: true };
          });
        let newUnit = {
          id: uuidv5(name, "142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e"),
          name,
          source: "40k-10e",
          faction_id: factionId,
          cardType: "DataCard",
          leader: unitLeader,
          composition: unitComposition,
          loadout: unitLoadout,
          wargear: unitWargear,
          transport: unitTransport,
          legends: legends ? true : undefined,
          imperialArmour: imperialArmour ? true : undefined,
          points: unitPoints,
          fluff: fluff,
          abilities: {
            wargear: wargearAbilities,
            core: coreKeywords,
            faction: factionKeywords,
            primarch: [...firstPagePrimarch, ...secondPagePrimarch],
            invul: {
              value: invul,
              info: invulInfo,
              showInvulnerableSave: invul ? true : false,
              showInfo: invulInfo ? true : false,
            },
            other: abilities,
            special: specialAbilities,
            damaged: {
              showDamagedAbility: damageRange ? true : false,
              showDescription: damageTableDescription ? true : false,
              range: damageRange ? damageRange : "",
              description: damageRange ? damageTableDescription.trim() : "",
            },
          },
          stats,
          rangedWeapons,
          meleeWeapons,
          keywords,
          factions: factionName,
        };

        newUnit = checkForManualFixes(newUnit);
        newUnit = fixFactionKeywords(newUnit);

        newUnit?.rangedWeapons?.forEach((wep) => {
          let abilities = undefined;
          wep?.profiles?.forEach((prof) => {
            specialWeaponKeywords.forEach((val) => {
              if (
                prof.keywords.some(
                  (keyword) => val.name.toLowerCase() === keyword.toLowerCase(),
                )
              ) {
                abilities = [val];
              }
            });
          });
          wep.abilities = abilities;
        });
        newUnit?.meleeWeapons?.forEach((wep) => {
          let abilities = undefined;
          wep?.profiles?.forEach((prof) => {
            specialWeaponKeywords.forEach((val) => {
              if (
                prof.keywords.some(
                  (keyword) => val.name.toLowerCase() === keyword.toLowerCase(),
                )
              ) {
                abilities = [val];
              }
            });
          });
          wep.abilities = abilities;
        });

        newUnit = sortObj(newUnit);

        units.push(newUnit);
      }
    }
    units.sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < units.length; i++) {
      const unit = units[i];

      if (unit.leader) {
        // console.log(i, unit.name, unit.leader);
        let assignedUnits = undefined;
        let extraText = "";

        if (unit.leader.includes("You can attach")) {
          assignedUnits = unit.leader
            .substring(
              unit.leader.indexOf("■"),
              unit.leader.indexOf("You can attach"),
            )
            .split("■")
            .filter((v) => v)
            .map((v) => v.replaceAll("*", "").trim());
          extraText = unit.leader.substring(
            unit.leader.indexOf("You can attach"),
          );
        } else if (unit.leader.includes("You must attach")) {
          assignedUnits = unit.leader
            .substring(
              unit.leader.indexOf("■"),
              unit.leader.indexOf("You must attach"),
            )
            .split("■")
            .filter((v) => v)
            .map((v) => v.replaceAll("*", "").trim());
          extraText = unit.leader.substring(
            unit.leader.indexOf("You must attach"),
          );
        } else if (unit.leader.includes("This model can be attached to a")) {
          assignedUnits = unit.leader
            .substring(
              unit.leader.indexOf("■"),
              unit.leader.indexOf("This model can be attached to a"),
            )
            .split("■")
            .filter((v) => v)
            .map((v) => v.replaceAll("*", "").trim());
          extraText = unit.leader.substring(
            unit.leader.indexOf("This model can be attached to a"),
          );
        } else if (unit.leader.includes("This model cannot be attached to a")) {
          assignedUnits = unit.leader
            .substring(
              unit.leader.indexOf("■"),
              unit.leader.indexOf("This model cannot be attached to a"),
            )
            .split("■")
            .filter((v) => v)
            .map((v) => v.replaceAll("*", "").trim());
          extraText = unit.leader.substring(
            unit.leader.indexOf("This model cannot be attached to a"),
          );
        } else if (unit.leader.includes("If this unit’s Bodyguard")) {
          assignedUnits = unit.leader
            .substring(
              unit.leader.indexOf("■"),
              unit.leader.indexOf("If this unit’s"),
            )
            .split("■")
            .filter((v) => v)
            .map((v) => v.replaceAll("*", "").trim());
          extraText = unit.leader.substring(
            unit.leader.indexOf("If this unit’s"),
          );
          // } else if (unit.leader.includes('(see Drukhari)')) {
          //   assignedUnits = unit.leader
          //     .substring(unit.leader.indexOf('■'), unit.leader.indexOf('(see Drukhari)'))
          //     .split('■')
          //     .filter((v) => v)
          //     .map((v) => v.replaceAll('*', '').trim());
          //     extraText = unit.leader.substring(unit.leader.indexOf('(see Drukhari)'));
        } else {
          assignedUnits = unit.leader
            .substring(unit.leader.indexOf("■"))
            .split("■")
            .filter((v) => v)
            .map((v) => v.replaceAll("*", "").trim());
        }
        unit.leads = { units: assignedUnits, extra: extraText };
        if (assignedUnits.length > 0) {
          assignedUnits.forEach((atUnit) => {
            const foundUnitIndex = units.findIndex(
              (u) =>
                u.name.toLowerCase().trim() === atUnit.toLowerCase().trim(),
            );
            if (
              foundUnitIndex >= 0 &&
              units[foundUnitIndex].leadBy &&
              units[foundUnitIndex].leadBy.length > 0
            ) {
              units[foundUnitIndex].leadBy.push(unit.name);
            } else if (foundUnitIndex >= 0) {
              units[foundUnitIndex].leadBy = [unit.name];
            } else {
              // console.log(unit.name, 'not found:', atUnit);
            }
          });
        }
      }
    }
    const enhancement = enhancements.find((eh) => eh.faction_id === factionId);
    const detachment = detachments.find((dt) => dt.faction_id === factionId);

    // const stratagems = import(`./stratagems/${outputFile.toLowerCase().replaceAll(' ', '')}.mjs`);

    // console.log(data[outputFile]);

    const factions = {
      id: factionId,
      link: "https://game-datacards.eu",
      name: factionName,
      ...getAlliedInfo(factionId),
      stratagems: data[outputFile]?.map((val) => {
        return {
          ...val,
          id: uuidv5(val.name, "142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e"),
          faction_id: factionId,
        };
      }),
      enhancements: enhancement?.enhancements?.map((val) => {
        return {
          ...val,
          id: uuidv5(val.name, "142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e"),
          faction_id: factionId,
        };
      }),
      detachments: detachment.detachments,
      datasheets: units,
      colours: {
        banner,
        header,
      },
    };

    fs.writeFileSync(
      path.resolve(__dirname, `gdc/${outputFile}.json`),
      JSON.stringify(sortObj(factions), null, 2),
    );
  });
};

convertTextToJson(
  "/deathguard/",
  "deathguard",
  "DG",
  "Death Guard",
  "#4d560e",
  "#2c290c",
  3,
);
convertTextToJson(
  "/tyranids/",
  "tyranids",
  "TYR",
  "Tyranids",
  "#381a3a",
  "#411f41",
  3,
);
convertTextToJson(
  "/spacemarines/",
  "space_marines",
  "SM",
  "Space Marines",
  "#4b6262",
  "#092135",
  3,
);
convertTextToJson(
  "/bloodangels/",
  "bloodangels",
  "CHBA",
  "Blood Angels",
  "#72191c",
  "#631210",
  3,
);
convertTextToJson(
  "/darkangels/",
  "darkangels",
  "CHDA",
  "Dark Angels",
  "#013a17",
  "#16291a",
  3,
);
convertTextToJson(
  "/blacktemplar/",
  "blacktemplar",
  "CHBT",
  "Black Templar",
  "#142637",
  "#202a2f",
  3,
);
convertTextToJson(
  "/spacewolves/",
  "spacewolves",
  "CHSW",
  "Space Wolves",
  "#435d63",
  "#283743",
  3,
);
convertTextToJson(
  "/deathwatch/",
  "deathwatch",
  "CHDW",
  "Death Watch",
  "#3d3e41",
  "#232425",
  3,
);
convertTextToJson(
  "/thousandsons/",
  "thousandsons",
  "TS",
  "Thousand Sons",
  "#185862",
  "#0b3645",
  3,
);
convertTextToJson(
  "/worldeaters/",
  "worldeaters",
  "WE",
  "World Eaters",
  "#4d161a",
  "#611013",
  3,
);
convertTextToJson(
  "/chaos_spacemarines/",
  "chaos_spacemarines",
  "CSM",
  "Chaos Space Marines",
  "#222a2f",
  "#320b0d",
  3,
);
convertTextToJson(
  "/chaosdaemons/",
  "chaosdaemons",
  "CD",
  "Chaos Daemons",
  "#393940",
  "#202224",
  3,
);
convertTextToJson(
  "/chaosknights/",
  "chaosknights",
  "QT",
  "Chaos Knights",
  "#49584c",
  "#102824",
  3,
);

convertTextToJson(
  "/astramilitarum/",
  "astramilitarum",
  "AM",
  "Astra Militarum",
  "#324935",
  "#0a2118",
  3,
);
convertTextToJson(
  "/imperialknights/",
  "imperialknights",
  "QI",
  "Imperial Knights",
  "#023e58",
  "#122d42",
  3,
);
convertTextToJson(
  "/greyknights/",
  "greyknights",
  "GK",
  "Grey Knights",
  "#4a5e67",
  "#325b68",
  3,
);
convertTextToJson(
  "/adeptasororitas/",
  "adeptasororitas",
  "AS",
  "Adepta Sororitas",
  "#570c0c",
  "#561113",
  3,
);
convertTextToJson(
  "/adeptusmechanicus/",
  "adeptusmechanicus",
  "AdM",
  "Adeptus Mechanicus",
  "#9f2628",
  "#5d1615",
  3,
);
convertTextToJson(
  "/adeptuscustodes/",
  "adeptuscustodes",
  "AC",
  "Adeptus Custodes",
  "#6d5035",
  "#6a0e19",
  3,
);
convertTextToJson(
  "/agents/",
  "agents",
  "AoI",
  "Agents of the Imperium",
  "#244b6a",
  "#1a3445",
  3,
);
convertTextToJson("/orks/", "orks", "ORK", "Orks", "#465b18", "#283109", 3);
convertTextToJson(
  "/votann/",
  "votann",
  "LoV",
  "Votann",
  "#3c4b3f",
  "#572d0a",
  3,
);
convertTextToJson(
  "/tau/",
  "tau",
  "TAU",
  "T'au Empire",
  "#2e5a6a",
  "#175966",
  3,
);
convertTextToJson(
  "/necrons/",
  "necrons",
  "NEC",
  "Necrons",
  "#04532a",
  "#032b16",
  3,
);
convertTextToJson(
  "/aeldari/",
  "aeldari",
  "AE",
  "Aeldari",
  "#347379",
  "#0a353a",
  3,
);
convertTextToJson(
  "/drukhari/",
  "drukhari",
  "DRU",
  "Drukhari",
  "#0f454e",
  "#102929",
  3,
);

convertTextToJson(
  "/gsc/",
  "gsc",
  "GSC",
  "Genestealer Cults",
  "#391625",
  "#291221",
  3,
);

convertTextToJson(
  "/titan/",
  "titan",
  "AT",
  "Adeptus Titanicus",
  "#4b6262",
  "#092135",
  3,
);
convertTextToJson(
  "/unaligned/",
  "unaligned",
  "UN",
  "Unaligned",
  "#4b6262",
  "#092135",
  3,
);
