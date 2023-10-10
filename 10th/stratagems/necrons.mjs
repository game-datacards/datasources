import { TURN, TYPE, PHASE } from "./CONSTANTS.mjs";

const detachment = "Awakened Dynasty";

const template = [
  {
    name: "PROTOCOL OF THE ETERNAL GUARDIAN",
    cost: 1,
    type: TYPE["Epic Deed"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.any],
    fluff: `Necron rulers possess sophisticated
self-repair systems that can reknit their
corporeal forms so they can once more
command their legions.`,
    when: `Any phase.`,
    target: `One Necrons Infantry
Character model from your army that
was just destroyed.`,
    effect: `Set your model back up on the
battlefield as close as possible to where
it was destroyed and more than 1" away
from all enemy models, with half of its
starting number of wounds remaining.`,
    restrictions: `Each model can only
be targeted with this Stratagem once
per battle.`,
  },
  {
    name: "PROTOCOL OF THE HUNGRY VOID",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `The Necrons strike with data-augmented
accuracy, their murderous attacks as
inescapable as the killing cold of space.`,
    when: `Fight phase.`,
    target: `One Necrons unit from your
army that has not been selected to fight
this phase.`,
    effect: `Until the end of the phase, add
1 to the Strength characteristic of melee
weapons equipped by models in your
unit. In addition, If a Necrons Character
is leading your unit, until the end of the
phase, improve the Armour Penetration
characteristic of melee weapons
equipped by models in your unit by 1.`,
    restrictions: ``,
  },
  {
    name: "PROTOCOL OF THE CONQUERING TYRANT",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `The legions employ the strategies of their
masters in perfect synchronicity, laying
down hails of mechanically coordinated fire.`,
    when: `Your Shooting phase.`,
    target: `One Necrons unit from your
army that has not been selected to shoot
this phase.`,
    effect: `Until the end of the phase, each
time a model in your unit makes an attack
that targets a unit within half of the firing
weapon’s range, you can re-roll the Wound
roll. If a Necrons Character is leading
your unit, until the end of the phase, this
effect applies at the firing weapon’s full
range instead.`,
    restrictions: ``,
  },
  {
    name: "PROTOCOL OF THE UNDYING LEGIONS",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `At a hissing static signal, nanoscarabs
are released in boiling black clouds
that whirl about the legions and effect
constant repairs.`,
    when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has resolved its attacks.`,
    target: `One Necrons unit from your
army that had one or more of its models
destroyed as a result of the attacking
unit’s attacks.`,
    effect: `Your unit activates its
Reanimation Protocols and reanimates
D3 wounds. When doing so, if a Necrons
Character is leading your unit, your unit
reanimates D3+1 wounds instead.`,
    restrictions: ``,
  },
  {
    name: "PROTOCOL OF THE SUDDEN STORM",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.movement],
    fluff: `Arcing energies leap from one Necron unit
to the next, lending speed to their limbs
and causing their eye lenses to blaze.`,
    when: `Your Movement phase.`,
    target: `One Necrons unit from
your army.`,
    effect: `Until the end of the turn, ranged
weapons equipped by models in your unit
have the [ASSAULT] ability. In addition, if a
Necrons Character is leading your unit,
until the end of the phase, you can re-roll
Advance rolls made for your unit.`,
    restrictions: ``,
  },
  {
    name: "PROTOCOL OF THE VENGEFUL STARS",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `In response to enemy attack, criss-cross
fire leaps from the Necron ranks, forming
a blazing corona of deadly energy from
which there can be no escape.`,
    when: `Your opponent’s Shooting phase,
just after an enemy unit has resolved
its attacks.`,
    target: `One Necrons unit from your
army that had one or more of its models
destroyed as a result of the attacking
unit’s attacks.`,
    effect: `Your unit can shoot as if it were
your Shooting phase, but it must target
the enemy unit that just attacked it, and
can only do so if that enemy unit is an
eligible target. In addition, if a Necrons
Character is leading your unit, until
the end of the phase, ranged weapons
equipped by models in your unit have the
[IGNORES COVER] ability. `,
    restrictions: ``,
  },
];

export default template;
