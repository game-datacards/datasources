import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'Kauyon';

const template = [{
  name: 'STIMM INJECTORS',
  cost: 1,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.either,
  phase: [PHASE.fight, PHASE.shooting],
  fluff: `This system injects the battlesuit pilot with
a measured dose of chemical stimulants
intended to temporarily accelerate their
physical aptitude and pain tolerances.`,
  when: `Fight phase or your opponent’s
Shooting phase, just after an enemy unit
has selected its targets.`,
  target: `One T’au Empire Battlesuit
unit from your army that was selected as
the target of one or more of the attacking
unit’s attacks.`,
  effect: `Until the end of the phase,
models in your unit have the
Feel No Pain 6+ ability.`,
  restrictions: ``
},{
  name: 'STRIKE AND FADE',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `T’au are experts at harrying and
outmanoeuvring their foes, bleeding them
with accurate fire before fading away into
the shadows and luring the foe into a trap.`,
  when: `Your Shooting phase.`,
  target: `One T’au Empire Battlesuit
unit from your army that can Fly whose
attacks have been resolved this phase.`,
  effect: `If your unit is not within
Engagement Range of any enemy units, it
can make a Normal move. If it does, your
unit cannot declare a charge this turn.`,
  restrictions: ``
},{
  name: 'COORDINATE TO ENGAGE',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `T’au combined arms groups are called
Hunter Cadres for good reason. Working in
close coordination, they hunt and destroy
the most dangerous enemy targets.`,
  when: `Your Shooting phase.`,
  target: `One T’au Empire unit from your
army that has just been selected as an
Observer unit (see For the Greater Good).`,
  effect: `Until the end of the phase, each
time a model in your unit makes an attack
that targets their Spotted unit, improve
the Ballistic Skill characteristic of that
attack by 1 and, if your unit has the
Markerlight keyword, that attack has
the [IGNORES COVER] ability.`,
  restrictions: ``
},{
  name: 'POINT-BLANK AMBUSH',
  cost: 1,
  type: TYPE['Battle Tactic'],
  detachment,
  turn: TURN.your,
  phase: [PHASE.shooting],
  fluff: `The Kauyon teaches to lure the enemy
into deadly point-blank ambushes.`,
  when: `Your Shooting phase.`,
  target: `One T’au Empire unit from your
army that has not been selected to shoot
this phase.`,
  effect: `Until the end of the phase, each
time a model in your unit makes a ranged
attack that targets an enemy unit within
9", improve the Armour Penetration
characteristic of that attack by 1.`,
  restrictions: `You cannot use this
Stratagem during the first or second
battle rounds.`
},{
  name: 'PHOTON GRENADES',
  cost: 1,
  type: TYPE.Wargear,
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.charge],
  fluff: `Hurling a volley of photon grenades, the
T’au leave their enemies dazzled and
disorientated, unable to close the distance
into combat at a crucial moment.`,
  when: `Your opponent’s Charge phase,
just after an enemy unit has declared
a charge.`,
  target: `One T’au Empire Grenades unit
from your army that was selected as one
of the targets of that charge.`,
  effect: `That enemy unit must
immediately take a Battle-shock test, and
until the end of the phase, subtract 2 from
Charge rolls made for that enemy unit.`,
  restrictions: ``
},{
  name: 'COMBAT EMBARKATION',
  cost: 1,
  type: TYPE['Strategic Ploy'],
  detachment,
  turn: TURN.opponents,
  phase: [PHASE.charge],
  fluff: `Those who act as the lure in the
Kauyon must be ready to make a hasty
withdrawal once the enemy closes into
killing range, lest they be trapped.`,
  when: `Your opponent’s Charge phase,
just after an enemy unit has declared
a charge.`,
  target: `One T’au Empire Infantry unit
from your army that was selected as one
of the targets of that charge, and one
friendly Transport.`,
  effect: `Your unit can embark within that
Transport. If it does, your opponent can
select new targets for that charge.`,
  restrictions: `Every model in your T’au
Empire Infantry unit must be within
3" of that Transport and there must be
sufficient transport capacity to embark
the entire unit.`
}];

export default template;
