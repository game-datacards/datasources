import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Combined Regiment';

const template = [{
  name: 'REINFORCEMENTS!',
  cost: 2,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `The Astra Militarum can call upon a nearly
inexhaustible supply of warriors.`,
  when: `Any phase.`,
  target: `One Regiment unit from your
army that was just destroyed. You can use
this Stratagem on that unit even though it
was just destroyed.`,
  effect: `Add a new unit to your army
identical to your destroyed unit, in
Strategic Reserves, at its Starting Strength
and with all of its wounds remaining.`,
  restrictions: `This Stratagem cannot
be used to return destroyed Character
units to Attached units.`
},{
  name: 'FIELDS OF FIRE',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `Astra Militarum combat doctrine utilises
the concentration of focused firepower to
hammer the foe from multiple angles.`,
  when: `Your Shooting phase.`,
  target: `One Regiment or Squadron
unit from your army that has not been
selected to shoot this phase.`,
  effect: `After your unit has resolved its
attacks, select one enemy unit that was
targeted by one or more of those attacks.
Until the end of the phase, each time an
attack is made against that enemy unit
by a Regiment or Squadron model from
your army, unless the attacking unit
is Battle-shocked, improve the Armour
Penetration characteristic of that attack
by 1.`,
  restrictions: ``
},{
  name: 'SUPPRESSION FIRE',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `Ordered to focus a rapid and repeated
volley of fire, soldiers are able to rattle even
the staunchest foe with a blizzard of shots.`,
  when: `Your Shooting phase.`,
  target: `One Astra Militarum Infantry
unit from your army that has not been
selected to shoot this phase, and one
enemy unit (excluding Monsters
and Vehicles).`,
  effect: `If your Astra Militarum unit
scores one or more hits against that
enemy unit this phase, until the end of
your opponent’s next turn, each time
a model in that enemy unit makes an
attack, subtract 1 from the Hit roll.`,
  restrictions: ``
},{
  name: 'EXPERT BOMBARDIERS',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `Skilled in coordinating their targeting with
forward spotter elements, this regiment’s
artillery crews are capable of devastating
precision shelling.`,
  when: `Start of your Shooting phase.`,
  target: `One Astra Militarum unit from
your army equipped with a vox-caster, and
one enemy unit that is visible to that unit.`,
  effect: `Until the end of the phase, each
time an Astra Militarum model from
your army makes an attack with an
Indirect Fire weapon that targets that
enemy unit, unless the attacking model is
Battle-shocked, add 1 to the Hit roll.`,
  restrictions: ``
},{
  name: 'INSPIRED COMMAND',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.command],
  fluff: `This officer is known for their strategic
excellence, as are those they command.
Honed over many years, their curt,
well-established battle cant is wielded
with consummate efficiency, reinforced
by the inspirational example they
themselves set.`,
  when: `Your opponent’s Command phase.`,
  target: `One Astra Militarum Officer
unit from your army.`,
  effect: `Your Officer can issue one Order
as if it were your Command phase.`,
  restrictions: `Your Officer cannot issue
that Order to a Battle-shocked unit.`
},{
  name: 'ARMOURED MIGHT',
  cost: 2,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `The tanks of the Imperial Guard are
armoured not only in reinforced
plas-steel, but with devout faith in the
Emperor and utter contempt for their foes.`,
  when: `Your opponent’s Shooting phase,
just after an enemy unit has selected
its targets.`,
  target: `One Astra Militarum Vehicle
unit from your army that was selected as
the target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack is allocated to your unit,
subtract 1 from the Damage characteristic
of that attack`,
  restrictions: ``
}];

export default template;
