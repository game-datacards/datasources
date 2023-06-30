import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Cult of Magic';

const template = [{
  name: 'PSYCHIC DOMINION',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `To pit one’s own psychic prowess against
the sorcerous might of the Thousand Sons
is to be trapped, helpless and screaming,
within one’s own mind.`,
  when: `Any phase, just after an enemy
unit has selected its targets.`,
  target: `One Thousand Sons unit from
your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, all
attacks made against your unit with
Psychic weapons have the [HAZARDOUS]
ability and all models in your unit have
the Feel No Pain 4+ ability against
Psychic Attacks`,
  restrictions: ``
},{
  name: 'DESTINED BY FATE',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `The Architect of Fate has great designs
for his pawns, which do not include their
untimely demise just yet…`,
  when: `Any phase, when a saving throw is
failed for a Thousand Sons Psyker model
from your army.`,
  target: `That Psyker model.`,
  effect: `Change the Damage
characteristic of that attack to 0.`,
  restrictions: ``
},{
  name: 'DEVASTATING SORCERY',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `This warrior’s veins burn with raw
sorcery. The sheer unstoppable might
of their conjurations is such that, when
unleashed with destructive intent, there
is little that can prevent them from
devastating manifestation.`,
  when: `Your Shooting phase.`,
  target: `One Thousand Sons Psyker
unit from your army that has not been
selected to shoot this phase.`,
  effect: `Until the end of the phase, each
time a model in your unit makes a Psychic
Attack, you can re-roll the Hit roll and you
can re-roll the Wound roll.`,
  restrictions: ``
},{
  name: 'ENSORCELLED INFUSION',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `Utilising the fell powers of the warp,
Thousand Sons Sorcerers infuse their
minions’ bolter rounds with empyric
energies to render them even deadlier.`,
  when: `Your Shooting phase.`,
  target: `One Thousand Sons Psyker
unit from your army that has not been
selected to shoot this phase.`,
  effect: `Until the end of the phase, all
inferno bolt pistols, inferno boltguns,
inferno combi-bolters and inferno
combi-weapons equipped by models in
your unit have the [PSYCHIC] ability and a
Strength characteristic of 5. `,
  restrictions: ``
},{
  name: 'SORCEROUS MIGHT',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `The most powerful sorcerers of the
Thousand Sons are battle-psykers who
can, if the need is dire enough, siphon a
sliver of their corrupted souls into their
eldritch assaults to temporarily boost
their potency.`,
  when: `Your Shooting phase.`,
  target: `One Thousand Sons Psyker
unit from your army that has not been
selected to shoot this phase.`,
  effect: `Until the end of the phase, add 9"
to the range of Psychic weapons equipped
by your unit.`,
  restrictions: ``
},{
  name: 'WARP SIGHT',
  cost: 2,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `With their tainted souls melded as one in
the warp, what one champion of the cabal
sees, all their fellows see also.`,
  when: `Your Shooting phase.`,
  target: `One Thousand Sons Psyker unit
from your army and one enemy unit that
is visible to that unit.`,
  effect: `Until the end of the phase, each
time a friendly Thousand Sons Psyker
model makes an attack with a Psychic
weapon that targets that enemy unit,
that attack has the [INDIRECT FIRE] and
[IGNORES COVER] abilities. `,
  restrictions: ``
}];

export default template;
