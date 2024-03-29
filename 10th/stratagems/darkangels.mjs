import { PHASE, TURN, TYPE } from './CONSTANTS.mjs';

const DETACHMENT = {
  'Unforgiven Task Force': 'Unforgiven Task Force',
  'Inner Circle Task Force': 'Inner Circle Task Force',
  'Company Of Hunters': 'Company Of Hunters',
};

const template = [
  {
    name: 'UNFORGIVEN FURY',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Unforgiven Task Force'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `With focused aggression, the Dark Angels relentlessly punish the foe.`,
    when: `Your Shooting phase or the Fight phase.`,
    target: `One ADEPTUS ASTARTES unit from your army that has not been selected to shoot or fight this phase.`,
    effect: `Until the end of the phase, weapons equipped by models in your unit have the [LETHAL HITS] ability. In addition, if one or more ADEPTUS ASTARTES units from your army are currently Battle-shocked, until the end of the phase, each time a model in your unit makes an attack, a successful unmodified Hit roll of 5+ scores a Critical Hit.`,
    restrictions: ``,
  },
  {
    name: 'INTRACTABLE',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: DETACHMENT['Unforgiven Task Force'],
    turn: TURN.your,
    phase: [PHASE.movement],
    fluff: `Even the Dark Angels must give ground occasionally, y but their stubborn determination ensures they never do so for long, or without a fight.`,
    when: `Your Movement phase, just after an Adeptus Astartes unit from your army Falls Back.`,
    target: `That Adeptus Astartes unit.`,
    effect: `Until the end of the turn, your unit is eligible to shoot and declare a charge in a turn in which it Fell Back.`,
    restrictions: ``,
  },
  {
    name: 'ARMOUR OF CONTEMPT',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Unforgiven Task Force'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `The belligerency and transhuman physiologies of the Adeptus Astartes make them unyielding foes.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has selected its targets.`,
    target: `One ADEPTUS ASTARTES unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time an attack targets your unit, worsen the Armour Penetration characteristic of that attack by 1.`,
    restrictions: ``,
  },
  {
    name: 'FIRE DISCIPLINE',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Unforgiven Task Force'],
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `There is no escaping the Unforgiven’s wrath when they bring their disciplined firepower to bear.`,
    when: `Your Shooting phase.`,
    target: `One ADEPTUS ASTARTES unit from your army that has not been selected to shoot this phase.`,
    effect: `Until the end of the phase, ranged weapons equipped by models in that unit have the [ASSAULT], [HEAVY] and [IGNORES COVER] abilities.`,
    restrictions: ``,
  },
  {
    name: 'GRIM RETRIBUTION',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: DETACHMENT['Unforgiven Task Force'],
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `Stern and vengeful as they are, the warriors of the Unforgiven Chapters deliver swift retribution to any foe foolish enough to try to lay them low.`,
    when: `Your opponent’s Shooting phase, just after an enemy unit has shot.`,
    target: `One ADEPTUS ASTARTES unit from your army that had one or more models destroyed as a result of the attacking unit’s attacks.`,
    effect: `Your unit can shoot as if it were your Shooting phase, but it must target the enemy unit that just attacked it, and can only do so if that enemy unit is an eligible target.`,
    restrictions: ``,
  },
  {
    name: 'UNBREAKABLE LINES',
    cost: 2,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Unforgiven Task Force'],
    turn: TURN.opponents,
    phase: [PHASE.charge],
    fluff: `Countless assaults have faltered against the unbreakable ceramite wall that is the Unforgiven standing their ground.`,
    when: `Your opponent’s Charge phase, just after an enemy unit ends a Charge move.`,
    target: `One ADEPTUS ASTARTES unit from your army within Engagement Range of that enemy unit.`,
    effect: `Until the end of the turn, each time an attack targets your unit, subtract 1 from the Wound roll.`,
    restrictions: ``,
  },
  {
    name: 'ARMOUR OF CONTEMPT',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Inner Circle Task Force'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `The belligerency and transhuman physiologies of the Adeptus Astartes make them unyielding foes.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has selected its targets.`,
    target: `One ADEPTUS ASTARTES unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time an attack targets your unit, worsen the Armour Penetration characteristic of that attack by 1.`,
    restrictions: ``,
  },
  {
    name: 'MARTIAL MASTERY',
    cost: 1,
    type: TYPE['Epic Deed'],
    detachment: DETACHMENT['Inner Circle Task Force'],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `The warriors of the Deathwing fight with the honed skill and lethality of knightly champions.`,
    when: `Fight phase.`,
    target: `One DEATHWING INFANTRY unit from your army that has not been selected to fight this phase.`,
    effect: `Until the end of the phase, each time a model in your unit makes an attack, re-roll a Wound roll of 1. If your unit is within range of your Vowed objective marker, you can re-roll the Wound roll instead.`,
    restrictions: ``,
  },
  {
    name: 'DUTY UNTO DEATH',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: DETACHMENT['Inner Circle Task Force'],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `So driven by duty are the veterans of the Unforgiven that even death cannot keep them from it.`,
    when: `Fight phase, just after an enemy unit has selected its targets.`,
    target: `One DEATHWING unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time a model in your unit is destroyed, if that model has not fought this phase, roll one D6, adding 1 if your unit is within range of your Vowed objective marker. On a 4+, do not remove the destroyed model from play; it can fight after the attacking unit has finished making its attacks, and is then removed from play.`,
    restrictions: ``,
  },
  {
    name: 'RELIC TELEPORTARIUM',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: DETACHMENT['Inner Circle Task Force'],
    turn: TURN.your,
    phase: [PHASE.movement],
    fluff: `The Deathwing employ ancient and incredibly powerful teleportariums, some older than the Great Crusade, to strike at their foes with unparalleled safety and accuracy.`,
    when: `Your Movement phase.`,
    target: `One DEATHWING unit from your army that is arriving using the Deep Strike ability this phase.`,
    effect: `Your unit can be set up anywhere on the battlefield that is more than 3" horizontally away from all enemy models.`,
    restrictions: `Until the end of the turn, your unit is not eligible to declare a charge.`,
  },
  {
    name: 'WRATH OF THE LION',
    cost: 1,
    type: TYPE['Epic Deed'],
    detachment: DETACHMENT['Inner Circle Task Force'],
    turn: TURN.your,
    phase: [PHASE.charge],
    fluff: `Channelling the strategic puissance and measured ferocity of their gene-sire, the veterans of the Unforgiven unleash a perfectly timed and utterly lethal storm of tightly controlled violence.`,
    when: `Your Charge phase.`,
    target: `One DEATHWING INFANTRY unit from your army that just ended a Charge move.`,
    effect: `Select one enemy unit within Engagement Range of your unit and roll one D6 for each model in your unit, adding 1 to the result if that enemy unit is within range of your Vowed objective marker: for each 4+, that enemy unit suffers 1 mortal wound (to a maximum of 3 mortal wounds).`,
    restrictions: ``,
  },
  {
    name: 'UNMATCHED FORTITUDE',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Inner Circle Task Force'],
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `In the name of their oaths to Chapter, Primarch and Emperor, the Deathwing march into the fiercest firestorms and refuse to falter.`,
    when: `Your opponent’s Shooting phase, just after an enemy unit has selected its targets.`,
    target: `One DEATHWING INFANTRY unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time an attack targets your unit, if the Strength characteristic of that attack is greater than your unit’s Toughness characteristic, subtract 1 from the Wound roll.`,
    restrictions: ``,
  },
  {
    name: 'HUNTERS’ TRAIL',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: DETACHMENT['Company Of Hunters'],
    turn: TURN.either,
    phase: [PHASE.command],
    fluff: `Using augur beacons, servo-skulls and the like, the Ravenwing mark locations they have passed through and cleansed of foes, laying a trial their fellows can follow on the hunt.`,
    when: `Command phase.`,
    target: `One RAVENWING MOUNTED unit from your army that is within range of an objective marker you control.`,
    effect: `That objective marker remains under your control, even if you have no models within range of it, until your opponent controls it at the start or end of any turn.`,
    restrictions: ``,
  },
  {
    name: 'ARMOUR OF CONTEMPT',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Company Of Hunters'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `The belligerency and transhuman physiologies of the Adeptus Astartes make them unyielding foes.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has selected its targets.`,
    target: `One ADEPTUS ASTARTES unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time an attack targets your unit, worsen the Armour Penetration characteristic of that attack by 1.`,
    restrictions: ``,
  },
  {
    name: 'TALON STRIKE',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: DETACHMENT['Company Of Hunters'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Be it their true quarry or simply one who possesses knowledge that will lead them to their apprehension, when the Ravenwing strike at a priority target they do so with unmerciful surety.`,
    when: `Your Shooting phase or the Fight phase.`,
    target: `One RAVENWING MOUNTED unit from your army that has not been selected to shoot or fight this phase.`,
    effect: `Until the end of the phase, each time a model in your unit makes an attack that targets an INFANTRY CHARACTER or MOUNTED CHARACTER unit, add 1 to the Wound roll.`,
    restrictions: ``,
  },
  {
    name: 'DEATH ON THE WIND',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Company Of Hunters'],
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `The Ravenwing employ shock tactics and focussed firepower to tear bloody paths through the enemy ranks, shattering resistance and clearing the way to their true quarry.`,
    when: `Your Shooting phase.`,
    target: `One RAVENWING unit from your army that has just shot.`,
    effect: `Select one enemy unit that was hit by one or more of those attacks. That unit must take a Battle-shock test. When doing so, if one or more RAVENWING units from your army are within 6" of that enemy unit, subtract 1 from the test.`,
    restrictions: ``,
  },
  {
    name: 'HIGH-SPEED FOCUS',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Company Of Hunters'],
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `Even when travelling at breakneck pace, the Ravenwing control their vehicles with consummate skill and are able to jink and dodge around incoming enemy fire.`,
    when: `Your opponent’s Shooting phase, just after an enemy unit has selected its targets.`,
    target: `One RAVENWING unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time an attack targets your unit, subtract 1 from the Hit roll.`,
    restrictions: ``,
  },
  {
    name: 'RAPID REAPPRAISAL',
    cost: 2,
    type: TYPE['Battle Tactic'],
    detachment: DETACHMENT['Company Of Hunters'],
    turn: TURN.opponents,
    phase: [PHASE.fight],
    fluff: `The Ravenwing scan and analyse their foes’ strategic dispositions constantly, augury and aerial surveillance helping to watch that no quarry slips their closing net. They are quick to redirect combat assets should such a risk present itself`,
    when: `End of your opponent’s Fight phase.`,
    target: `One RAVENWING unit from your army that is not within Engagement Range of one or more enemy units.`,
    effect: `Remove your unit from the battlefield and place it into Strategic Reserves.`,
    restrictions: ``,
  },
];

export default template;
