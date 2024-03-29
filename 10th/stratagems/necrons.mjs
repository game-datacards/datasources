import { PHASE, TURN, TYPE } from './CONSTANTS.mjs';

const detachment = {
  'Awakened Dynasty': 'Awakened Dynasty',
  'Annihilation Legion': 'Annihilation Legion',
  'Canoptek Court': 'Canoptek Court',
  'Obeisance Phalanx': 'Obeisance Phalanx',
  'Hypercrypt Legion': 'Hypercrypt Legion',
};

const template = [
  {
    name: 'PROTOCOL OF THE ETERNAL REVENANT',
    cost: 1,
    type: TYPE['Epic Deed'],
    detachment: detachment['Awakened Dynasty'],
    turn: TURN.either,
    phase: [PHASE.any],
    fluff: `Necron rulers possess enhanced self-repair systems.`,
    when: `Any phase.`,
    target: `One NECRONS INFANTRY CHARACTER model from your army that was just destroyed. You can use this Stratagem on that model even though it was just destroyed.`,
    effect: `At the end of the phase, set your model back up on the battlefield as close as possible to where it was destroyed and not within Engagement Range of any enemy units, with half of its starting number of wounds remaining.`,
    restrictions: `Each model can only be targeted with this Stratagem once per battle.`,
  },
  {
    name: 'PROTOCOL OF THE HUNGRY VOID',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Awakened Dynasty'],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Necrons strike with data-augmented accuracy.`,
    when: `Fight phase.`,
    target: `One NECRONS unit from your army that has not been selected to fight this phase.`,
    effect: `Until the end of the phase, add 1 to the Strength characteristic of melee weapons equipped by models in your unit. In addition, If a NECRONS CHARACTER is leading your unit, until the end of the phase, improve the Armour Penetration characteristic of melee weapons equipped by models in your unit by 1. (this is not cumulative with any other modifiers that improve Armour Penetration].`,
    restrictions: ``,
  },
  {
    name: 'PROTOCOL OF THE CONQUERING TYRANT',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Awakened Dynasty'],
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `The legions employ the strategies of their masters in perfect synchronicity, laying down hails of mechanically coordinated fire.`,
    when: `Your Shooting phase.`,
    target: `One NECRONS unit from your army that has not been selected to shoot this phase.`,
    effect: `Until the end of the phase, each time a model in your unit makes an attack that targets a unit within half range, re-roll a Hit roll of 1. If a NECRONS CHARACTER is leading your unit, until the end of the phase, you can re-roll the Hit roll for that attack instead.`,
    restrictions: ``,
  },
  {
    name: 'PROTOCOL OF THE UNDYING LEGIONS',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Awakened Dynasty'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Nanoscarabs are released in boiling black clouds that whirl about the legions and effect rapid repairs`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has resolved its attacks.`,
    target: `One NECRONS unit from your army that had one or more of its models destroyed as a result of the attacking unit’s attacks.`,
    effect: `Your unit activates its Reanimation Protocols and reanimates D3 wounds (or D3+1 wounds if a NECRONS CHARACTER is leading your unit].`,
    restrictions: ``,
  },
  {
    name: 'PROTOCOL OF THE SUDDEN STORM',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Awakened Dynasty'],
    turn: TURN.your,
    phase: [PHASE.movement],
    fluff: `Arcing energies leap from one Necron to the next, lending them unnatural speed and surety`,
    when: `Your Movement phase.`,
    target: `One NECRONS unit from your army.`,
    effect: `Until the end of the turn, ranged weapons equipped by models in your unit have the [ASSAULT] ability. In addition, if a NECRONS CHARACTER is leading your unit, until the end of the phase, you can re-roll Advance rolls made for your unit.`,
    restrictions: ``,
  },
  {
    name: 'PROTOCOL OF THE VENGEFUL STARS',
    cost: 2,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Awakened Dynasty'],
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `Criss-crossfire leaps from the Necron ranks, forming a blazing corona of deadly energy to punish those who dare threaten the indignant nobility's legions.`,
    when: `Your opponent’s Shooting phase, just after an enemy unit destroys a NECRONS unit from your army.`,
    target: `One NECRONS CHARACTER unit from your army that was within 6" of that NECRONS unit when it was destroyed.`,
    effect: `After the attacking unit has resolved its attacks, your unit can shoot as if it were your Shooting phase, but it must target only that enemy unit when doing so, and can only do so if that enemy unit is an eligible target.`,
    restrictions: ``,
  },
  {
    name: 'MASKS OF DEATH',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Annihilation Legion'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Wreathed in tendrils of transdimensional shadow that intensify their deathly visages, these killing machines evoke such terror that steady aims tremble and blade arms are sapped of strength.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has selected its targets.`,
    target: `One DESTROYER CULT or FLAYED ONES unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time an attack targets your unit, subtract 1 from the Hit roll.`,
    restrictions: ``,
  },
  {
    name: 'THE SPOOR OF FRAILTY',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Annihilation Legion'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Where one foe falls, logic dictates all others must follow. Where blood is shed, ever must more flow.`,
    when: `Your Shooting phase or the Fight phase.`,
    target: `One DESTROYER CULT or FLAYED ONES unit from your army that has not been selected to shoot or fight this phase.`,
    effect: `Until the end of the phase, each time a model from your unit makes an attack that targets a unit below Starting Strength, add 1 to the Hit roll. If the target is Below Half-strength, add 1 to the Wound roll as well.`,
    restrictions: ``,
  },
  {
    name: 'MURDEROUS REANIMATION',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Annihilation Legion'],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Through some quirk of their kind's shared insanity, a spark of gruesome satisfaction surges through them with every enemy life snuffed out, triggering quiescent power reserves that drive them onwards.`,
    when: `Fight phase.`,
    target: `One DESTROYER CULT or FLAYED ONES unit from your army that has just destroyed an enemy unit, or just caused an enemy unit that was not Below Half-strength to become Below Half-strength.`,
    effect: `Your unit’s Reanimation Protocols activate.`,
    restrictions: ``,
  },
  {
    name: 'PITILESS HUNTERS',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Annihilation Legion'],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Driven into a state of hyperaggression, an Annihilation Legion's most eager hunters plunge into their prey's midst to maximise their butchery.`,
    when: `Fight phase.`,
    target: `One DESTROYER CULT or FLAYED ONES unit from your army that has not been selected to fight this phase.`,
    effect: `Until the end of the phase, each time a model in your unit makes a Pile-in or Consolidation move, it can move up to 6" instead of up to 3".`,
    restrictions: ``,
  },
  {
    name: 'BLOOD-FUELLED CRUELTY',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Annihilation Legion'],
    turn: TURN.opponents,
    phase: [PHASE.movement],
    fluff: `Whatever strange afflictions eat away at the sanity of Destroyers and Flayed Ones, mercy is not one of them.`,
    when: `Your opponent’s Movement phase, just after an enemy unit ends a Fall Back move.`,
    target: `One DESTROYER CULT or FLAYED ONES unit from your army that started the phase within Engagement Range of that enemy unit.`,
    effect: `Roll one D6: on a 2-5, that enemy unit suffers D3 mortal wounds; on a 6, that enemy unit suffers 3 mortal wounds. Your unit can then make a Normal move, but must end that move as close as possible to that enemy unit.`,
    restrictions: ``,
  },
  {
    name: 'INSANITY’S IRE',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Annihilation Legion'],
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `To strike down one horror is merely to draw the rest of the pack's insane and murderous focus.`,
    when: `Your opponent’s Shooting phase, just after an enemy unit has shot.`,
    target: `One DESTROYER CULT or FLAYED ONES unit from your army that had one or more of its models destroyed by the attacking unit’s attacks.`,
    effect: `Your unit can make a Normal move, but must end that move as close as possible to that enemy unit.`,
    restrictions: ``,
  },
  {
    name: 'CURSE OF THE CRYPTEK',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Canoptek Court'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Vindictive Crypteks often hardwire vengeance sub protocols into the ancient cores of their unliving servants, by which a last act of reprisal is assured.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has shot or fought.`,
    target: `One CRYPTEK model from your army that was destroyed by one of the attacking unit’s attacks.
    You can use this Stratagem on that model even though it was just destroyed.`,
    effect: `Until the end of the battle, each time a friendly CANOPTEK model makes an attack that targets the attacking unit, add 1 to the Hit roll and add 1 to the Wound roll.`,
    restrictions: ``,
  },
  {
    name: 'CYNOSURE OF ERADICATION',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Canoptek Court'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Only the foolish tread where a Cryptek has set their sights, for these arcane scientists will suffer no threat to their works.`,
    when: `The start of your Shooting phase or the start of the Fight phase.`,
    target: `One CRYPTEK or CANOPTEK unit from your army that is wholly within your army’s Power Matrix.`,
    effect: `Until the end of the phase, weapons equipped by models in your unit have the [DEVASTATING WOUNDS] ability.`,
    restrictions: ``,
  },
  {
    name: 'SOLAR PULSE',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Canoptek Court'],
    turn: TURN.your,
    phase: [PHASE.shooting],
    fluff: `By remotely accessing a hidden engine's most illuminating protocols, a Cryptek can release the awesome power of a caged solar flare.`,
    when: `Start of your Shooting phase.`,
    target: `One CRYPTEK model from your army.`,
    effect: `Select one objective marker within 18" of your CRYPTEK model. Until the end of the phase, weapons equipped by friendly NECRONS models have the [IGNORES COVER] ability while targeting units within range of that objective marker.`,
    restrictions: ``,
  },
  {
    name: 'REACTIVE SUBROUTINES',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Canoptek Court'],
    turn: TURN.opponents,
    phase: [PHASE.movement],
    fluff: `Canoptek constructs spent the long Great Sleep in watchful vigilance. Triggering a surge of power, they are capable of responsive manoeuvres to outwit the swiftest of attackers.`,
    when: `Your opponent’s Movement phase, just after an enemy unit ends a Normal, Advance or Fall Back move.`,
    target: `One CANOPTEK unit from your army that is within 9" of that enemy unit.`,
    effect: `Your unit can make a Normal move of up to 6".`,
    restrictions: ``,
  },
  {
    name: 'COUNTERTEMPORAL SHIFT',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Canoptek Court'],
    turn: TURN.opponents,
    phase: [PHASE.shooting],
    fluff: `With a twist to the fabric of time, a bubble of another moment enshrouds these constructs. Strange emissions from long-dead elder stars or utter darkness from a nighttime fa r in the future occludes them from their master’s foes.`,
    when: `Your opponent’s Shooting phase, just after an enemy unit has selected its targets.`,
    target: `One CANOPTEK unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, your unit can only be selected as the target of a ranged attack if the attacking model is within 12".`,
    restrictions: ``,
  },
  {
    name: 'SUBOPTIMAL FACADE',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Canoptek Court'],
    turn: TURN.opponents,
    phase: [PHASE.charge],
    fluff: `Canoptek constructs use sophisticated metalogic to craft sinister ambushes. Luring the foe in by appearing at suboptimal operation, a surge of reanimation protocols suddenly swells their numbers.`,
    when: `Your opponent’s Charge phase, just after an enemy unit has declared a charge.`,
    target: `One CANOPTEK unit from your army that was selected as a target of that charge and is wholly within your army’s Power Matrix.`,
    effect: `Your unit’s Reanimation Protocols activate.`,
    restrictions: ``,
  },
  {
    name: 'YOUR TIME IS NIGH',
    cost: 1,
    type: TYPE['Epic Deed'],
    detachment: detachment['Obeisance Phalanx'],
    turn: TURN.either,
    phase: [PHASE.any],
    fluff: `With a pulse of necroneural energy that erodes the foe’s will, the Necron commander declares the fall of the enemy general, promising their remaining forces that it is only a matter of time until they join their master in ignoble death.`,
    when: `Any phase, just after your opponent’s WARLORD is destroyed.`,
    target: `Your NECRONS WARLORD.`,
    effect: `Until the end of the battle, each time an enemy unit takes a Battle-shock or Leadership test, subtract 1 from the result.`,
    restrictions: ``,
  },
  {
    name: 'ENSLAVED ARTIFICE',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Obeisance Phalanx'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `With a pulse of necroneural energy that erodes the foe’s will, the Necron commander declares the fall of the enemy general, promising their remaining forces that it is only a matter of time until they join their master in ignoble death.`,
    when: `Your Shooting phase or the Fight phase.`,
    target: `One NECRONS unit from your army (excluding TITANIC units) that has not been selected to shoot or fight this phase.`,
    effect: `Until the end of the phase, each time a model in your unit makes an attack, an unmodified Hit roll of 5+ scores a Critical Hit.`,
    restrictions: ``,
  },
  {
    name: 'NANOASSEMBLY PROTOCOLS',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Obeisance Phalanx'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `A tomb world’s war engines are the pride of its nobility and they will suffer no affront to them, demanding the reassembly of slablike armour atom by atom even as the foe seek to sunder the vehicles.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has selected its targets.`,
    target: `One NECRONS VEHICLE unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time an attack is allocated to a model in your unit, subtract 1 from the Damage characteristic of that attack.`,
    restrictions: ``,
  },
  {
    name: 'SENTINELS OF ETERNITY',
    cost: 1,
    type: TYPE['Epic Deed'],
    detachment: detachment['Obeisance Phalanx'],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Lychguard never tire, nor give a thought to their own safety over that of their master. With parrying blows and blocking shots they protect their liege even as they continue to strike down their opponents.`,
    when: `Fight phase, just after an enemy unit has selected its targets.`,
    target: `One LYCHGUARD or TRIARCH PRAETORIANS unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, each time a model in your unit is destroyed, if that model has not fought this phase, roll one D6: on a 4+, do not remove it from play. The destroyed model can fight after the attacking model’s unit has finished making attacks, and is then removed from play.`,
    restrictions: ``,
  },
  {
    name: 'SUFFER NO RIVAL',
    cost: 1,
    type: TYPE['Battle Tactic'],
    detachment: detachment['Obeisance Phalanx'],
    turn: TURN.either,
    phase: [PHASE.fight],
    fluff: `Few enemy are worthy of a duel. What dangerous vermin are encountered are prioritised for execution to safeguard the nobles' honour.`,
    when: `Fight phase.`,
    target: `One LYCHGUARD or TRIARCH unit from your army that has not been selected to fight this phase.`,
    effect: `Until the end of the phase, melee weapons equipped by models in your unit have the [PRECISION] ability..`,
    restrictions: ``,
  },
  {
    name: 'TERRITORIAL OBSESSION',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Obeisance Phalanx'],
    turn: TURN.your,
    phase: [PHASE.command],
    fluff: `The ancient and arrogant will of the nobility drives their powerful servants to stand their ground defiantly as they claim the dynasty's rightful lands.`,
    when: `Your Command phase.`,
    target: `One LYCHGUARD or TRIARCH PRAETORIANS unit from your army.`,
    effect: `Until the start of your next Command phase, add 1 to the Objective Control characteristic of models in your unit. If your unit has the VEHICLE keyword, add 3 to the Objective Control characteristic instead.`,
    restrictions: ``,
  },
  {
    name: 'HYPERPHASIC RECALL',
    cost: 2,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Hypercrypt Legion'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Obeying recall protocols, threatened tomb defenders will phase out of existence, only to be relocated to a more advantageous position by the tomb's hulking Monoliths.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has shot or fought.`,
    target: `One NECRONS INFANTRY unit from your army that had one or more of its models destroyed as a result of the attacking unit’s attacks and one friendly MONOLITH model.`,
    effect: `Remove your INFANTRY unit from the battlefield and then set it back up anywhere on the battlefield that is wholly within 6" of your MONOLITH model and not within Engagement Range of one or more enemy units.`,
    restrictions: ``,
  },
  {
    name: 'QUANTUM DEFLECTION',
    cost: 1,
    type: TYPE.Wargear,
    detachment: detachment['Hypercrypt Legion'],
    turn: TURN.either,
    phase: [PHASE.shooting, PHASE.fight],
    fluff: `Necron quantum shielding is a true marvel of techno-arcana. Channelled with energy reserves from the rising tomb structures, the shielding is capable of adaptive remodulation to diffuse and deflect the most powerful enemy attacks.`,
    when: `Your opponent’s Shooting phase or the Fight phase, just after an enemy unit has selected its targets.`,
    target: `One NECRONS VEHICLE unit from your army that was selected as the target of one or more of the attacking unit’s attacks.`,
    effect: `Until the end of the phase, models in your unit have a 4+ invulnerable save.`,
    restrictions: ``,
  },
  {
    name: 'REANIMATION CRYPTS',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Hypercrypt Legion'],
    turn: TURN.your,
    phase: [PHASE.command],
    fluff: `There is no rest for Necrons who fall in the service of their master. In dark crypts, their bodies are repaired and they are dispatched once more to war.`,
    when: `Your Command phase.`,
    target: `Your NECRONS WARLORD.`,
    effect: `For each of your NECRONS units in Reserves, that Reserves unit’s Reanimation Protocols activate.`,
    restrictions: ``,
  },
  {
    name: 'COSMIC PRECISION',
    cost: 1,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Hypercrypt Legion'],
    turn: TURN.your,
    phase: [PHASE.movement],
    fluff: `With a sanity-defying mechanism at the heart of the tomb, dynastic astromancers divine the pre-aligned point in space and time where a crucial role can be played in the wider battle plan.`,
    when: `Your Movement phase.`,
    target: `One NECRONS unit from your army that is arriving using the Deep Strike or Hyperphasing abilities this phase.`,
    effect: `Your unit can be set up anywhere on the battlefield that is more than 3" horizontally away from all enemy models.`,
    restrictions: `A unit targeted with this Stratagem is not eligible to declare a charge in the same turn.`,
  },
  {
    name: 'DIMENSIONAL CORRIDOR',
    cost: 2,
    type: TYPE['Strategic Ploy'],
    detachment: detachment['Hypercrypt Legion'],
    turn: TURN.your,
    phase: [PHASE.charge],
    fluff: `As the tomb's warriors pass through a dimensional displacement corridor, the passage’s surface is lit with data-glyphs providing hyperlogical tactical information. When they step from an eternity gate, they are already prepared for the hunt.`,
    when: `Your Charge phase.`,
    target: `One NECRONS unit from your army that was set up on the battlefield this turn using the Eternity Gate ability of a MONOLITH model that started the turn on the battlefield.`,
    effect: `Your unit is eligible to charge this phase.`,
    restrictions: ``,
  },
  {
    name: 'ENTROPIC DAMPING',
    cost: 1,
    type: TYPE.Wargear,
    detachment: detachment['Hypercrypt Legion'],
    turn: TURN.your,
    phase: [PHASE.movement],
    fluff: `Towering war engines rise from an erupting tomb in its defence, directing entropic energies to weaken and fracture the enemies' own weapons and turning them into dangerous tools only the desperate would use.`,
    when: `Your opponent’s Shooting phase, just after an enemy unit has selected its targets.`,
    target: `One TITANIC model from your army that was selected as the target of one or more of the attacking unit’s attacks and is within 18" of the attacking unit.`,
    effect: `Until the end of the phase, weapons equipped by models in the attacking unit have the [HAZARDOUS] ability.`,
    restrictions: ``,
  },
];

export default template;
