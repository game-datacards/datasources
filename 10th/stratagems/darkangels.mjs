import {TURN, TYPE, PHASE } from './CONSTANTS';

const detachment = 'Unforgiven Task Force';

const template = [{
  name: 'UNFORGIVEN FURY',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `With focused aggression, the Dark Angels
relentlessly punish the foe.`,
  when: `Your Shooting phase or the
Fight phase.`,
  target: `One Adeptus Astartes unit from
your army that has not been selected to
shoot or fight this phase.`,
  effect: `Until the end of the phase,
weapons equipped by models in your
unit have the [LETHAL HITS] ability. In
addition, if one or more Adeptus Astartes
units from your army are currently
Battle-shocked, until the end of the phase,
each time a model in your unit makes an
attack, a successful unmodified Hit roll of
5+ scores a Critical Hit.`,
  restrictions: ``
},{
  name: 'INTRACTABLE',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `Although stubborn warriors, even the
resolute Dark Angels know that a fighting
retreat can be the wisest course of action.`,
  when: `Your Movement phase, just after
an Adeptus Astartes unit from your army
Falls Back.`,
  target: `That Adeptus Astartes unit.`,
  effect: `Until the end of the turn, that unit
is eligible to shoot and declare a charge,
even though it Fell Back this phase.`,
  restrictions: ``
},{
  name: 'ARMOUR OF CONTEMPT',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `The belligerency and transhuman
physiologies of the Adeptus Astartes make
them unyielding foes.`,
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
  name: 'FIRE DISCIPLINE',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `There is no escaping the Unforgiven’s
wrath when they bring their disciplined
firepower to bear.`,
  when: `Your Shooting phase.`,
  target: `One Adeptus Astartes unit from
your army that has not been selected to
shoot this phase.`,
  effect: `Until the end of the phase, ranged
weapons equipped by models in that
unit have the [ASSAULT], [HEAVY] and
[IGNORES COVER] abilities.`,
  restrictions: ``
},{
  name: 'GRIM RETRIBUTION',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `The Dark Angels are renowned for yielding
nothing to the enemy, and fighting back
with unanswerable fury in the face of
odds that would force even other Adeptus
Astartes to reconsider their position.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has shot.`,
  target: `One Adeptus Astartes unit from
your army that had one or more models
destroyed as a result of the attacking
unit’s attacks.`,
  effect: `Your unit can shoot as if it were
your Shooting phase, but it must target
the enemy unit that just attacked it, and
can only do so if that enemy unit is an
eligible target.`,
  restrictions: ``
},{
  name: 'UNBREAKABLE LINES',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.charge],
  fluff: `Countless assaults have faltered against
the unbreakable ceramite wall that is the
Unforgiven standing their ground.`,
  when: `Your opponent’s Charge phase, just
after an enemy unit ends a Charge move.`,
  target: `One Adeptus Astartes unit from
your army within Engagement Range of
that enemy unit.`,
  effect: `Until the end of the turn, each
time an attack is allocated to a model in
your unit, subtract 1 from the Damage
characteristic of that attack.`,
  restrictions: ``
}];

export default template;
