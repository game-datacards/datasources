import { TURN, TYPE, PHASE } from "./CONSTANTS.mjs";

const detachment = "Black Spear Task Force";

const template = [
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
    name: "TELEPORTARIUM",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.fight],
    fluff: `
Site-to-site battlefield teleportation is a
rare capability indeed, used only by the
Deathwatch in extreme situations.`,
    when: `End of your opponent’s
Fight phase.`,
    target: `Up to two Kill Team units
from your army, or one other Adeptus
Astartes Infantry unit from your army.`,
    effect: `Remove those units from the
battlefield. In the Reinforcements step of
your next Movement phase, set each of
those units up anywhere on the battlefield
that is more than 9" horizontally away
from all enemy models.`,
    restrictions: `You cannot select any
units that are within Engagement Range of
one or more enemy units.`,
  },
  {
    name: "ADAPTIVE TACTICS",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.command],
    fluff: `Only a truly versatile approach to warfare
allows the tactical genius of the Deathwatch
to best the myriad xenos foes they face.`,
    when: `Your Command phase.`,
    target: `Up to two Kill Team units
from your army, or one other Adeptus
Astartes unit your army.`,
    effect: `For each unit targeted, select the
Furor Tactics, Malleus Tactics or Purgatus
Tactics. Until the start of your next
Command phase, that Mission Tactic is
active for that unit instead of any Mission
Tactic that is active for your army.`,
    restrictions: ``,
  },
  {
    name: "HELLFIRE ROUNDS",
    cost: 1,
    type: TYPE.Wargear,
    detachment,
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `Hellfire rounds douse their targets in
voracious acids that are utterly lethal to
organic life.`,
    when: `Your Shooting phase.`,
    target: `Up to two Kill Team units from
your army that have not been selected to
shoot this phase, or one other Adeptus
Astartes unit from your army (excluding
Vehicles) that has not been selected to
shoot this phase.`,
    effect: `Until the end of the phase, bolt weapons*
(excluding Devastating Wounds weapons) equipped 
by models in your unit have the [ANTI-INFANTRY 2+] and 
[ANTI-MONSTER 5+] abilities`,
    restrictions: `You cannot select any
  units that have already been targeted with
  either the Kraken Rounds or Dragonfire
  Rounds Stratagems this phase.`,
  },
  {
    name: "KRAKEN ROUNDS",
    cost: 1,
    type: TYPE.Wargear,
    detachment,
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `Kraken rounds utilise adamantine cores
and improved propellants to penetrate the
thickest hide.`,
    when: `Your Shooting phase.`,
    target: `Up to two Kill Team units from
your army that have not been selected to
shoot this phase, or one other Adeptus
Astartes unit from your army (excluding
Vehicles) that has not been selected to
shoot this phase.`,
    effect: ` Until the end of the phase, improve the 
Armour Penetration characteristic of bolt weapons* 
equipped by models in your unit by 1 and improve the 
range characteristic of those weapons by 6.`,
    restrictions: `You cannot select any
units that have already been targeted with
either the Dragonfire Rounds or Hellfire
Rounds Stratagems this phase.`,
  },
  {
    name: "DRAGONFIRE ROUNDS",
    cost: 1,
    type: TYPE.Wargear,
    detachment,
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `Dragonfire rounds are designed to explode
just before contact, saturating foes in cover
with searing gas and flames.`,
    when: `Your Shooting phase.`,
    target: `Up to two Kill Team units from
your army that have not been selected to
shoot this phase, or one other Adeptus
Astartes unit from your army (excluding
Vehicles) that has not been selected to
shoot this phase.`,
    effect: `Until the end of the phase, bolt weapons* 
  equipped by models in your unit have the [ASSAULT]
  and [IGNORES COVER] abilities`,
    restrictions: `You cannot select any
units that have already been targeted
with either the Kraken Rounds or Hellfire
Rounds Stratagems this phase.`,
  },
];

export default template;
