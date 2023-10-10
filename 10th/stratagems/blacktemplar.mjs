import { TURN, TYPE, PHASE } from "./CONSTANTS.mjs";

const detachment = "Righteous Crusaders";

const template = [
  {
    name: "FERVENT ACCLAMATION",
    cost: 1,
    type: TYPE["Epic Deed"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.command],
    fluff: `The magnetic force of this Black Templar’s
oratory inspires his fellow warriors to
swear great vows, even in the midst of
the battle.`,
    when: `Your Command phase.`,
    target: `One Adeptus Astartes
Character unit from your army.`,
    effect: `Select one Templar Vow that is
not active for your army. Until the start
of your next Command phase, while that
Character is leading a unit, models in
that unit gain the benefits of that vow in
addition to the vow selected to be active
for your army at the start of the battle.`,
    restrictions: ``,
  },
  {
    name: "NO ESCAPE",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.movement],
    fluff: `Glowing blades and revving chainswords
close off the foe’s every avenue of escape.`,
    when: `Your opponent’s Movement phase,
when an enemy unit (excluding Vehicles
and Monsters) is selected to Fall Back.`,
    target: `One Adeptus Astartes unit from
your army that is within Engagement
Range of that enemy unit.`,
    effect: `Roll one D6, adding 1 to the result
if the Accept Any Challenge, No Matter
the Odds vow is active for your army. On
a 4+, that enemy unit cannot Fall Back
this phase and must Remain Stationary.
Otherwise, that enemy unit can Fall Back
this phase, but if it does, all models in that
unit must take a Desperate Escape test.`,
    restrictions: ``,
  },
  {
    name: "DEVOUT PUSH",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `With a zealous cry, the Black Templars
press forward towards victory.`,
    when: `Your opponent’s Shooting phase,
just after an enemy unit has shot.`,
    target: `One Adeptus Astartes unit
from your army that had one or more of
its models destroyed as a result of the
attacking unit’s attacks.`,
    effect: `Your unit can make a Normal
move of up to D6", but it must end that
move closer to the enemy unit that just
shot. If the Abhor the Witch, Destroy the
Witch vow is active for your army, your
unit can make a Normal move of up to 6"
instead, but it must end that move either
closer to the enemy unit that just shot, or
closer to the closest enemy Psyker unit. `,
    restrictions: ``,
  },
  {
    name: "ARMOUR OF CONTEMPT",
    cost: 1,
    type: TYPE["Battle Tactic"],
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
    restrictions: ``,
  },
  {
    name: "CRUSADER'S WRATH",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `The Black Templars channel their fervour
into a hate-fuelled flurry of blows.`,
    when: `Fight phase.`,
    target: `One Adeptus Astartes unit from
your army that has not been selected to
fight this phase.`,
    effect: `Until the end of the phase, each
time a model in your unit makes a melee
attack, improve the Armour Penetration
characteristic of that attack by 1. If the
Suffer Not The Unclean to Live vow is
active for your army, add 1 to the Strength
characteristic of that attack as well.`,
    restrictions: ``,
  },
  {
    name: "VICIOUS RIPOSTE",
    cost: 1,
    type: TYPE["Epic Deed"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Every blow struck against a Black Templar
is answered in kind. Even as they are
laid low, their blades still lash out at the
enemies of the divine Emperor.`,
    when: `Fight phase, just after an enemy
unit has selected its targets.`,
    target: `One Adeptus Astartes unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
    effect: `Until the end of the phase, each
time a model in your unit is destroyed,
if that model has not fought this phase,
roll one D6, adding 1 to the result if the
Uphold the Honour of the Emperor vow
is active for your army. On a 4+, do not
remove the destroyed model from play; it
can fight after the attacking model’s unit
has finished making its attacks, and is
then removed from play.`,
    restrictions: ``,
  },
];

export default template;
