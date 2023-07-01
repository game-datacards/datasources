import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Plague Company';

const template = [{
  name: 'FERRIC BLIGHT',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `The spreading rust of the Ferric Blight can
reduce armour of all kinds to nothing.`,
  when: `Your Shooting phase or the
Fight phase.`,
  target: `One Death Guard unit from your
army that has not been selected to shoot
or fight this phase.`,
  effect: `Until the end of the phase, each
time a model in your unit makes an
attack, improve the Armour Penetration
characteristic of that attack by 1. If the
target of that attack is within Contagion
Range of an Infected objective marker
you control and a Critical Wound is scored
for that attack, improve the Armour
Penetration characteristic of that attack
by 2 instead.`,
  restrictions: ``
},{
  name: 'SANGUOUS FLUX',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Bleeding sores erupt all over enemies
afflicted by the Sanguous Flux, the wounds
never clotting or healing.`,
  when: `Fight phase.`,
  target: `One Death Guard unit from your
army that has not been selected to fight
this phase.`,
  effect: `Until the end of the phase,
weapons equipped by models in your unit
have the [SUSTAINED HITS 1] ability. While
your unit is within range of an Infected
objective marker you control, those
weapons have the [SUSTAINED HITS 2]
ability instead.`,
  restrictions: ``
},{
  name: 'DISGUSTINGLY RESILIENT',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `Those favoured by Nurgle are inured to
pain, their rotting bodies shrugging off all
but the most traumatic damage with ease.
WHEN: Fight phase, just after an enemy
unit has selected its targets.`,
  when: `Fight phase, just after an enemy
unit has selected its targets.`,
  target: `One Death Guard unit from your
army that was selected as the target of
one or more of that enemy unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack is allocated to a model in
your unit, subtract 1 from the Damage
characteristic of that attack.`,
  restrictions: ``
},{
  name: 'GIFTS OF DECAY',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `Nurgle is a generous god, and through
worship and devotion his followers can
gain mighty rewards as they spread
sickness in his name.`,
  when: `Your Command phase.`,
  target: `One Death Guard model from
your army.`,
  effect: `Your model regains up to D3 lost
wounds. If your model’s unit is within
Contagion Range of an Infected objective
marker you control, your model regains
up to 3 lost wounds instead.`,
  restrictions: ``
},{
  name: 'BOILBLIGHT',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `The strange lumps that form on victims
of Boilblight – also known as Nurgle’s
Fruit, Lumpen Splatter or the Crawling
Pustulence – are easy to spot at a
distance for the Death Guard.`,
  when: `Your Shooting phase.`,
  target: `One Death Guard unit from
your army, and one enemy unit within
Contagion Range of that unit.`,
  effect: `Until the end of the phase, each
time a weapon equipped by a Death
Guard model from your army targets that
enemy unit, that weapon has the [HEAVY]
and [IGNORES COVER] abilities.`,
  restrictions: ``
},{
  name: 'CLOUD OF FLIES',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.shooting],
  fluff: `With a thrumming roar, a thick cloud of
daemon flies whirls around the Death Guard
and obscures them from the enemy’s sight.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
  target: `One Death Guard unit from your
army that was selected as the target of
one or more of that enemy unit’s attacks.`,
  effect: `Until the end of the phase, your
unit has the Stealth ability.`,
  restrictions: ``
}];

export default template;
