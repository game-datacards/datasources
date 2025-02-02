import fs from 'fs';

export const readFile = (file) => {
  if (!file) {
    return;
  }
  return fs.readFileSync(file, 'utf8');
};

export const removeMarkdown = (str) => {
  if (!str) return str;
  return str
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
    .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```(.*?)```/gs, '$1') // Remove code blocks
    .replace(/#+\s?(.*?)\s*$/gm, '$1') // Remove headers
    .replace(/>\s?(.*?)\s*$/gm, '$1') // Remove blockquotes
    .replace(/^-{3,}\s*$/gm, '') // Remove horizontal rules
    .replace(/^( *[-*+] +.*)$/gm, '$1') // Remove unordered list items
    .replace(/^( *\d+\. +.*)$/gm, '$1') // Remove ordered list items
    .trim(); // Trim whitespace
};

export const findFactionAndPublication = (dataExport, factionName) => {
  const faction = dataExport.faction_keyword.find((faction_keyword) => {
    return faction_keyword.name === factionName;
  });

  const publication = dataExport.publication.find((publication) => {
    return (
      publication.factionKeywordId === faction.id &&
      (publication.isCombatPatrol === 0 || publication.isCombatPatrol === false) &&
      !publication.name.includes('Imperial Armour')
    );
  });

  return { faction, publication };
};

export const processWeaponKeywords = (weapons, specialWeaponKeywords) => {
  weapons?.forEach((wep) => {
    let abilities = undefined;
    wep?.profiles?.forEach((prof) => {
      specialWeaponKeywords.forEach((val) => {
        if (prof.keywords.some((keyword) => val.name.toLowerCase() === keyword.toLowerCase())) {
          abilities = [val];
        }
      });
    });
    wep.abilities = abilities;
  });
  return weapons;
};