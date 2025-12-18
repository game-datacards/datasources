# Manifestation Lore and Warscroll Linking

This document describes the data changes made to link manifestation lores with their corresponding warscrolls bidirectionally.

## Overview

Manifestations in Age of Sigmar are special units that are summoned by spells from manifestation lores. We've added bidirectional linking so that:
1. **Manifestation lore spells** show which warscroll they summon
2. **Manifestation warscrolls** show which spell summons them

---

## Data Schema Changes

### 1. Manifestation Lore Abilities - New Field: `linkedWarscroll`

**Location:** `manifestationLores[].spells[]`

**Field:** `linkedWarscroll`
**Type:** `string | null`
**Description:** The name of the warscroll that this summon spell creates. Only present on summon spells in manifestation lores.

#### Example Structure
```json
{
  "manifestationLores": [
    {
      "id": "uuid",
      "name": "Lore of the Abyss",
      "cardType": "Lore",
      "source": "aos-4e",
      "faction_id": "IDONETH_DEEPKIN",
      "restrictionText": null,
      "spells": [
        {
          "id": "uuid",
          "name": "Summon Incarnate of the Deep",
          "castingValue": 8,
          "chantValue": null,
          "phase": "heroPhase",
          "phaseDetails": "Your Hero Phase",
          "icon": "special",
          "declare": "If there is not a friendly Incarnate of the Deep on the battlefield...",
          "effect": "Set up an Incarnate of the Deep wholly within 12\" of the caster...",
          "keywords": ["Summon", "Spell"],
          "linkedWarscroll": "Incarnate of the Deep"  // <-- NEW FIELD
        }
      ]
    }
  ]
}
```

---

### 2. Warscrolls - New Field: `summonedBy`

**Location:** `warscrolls[]`

**Field:** `summonedBy`
**Type:** `object | null`
**Description:** Information about the spell that summons this warscroll. Only present on manifestation warscrolls (units with the "Manifestation" keyword).

#### Object Properties

| Property | Type | Description |
|----------|------|-------------|
| `spell` | `string` | Name of the summon spell |
| `lore` | `string \| null` | Name of the lore containing the spell |
| `castingValue` | `number \| null` | Casting value required for the spell |

#### Example Structure
```json
{
  "warscrolls": [
    {
      "id": "uuid",
      "name": "Incarnate of the Deep",
      "cardType": "Warscroll",
      "keywords": ["Manifestation", "Endless Spell", "Ward (6+)", "Fly", "Incarnate"],
      "stats": {
        "move": "10\"",
        "save": "4+",
        "control": "9+",
        "health": "12",
        "ward": "6+",
        "wizard": null,
        "priest": null
      },
      "weapons": { ... },
      "abilities": [ ... ],
      "summonedBy": {                              // <-- NEW FIELD
        "spell": "Summon Incarnate of the Deep",
        "lore": "Lore of the Abyss",
        "castingValue": 8
      },
      "notes": null
    }
  ]
}
```

---

## How to Identify Manifestation Warscrolls

A warscroll is a manifestation if:
1. It has `"summonedBy": { ... }` (not null)
2. OR it has `"Manifestation"` in its `keywords` array

```typescript
// TypeScript example
function isManifestationWarscroll(warscroll: Warscroll): boolean {
  return warscroll.summonedBy !== null ||
         warscroll.keywords?.includes('Manifestation');
}
```

---

## How to Identify Manifestation Lores

Manifestation lores are stored separately from spell lores:
- Regular spell lores: `spellLores[]`
- Manifestation lores: `manifestationLores[]`

All spells in `manifestationLores` are summon spells that create manifestations.

---

## Frontend Implementation Guide

### Use Case 1: Display Summon Info on Warscroll Card

When displaying a manifestation warscroll, show the summoning information:

```tsx
// React example
function WarscrollCard({ warscroll }) {
  return (
    <div>
      <h2>{warscroll.name}</h2>

      {warscroll.summonedBy && (
        <div className="summon-info">
          <span>Summoned by: </span>
          <strong>{warscroll.summonedBy.spell}</strong>
          {warscroll.summonedBy.castingValue && (
            <span> (Casting Value: {warscroll.summonedBy.castingValue}+)</span>
          )}
          {warscroll.summonedBy.lore && (
            <span> from {warscroll.summonedBy.lore}</span>
          )}
        </div>
      )}

      {/* rest of warscroll content */}
    </div>
  );
}
```

