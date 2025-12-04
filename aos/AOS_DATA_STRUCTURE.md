# Age of Sigmar Data Structure

This document describes the data structure used for Age of Sigmar faction files in game-datacards.

## Overview

The AoS data is exported from the official AoS app data export and transformed into structured JSON files for each faction. Each faction file contains warscrolls (units), battle formations, spell lores, enhancements, terrain rules, and battle traits.

## File Structure

Files are located in `aos/gdc/` with naming convention: `{faction_name}.json`

Example: `stormcast_eternals.json`, `skaven.json`, `daughters_of_khaine.json`

---

## Faction File Schema

```json
{
  "id": "STORMCAST_ETERNALS",
  "name": "Stormcast Eternals",
  "grandAlliance": "Order",
  "parentFaction": null,
  "isLegends": false,
  "colours": {
    "banner": "#1E5B8C",
    "header": "#2A7AB8"
  },
  "updated": "2025-12-04T00:00:00.000Z",
  "compatibleDataVersion": 363,

  "warscrolls": [...],
  "battleFormations": [...],
  "lores": [...],
  "enhancements": {...},
  "terrain": [...],
  "rules": {...}
}
```

### Top-Level Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Uppercase identifier (e.g., "STORMCAST_ETERNALS") |
| `name` | string | Display name of the faction |
| `grandAlliance` | string | Order, Chaos, Death, or Destruction |
| `parentFaction` | string\|null | Parent faction if subfaction |
| `isLegends` | boolean | True if faction is Legends (deprecated) |
| `colours` | object | Banner and header hex colours |
| `updated` | string | ISO timestamp of last update |
| `compatibleDataVersion` | number | Data export version number |

---

## Warscroll Schema

Warscrolls represent individual units in the game.

```json
{
  "id": "uuid-v5",
  "name": "Liberators",
  "subname": null,
  "cardType": "Warscroll",
  "source": "aos-4e",
  "faction_id": "STORMCAST_ETERNALS",
  "factions": ["Stormcast Eternals"],
  "keywords": ["Infantry", "Hero", "Ward (6+)"],
  "factionKeywords": ["Stormcast Eternals", "Redeemer"],
  "fluff": "Lore text...",
  "referenceKeywords": "Infantry, Hero, Ward (6+), Order, Stormcast Eternals",

  "stats": {
    "move": "5\"",
    "save": "3+",
    "control": "1",
    "health": "2",
    "ward": "6+"
  },

  "points": 150,
  "modelCount": 5,
  "baseSize": "32mm",
  "cannotBeReinforced": false,
  "isSpearhead": false,
  "isLegends": false,

  "weapons": {
    "ranged": [...],
    "melee": [...]
  },

  "abilities": [...],
  "regimentOptions": [...],
  "notes": null
}
```

### Warscroll Stats

| Field | Type | Description |
|-------|------|-------------|
| `move` | string | Movement characteristic (e.g., "5\"") |
| `save` | string | Save characteristic (e.g., "3+") |
| `control` | string | Control value |
| `health` | string | Health/wounds |
| `ward` | string\|null | Ward save if present (e.g., "6+") |

### Weapon Schema

