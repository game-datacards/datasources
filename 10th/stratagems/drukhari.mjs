import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Realspace Raiders';

const template = [{
  name: 'PREY ON THE WEAK',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `The scent of a foe in pain draws Drukhari
to it like hungry predators to an injured
beast, their senses sharpening at its tang.`,
  when: `Your Shooting phase.`,
  target: `One Kabal unit from your
army and one enemy unit that is
Below Half-strength.`,
  effect: `Until the end of the phase, each
time a model in your unit makes an attack
that targets that enemy unit, you can
re-roll the Wound roll. `,
  restrictions: ``
},{
  name: 'STRIKE AND FADE',
  cost: 2,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `The Drukhari are masters at using
hit-and-run tactics, engaging a target
with a flurry of shots before quickly
manoeuvring into cover or out of sight.`,
  when: `End of your Shooting phase.`,
  target: `One Drukhari unit from your
army (excluding Aircraft).`,
  effect: `Your unit can immediately make a
Normal move.`,
  restrictions: `Until the end of the turn,
your unit is not eligible to declare a charge
and that unit cannot embark within a
Transport at the end of this move.`
},{
  name: 'ACROBATIC DISPLAY',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.charge],
  fluff: `Many Wych Cults favour spectacular
gymnastic displays. Their fighters are
never still, springing from one foot to the
other at blinding speed.`,
  when: `Your Charge phase.`,
  target: `One Wych Cult unit from
your army.`,
  effect: `Until the end of the phase, your
unit is eligible to declare a charge even if it
Fell Back or Advanced this turn. `,
  restrictions: ``
},{
  name: 'ALLIANCE OF AGONY',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `Even the most bloodthirsty Drukhari
will veil their enmity to work together
against a shared enemy for the same
gruesome purpose.`,
  when: `Start of any phase.`,
  target: `One Archon, one Succubus and
one Haemonculus from your army.`,
  effect: `Discard one Pain token from
your Pain token pool. Until the end of the
phase, all three of those models’ units
are Empowered.`,
  restrictions: `You can only use this
Stratagem if you are able to select all
three of the target models stated above.`
},{
  name: 'QUICKSILVER REACTIONS',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `The hyper-fast reflexes of the Drukhari
allow them to duck and weave to avoid all
but the swiftest enemy strikes.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Drukhari unit from your
army that was selected as the target of
one or more of the attacking unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack that targets your unit,
subtract 1 from the Hit roll.`,
  restrictions: `You cannot target a
Haemonculus Covens unit from your
army for this Stratagem. `
},{
  name: 'INSENSIBLE TO PAIN',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `The twisted creations of the Haemonculus
Covens are insensible to all but the most
mortal injuries.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Haemonculus Covens unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack targets your unit, subtract
1 from the Wound roll.`,
  restrictions: ``
}];

export default template;
