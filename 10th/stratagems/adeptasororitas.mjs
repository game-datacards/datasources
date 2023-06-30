import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Hallowed Martyrs';

const template = [{
  name: 'DIVINE INTERVENTION',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `Sometimes, a brush with death is so close
the only explanation is divine intervention.`,
  when: `Any phase.`,
  target: `One Adepta Sororitas
Character unit from your army that
was just destroyed. You can use this
Stratagem on that unit even though it was
just destroyed.`,
  effect: `Discard 1-3 Miracle dice. At the
end of the phase, set the last destroyed
model from your unit back up on the
battlefield, as close as possible to
where it was destroyed and not within
Engagement Range of any enemy models.
That model is set back up with a number
of wounds remaining equal to the number
of Miracle dice you discarded.`,
  restrictions: `You cannot select Saint
Celestine as the target of this Stratagem.
You cannot select the same Character
as the target of this Stratagem more than
once per battle. `
},{
  name: 'LIGHT OF THE EMPEROR',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.command],
  fluff: `The Emperor’s radiance shines upon his
warriors, emboldening them amidst the
thick of battle in their darkest hour.`,
  when: `Command phase.`,
  target: `One Adepta Sororitas unit
from your army that is below its Starting
Strength. For the purposes of this
Stratagem, if a unit has a Starting Strength
of 1, it is considered to be below its
Starting Strength while it has lost one or
more wounds.`,
  effect: `Until the end of the turn, your
unit can ignore any or all modifiers to
its characteristics and/or to any roll or
test made for it (excluding modifiers to
saving throws).`,
  restrictions: ``
},{
  name: 'HOLY RAGE',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `With psalms on their lips, the faithful hurl
themselves forward, striking the foe down
with the inner strength born of faith in
the Emperor.`,
  when: `Fight phase.`,
  target: `One Adepta Sororitas unit from
your army that has not been selected to
fight this phase.`,
  effect: `Until the end of the phase, each
time a model in your unit makes a melee
attack, add 1 to the Wound roll.`,
  restrictions: ``
},{
  name: 'SPIRIT OF THE MARTYR',
  cost: 2,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Even with their dying act, the Sororitas
mete out the Emperor’s judgement.`,
  when: `Fight phase, just after an enemy
unit has selected its targets.`,
  target: `One Adepta Sororitas unit
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, each
time a model in your unit is destroyed, if
that model has not fought this phase, do
not remove it from play. The destroyed
model can fight after the attacking
model’s unit has finished making attacks,
and is then removed from play.`,
  restrictions: ``
},{
  name: 'SUFFERING & SACRIFICE',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `Suffering is a staple prayer for the Adepta
Sororitas, and a martyr’s fate only brings
greater glory to the God-Emperor.`,
  when: `Start of the Fight phase.`,
  target: `One Adepta Sororitas Infantry
or Adepta Sororitas Walker unit from
your army.`,
  effect: `Until the end of the phase, each
time an enemy model within Engagement
range of your unit selects targets, it must
select your unit as the target of its attacks.`,
  restrictions: ``
},{
  name: 'REJOICE THE FALLEN',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `The death of a Battle Sister only stirs
the survivors to fight harder to exact
swift vengeance.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has resolved
its attacks.`,
  target: `One Adepta Sororitas unit
from your army that had one or more of
its models destroyed as a result of the
attacking unit’s attacks.`,
  effect: `Your unit can shoot as if it were
your Shooting phase, but it must target
only that enemy unit when doing so, and
can only do so if that enemy unit is an
eligible target.`,
  restrictions: ``
}];

export default template;
