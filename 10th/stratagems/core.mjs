import {TURN, TYPE, PHASE } from './CONSTANTS.mjs';

const detachment = 'core';

const core = [{
	name: 'COMMAND RE-ROLL',
	cost: 1,
	type: TYPE['Battle Tactic'],
	detachment,
	turn: TURN.either,
	phase: [PHASE.any],
	fluff: `A great commander can bend even the vagaries of fate and fortune to their will, the better to ensure victory`,
  when: `In any phase, just after you have made a Hit',
roll, a Wound roll, a Damage roll, a saving throw, an
Advance roll, a Charge roll, a Desperate Escape test,
a Hazardous test, or just after you have rolled the
dice to determine the number of attacks made with a
weapon, for an attack, model or unit from your army.`,
	target: ``,
  effect: `You re-roll that roll, test or saving throw.`,
	restrictions: ``
},{
	name: 'COUNTER-OFFENSIVE',
	cost: 2,
	type: TYPE['Strategic Ploy'],
	detachment,
	turn: TURN.either,
	phase: [PHASE.fight],
	fluff: `In close-quarters combat, the slightest hesitation
can leave an opening for a swift foe to exploit. `,
	when: `Fight phase, just after an enemy unit
has fought.`,
	target: `One unit from your army that is within
Engagement Range of one or more enemy units
and that has not already been selected to fight
this phase.`,
	effect: `Your unit fights next.`,
	restrictions: ``
},{
	name: 'EPIC CHALLENGE',
	cost: 1,
	type: TYPE['Epic Deed'],
	detachment,
	turn: TURN.either,
	phase: [PHASE.fight],
	fluff: `The legends of the 41st Millennium are replete with
deadly duels between mighty champions.`,
	when: `Fight phase, when a Character unit from
your army that is within Engagement Range of one or
more Attached units is selected to fight.`,
	target: `One Character model in your unit.`,
	effect: `Until the end of the phase, all melee
attacks made by that model have the [PRECISION]
ability (pg 26).`,
	restrictions: ``
},{
	name: 'INSANE BRAVERY',
	cost: 1,
	type: TYPE['Battle Tactic'],
	detachment,
	turn: TURN.your,
	phase: [PHASE.command],
	fluff: `Indifferent to their own survival, these warriors hold 
their ground against seemingly impossible odds.`,
  when: `Battle-shock step of your Command 
phase, just before you take a Battle-shock test 
for a unit from your army (pg 11).`,
	target: `A unit from your army that must take a 
Battle-shock test.`,
	effect: `Your unit automatically passes that 
Battle-shock test.`,
	restrictions: `You cannot use this Stratagem 
more than once per battle.`
},{
	name: 'GRENADE',
	cost: 1,
	type: TYPE.Wargear,
	detachment,
	turn: TURN.your,
	phase: [PHASE.shooting],
	fluff: `Priming their hand-held projectiles, these warriors
draw back and hurl death into the enemy’s midst.`,
	when: `Your Shooting phase.`,
	target: `One Grenades unit from your army that is
not within Engagement Range of any enemy units
and has not been selected to shoot this phase.`,
	effect: `Select one enemy unit that is not within
Engagement Range of any units from your army and
is within 8" of and visible to your Grenades unit.
Roll six D6: for each 4+, that enemy unit suffers 1
mortal wound.`,
	restrictions: ``
},{
	name: 'TANK SHOCK',
	cost: 1,
	type: TYPE['Strategic Ploy'],
	detachment,
	turn: TURN.your,
	phase: [PHASE.charge],
	fluff: `Ramming the foe with a speeding vehicle may be an
unsubtle tactic, but it is a murderously effective one.`,
	when: `Your Charge phase.`,
	target: `One Vehicle unit from your army.`,
	effect: `Until the end of the phase, after your unit
ends a Charge move, select one enemy unit within
Engagement Range of it, then select one melee
weapon your unit is equipped with. Roll a number of
D6 equal to that weapon’s Strength characteristic.
If that Strength characteristic is greater than that
enemy unit’s Toughness characteristic, roll two
additional D6. For each 5+, that enemy unit suffers 1
mortal wound (to a maximum of 6 mortal wounds).`,
	restrictions: ``
},{
	name: 'RAPID INGRESS',
	cost: 1,
	type: TYPE['Strategic Ploy'],
	detachment,
	turn: TURN.opponents,
	phase: [PHASE.movement],
	fluff: `Be it cunning strategy, potent technology or
supernatural ritual, there are many means by which a
commander may hasten their warriors’ onset.`,
	when: `End of your opponent’s Movement phase.`,
	target: `One unit from your army that is in Reserves.`,
	effect: `Your unit can arrive on the battlefield
as if it were the Reinforcements step of your
Movement phase.`,
	restrictions: `You cannot use this Stratagem to
enable a unit to arrive on the battlefield during a
battle round it would not normally be able to do so in.`
},{
	name: 'FIRE OVERWATCH',
	cost: 1,
	type: TYPE['Strategic Ploy'],
	detachment,
	turn: TURN.opponents,
	phase: [PHASE.movement, PHASE.charge],
	fluff: `A hail of wildfire can drive back advancing foes.`,
	when: `Your opponent’s Movement or Charge phase,
just after an enemy unit is set up or when an enemy
unit starts or ends a Normal, Advance, Fall Back or
Charge move.`,
	target: `One unit from your army that is within 24" of
that enemy unit and that would be eligible to shoot if
it were your Shooting phase.`,
effect: `If that enemy unit is visible to your unit, 
your unit can shoot that enemy unit as if it were 
your Shooting phase.`,ö
	restrictions: `You cannot target a Titanic unit 
with this Stratagem. Until the end of the phase, 
each time a model in your unit makes a ranged 
attack, an unmodified Hit roll of 6 is required 
to score a hit, irrespective of the attacking 
weapon’s Ballistic Skill or any modifiers. You can 
only use this Stratagem once per turn.`
},{
	name: 'GO TO GROUND',
	cost: 1,
	type: TYPE['Battle Tactic'],
	detachment,
	turn: TURN.opponents,
	phase: [PHASE.shooting],
	fluff: `Seeking salvation from incoming fire, warriors hurl
themselves into whatever cover they can find.`,
	when: `Your opponent’s Shooting phase, just after an
enemy unit has selected its targets.`,
	target: `One Infantry unit from your army that was
selected as the target of one or more of the attacking
unit’s attacks.`,
	effect: `Until the end of the phase, all models in
your unit have a 6+ invulnerable save and have the
Benefit of Cover (pg 44).`,
	restrictions: ``
},{
	name: 'SMOKESCREEN',
	cost: 1,
	type: TYPE.Wargear,
	detachment,
	turn: TURN.opponents,
	phase: [PHASE.shooting],
	fluff: `Even the most skilled marksmen struggle to hit targets
veiled by billowing screens of smoke.`,
	when: `Your opponent’s Shooting phase, just after an
enemy unit has selected its targets.`,
	target: `One Smoke unit from your army that was
selected as the target of one or more of the attacking
unit’s attacks.`,
	effect: `Until the end of the phase, all models in your
unit have the Benefit of Cover (pg 44) and the Stealth
ability (pg 20).`,
	restrictions: ``
},{
	name: 'HEROIC INTERVENTION',
	cost: 2,
	type: TYPE['Strategic Ploy'],
	detachment,
	turn: TURN.opponents,
	phase: [PHASE.charge],
	fluff: `Voices raised in furious war cries, your warriors surge
forth to meet the enemy’s onslaught head-on.`,
	when: `Your opponent’s Charge phase, just after an
enemy unit ends a Charge move.`,
	target: `One unit from your army that is within 6"
of that enemy unit and would be eligible to declare
a charge against that enemy unit if it were your
Charge phase.`,
	effect: `Your unit now declares a charge that targets
only that enemy unit, and you resolve that charge as
if it were your Charge phase.`,
	restrictions: `You can only select a Vehicle unit
from your army if it is a Walker. Note that even if
this charge is successful, your unit does not receive
any Charge bonus this turn (pg 29).`
}];

export default core;
