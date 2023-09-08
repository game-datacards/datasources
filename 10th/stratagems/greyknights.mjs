import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Teleport Strike Force';

const template = [{
  name: 'RADIANT STRIKE',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Psychic fire rimes the blades of the Grey
Knights as they charge at the foe, fanned
by their battle fury. At the moment of
contact, the empyric charge is unleashed
in a blast of azure light.`,
  when: `Fight phase.`,
  target: `One Grey Knights Psyker unit
from your army.`,
  effect: `Until the end of the phase, melee
weapons equipped by models in your unit
with the [PSYCHIC] ability also have the
[DEVASTATING WOUNDS] ability.`,
  restrictions: ``
},{
  name: 'PROGNISTICATED ARRIVAL',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `Accessing a vision granted by the
Chapter’s Prognosticars, the Grey
Knights perceive the hidden ways of the
battlefield and a sliver of the enemy’s
intentions, granting them a prophetic
situational awareness that aids their
strategic disposition.`,
  when: `Your Movement phase.`,
  target: `One Grey Knights Psyker unit
from your army that is arriving using the
Deep Strike or Teleport Assault abilities
this phase.`,
  effect: `Your unit can be set up anywhere
on the battlefield that is more than 3"
horizontally away from all enemy models.
RESTRICTIONS: A unit targeted by this
Stratagem is not eligible to declare a
charge in the same turn.`,
  restrictions: ``
},{
  name: 'DEATH FROM THE WARP',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `Utilising their warp-attuned senses during
the timeless instant of teleportation, Grey
Knights know exactly where the enemy
are before they arrive. They emerge
from the blinding flare of warp energies
already firing.`,
  when: `Your Movement phase.`,
  target: `One Grey Knights Psyker unit
from your army that either Advanced this
turn or arrived using the Deep Strike or
Teleport Assault abilities this turn.`,
  effect: `Until the end of the phase, ranged
weapons equipped by models in your unit
have the [ASSAULT] ability and each time
a model in your unit makes an attack, add
1 to the Hit roll. `,
  restrictions: ``
},{
  name: 'HALOED IN SOULFIRE',
  cost: 2,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `The blazing glare of ancient technology
and the shrouding coils of the
immaterium often linger, obscuring the
Grey Knights’ presence.`,
  when: `Your Movement phase.`,
  target: `One Grey Knights Psyker unit
from your army that is arriving using the
Deep Strike or Teleport Assault abilities
this phase.`,
  effect: `Until the start of your next
Movement phase, your unit cannot be
targeted by ranged attacks unless the
attacking model is within 12". `,
  restrictions: ``
},{
  name: 'MISTS OF DEIMOS',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.movement],
  fluff: `When the enemy closes in, the Grey
Knights wreathe themselves in psychic
mists to confound the foe while they
reposition until the time is ready to launch
a counter-blow.`,
  when: `Your opponent’s Movement phase,
just after an enemy unit ends a Normal,
Advance or Fall Back move.`,
  target: `One Grey Knights Psyker unit
from your army that is within 9" of that
enemy unit.`,
  effect: `Your unit can make a Normal
move of up to 6" as if it were your
Movement phase or, if it has the Deep
Strike ability, it can be placed into
Strategic Reserves.`,
  restrictions: `You cannot select a unit
that is within Engagement Range of one or
more enemy units.`
},{
  name: 'TRUESILVER ARMOUR',
  cost: 1,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Grey Knights battle plate incorporates
litanies of purity, strands of sanctified
silver and other sacred wards, whose
defences can be further empowered by
ritual mantras.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Grey Knights unit from your
army that was selected as the target of
one or more of that enemy unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack targets your unit, worsen
the Armour Penetration characteristic of
that attack by 1.`,
  restrictions: ``
}];

export default template;
