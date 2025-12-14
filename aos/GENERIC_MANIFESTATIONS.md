# Generic Manifestations

This document describes generic manifestations - universal manifestations that can be used by any faction with a WIZARD.

## Overview

Generic manifestations are special units that are not tied to any specific faction. Any army with a WIZARD can summon these manifestations. They are stored in a separate `gdc/generic.json` file.

## How Generic Manifestations Differ from Faction Manifestations

| Aspect | Generic Manifestations | Faction Manifestations |
|--------|----------------------|----------------------|
| Faction restriction | None - any WIZARD can summon | Faction-specific WIZARD required |
| Storage location | `gdc/generic.json` | Within faction JSON files |
| Summon declaration | "pick a friendly **WIZARD**" | "pick a friendly **[FACTION] WIZARD**" |
| Points cost | Usually null (included in army) | Usually null |

## Data Structure

### gdc/generic.json

```json
{
  "id": "GENERIC",
  "name": "Generic",
  "updated": "2024-01-01T00:00:00.000Z",
  "compatibleDataVersion": "363",
  "warscrolls": [
    {
      "id": "uuid",
      "name": "Krondspine Incarnate of Ghur",
      "cardType": "Warscroll",
      "source": "aos-4e",
      "faction_id": "GENERIC",
      "factions": ["Generic"],
      "keywords": ["Manifestation", "Endless Spell", "Incarnate", "Fly", "Ward (6+)"],
      "stats": {
        "move": "10\"",
        "save": "6+",
        "control": "8+",
        "health": "12",
        "ward": "6+",
        "wizard": null,
        "priest": null
      },
      "summonedBy": {
        "spell": "Summon Krondspine Incarnate of Ghur",
        "lore": "Krondspine Incarnate of Ghur Summon Lore",
        "castingValue": 8
      }
    }
  ],
  "manifestationLores": [
    {
      "id": "uuid",
      "name": "Krondspine Incarnate of Ghur Summon Lore",
      "cardType": "Lore",
      "source": "aos-4e",
      "faction_id": "GENERIC",
      "spells": [
        {
          "id": "uuid",
          "name": "Summon Krondspine Incarnate of Ghur",
          "castingValue": 8,
          "phase": "heroPhase",
          "phaseDetails": "Your Hero Phase",
          "icon": "special",
          "declare": "If there is not a friendly Krondspine Incarnate of Ghur on the battlefield, pick a friendly WIZARD to cast this spell...",
          "effect": "Set up a Krondspine Incarnate of Ghur wholly within 12\" of the caster...",
          "keywords": ["Summon", "Spell"],
          "linkedWarscroll": "Krondspine Incarnate of Ghur"
        }
      ]
    }
  ]
}
```

## gdc/index.json

The index file provides a list of all faction files plus the generic file:

```json
{
  "updated": "2024-01-01T00:00:00.000Z",
  "factions": [
    { "id": "STORMCAST_ETERNALS", "name": "Stormcast Eternals", "file": "stormcast_eternals.json" },
    { "id": "CITIES_OF_SIGMAR", "name": "Cities of Sigmar", "file": "cities_of_sigmar.json" }
    // ... all 27 factions
  ],
  "generic": {
    "id": "GENERIC",
    "name": "Generic",
    "file": "generic.json"
  }
}
```

## Frontend Implementation

### Loading All Data

```typescript
// Load faction data
const factionResponse = await fetch('/data/aos/gdc/stormcast_eternals.json');
const factionData = await factionResponse.json();

// Load generic data
const genericResponse = await fetch('/data/aos/gdc/generic.json');
const genericData = await genericResponse.json();
```

### Merging Generic Manifestations with Faction Data

When displaying available manifestations for a faction, combine faction-specific and generic manifestations:

```typescript
interface FactionData {
  id: string;
  name: string;
  warscrolls: Warscroll[];
  manifestationLores: Lore[];
}

interface GenericData {
  id: 'GENERIC';
  name: 'Generic';
  warscrolls: Warscroll[];
  manifestationLores: Lore[];
}

function getAvailableManifestations(
  factionData: FactionData,
  genericData: GenericData,
  hasWizard: boolean
): Warscroll[] {
  // Start with faction-specific manifestation warscrolls
  const manifestations = factionData.warscrolls.filter(w =>
    w.keywords?.includes('Manifestation')
  );

  // Add generic manifestations if the army has a WIZARD
  if (hasWizard) {
    manifestations.push(...genericData.warscrolls);
  }

  return manifestations;
}

function getAvailableManifestationLores(
  factionData: FactionData,
  genericData: GenericData,
  hasWizard: boolean
): Lore[] {
  // Start with faction-specific manifestation lores
  const lores = [...factionData.manifestationLores];

  // Add generic lores if the army has a WIZARD
  if (hasWizard) {
    lores.push(...genericData.manifestationLores);
  }

  return lores;
}
```

### React Example

```tsx
function ManifestationSelector({ factionData, genericData, armyHasWizard }) {
  const allManifestations = useMemo(() => {
    const manifestations = [...factionData.manifestationLores];

    // Include generic manifestation lores if army has a wizard
    if (armyHasWizard) {
      manifestations.push(...genericData.manifestationLores);
    }

    return manifestations;
  }, [factionData, genericData, armyHasWizard]);

  return (
    <div>
      <h3>Available Manifestation Lores</h3>

      {/* Faction-specific lores */}
      {factionData.manifestationLores.length > 0 && (
        <section>
          <h4>{factionData.name} Manifestations</h4>
          {factionData.manifestationLores.map(lore => (
            <LoreCard key={lore.id} lore={lore} />
          ))}
        </section>
      )}

      {/* Generic lores - available to any wizard */}
      {armyHasWizard && genericData.manifestationLores.length > 0 && (
        <section>
          <h4>Universal Manifestations</h4>
          <p className="note">Available to any WIZARD</p>
          {genericData.manifestationLores.map(lore => (
            <LoreCard key={lore.id} lore={lore} isGeneric />
          ))}
        </section>
      )}
    </div>
  );
}
```

## TypeScript Types

```typescript
interface GenericManifestationData {
  id: 'GENERIC';
  name: 'Generic';
  updated: string;
  compatibleDataVersion: string;
  warscrolls: Warscroll[];
  manifestationLores: Lore[];
}

interface IndexData {
  updated: string;
  factions: FactionEntry[];
  generic: {
    id: 'GENERIC';
    name: 'Generic';
    file: 'generic.json';
  };
}

interface FactionEntry {
  id: string;
  name: string;
  file: string;
}
```

## Currently Known Generic Manifestations

- **Krondspine Incarnate of Ghur** - A powerful Incarnate that any WIZARD can summon

## Notes

1. **Wizard requirement**: Generic manifestations can only be summoned if the army includes at least one WIZARD unit.

2. **Frontend responsibility**: The frontend must decide when to show generic manifestations based on army composition.

3. **No duplication**: Generic manifestations are NOT included in faction files. The frontend must load and merge `generic.json` separately.

4. **Bidirectional linking**: Generic manifestations use the same `linkedWarscroll` (on spells) and `summonedBy` (on warscrolls) linking system as faction manifestations.