### Use Case 2: Link from Spell to Warscroll

When displaying a manifestation lore spell, link to the warscroll it summons:

```tsx
// React example
function ManifestationSpellCard({ spell, warscrolls }) {
  const linkedWarscroll = spell.linkedWarscroll
    ? warscrolls.find(w => w.name === spell.linkedWarscroll)
    : null;

  return (
    <div>
      <h3>{spell.name}</h3>
      <p>Casting Value: {spell.castingValue}+</p>
      <p>{spell.effect}</p>

      {linkedWarscroll && (
        <div className="linked-warscroll">
          <span>Summons: </span>
          <a href={`/warscroll/${linkedWarscroll.id}`}>
            {linkedWarscroll.name}
          </a>
        </div>
      )}
    </div>
  );
}
```

### Use Case 3: TypeScript Types

```typescript
interface SummonedBy {
  spell: string;
  lore: string | null;
  castingValue: number | null;
}

interface Warscroll {
  id: string;
  name: string;
  cardType: 'Warscroll';
  // ... other fields
  summonedBy: SummonedBy | null;
  notes: string | null;
}

interface LoreAbility {
  id: string;
  name: string;
  castingValue: number | null;
  chantValue: number | null;
  phase: string;
  phaseDetails: string;
  icon: string;
  declare: string | null;
  effect: string;
  keywords?: string[];
  linkedWarscroll: string | null;  // Only for manifestation lore spells
}

interface Lore {
  id: string;
  name: string;
  cardType: 'Lore';
  source: string;
  faction_id: string;
  restrictionText: string | null;
  spells: LoreAbility[];
}

interface FactionData {
  // ... other fields
  spellLores: Lore[];           // Regular spell lores
  manifestationLores: Lore[];   // Manifestation lores with linkedWarscroll
  warscrolls: Warscroll[];      // Includes summonedBy for manifestations
}
```

---

## Sample Data for Testing

### Idoneth Deepkin - Incarnate of the Deep

**Manifestation Lore Entry:**
```json
{
  "name": "Lore of the Abyss",
  "spells": [{
    "name": "Summon Incarnate of the Deep",
    "castingValue": 8,
    "linkedWarscroll": "Incarnate of the Deep"
  }]
}
```

**Warscroll Entry:**
```json
{
  "name": "Incarnate of the Deep",
  "keywords": ["Manifestation", "Endless Spell", "Ward (6+)", "Fly", "Incarnate"],
  "summonedBy": {
    "spell": "Summon Incarnate of the Deep",
    "lore": "Lore of the Abyss",
    "castingValue": 8
  }
}
```

### Stormcast Eternals - Celestian Vortex

**Manifestation Lore Entry:**
```json
{
  "name": "Manifestations of the Storm",
  "spells": [{
    "name": "Summon Celestian Vortex",
    "castingValue": 6,
    "linkedWarscroll": "Celestian Vortex"
  }]
}
```

**Warscroll Entry:**
```json
{
  "name": "Celestian Vortex",
  "keywords": ["Manifestation", "Endless Spell", "Fly"],
  "summonedBy": {
    "spell": "Summon Celestian Vortex",
    "lore": "Manifestations of the Storm",
    "castingValue": 6
  }
}
```

---

## Factions with Manifestation Lores

The following factions have manifestation lores (check `manifestationLores` array):

- Stormcast Eternals
- Daughters of Khaine
- Fyreslayers
- Idoneth Deepkin
- Lumineth Realm-lords
- Sylvaneth
- Blades of Khorne
- Disciples of Tzeentch
- Hedonites of Slaanesh
- Skaven
- Slaves to Darkness
- Beasts of Chaos
- Flesh-eater Courts
- Nighthaunt
- Ossiarch Bonereapers
- Soulblight Gravelords
- Gloomspite Gitz

---

## Notes

1. **Null handling:** Both `linkedWarscroll` and `summonedBy` can be `null`. Always check for null before accessing.

2. **Name matching:** The `linkedWarscroll` value is the exact warscroll name string. Use exact string matching to find the corresponding warscroll.

3. **Multiple lores:** Some manifestations appear in multiple lores (e.g., main faction lore and Spearhead lore). The `summonedBy` field shows one valid summon path, but the warscroll could potentially be summoned from different lores.

4. **Casting value consistency:** The `castingValue` in `summonedBy` matches the spell's casting value in the corresponding manifestation lore.
