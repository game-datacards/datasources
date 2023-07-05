import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Shield Host';

const adeptuscustodes = [{
  name: 'SLAYERS OF NIGHTMARES',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `In an age plagued by monstrous foes,
when primordial horrors from the darkest
void circle Humanity’s dying light, still the
Adeptus Custodes stand strong.`,
  when: `Fight phase.`,
  target: `One Adeptus Custodes unit from
your army that has not been selected to
fight this phase.`,
  effect: `Until the end of the phase, each
time a model in your unit makes an attack
that targets a Monster or Vehicle unit,
add 1 to the Wound roll.`,
  restrictions: ``
},{
  name: 'AVENGE THE FALLEN',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight],
  fluff: `The loss of a single Talon of the Emperor
is commemorated by the tolling of
the Bell of Lost Souls on Terra, and by
their comrades’ bloody vengeance on
the battlefield.`,
  when: `Start of the Fight phase.`,
  target: `One Adeptus Custodes unit
from your army that is below its Starting
Strength and has not been selected to
fight this phase.`,
  effect: `Until the end of the phase, add
1 to the Attacks characteristic of melee
weapons equipped by models in that
unit. If that unit is Below Half-strength,
until the end of the phase, add 2 to the
Attacks characteristic of those melee
weapons instead.`,
  restrictions: ``
},{
  name: 'UNWAVERING SENTINELS',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.any],
  fluff: `Custodians will not be moved from
their objective.`,
  when: `Start of the Fight phase.`,
  target: `One Adeptus Custodes unit
from your army (excluding Anathema
Psykana units) that is within range of an
objective marker.`,
  effect: `Until the end of the phase, your
unit has the Fights First ability.`,
  restrictions: ``
},{
  name: 'ARCANE GENETIC ALCHEMY',
  cost: 2,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.either,
  phase: [PHASE.shooting, PHASE.fight],
  fluff: `The Adeptus Custodes are individually
engineered on a molecular level using
secrets of genetic alchemy that render
them virtual demigods in battle.`,
  when: `Your opponent’s Shooting phase or
the Fight phase, just after an enemy unit
has selected its targets.`,
  target: `One Adeptus Custodes Infantry
unit from your army (excluding Anathema
Psykana units) that was selected as
the target of one or more of that enemy
unit’s attacks.`,
  effect: `Until the end of the phase, each
time an attack is allocated to a model in
your unit, subtract 1 from the Damage
characteristic of that attack.`,
  restrictions: ``
},{
  name: 'VIGIL UNENDING',
  cost: 1,
  type: TYPE['Epic Deed'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.command],
  fluff: `The Custodes are determined that
every second of their lives will be spent
committed to the Emperor, and they
do not yield while their duty remains
unfilfilled, rising from the blood and ashes
to continue their vigil.`,
  when: `Your Command phase.`,
  target: `One Adeptus Custodes Infantry
unit from your army (excluding Anathema
Psykana units).`,
  effect: `One destroyed model (excluding
Character models) is returned to your
unit with its full wounds remaining.`,
  restrictions: `You cannot target the
same unit with this Stratagem more than
once per battle.`
},{
  name: 'SWORN GUARDIANS',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.movement],
  fluff: `The Adeptus Custodes smash apart
their foes without slowing, securing the
Emperor’s realm with bloody efficiency
and then advancing to new positions.`,
  when: `Your Movement phase.`,
  target: `One Adeptus Custodes unit from
your army (excluding Anathema Psykana
units) within range of an objective marker
you control.`,
  effect: `That objective marker remains
under your control even if you have
no models within range of it, until your
opponent controls it at the start or end of
any turn.`,
  restrictions: ``
}];

export default adeptuscustodes;
