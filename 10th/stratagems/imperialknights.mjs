import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Noble Lance';

const template = [{
  name: 'SHOULDER THE BURDEN',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `When faced with their darkest hour, knightly
Nobles rise to the challenge, for nothing
shall deter them from fulfilling their duty.`,
  when: `Your Command phase.`,
  target: `One Imperial Knights model
from your army that has lost one or
more wounds.`,
  effect: `Until the start of your next
Command phase, improve your model’s
Move, Toughness, Save, Leadership and
Objective Control characteristics by 1 and
each time your model makes an attack,
add 1 to the Hit roll.`,
  restrictions: `You can only use this
Stratagem once per battle. If your army
is Honoured, you can use this Stratagem
one additional time.`
},{
  name: 'ROTATE ION SHIELDS',
  cost: 1,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `Veteran Knight pilots can swiftly angle their
ion shields to better deflect incoming fire.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
  target: `One Imperial Knights model
from your army that was selected as the
target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase,
that Imperial Knights model has a 4+
invulnerable save against ranged attacks.`,
  restrictions: ``
},{
  name: 'THUNDERSTOMP',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `The Noble brings their Knight suit’s full
weight crashing down with the force of
an industrial piledriver. Few can survive
such a blow.`,
  when: `Fight phase.`,
  target: `One Imperial Knights model
from your army that has not been
selected to fight this phase.`,
  effect: `Until the end of the phase,
your model cannot target Monster or
Vehicle units, but all melee weapons
equipped by your model have the
[DEVASTATING WOUNDS] ability.`,
  restrictions: ``
},{
  name: 'SQUIRES\' DUTY',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Under the scrutiny and judgement of their
Noble betters, Armiger pilots will redouble
their efforts, attacking as one to smash
aside their foes.`,
  when: `The start of your Shooting phase or
the start of the Fight phase.`,
  target: `Two or more Armiger models
from your army and one enemy unit
that is an eligible target for all of those
Armiger models.`,
  effect: `Until the end of the phase,
improve the Strength and Armour
Penetration characteristics of weapons
equipped by those Armiger models by
1. If your army is Honoured, until the
end of the phase, add 1 to the Damage
characteristic of those weapons as well.`,
  restrictions: ``
},{
  name: 'TROPHY CLAIM',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `Once a mighty foe is laid low, the
victorious Knight’s emitters blare its
triumph, announcing the glory brought
to the Imperium, but shame awaits those
who fail in such confrontations.`,
  when: `Your Shooting phase or the
Fight phase.`,
  target: `One Imperial Knights model
from your army that has not been
selected to shoot or fight this phase, and
one enemy Monster or Vehicle unit.`,
  effect: `Until the end of the phase, each
time your model makes an attack that
targets that enemy unit, add 1 to the
Wound roll. If your model destroys that
enemy unit this phase, you gain 1CP, but if
your model does not destroy that enemy
unit this phase, you cannot use this
Stratagem again for the rest of the battle. `,
  restrictions: ``
},{
  name: 'VALIANT LAST STAND',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Badly wounded, their Knight’s generator
on the verge of overload, still the Noble
fights on, drawing upon their reserves of
chivalric heroism to sell their life as dearly
as they can.`,
  when: `Fight phase.`,
  target: `One Imperial Knights model
from your army that was just destroyed
and that is eligible to fight but has not
been selected to fight this phase. You can
use this Stratagem on that model even
though it was just destroyed.`,
  effect: `Before rolling to see if this model
deals any mortal wounds as a result of its
Deadly Demise ability, it can fight; when
doing so, it is assumed to have 1 wound
remaining, or all its wounds remaining
if your army is Honoured. After it has
finished resolving its attacks, resolve its
Deadly Demise ability as normal.`,
  restrictions: `You cannot target
Sir Hekhtur with this Stratagem.`
}];

export default template;
