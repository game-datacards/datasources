import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Berzerker Warband';

const template = [{
  name: 'GORY MASSACRE',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Those who witness the massacres
inflicted by the World Eaters flee to avoid
being the next victims.`,
  when: `Fight phase.`,
  target: `One World Eaters unit from
your army that made a Charge move this
turn and destroyed one or more enemy
units this phase.`,
  effect: `In your opponent’s next
Command phase, each enemy unit within
6" of your unit must take a Battle-shock
test. If the unit taking that test is Below
Half-strength, subtract 1 from that test.
Enemy units affected by this Stratagem
do not need to take any other Battle-shock
tests in the same phase.`,
  restrictions: ``
},{
  name: 'FOR THE SKULL THRONE!',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Khorne rewards those who test their might
against the strongest foes, blessing the
greatest warriors with his favour.`,
  when: `Fight phase.`,
  target: `One World Eaters unit from
your army that has not been selected to
fight this phase.`,
  effect: `Until the end of the phase,
each time a model in your unit makes a
melee attack that targets a Character,
Monster or Vehicle unit, add 1 to the
Wound roll. `,
  restrictions: ``
},{
  name: 'FOR THE BLOOD GOD!',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `When blood spills, the blessings of the
Blood God are bountiful.`,
  when: `Fight phase, just after a World
Eaters unit from your army destroys an
enemy unit.`,
  target: `That World Eaters unit.`,
  effect: `Make a Blessings of Khorne
roll. You can use the results of this roll
to activate one Blessing of Khorne.
That Blessing of Khorne does not count
towards your maximum number of
activated Blessings of Khorne, but all
other rules for Blessings of Khorne apply.`,
  restrictions: ``
},{
  name: 'KHORNE CARES NOT…',
  cost: 2,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Khorne cares not from whence the blood
flows, so long as it flows, and mere flesh
wounds will not stay the wrath of the
World Eaters.`,
  when: `Fight phase, just after an enemy
unit has selected its targets.`,
  target: `One World Eaters unit from
your army that was selected as the
target of one or more of that enemy
unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack targets your unit, subtract
1 from the Damage characteristic of
that attack.`,
  restrictions: ``
},{
  name: 'BLOOD OFFERING',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `The blood of Khorne’s devoted warriors
is still blood, and when the battleground
runs red, it is still a worthy addition to the
Blood God’s domain.`,
  when: `Any phase.`,
  target: `One World Eaters unit from
your army that was just destroyed
while it was within range of an objective
marker you controlled. You can use this
Stratagem on that unit even though it was
just destroyed.`,
  effect: `That objective marker remains
under your control, even if you have
no models within range of it, until your
opponent controls it at the start or end of
any turn. `,
  restrictions: ``
},{
  name: 'APOPLECTIC FRENZY',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `Those who fight for Khorne are driven
to even greater depths of rage, surging
towards the foe in a barely controlled tide.`,
  when: `Your Movement phase.`,
  target: `One World Eaters unit from
your army that has not been selected to
move this phase.`,
  effect: `Until the end of the phase, if your
unit Advances, do not make an Advance
roll for it. Instead, until the end of the
phase, add 6" to the Move characteristic
of models in your unit.`,
  restrictions: ``
}];

export default template;
