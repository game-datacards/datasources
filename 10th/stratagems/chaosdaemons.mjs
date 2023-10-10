import { TURN, TYPE, PHASE } from "./CONSTANTS.mjs";

const detachment = "Demonic Incursion";

const template = [
  {
    name: "CORRUPT REALSPACE",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.command],
    fluff: `Daemons instinctively feel the need
to despoil and corrupt every corner of
realspace, the better to sustain their
otherworldly forms.`,
    when: `Start of any Command phase.`,
    target: `One Legiones Daemonica unit
from your army that is within range of an
objective marker you control.`,
    effect: `That objective marker is said to
be Corrupted and remains under your
control, even if you have no models within
range of it, until your opponent controls it
at the start or end of any turn. In addition,
while an objective marker is Corrupted
and under your control, the area of the
battlefield within 6" of that objective
marker is considered to be within your
army’s Shadow of Chaos. `,
    restrictions: ``,
  },
  {
    name: "WARP SURGE",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.your,
    phase: [PHASE.charge],
    fluff: `The winds of the warp blow strong,
invigorating daemonkind and lending
them supernatural speed and ferocity.`,
    when: `Your Charge phase.`,
    target: `One Legiones Daemonica unit
from your army that is within your army’s
Shadow of Chaos.`,
    effect: `Until the end of the phase, your
unit is eligible to declare a charge even if it
Advanced this turn`,
    restrictions: ``,
  },
  {
    name: "DRAUGHT OF TERROR",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `The swelling fear of their mortal prey serves
as an intoxicating elixir to the daemonic
followers, each draught invigorating their
forms with deadly power.`,
    when: `Your Shooting phase or the
Fight phase.`,
    target: `One Legiones Daemonica
unit from your army that has not been
selected to shoot or fight this phase.`,
    effect: `Until the end of the phase,
improve the Armour Penetration
characteristic of weapons equipped by
models in that unit by 1. In addition,
until the end of the phase, each time
such a weapon targets a unit that is
Battle-shocked, you can re-roll the
Wound roll.`,
    restrictions: ``,
  },
  {
    name: "DENIZENS OF THE WARP",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment,
    turn: TURN.either,
    phase: [PHASE.any],
    fluff: `Ever lurking in the warp, daemons will
wait until the barriers between realms thin
before tearing their way into realspace.`,
    when: `Your Movement phase.`,
    target: `One Legiones Daemonica unit
from your army that is arriving using the
Deep Strike ability this phase.`,
    effect: `Your unit can be set up anywhere
on the battlefield that is more than 3"
horizontally away from all enemy models.`,
    restrictions: `A unit targeted by this
Stratagem is not eligible to declare a
charge in the same turn.`,
  },
  {
    name: "THE REALM OF CHAOS",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.endOfTurn],
    fluff: `When the energies of the warp bleed into
realspace, the Legiones Daemonica can rip
open portals in seeming thin-air, returning
to their hellscapes only to rematerialise
amidst their foes a heartbeat later.`,
    when: `End of your opponent’s turn.`,
    target: `Up to two Legiones Daemonica
units from your army that are within
your army’s Shadow of Chaos, or one
other Legiones Daemonica unit from
your army.`,
    effect: `Remove the targeted units
from the battlefield and place them into
Strategic Reserves. They will arrive back
on the battlefield in the Reinforcements
step of your next Movement phase using
the Deep Strike ability.`,
    restrictions: `You cannot target units
that are within Engagement Range of one
or more enemy units with this Stratagem`,
  },
  {
    name: "DAEMONIC INVULNERABILITY",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment,
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `Daemons are madness given form. Their
very bodies are fashioned from the stuff
of the warp, and are difficult to destroy
through conventional means.`,
    when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
    target: `One Legiones Daemonica unit
from your army that was selected as
the target of one or more of that enemy
unit’s attacks.`,
    effect: `Until the end of the phase, each
time an invulnerable saving throw is made
for a model in your unit, re-roll a saving
throw of 1.`,
    restrictions: ``,
  },
];

export default template;
