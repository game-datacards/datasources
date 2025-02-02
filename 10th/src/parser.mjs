import { v5 as uuidv5 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sortObj } from 'jsonabc';

import { readFile, findFactionAndPublication, processWeaponKeywords } from './utils.mjs';
import { specialWeaponKeywords, UUID_NAMESPACE } from './constants.mjs';
import { processStratagems, processEnhancements } from './transformers/stratagems.mjs';
import { processUnit, processLeadershipConnections } from './transformers/units.mjs';

export const parseDataExport = (fileName, factionName) => {
  // Read and parse input files
  const oldParsedUnitsFile = readFile(fileName);
  const oldParsedUnits = sortObj(JSON.parse(oldParsedUnitsFile));

  const newDataExportFile = readFile('10th/temp/data-export-541.json');
  const newDataExport = sortObj(JSON.parse(newDataExportFile).data);

  // Find faction and publication
  const { faction: newFaction, publication: newPublication } = findFactionAndPublication(newDataExport, factionName);

  if (!newPublication) {
    console.error(`No valid publication found for faction: ${factionName}`);
    return;
  }

  // Process stratagems
  const stratagems = newDataExport.stratagem.filter((stratagem) => {
    return stratagem.publicationId === newPublication?.id;
  });

  const detachments = newDataExport.detachment.filter((detachment) => {
    return detachment.publicationId === newPublication?.id;
  });

  oldParsedUnits.detachments = detachments.map((detachment) => detachment.name);
  oldParsedUnits.stratagems = processStratagems(stratagems, oldParsedUnits, detachments, newDataExport);

  // Process enhancements
  let enhancements = newDataExport.enhancement.filter((enhancement) => {
    return enhancement.publicationId === newPublication?.id;
  });

  oldParsedUnits.enhancements = processEnhancements(enhancements, oldParsedUnits, detachments, newDataExport, newFaction);

  // Process datasheets
  const allDatasheetFactionKeywords = newDataExport.datasheet_faction_keyword.filter(
    (datasheet_faction_keyword) => datasheet_faction_keyword.factionKeywordId === newFaction.id
  );

  let allDataSheets = newDataExport.datasheet.filter((datasheet) =>
    allDatasheetFactionKeywords.find(
      (datasheet_faction_keyword) => datasheet.id === datasheet_faction_keyword.datasheetId
    )
  );

  // Enrich datasheets with additional data
  allDataSheets = allDataSheets.map((card) => {
    // Add publication info
    card.publication = newDataExport.publication.find((publication) => publication.id === card.publicationId);

    // Process miniatures
    const miniatures = newDataExport.miniature
      .filter((miniature) => miniature.datasheetId === card.id)
      .map((miniature) => {
        const miniatureKeywords = newDataExport.miniature_keyword
          .filter((kw) => kw.miniatureId === miniature.id)
          .map((kw) => newDataExport.keyword.find((keyword) => keyword.id === kw.keywordId).name);
        return { ...miniature, keywords: miniatureKeywords };
      })
      .sort((a, b) => a.displayOrder - b.displayOrder);

    // Process abilities
    const datasheetAbilities = newDataExport.datasheet_datasheet_ability
      .filter((ability) => ability.datasheetId === card.id)
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((datasheetAbility) => {
        const foundAbility = newDataExport.datasheet_ability.find(
          (ability) => datasheetAbility.datasheetAbilityId === ability.id
        );
        const subAbilities = newDataExport.datasheet_sub_ability.filter(
          (subAbility) => subAbility.datasheetAbilityId === foundAbility.id
        );
        return { ...foundAbility, restriction: datasheetAbility.restriction, subAbilities };
      });

    // Process damage ability
    const damageAbility = newDataExport.datasheet_damage.filter((ability) => ability.datasheetId === card.id);

    // Process rules
    const datasheetRules = newDataExport.datasheet_rule
      .filter((ability) => ability.datasheetId === card.id)
      .sort((a, b) => b.displayOrder - a.displayOrder);

    // Process wargear
    const wargearOptions = newDataExport.wargear_rule
      .filter((wargear) => wargear.datasheetId === card.id)
      .sort((a, b) => b.displayOrder - a.displayOrder);

    // Process invulnerable save
    const invulAbility = newDataExport.invulnerable_save.find((ability) => ability.datasheetId === card.id);

    // Process weapons
    const wargearOptionsGroups = newDataExport.wargear_option_group.filter(
      (wargear) => wargear.datasheetId === card.id
    );

    const wargearOpts = wargearOptionsGroups.flatMap((wargearOptionGroup) =>
      newDataExport.wargear_option.filter((wargear) => wargear.wargearOptionGroupId === wargearOptionGroup.id)
    );

    const wargearItems = wargearOpts
      .flatMap((wargearOption) =>
        newDataExport.wargear_item.filter((wargear) => wargear.id === wargearOption.wargearItemId)
      )
      .sort((a, b) => b.displayOrder - a.displayOrder);

    const weapons = wargearItems
      .filter((item) => item.wargearType === 'weapon')
      .map((item) => ({
        name: item.name,
        id: item.id,
        profiles: newDataExport.wargear_item_profile
          .filter((profile) => profile.wargearItemId === item.id)
          .map((profile) => ({
            ...profile,
            keywords: newDataExport.wargear_item_profile_wargear_ability
              .filter((ability) => ability.wargearItemProfileId === profile.id)
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((ability) =>
                newDataExport.wargear_ability.find((wargearAbility) => wargearAbility.id === ability.wargearAbilityId)
                  .name
              ),
          })),
      }))
      .filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.attacks === value.attacks && t.name === value.name)
      );

    // Process points
    const points = newDataExport.unit_composition
      .filter((ability) => ability.datasheetId === card.id)
      .sort((a, b) => b.displayOrder - a.displayOrder)
      .map((point) => {
        const unitCompMini = newDataExport.unit_composition_miniature.filter(
          (pointComp) => pointComp.unitCompositionId === point.id
        );
        return {
          cost: point.points.toString(),
          keyword:
            point.referenceGroupingKeywordId !== null
              ? newDataExport.keyword.find((kw) => kw.id === point.referenceGroupingKeywordId).name
              : null,
          models: unitCompMini.reduce((acc, curr) => acc + curr.max, 0).toString(),
          active: true,
        };
      })
      .filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.cost === value.cost && t.models === value.models && t.keyword === value.keyword)
      );

    return {
      ...card,
      miniatures,
      datasheetAbilities,
      damageAbility,
      datasheetRules,
      wargearOptions,
      wargearItems,
      invulAbility: invulAbility,
      weapons,
      points,
    };
  });

  // Filter out combat patrol datasheets
  allDataSheets = allDataSheets.filter(
    (card) => card.publication.isCombatPatrol === false || card.publication.isCombatPatrol === 0
  );

  // Process each datasheet into a unit
  let foundUnits = allDataSheets.map((card) => processUnit(card, factionName, oldParsedUnits));

  // Process leadership connections
  foundUnits = processLeadershipConnections(foundUnits);

  // Process weapon keywords
  foundUnits.forEach((unit) => {
    unit.rangedWeapons = processWeaponKeywords(unit.rangedWeapons, specialWeaponKeywords);
    unit.meleeWeapons = processWeaponKeywords(unit.meleeWeapons, specialWeaponKeywords);
  });

  // Combine with legends units
  const legendsUnits = oldParsedUnits.datasheets.filter((sheet) => sheet.legends === true);
  oldParsedUnits.datasheets = [...foundUnits, ...legendsUnits];
  oldParsedUnits.updated = new Date().toISOString();

  // Write the result
  fs.writeFileSync(fileName, JSON.stringify(oldParsedUnits, null, 2));
};

// Export the main function
export default parseDataExport;