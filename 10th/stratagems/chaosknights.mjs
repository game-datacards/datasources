import {TURN, TYPE, PHASE } from './CONSTANTS';

const detachment = 'Traitoris Lance';

const template = [{
  name: 'DREAD HOUNDS',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `War Dog pilots encircle their terrified
victims then attack in a ferocious mass.`,
  when: `The start of your Shooting phase or
the start of the Fight phase.`,
  target: `Two or more War Dog units from
your army and one enemy unit that is an
eligible target for each of those selected
War Dog units.`,
  effect: `Until the end of the phase,
the selected War Dog units can only
target that enemy unit, but all weapons
equipped by those War Dog models gain
the [SUSTAINED HITS 1] ability. In addition,
if that enemy unit is Battle-shocked, until
the end of the phase, each time a selected
War Dog model makes an attack against
that enemy unit, an unmodified Hit roll of
5+ scores a Critical Hit.`,
  restrictions: ``
},{
  name: 'DISDAIN FOR THE WEAK',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Chaos Knight pilots refuse to yield while
foes remain to be slain, disdainfully
ignoring those who succumb to fear.`,
  when: `Fight phase, just after an enemy
unit has selected its targets.`,
  target: `One Chaos Knights unit from
your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, your
model has the Feel No Pain 6+ ability, and
the Feel No Pain 5+ ability against attacks
made by Battle-shocked models.`,
  restrictions: ``
},{
  name: 'PTERRORSHADES',
  cost: 1,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `Shrieking with ghoulish hunger, daemonic
entities descend in a tatterwinged
whirlwind to rend apart the souls of those
enemies who show even a moment’s fear.
The soul-raptors tear apart their victims’
animus and, as they feed, this life force
is channelled to regenerate the battle
damage or heal the pilot of the Knight in
which these creatures roost.`,
  when: `Any phase, just after an enemy
unit fails a Battle-shock test.`,
  target: `One Chaos Knights unit from
your army that is within 12" of that
enemy unit.`,
  effect: `Roll six D6. For each 4+, that
enemy unit suffers 1 mortal wound and
this model regains up to 1 lost wound. `,
  restrictions: ``
},{
  name: 'A LONG LEASH',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `The War Dogs of the Chaos Knights are
more terrified of their lords than they
are the enemy, and they heed their
masters well, for they know the price of
disobedience or disloyalty.`,
  when: `Your Command phase.`,
  target: `One Abhorrent model from your
army and up to three War Dog models
from your army.`,
  effect: `Until the start of your next
Command phase, those War Dog models
count as being within range of any Aura
abilities that Abhorrent model has.`,
  restrictions: ``
},{
  name: 'KNIGHTS OF SHADE',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement,PHASE.charge],
  fluff: `Like dark phantoms, some Chaos
Knights can move through solid walls
without hindrance.`,
  when: `Your Movement phase or your
Charge phase.`,
  target: `Up to two War Dog models from
your army or one Titanic Chaos Knights
model from your army.`,
  effect: `Until the end of the phase, the
selected models can move horizontally
through models and terrain features as if
they were not there.`,
  restrictions: ``
},{
  name: 'DIABOLIC BULWARK',
  cost: 1,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `Ectoplasmic blood surges hot through
glowing conduits as the Chaos Knight
feeds power to its shield emitters.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
  target: `One Chaos Knights unit from
your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase,
that Chaos Knights model has a 4+
invulnerable save against ranged attacks.`,
  restrictions: ``
}];

export default template;
