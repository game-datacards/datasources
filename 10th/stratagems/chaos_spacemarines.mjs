import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Slaves to Darkness';

const template = [{
  name: 'INFERNAL RITES',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `With gruesome offerings and ritualised
promises, the Chaos Space Marines seek
the protection of their infernal masters.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Heretic Astartes unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack targets your unit, worsen
the Armour Penetration characteristic of
that attack by 1.`,
  restrictions: ``
},{
  name: 'PROFANE ZEAL',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Fervent mortal followers flock to the
champions of Chaos, damning their souls
seeking promises of dark power.`,
  when: `Your Shooting phase or the
Fight phase.`,
  target: `One Heretic Astartes unit from
your army that has not been selected to
shoot or fight this phase.`,
  effect: `Until the end of the phase, each
time a model in your unit makes an
attack, re-roll a Hit roll of 1 and re-roll a
Wound roll of 1. If your unit is a Chaos
Undivided unit, you can instead re-roll
the Hit roll and you can re-roll the Wound
roll for that attack.`,
  restrictions: ``
},{
  name: 'ETERNAL HATE',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Heretic Astartes are fuelled by hate, a searing
spite that burns fiercely within them unto the
very moment of death. Even as their life force
pours from terrible wounds, this loathing can
drive them to fight on in a second wind of
wrath. Those Heretic Astartes in thrall to the
Blood God feel this enmity to an even greater
extent than others, exploding with violence
just as the enemy think they have finally
ended them.`,
  when: `Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Heretic Astartes unit from
your army that was selected as the target of
one or more of the attacking unit’s attacks.`,
  effect: `Until the end of the phase, each
time a model in your unit is destroyed, if that
model has not fought this phase, roll one
D6, adding 1 to the result if it is a Khorne
unit: on a 4+, do not remove it from play. That
destroyed model can fight after the attacking
model’s unit has finished making its attacks,
and is then removed from play.`,
  restrictions: ``
},{
  name: 'SKINSHIFT',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `With the Dark Gods and the powers of the
warp on their side, Chaos Space Marines
can cheat death altogether. Their foes
look on in horror as killing wounds knit
themselves together in a cacophony
of hideous cracks and squelches and
shattered armour reforms. After such a
blessing, the Heretic Astartes are both
something far greater, and far less, than
what they once were.`,
  when: `Your Command phase.`,
  target: `One Heretic Astartes unit from
your army.`,
  effect: `One model in your unit regains
up to 3 lost wounds. In addition, if your
unit is a Tzeentch unit below its Starting
Strength, one destroyed model (excluding
Character models) is returned to your
unit with its full wounds remaining.`,
  restrictions: ``
},{
  name: 'UNNATURAL SWIFTNESS',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `
Some Heretic Astartes appear to move
with a speed that should be impossible,
weapons and bodies seemingly moving
from one place to another in the blink of
an eye.`,
  when: `Your Movement phase.`,
  target: `One Heretic Astartes unit from
your army.`,
  effect: `Until the end of the turn, your unit
is eligible to shoot and declare a charge in
a turn in which it Fell Back. In addition, if
your unit is a Slaanesh unit, until the end
of the turn, your unit is eligible to shoot
and declare a charge in a turn in which
it Advanced.`,
  restrictions: ``
},{
  name: 'DARK OBSCURATION',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `Choking fogs echoing with the screams
of tortured souls; dense clouds of bloated
flies; deluges of bloody rain; whirlwinds of
coruscating flames blazing in a thousand
hues. Such warp-born phenomena can
appear on the battlefield in an instant,
and disappear just as quickly. All serve
to obscure the Heretic Astartes from their
terrified foes.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
  target: `One Heretic Astartes unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, your
unit has the Stealth ability. In addition, if
your unit is a Nurgle unit, until the end of
the phase, your unit can only be selected
as the target of a ranged attack if the
attacking model is within 12".`,
  restrictions: ``
}];

export default template;
