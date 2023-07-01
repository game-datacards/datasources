import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Champions of Russ';

const template = [{
  name: 'ARMOUR OF CONTEMPT',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `The belligerency of the Adeptus Astartes,
combined with their transhuman
physiology, makes them unyielding foes
to face.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Adeptus Astartes unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack targets your unit, worsen
the Armour Penetration characteristic of
that attack by 1.`,
  restrictions: ``
},{
  name: 'GO FOR THE THROAT',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `With the scent of blood in the air and the
rushing joy of battle surging through
every true warrior’s hearts, even the
greatest quarry can be brought down.`,
  when: `Fight phase.`,
  target: `One Adeptus Astartes unit from
your army that has not been selected to
fight this phase.`,
  effect: `Until the end of the phase,
improve the Armour Penetration
characteristic of melee weapons
equipped by models in your unit by 1.
If the Saga of the Beastslayer has been
completed by your army, until the end
of the phase, such weapons have the
[LANCE] ability as well.`,
  restrictions: ``
},{
  name: 'RUNIC WARDS',
  cost: 1,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Imbued as they are with the cunning
psychic might of the Rune Priests,
shamanistic totems, tattoos and fetishes
are a potent shield against baleful attacks
and the foul sorcery of witches.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Adeptus Astartes unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase,
models in your unit have the Feel No
Pain 5+ ability against mortal wounds
and Psychic Attacks. If the Saga of the
Bear has been completed by your army,
until the end of the phase, models in
your unit have the Feel No Pain 4+ ability
against mortal wounds and Psychic
Attacks instead.`,
  restrictions: ``
},{
  name: 'DEATH HOWL',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Having stalked their prey or run them
to ground, all that remains is to go for
the enemy’s weakest points, to rip them
apart in a furious bloodletting. Onlookers
are stricken with terror at the bloody
spectacle, an instant before the sons of
Russ pounce upon them.`,
  when: `Fight phase.`,
  target: `One Adeptus Astartes unit from
your army that destroyed one or more
enemy units this phase.`,
  effect: `Until the end of the phase,
each time a model in your unit makes
a Consolidation move, it can move up
to 6" instead of up to 3", provided your
unit ends that Consolidation move in
Unit Coherency and within Engagement
Range of one or more enemy units. In
addition, if the Saga of Majesty has been
completed by your army, each enemy
unit within 6" of your unit when it ends
that Consolidation move must take a
Battle-shock test`,
  restrictions: ``
},{
  name: 'WARRIOR PRIDE',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `The greatest champions amongst the
sons of Russ must take the fight to the
enemy, leading by example to uphold the
honour of their Chapter.`,
  when: `Your Command phase.`,
  target: `One Adeptus Astartes
Character model from your army.`,
  effect: `Select one Saga that has not
yet been completed by your army.
Until the end of the turn, models in your
Character’s unit have the benefit of the
selected Saga as if it had been completed
by your army.`,
  restrictions: ``
},{
  name: 'RELENTLESS ASSAULT',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `Once their blades and claws run red with
the enemy’s blood, nothing will hold the
savage sons of Russ back from new prey.`,
  when: `Your Movement phase, just after
an Adeptus Astartes unit from your army
makes a Fall Back or Advance move.`,
  target: `That Adeptus Astartes unit.`,
  effect: `Until the end of the turn, your unit
is eligible to shoot even though it Fell Back
or Advanced this phase. If the Saga of the
Warrior Born has been completed by your
army, until the end of the turn, your unit is
also eligible to declare a charge. `,
  restrictions: ``
}];

export default template;
