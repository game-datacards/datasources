import { PHASE, TURN, TYPE } from "./CONSTANTS.mjs";

const detachment = "Invasion Fleet";

const DETACHMENT = {
  "Invasion Fleet": "Invasion Fleet",
  "Crusher Stampede": "Crusher Stampede",
  "Unending Swarm": "Unending Swarm",
  "Assimilation Swarm": "Assimilation Swarm",
  "Vanguard Onslaught": "Vanguard Onslaught",
  "Synaptic Nexus": "Synaptic Nexus",
};

const template = [
  {
    name: "RAPID REGENERATION",
    cost: 1,
    type: TYPE["Battle Tactic"],
    detachment: DETACHMENT["Invasion Fleet"],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Prey stare in horror as chitinous
armour regrows and flesh, muscle and
sinew knots back together as though
never harmed.`,
    when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
    target: `One Tyranids unit from your
army that was selected as the target of
one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase,
models in your unit have the
Feel No Pain 6+ ability. If your unit is
within Synapse Range of your army, until
the end of the phase, models in your unit
have the Feel No Pain 5+ ability instead.`,
    restrictions: ``,
  },
  {
    name: "DEATH FRENZY",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment: DETACHMENT["Invasion Fleet"],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Tyranids care nothing for selfpreservation, lashing out even in death.`,
    when: `Fight phase, just after an enemy
unit has selected its targets.`,
    target: `One Tyranids unit from your
army that was selected as the target of
one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each
time a model in your unit is destroyed, if
that model has not fought this phase, roll
one D6: on a 4+, do not remove it from
play. The destroyed model can fight after
the attacking model’s unit has finished
making attacks, and is then removed
from play`,
    restrictions: ``,
  },
  {
    name: "ADRENAL SURGE",
    cost: 2,
    type: TYPE["Battle Tactic"],
    detachment: DETACHMENT["Invasion Fleet"],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `These warrior organisms destroy all as
their adrenaline surges.`,
    when: `Fight phase.`,
    target: `Up to two Tyranids units from
your army that are within Synapse Range
of your army and are eligible to fight, or
one other Tyranids unit from your army
that is eligible to fight.`,
    effect: `Until the end of the phase, each
time a model in one of those selected
units makes an attack, a successful
unmodified Hit roll of 5+ scores a
Critical Hit.`,
    restrictions: ``,
  },
  {
    name: "OVERRUN",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment: DETACHMENT["Invasion Fleet"],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Tyranids are an unstoppable avalanche of
flesh and chitin.`,
    when: `Fight phase, just before a Tyranids
unit from your army Consolidates.`,
    target: `That Tyranids unit.`,
    effect: `Until the end of the phase,
each time a model in your unit makes a
Consolidation move, it can move up to
6" instead of up to 3", provided your unit
can end its Consolidation move in Unit
Coherency and within Engagement Range
of one or more enemy units. If your unit
is within Synapse Range of your army
and not within Engagement Range of
any enemy units, instead of making that
Consolidation move, it can instead make a
Normal move of up to 6".`,
    restrictions: ``,
  },
  {
    name: "SYNAPTIC INSIGHT",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment: DETACHMENT["Invasion Fleet"],
    turn: TURN.your,
    phase: [PHASE.command],
    fluff: `Guided by the instincts of leader-beasts,
a portion of the swarm can be tasked with
focusing its hunting instincts to destroy a
particular foe.`,
    when: `Your Command phase.`,
    target: `Up to two Tyranids units from
your army that are within Synapse Range
of your army, or one other Tyranids unit
from your army.`,
    effect: `Select one Hyper-adaptation.
Until the end of the battle round, that
hyper-adaptation is active for those
selected units in addition to any other that
may be active for your army.`,
    restrictions: `You cannot select the
same hyper-adaptation you selected at
the start of the first battle round.`,
  },
  {
    name: "ENDLESS SWARM",
    cost: 1,
    type: TYPE["Strategic Ploy"],
    detachment: DETACHMENT["Invasion Fleet"],
    turn: TURN.your,
    phase: [PHASE.command],
    fluff: `As the battle rages, more organisms pour
in to bolster the swarms.`,
    when: `Your Command phase.`,
    target: `Up to two Endless Multitude
units from your army that are within
Synapse Range of your army, or one other
Endless Multitude unit from your army.`,
    effect: `Up to D3+3 destroyed models are
returned to each of the selected units.`,
    restrictions: ``,
  },
];

export default template;
