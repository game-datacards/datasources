import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Waaagh! Tribe';

const template = [{
  name: 'CAREEN!',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `If their vehicle is on its last legs, any Ork
worth their steering wheel will aim its
blazing remains into the nearest cluster
of enemies. The ensuing explosions never
fail to raise a rousing cheer from nearby
Ork onlookers.`,
  when: `Any phase, just after an Orks
Vehicle unit from your army with the
Deadly Demise ability is destroyed.`,
  target: `That destroyed Orks Vehicle
unit, if you roll a 6 for its Deadly Demise
ability. You can use this Stratagem on that
unit even though it was just destroyed.`,
  effect: `Your unit can make a Normal or
Fall Back move before its Deadly Demise
ability is resolved, and before any
embarked units perform an Emergency
Disembarkation. When making this move,
your unit can move over enemy units
(excluding Monsters and Vehicles) as if
they were not there.`,
  restrictions: ``
},{
  name: 'ORKS IS NEVER BEATEN',
  cost: 2,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `So resilient is Ork physiology – and so
slow are Orks on the uptake – that even
killing wounds can take a while to register.`,
  when: `Fight phase, just after an enemy
unit has selected its targets.`,
  target: `One Orks unit from your army
that was selected as the target of one or
more of the attacking unit’s attacks.`,
  effect: `Until the end of the phase, each
time a model in your unit is destroyed, if
that model has not fought this phase, do
not remove it from play. The destroyed
model can fight after the attacking
model’s unit has finished making attacks,
and is then removed from play.`,
  restrictions: ``
},{
  name: 'UNBRIDLED CARNAGE',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `When Orks get stuck into the foe, the
carnage is wonderful to behold, at least
for other Orks.`,
  when: `Fight phase.`,
  target: `One Orks unit from your army
that has not been selected to fight
this phase.`,
  effect: `Until the end of the phase, each
time an Orks model in your unit makes a
melee attack, an unmodified hit roll of 5+
scores a Critical Hit.`,
  restrictions: ``
},{
  name: '’ARD AS NAILS',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Even the lowliest Ork Boy can take a
tremendous amount of punishment before
being slain.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Orks unit from your army
that was selected as the target of one or
more of the attacking unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack targets your unit, subtract
1 from the Wound roll.`,
  restrictions: `You cannot select
a Vehicle or Gretchin unit for
this Stratagem. `
},{
  name: 'MOB RULE',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `The more Orks that gather in one place the
more the Waaagh! energy flows, and the
more fearless they all become.`,
  when: `Your Command phase.`,
  target: `One Mob unit from your army that
contains 10 or more models and is not
Below Half-strength.`,
  effect: `Until the end of the phase, while
a friendly Orks Infantry unit is within 6"
of that Mob unit, that Orks Infantry unit
can still be selected as the target of your
Stratagems even if it is Battle-shocked.`,
  restrictions: ``
},{
  name: 'ERE WE GO',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `’Even lumbering Orks can put on a
surprising turn of speed when the promise
of a good face-to-face fight is in the offing.
Once a horde of Orks get a sight of the foe,
nothing can stop them.`,
  when: `Start of your Movement phase.`,
  target: `One Orks Infantry unit from
your army.`,
  effect: `Until the end of the turn, add 2
to Advance and Charge rolls made for
your unit.`,
  restrictions: ``
}];

export default template;
