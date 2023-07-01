import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Battle Host';

const template = [{
  name: 'FEIGNED RETREAT',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `The Aeldari are forever elusive, and their
actions are unpredictable and deceptive.
What appears to be a full retreat one
moment is revealed as the prelude to a
devastating attack the next.`,
  when: `Your Movement phase, just after
an Aeldari unit from your army makes a
Fall Back move.`,
  target: `That Aeldari unit.`,
  effect: `Your unit is eligible to shoot and
declare a charge this turn even though it
Fell Back`,
  restrictions: ``
},{
  name: 'MATCHLESS AGILITY',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `Grace in battle and merciless efficiency
are prized virtues in craftworld armies.
Like the shimmering blades of Khaine,
the Asuryani carve through the ranks of
their enemies.`,
  when: `Your Movement phase.`,
  target: `One Aeldari unit from your
army that has not been selected to move
this phase.`,
  effect: `Until the end of the phase, if your
unit Advances, do not make an Advance
roll for it. Instead, until the end of the
phase, add 6" to the Move characteristic
of models in your unit.`,
  restrictions: ``
},{
  name: 'FIRE AND FADE',
  cost: 2,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `The Aeldari are masters of hit-and-run
tactics, engaging a target with a flurry of
shots before quickly manoeuvring into
cover or out of sight.`,
  when: `End of your Shooting phase.`,
  target: `One Aeldari unit from your army.`,
  effect: `Your unit can make a Normal
move. It cannot embark within a
Transport at the end of this move.`,
  restrictions: `You cannot select an
Aircraft unit or a unit within Engagement
Range of one or more enemy units, and
until the end of the turn, the unit you
selected is not eligible to declare a charge.`
},{
  name: 'BLADESTORM',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `The well-trained Aeldari are able to lay
down a hail of fire from their weapons,
their superior reflexes allowing them to
track even the most sudden movement
and place every shot perfectly.`,
  when: `Your Shooting phase.`,
  target: `One Aeldari unit from your
army that has not been selected to shoot
this phase.`,
  effect: `Until the end of the phase, each
time a model in your unit makes an
attack, on a Critical Wound, improve the
Armour Penetration characteristic of that
attack by 2.`,
  restrictions: ``
},{
  name: 'PHANTASM',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.movement],
  fluff: `The Aeldari are masters of misdirection,
and they employ holo-emitters and psychic
phantasms to fool enemy scouts.`,
  when: `End of your opponent’s
Movement phase.`,
  target: `One Aeldari unit from your army.`,
  effect: `Your unit can make a Normal
move of up to 7". It cannot embark within
a Transport at the end of this move.`,
  restrictions: `You cannot select a unit
within Engagement Range of one or more
enemy units, and until the end of the turn,
you cannot target that unit with the Heroic
Intervention Stratagem.`
},{
  name: 'LIGHTNING-FAST REACTIONS',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `The Aeldari can process battlefield
events at baffling speed, making their
physical reactions so fast that they are
able to dodge attacks that would hit any
other target.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Aeldari unit from your army
(excluding Wraith Construct units) that
was selected as the target of one or more
of the attacking unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack targets your unit, subtract
1 from the Hit roll.`,
  restrictions: ``
}];

export default template;
