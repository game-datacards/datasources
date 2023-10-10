import { TURN, TYPE, PHASE } from "./CONSTANTS.mjs";

const detachment = "Gladius Task Force";

const template = [
  {
    name: "ONLY IN DEATH DOES DUTY END",
    cost: 2,
    type: TYPE["Epic Deed"],
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
    restrictions: ``,
  },
  {
    name: "HONOUR THE CHAPTER",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Every Chapter has forged its own tales of
heroism, and none of its battle-brothers
would see that noble record besmirched.`,
    when: `Fight phase.`,
    target: `One Adeptus Astartes unit from
your army.`,
    effect: `Until the end of the phase, melee
weapons equipped by models in your unit
have the [LANCE] ability. If your unit is
under the effects of the Assault Doctrine,
until the end of the phase, improve the
Armour Penetration characteristic of such
weapons by 1 as well.`,
    restrictions: ``,
  },
  {
    name: "ARMOUR OF CONTEMPT",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `The belligerency of the Adeptus Astartes,
combined with their transhuman
physiology, makes them unyielding foes
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
    restrictions: ``,
  },
  {
    name: "ADAPTIVE STRATEGY",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.command],
    fluff: `The tenets of the Codex Astartes allow for
unorthodox use of combat tactics and
the employment of divergent strategic
doctrines if doing so will lead to victory.`,
    when: `Your Command phase.`,
    target: `One Adeptus Astartes unit from
your army.`,
    effect: `Select the Devastator Doctrine,
Tactical Doctrine or Assault Doctrine. Until
the start of your next Command phase,
that Combat Doctrine is active for that unit
instead of any other Combat Doctrine that
is active for your army, even if you have
already selected that doctrine this battle.`,
    restrictions: ``,
  },
  {
    name: "STORM OF FIRE",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `There is no escaping the wrath of the
Space Marines, and they use their
weapons to bring swift death to their foes
wherever they may hide, expertly placing
their shots to wreak maximum damage.`,
    when: `Your Shooting phase.`,
    target: `One Adeptus Astartes unit from
your army.`,
    effect: `Until the end of the phase, ranged
weapons equipped by models in your
unit have the [IGNORES COVER] ability.
If your unit is under the effects of the
Devastator Doctrine, until the end of the
phase, improve the Armour Penetration
characteristic of such weapons by 1
as well.`,
    restrictions: ``,
  },
  {
    name: "SQUAD TACTICS",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.movement],
    fluff: `Space Marines know precisely when
to give ground in order to leave their
enemies floundering, before surging back
into the fight and driving them from the
field in disarray.`,
    when: `Your opponent’s Movement phase,
just after an enemy unit ends a Normal,
Advance or Fall Back move.`,
    target: `One Adeptus Astartes Infantry
or Adeptus Astartes Mounted unit from
your army that is within 9" of the enemy
unit that just ended that move.`,
    effect: `Your unit can make a Normal
move of up to D6", or a Normal move of up
to 6" instead if it is under the effects of the
Tactical Doctrine.`,
    restrictions: `You cannot select a unit
that is within Engagement Range of one or
more enemy units.`,
  },
];

export default template;
