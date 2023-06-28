import {TURN, TYPE, PHASE } from './CONSTANTS';

const detachment = 'Rad-Cohort';

const template = [{
  name: 'BALEFUL HALO',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `A haze of deadly radiation hangs around
the warriors of a Rad-Cohort, every
exhalation they make adding to the
isotopic fog, sapping the strength and
stamina of those who are not inured to
its effects.`,
  when: `Fight phase, just after an enemy
unit has selected its targets.`,
  target: `One Adeptus Mechanicus unit
from your army (excluding Vehicle units)
that was selected as the target of one or
more of that enemy unit’s attacks.`,
  effect: `Until the end of the turn, each
time an attack is made that targets your
unit, subtract 1 from the Wound roll.`,
  restrictions: ``
},{
  name: 'EXTINCTION ORDER',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `As Tech-Priests order the purge of an area
of the battlefield, rad-bombardments are
redoubled in the hopes of turning it into
a wasteland.`,
  when: `Your Command phase.`,
  target: `One Tech-Priest model from
your army and one objective marker
within 24" of that model.`,
  effect: `Roll one D6 for each enemy unit
within range of that objective marker. On a
4+, that unit suffers 1 mortal wound and it
must take a Battle-shock test.`,
  restrictions: ``
},{
  name: 'LETHAL DOSAGE',
  cost: 2,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `Sanctified with the Tri-fold Litany, the
most blessed power cells, fuel canisters
and solid slugs have spent a decade
in the oldest and most irradiated forge
temple to certify their lethality.`,
  when: `Your Shooting phase.`,
  target: `One Adeptus Mechanicus
unit from your army that has not been
selected to shoot this phase.`,
  effect: `Until the end of the phase,
each time a model in your unit makes a
ranged attack that targets an enemy unit
(excluding Vehicle units), add 1 to the
Wound roll.`,
  restrictions: ``
},{
  name: 'AGGRESSOR IMPERATIVE',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.charge],
  fluff: `The Skitarii feel the press of an invisible
hand upon their minds as the Machine
God drives them forward. Servos are
pushed to their structural limits as fibre
bundles fill with the boundless energy of
the Motive Force and propel the faithful on
an unstoppable crusade.`,
  when: `Your Charge phase.`,
  target: `One Skitarii unit from your army
that Advanced this turn.`,
  effect: `Until the end of the turn, your unit
is eligible to declare a charge even though
it Advanced this turn.`,
  restrictions: `You can only use this
Stratagem if the Conqueror Imperative is
active for your army.`
},{
  name: 'VENGEFUL FALLOUT',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `The sentence for those who dare strike
at the Tech-Priests' holy creations has
been carefully prepared in advance and
it can be unleashed with an anger born of
fanatical faith.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has resolved
its attacks.`,
  target: `One Adeptus Mechanicus unit
from your army that was selected as
the target of one or more of that enemy
unit’s attacks.`,
  effect: `Your unit can shoot as if it were
your Shooting phase, but it must target
only that enemy unit when doing so, and
it can only do so if that enemy unit is an
eligible target. After your unit has finished
making these attacks, it is not eligible to
shoot again this turn.`,
  restrictions: ``
},{
  name: 'BULWARK IMPERATIVE',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `The warrior wisdom of experienced
Reductors is force-loaded into the Skitarii’s
minds. Each pulse of data bestows a
sensation of sacred invulnerability upon
the Tech-Priests’ soldiers.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
  target: `One Skitarii unit from your army
that was selected as the target of one or
more of that enemy unit’s attacks.`,
  effect: `Until the end of the turn, models
in your unit have a 4+ invulnerable save.
RESTRICTIONS: You can only use this
Stratagem if the Protector Imperative is
active for your army.`,
  restrictions: ``
}];

export default template;
