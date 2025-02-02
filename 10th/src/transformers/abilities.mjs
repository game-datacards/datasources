import { removeMarkdown } from '../utils.mjs';

export const processFactionAbilities = (datasheetAbilities) => {
  return datasheetAbilities
    .filter((ability) => ability.abilityType === 'faction')
    .map((ability) => {
      let name = ability.name;
      if (ability.isAura || ability.isBondsman || ability.isPsychic) {
        const list = [];
        if (ability.isAura) list.push('Aura');
        if (ability.isBondsman) list.push('Bondsman');
        if (ability.isPsychic) list.push('Psychic');
        name = `${name} (${list.join(', ')})`;
      }
      if (ability.restriction !== null) {
        name = `${name} ${ability.restriction}`;
      }
      return name;
    });
};

export const processCoreAbilities = (datasheetAbilities) => {
  return datasheetAbilities
    .filter((ability) => ability.abilityType === 'core')
    .map((ability) => {
      if (ability.restriction !== null) {
        return `${ability.name} ${ability.restriction}`;
      }
      return ability.name;
    });
};

export const processDatasheetAbilities = (datasheetAbilities) => {
  return datasheetAbilities
    .filter((ability) => ability.abilityType === 'datasheet')
    .map((ability) => {
      let name = ability.name;
      if (ability.isAura || ability.isBondsman || ability.isPsychic) {
        const list = [];
        if (ability.isAura) list.push('Aura');
        if (ability.isBondsman) list.push('Bondsman');
        if (ability.isPsychic) list.push('Psychic');
        name = `${name} (${list.join(', ')})`;
      }
      return {
        name: name,
        description: removeMarkdown(ability.rules),
        showAbility: true,
        showDescription: true,
      };
    });
};

export const processWargearAbilities = (wargearItems) => {
  return wargearItems
    .filter((item) => item.wargearType === 'wargear')
    .map((item) => ({
      name: item.name,
      description: removeMarkdown(item.ruleText.split('\n\n')[0]),
      showAbility: true,
      showDescription: true,
    }));
};

export const processPrimarchAbilities = (datasheetAbilities) => {
  return datasheetAbilities
    .map((ability) => {
      if (ability.subAbilities.length > 0) {
        const abilities = ability.subAbilities.map((subAbility) => ({
          name: subAbility.name,
          description: removeMarkdown(subAbility.rules),
          showAbility: true,
          showDescription: true,
        }));
        return { name: ability.name, abilities: abilities, showAbility: true };
      }
      return undefined;
    })
    .filter((ability) => ability !== undefined);
};

export const processDamageAbility = (damageAbility) => {
  if (!damageAbility || damageAbility.length === 0) {
    return {
      description: '',
      range: '',
      showDamagedAbility: false,
      showDescription: true,
    };
  }

  return {
    range: damageAbility[0].name
      .replaceAll('DAMAGED: ', '')
      .replaceAll('Damaged: ', '')
      .replaceAll('Damaged ', '')
      .toUpperCase(),
    description: removeMarkdown(damageAbility[0].rules),
    showDamagedAbility: true,
    showDescription: true,
  };
};

export const processInvulAbility = (invulAbility) => {
  if (!invulAbility) {
    return {
      info: '',
      showAtTop: true,
      showInfo: false,
      showInvulnerableSave: false,
      value: '',
    };
  }

  return {
    info: invulAbility.rules ? removeMarkdown(invulAbility.rules) : '',
    showAtTop: true,
    showInfo: invulAbility.rules !== null,
    showInvulnerableSave: true,
    value: invulAbility.save,
  };
};

export const processSpecialRules = (datasheetRules) => {
  const specialAbilities = datasheetRules.filter(
    (ability) => ability.name !== 'Transport' && ability.name !== 'Leader'
  );

  if (!specialAbilities || specialAbilities.length === 0) {
    return [];
  }

  return specialAbilities.map((ability) => ({
    description: removeMarkdown(ability.rules.trim()),
    name: ability.name,
    showAbility: true,
    showDescription: true,
  }));
};