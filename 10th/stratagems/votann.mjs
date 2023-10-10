import { TURN, TYPE, PHASE } from "./CONSTANTS.mjs";

const detachment = "Oathband";

const template = [
  {
    name: "WARRIOR PRIDE",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `The warriors of the Leagues of Votann
pride themselves on their martial skill
and proficiency in combat, and when the
Ancestors are watching their actions they
can quickly overwhelm and pick apart
their foes.`,
    when: `Fight phase.`,
    target: `One Leagues of Votann unit
from your army, and one enemy unit
that has one or more Judgement tokens
and is within Engagement Range of that
Leagues of Votann unit.`,
    effect: `Until the end of the phase,
each time a model in your unit makes
a melee attack that targets that enemy
unit, improve the Armour Penetration
characteristic of that attack by 1 for each
Judgement token that enemy unit has.`,
    restrictions: ``,
  },
  {
    name: "ORDERED RETREAT",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.movement],
    fluff: `Not for the Kin the sudden panic of the
rout. Instead, they fall back steadily
and by squads, laying down furious
suppressing fire before launching
fresh assaults.`,
    when: `Your Movement phase, just after a
Leagues of Votann unit from your army
Falls Back.`,
    target: `That Leagues of Votann unit.`,
    effect: `Until the end of the turn, your unit
is eligible to shoot and declare a charge.`,
    restrictions: ``,
  },
  {
    name: "ANCESTRAL SENTENCE",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `Some foes are so loathed that the
Ancestors themselves are said to pass
sentence upon them, marking them
for death.`,
    when: `Your Shooting phase.`,
    target: `One Leagues of Votann unit
from your army.`,
    effect: `Until the end of the phase,
each time a model in your unit makes
a ranged attack, that attack has the
[SUSTAINED HITS 1] ability, and each time
a model in your unit makes a ranged
attack that targets a unit that has one or
more Judgement tokens, that attack has
the [SUSTAINED HITS 2] ability instead.`,
    restrictions: ``,
  },
  {
    name: "REACTIVE REPRISAL",
    cost: 2,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `Once an enemy target has been marked out
by the Eye of the Ancestors, the Kin focus their
efforts upon its destruction, redoubling their
fury should it attempt to engage.`,
    when: `Your opponent’s Shooting phase, just
after an enemy unit that has one or more
Judgement tokens has resolved its attacks.`,
    target: `One Leagues of Votann unit from
your army that was selected as the target of
one or more of the attacking unit’s attacks.`,
    effect: `Your Leagues of Votann unit can
shoot as if it were your Shooting phase, but it
must target the enemy unit that just attacked
it, and can only do so if that enemy unit is an
eligible target.`,
    restrictions: ``,
  },
  {
    name: "NEWFOUND NEMESIS",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `To strike down Kin is to earn the
immediate and murderous ire of all their
warrior comrades.`,
    when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has resolved its attacks.`,
    target: `One Leagues of Votann
Infantry or Leagues of Votann
Mounted unit from your army that was
reduced to Below Half-strength as a result
of the attacking unit’s attacks.`,
    effect: `The attacking unit gains 1
Judgement token, or up to 2 Judgement
tokens instead if that Leagues of Votann
unit contained your Warlord when it was
targeted by those attacks.`,
    restrictions: ``,
  },
  {
    name: "VOID ARMOUR",
    cost: 1,
    type: TYPE.Wargear,
    detachment,
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Void armour comprises hardened,
jointed segments hooked into the
void suit beneath. It is fashioned from
magnaferrite weave, and often reinforced
with adamantine and enhanced with
microfield generators.`,
    when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
    target: `One Leagues of Votann unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
    effect: `Until the end of the phase, each
time an attack targets your Leagues
of Votann unit, worsen the Armour
Penteration characteristic of that attack
by 1.`,
    restrictions: ``,
  },
];

export default template;
