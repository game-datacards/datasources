import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Sons of Sanguinius';

const template = [{
  name: 'ANGEL\'S SACRIFICE',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `The Blood Angels would gladly put
themselves in harm’s way to protect
others, exemplifying the sacrifice
of Sanguinius.`,
  when: `Any phase.`,
  target: `One Adeptus Astartes
Character unit from your army that
was just destroyed. You can use this
Stratagem on that unit even though it was
just destroyed.`,
  effect: `Until the end of the battle, each
time a friendly Adeptus Astartes unit
makes an attack that targets the enemy
unit that just destroyed your Character
unit, you can re-roll the Hit roll.`,
  restrictions: ``
},{
  name: 'ARMOUR OF CONTEMPT',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `The belligerency of the Adeptus Astartes
combined with their transhuman
physiology makes them unyielding foes
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
  name: 'AGGRESSIVE ONSLAUGHT',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `The Sons of Sanguinius constantly
push towards new foes, the bloodlust
singing in their veins unleashed in a
controlled dynamism.`,
  when: `Fight phase.`,
  target: `One Adeptus Astartes
unit from your army, just before that
unit Consolidates.`,
  effect: `Until the end of the phase,
each time a model in your unit makes a
Consolidation move, it can move up to
6" instead of up to 3", provided your unit
ends that Consolidation move in Unit
Coherency and within Engagement Range
of one or more enemy units.`,
  restrictions: ``
},{
  name: 'RED RAMPAGE',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `In times of great desperation, fury and
ferocity can be a warrior’s strongest allies.`,
  when: `Fight phase.`,
  target: `One Adeptus Astartes unit from
your army that has not been selected to
fight this phase.`,
  effect: `Until the end of the phase,
melee weapons equipped by models
in your unit have the [LANCE] and
[LETHAL HITS] abilities.`,
  restrictions: ``
},{
  name: 'ONLY IN DEATH DOES DUTY END',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Imminent death does not prevent a Space
Marine from enacting his final justice
upon the enemies of the Imperium.`,
  when: `Fight phase, just after an enemy
unit has selected its targets.`,
  target: `One Adeptus Astartes unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, each
time a model in your unit is destroyed, if
that model has not fought this phase, do
not remove it from play. The destroyed
model can fight after the attacking
model’s unit has finished making its
attacks, and is then removed from play.`,
  restrictions: ``
},{
  name: 'RELENTLESS ASSAULT',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `The Blood Angels are loathe to resort to
the defensive strategies favoured by
other Chapters, and a tactical withdrawal
is but a prelude to re-entering the fray.`,
  when: `Your Movement phase, just after
an Adeptus Astartes unit from your army
Falls Back.`,
  target: `That Adeptus Astartes unit.`,
  effect: `Until the end of the turn, your unit
is eligible to declare a charge even though
it Fell Back this phase.`,
  restrictions: ``
}];

export default template;