```json
{
  "name": "Celestial Hammers",
  "type": "melee",
  "range": null,
  "attacks": "2",
  "hit": "3+",
  "wound": "3+",
  "rend": "1",
  "damage": "2",
  "abilities": ["Crit (Mortal)"]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Weapon name |
| `type` | string | "melee" or "ranged" |
| `range` | string\|null | Range for ranged weapons |
| `attacks` | string | Number of attacks |
| `hit` | string | Hit roll required |
| `wound` | string | Wound roll required |
| `rend` | string | Rend value (or "-") |
| `damage` | string | Damage value |
| `abilities` | string[] | Weapon abilities (e.g., "Crit (Mortal)") |

### Ability Schema

```json
{
  "name": "Sundering Strike",
  "phase": "combatPhase",
  "phaseDetails": "Once Per Turn, Any Combat Phase",
  "icon": "offensive",
  "castingValue": null,
  "chantValue": null,
  "cpCost": null,
  "isReaction": false,
  "lore": "Fluff text...",
  "declare": "Pick a visible enemy unit...",
  "effect": "The effect text...",
  "keywords": ["KEYWORD"]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Ability name |
| `phase` | string | Game phase (heroPhase, movementPhase, shootingPhase, chargePhase, combatPhase, endOfTurn) |
| `phaseDetails` | string | Timing details |
| `icon` | string | Icon type (offensive, defensive, special, movement, shooting, control) |
| `castingValue` | number\|null | Casting value for spells |
| `chantValue` | number\|null | Chanting value for prayers |
| `cpCost` | number\|null | Command point cost |
| `isReaction` | boolean | True if reaction ability |
| `lore` | string\|null | Flavour text |
| `declare` | string\|null | Declaration requirements |
| `effect` | string | Effect text |
| `keywords` | string[] | Keywords if restricted |

---

## Battle Formation Schema

Battle formations are army-wide rules that affect how your army plays.

```json
{
  "id": "uuid-v5",
  "name": "Scions of the Storm",
  "cardType": "BattleFormation",
  "source": "aos-4e",
  "faction_id": "STORMCAST_ETERNALS",
  "factionTerrainLimit": 1,
  "isLegends": false,
  "points": null,
  "rules": [
    {
      "name": "Bolt from the Heavens",
      "phase": "movementPhase",
      "phaseDetails": "Deployment Phase",
      "icon": "movement",
      "lore": "...",
      "declare": "...",
      "effect": "...",
      "cpCost": null,
      "isReaction": false
    }
  ]
}
```

---

## Lore Schema (Spells)

Lores contain spells available to wizards of a faction.

```json
{
  "id": "uuid-v5",
  "name": "Lore of the Storm",
  "cardType": "Lore",
  "source": "aos-4e",
  "faction_id": "STORMCAST_ETERNALS",
  "restrictionText": "WIZARD only",
  "spells": [
    {
      "id": "uuid-v5",
      "name": "Lightning Blast",
      "castingValue": 7,
      "chantValue": null,
      "phase": "heroPhase",
      "phaseDetails": "Your Hero Phase",
      "icon": "offensive",
      "lore": "...",
      "declare": "Pick a wizard...",
      "effect": "Roll 2D6..."
    }
  ]
}
```

---

## Enhancement Schema

Enhancements are grouped by type: artefacts, heroic traits, and other.

```json
{
  "artefacts": [
    {
      "id": "uuid-v5",
      "name": "Mirrorshield",
      "cardType": "Enhancement",
      "enhancementType": "artefactsOfPower",
      "source": "aos-4e",
      "points": 20,
      "phase": "combatPhase",
      "phaseDetails": "Passive",
      "icon": "defensive",
      "lore": "...",
      "declare": null,
      "effect": "..."
    }
  ],
  "heroicTraits": [...],
  "other": [...]
}
```

### Enhancement Types

| Type | Description |
|------|-------------|
| `artefactsOfPower` | Magical items for heroes |
| `heroicTraits` | Character traits for heroes |
| `otherEnhancements` | Other enhancement types |
| `regimentAbilities` | Regiment-specific abilities |

---

## Terrain Schema

Faction-specific terrain features.

```json
{
  "id": "uuid-v5",
  "name": "Awakened Wyldwood",
  "cardType": "FactionTerrain",
  "source": "aos-4e",
  "abilities": [...]
}
```

---

## Rules Schema

Battle traits and army rules.

```json
{
  "battleTraits": [
    {
      "name": "Heavens-sent",
      "phase": "movementPhase",
      "phaseDetails": "Deployment Phase",
      "icon": "movement",
      "lore": "...",
      "declare": "...",
      "effect": "..."
    }
  ]
}
```

---

## Grand Alliances

| Alliance | Factions |
|----------|----------|
| **Order** | Stormcast Eternals, Cities of Sigmar, Daughters of Khaine, Fyreslayers, Idoneth Deepkin, Kharadron Overlords, Lumineth Realm-lords, Seraphon, Sylvaneth |
| **Chaos** | Blades of Khorne, Disciples of Tzeentch, Hedonites of Slaanesh, Maggotkin of Nurgle, Skaven, Slaves to Darkness, Beasts of Chaos*, Helsmiths of Hashut |
| **Death** | Flesh-eater Courts, Nighthaunt, Ossiarch Bonereapers, Soulblight Gravelords |
| **Destruction** | Gloomspite Gitz, Ironjawz, Kruleboyz, Ogor Mawtribes, Sons of Behemat, Bonesplitterz* |

\* Legends factions

---

## Comparison with 40K Data

| Aspect | 40K (10th Edition) | AoS (4th Edition) |
|--------|-------------------|-------------------|
| Units | Datasheets | Warscrolls |
| Unit Stats | M, T, SV, W, LD, OC | Move, Save, Control, Health, Ward |
| Weapons | Range, A, BS/WS, S, AP, D | Range, A, Hit, Wound, Rend, D |
| Army Building | Detachments | Battle Formations |
| Tactics | Stratagems (CP-based) | No stratagems |
| Magic | Psychic via abilities | Spell Lores with casting values |
| Terrain | Generic | Faction-specific |
| Enhancements | Per-detachment | Artefacts, Heroic Traits, Other |

---

## Data Source

Data is extracted from the official Age of Sigmar app data export using `readAoSExport.mjs`.

- **Source File**: `aos/temp/data-export-{version}.json`
- **Script**: `aos/readAoSExport.mjs`
- **Output**: `aos/gdc/{faction}.json`

### Running the Export

```bash
cd aos
node readAoSExport.mjs
```

This will:
1. Read the latest data export from `temp/`
2. Process all 27 factions
3. Generate JSON files in `gdc/`
4. Show a change summary report
5. Stage changed files in git

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 363 | 2025-12-04 | Initial AoS 4th Edition data |
