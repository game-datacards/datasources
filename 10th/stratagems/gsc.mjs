import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Ascension Day';

const template = [{
  name: 'UNQUESTIONING LOYALTY',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Broodkin are so fanatically loyal that they
do not hesitate to sacrifice themselves to
protect their leaders.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Genestealer Cults
Character unit from your army that was
selected as the target of one or more of
that enemy unit’s attacks.`,
  effect: `Until the end of the phase, each
time a Character model in your unit
would lose a wound, select one friendly
Genestealer Cults unit within 3" of it
(excluding Vehicle units). Your Character
model does not lost that wound and
that selected unit suffers one mortal
wound instead.`,
  restrictions: ``
},{
  name: 'COORDINATED TRAP',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Flowing like a dark tide down hidden
tunnels, along rubble-choked gulleys or
through sagging and rusted vents, the
faithful utterly encircle their enemies.`,
  when: `The start of your Shooting phase or
the start of the Fight phase.`,
  target: `Two Genestealer Cults units
from your army that have not been
selected to shoot or fight this phase, and
one enemy unit.`,
  effect: `Until the end of the phase, each
time a model in either of your units makes
an attack, it can only target that enemy
unit (and only if it is an eligible target
for that attack), and when resolving that
attack, add 1 to the Wound roll.`,
  restrictions: ``
},{
  name: 'TUNNEL CRAWLERS',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `Squirming, crawling and scrabbling
through confined spaces is second nature
to many broodkin, and is a skill they
use to assail seemingly impregnable
enemy positions.`,
  when: `Your Movement phase.`,
  target: `One Genestealer Cults unit
from your army that is arriving using the
Deep Strike ability this phase.`,
  effect: `Your unit can be set up anywhere
on the battlefield that is more than 3"
horizontally away from all enemy models.`,
  restrictions: `A unit targeted by this
Stratagem is not eligible to declare a
charge in the same turn.`
},{
  name: 'A PERFECT AMBUSH',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `These Cultists have tracked their enemies
tirelessly, as predatory beasts stalk their
prey. Only when their position is perfect do
they strike, engulfing their victims in a hail
of unexpected firepower.`,
  when: `Your Shooting phase.`,
  target: `One Genestealer Cults unit
from your army that arrived from Reserves
this turn and has not been selected to
shoot this phase.`,
  effect: `Until the end of the phase,
improve the Ballistic Skill and Armour
Penetration characteristics of ranged
weapons equipped by models in your
unit by 1.`,
  restrictions: ``
},{
  name: 'ONE WITH THE DARKNESS',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `In dark nooks and crevices the true
believers of the cult whisper and skulk, all
but invisible to those who approach.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
  target: `One Genestealer Cults
Infantry unit from your army that was
selected as the target of one or more of
that enemy unit’s attacks.`,
  effect: `Until the end of the phase, your
unit has the Stealth ability and can only
be selected as the target of a ranged
attack if the attacking model is within 12"`,
  restrictions: ``
},{
  name: 'RETURN TO THE SHADOWS',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.endOfTurn],
  fluff: `Ever cunning and duplicitous, broods of
the faithful often vanish back into tunnels
and vents after their initial strike, ready to
regroup and attack again elsewhere.`,
  when: `End of your opponent’s turn.`,
  target: `Up to two Genestealer Cults
Battleline units from your army, or one
other Genestealer Cults Infantry unit
from your army.`,
  effect: `Remove the targeted units
from the battlefield and place them into
Strategic Reserves.`,
  restrictions: `The targeted units must
have the Deep Strike ability and cannot be
within Engagement Range of any enemy
units when targeted.`
}];

export default template;
