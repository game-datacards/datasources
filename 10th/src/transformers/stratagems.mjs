import { v5 as uuidv5 } from 'uuid';
import { removeMarkdown } from '../utils.mjs';
import { UUID_NAMESPACE } from '../constants.mjs';

const processStratagem = (newStratagem, oldParsedUnits, detachments, newDataExport) => {
  let turn = '';
  switch (newStratagem?.key) {
    case 'yourTurn':
      turn = 'your';
      break;
    case 'opponentsTurn':
      turn = 'opponents';
      break;
    case 'eitherPlayer':
      turn = 'either';
      break;
  }

  let type = '';
  switch (newStratagem?.category) {
    case 'strategicPloy':
      type = 'Strategic Ploy';
      break;
    case 'battleTactic':
      type = 'Battle Tactic';
      break;
    case 'epicDeed':
      type = 'Epic Deed';
      break;
    case 'wargear':
      type = 'Wargear';
      break;
  }

  let phase = [];
  if (newStratagem.whenRules.toLowerCase().includes('any phase')) {
    phase = ['any'];
  } else {
    const phases = newDataExport.stratagem_phase.filter((strat_phase) => {
      return strat_phase.stratagemId === newStratagem.id;
    });
    phase = phases.map((strat_phase) => strat_phase.phase.replaceAll('Phase', '').trim().toLowerCase());
  }

  return {
    name: newStratagem.name,
    id: uuidv5(newStratagem.name, UUID_NAMESPACE),
    cost: Number(newStratagem.cpCost),
    turn: turn,
    target: removeMarkdown(newStratagem.targetRules) || '',
    when: removeMarkdown(newStratagem.whenRules) || '',
    effect: removeMarkdown(newStratagem.effectRules) || '',
    restrictions: removeMarkdown(newStratagem.restrictionRules) || '',
    type: type,
    phase: phase,
    faction_id: oldParsedUnits.id,
    fluff: removeMarkdown(newStratagem.lore) || '',
    detachment:
      detachments.find((detachment) => {
        return detachment.id === newStratagem.detachmentId;
      })?.name || '',
  };
};

export const processStratagems = (stratagems, oldParsedUnits, detachments, newDataExport) => {
  return stratagems?.map((stratagem) => processStratagem(stratagem, oldParsedUnits, detachments, newDataExport));
};

export const processEnhancements = (enhancements, oldParsedUnits, detachments, newDataExport, newFaction) => {
  enhancements.sort((a, b) => a.displayOrder - b.displayOrder);

  const processedEnhancements = enhancements.map((enhancement) => {
    const foundKeywordGroups = newDataExport.enhancement_required_keyword_group.filter((group) => {
      return group.enhancementId === enhancement.id;
    });

    let foundKeywords = [];
    foundKeywordGroups.forEach((group) => {
      const foundKeywordGroupsKeyword = newDataExport.enhancement_required_keyword_group_keyword.filter(
        (groupKeyword) => {
          return groupKeyword.enhancementRequiredKeywordGroupId === group.id;
        }
      );

      foundKeywords = [...foundKeywords, ...foundKeywordGroupsKeyword.map((kw) => kw.keywordId)];
    });

    // Remove duplicates
    foundKeywords = [...new Set(foundKeywords)];

    let excludedKeywords = newDataExport.enhancement_excluded_keyword
      .filter((keyword) => keyword.enhancementId === enhancement.id)
      .map((kw) => kw.keywordId);

    const enhancementData = {
      ...enhancement,
      keywords: !foundKeywords || foundKeywords.length === 0 
        ? [newFaction.name]
        : foundKeywords.map((keyword) => {
            return newDataExport.keyword.find((kw) => kw.id === keyword)?.name || '';
          }),
      excluded: excludedKeywords.map((keyword) => {
        return newDataExport.keyword.find((kw) => kw.id === keyword)?.name || '';
      }),
    };

    return {
      name: enhancementData.name,
      id: uuidv5(enhancementData.name, UUID_NAMESPACE),
      cost: enhancementData.basePointsCost.toString(),
      keywords: enhancementData.keywords,
      excludes: enhancementData.excluded,
      description: removeMarkdown(enhancementData.rules) || '',
      faction_id: oldParsedUnits.id,
      detachment:
        detachments.find((detachment) => {
          return detachment.id === enhancementData.detachmentId;
        })?.name || '',
    };
  });

  return processedEnhancements;
};