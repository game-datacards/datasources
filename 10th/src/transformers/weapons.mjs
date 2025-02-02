export const processWeapons = (weapons) => {
  const rangedWeapons = weapons
    .filter((weapon) => {
      return weapon.profiles.some((p) => p.type === 'ranged');
    })
    .map((weapon) => ({
      active: true,
      profiles: weapon.profiles
        .filter((p) => p.type === 'ranged')
        .map((profile) => ({
          active: true,
          ap: profile.armourPenetration,
          attacks: profile.attacks,
          damage: profile.damage,
          keywords: profile.keywords,
          name:
            weapon.profiles.length > 1 && weapon.name !== profile.name
              ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
              : profile.name === 'ranged'
              ? weapon.name
              : profile.name,
          range: profile.range,
          skill: profile.ballisticSkill.trim(),
          strength: profile.strength,
        })),
    }));

  const meleeWeapons = weapons
    .filter((weapon) => {
      return weapon.profiles.some((p) => p.type === 'melee');
    })
    .map((weapon) => ({
      active: true,
      profiles: weapon.profiles
        .filter((p) => p.type === 'melee')
        .map((profile) => ({
          active: true,
          ap: profile.armourPenetration,
          attacks: profile.attacks,
          damage: profile.damage,
          keywords: profile.keywords,
          name:
            weapon.profiles.length > 1 && weapon.name !== profile.name
              ? weapon.name + ' – ' + profile.name.charAt(0).toUpperCase() + profile.name.slice(1)
              : profile.name === 'melee'
              ? weapon.name
              : profile.name,
          range: profile.range,
          skill: profile.weaponSkill,
          strength: profile.strength,
        })),
    }));

  return { rangedWeapons, meleeWeapons };
};

export const processWargearOptions = (wargearOptions) => {
  if (!wargearOptions?.length) {
    return ['None'];
  }

  return wargearOptions.map((gear) => 
    gear.rulesText.replaceAll('■', '').replaceAll('\n', ' ').trim()
  );
};