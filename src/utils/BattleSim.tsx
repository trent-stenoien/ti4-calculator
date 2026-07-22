import type { FactionID } from "../constants/Factions";
import getUnitStats, { type UnitID, type UnitSummary } from "../constants/Units";
import type { Player, PlayerUnitState } from "./Player";
import typedEntries from "./TypedEntries";

export interface SimUnitState extends PlayerUnitState {
	damaged: number;
	destroyed: number;
	factionID: FactionID;
	stats: UnitSummary;
};

export type CombatType = 'Space' | 'Ground';

export type BattleSimulationOptions = {
	combatType: CombatType,
};

export type BattleSimulationResults = [number, number, number];

// Lists of units that partake in regular combat in ground vs space. PDS not included as that is pre-combat.
const SPACE_UNIT_IDS: UnitID[] = ['carrier', 'cruiser', 'destroyer', 'dreadnought', 'fighter', 'flagship', 'warsun'];
const GROUND_UNIT_IDS: UnitID[] = ['infantry', 'mech'];

const calculatePercentages = (
	tallies: BattleSimulationResults,
	devisor: number
): BattleSimulationResults => {
	return [
		Math.round((tallies[0] / devisor) * 100),
		Math.round((tallies[1] / devisor) * 100),
		Math.round((tallies[2] / devisor) * 100),
	];
};

const rollSingleUnitAttack = (count: number, combatValue: number, diceCount: number, factionMod: number) => {

	let hits = 0;
	let shots = count * diceCount;

	for (let i = 0; i < shots; i++) {
		const roll = Math.round(Math.random() * 10);

		if ((roll + factionMod) >= combatValue) hits++;
	}

	return hits;
}

type GetArrayOfLiveUnitsProps = {
	fleet: Record<UnitID, SimUnitState>,
	unitFilter?: UnitID[],
	sustain?: boolean
};

// Steps: 1. Filter but unitFilter, 2. filter out 0-counts and all-destroyed, 3. during sustain rounds filter out units that can't currently sustain.
export const getArrayOfLiveUnits = ({ fleet, unitFilter, sustain }: GetArrayOfLiveUnitsProps): [UnitID, SimUnitState][] =>
	typedEntries(fleet)
		.filter(([unitID]) => !unitFilter || unitFilter.includes(unitID))
		.filter(([_, unit]) => unit.count > 0 && unit.count > unit.destroyed)
		.filter(([_, unit]) => !(sustain && (unit.stats.sustainDamage || unit.count <= unit.damaged)));


const rollAllUnitAttacks = (fleet: Record<UnitID, SimUnitState>, factionID: FactionID, enemyShipCount?: number, unitFilter?: UnitID[]): number => {

	let hits = 0;

	// Saardak: +1, Jol-Nar: -1, All others: 0
	const factionMod: number = (
		factionID == 'sardakk' ? 1
			: (factionID == 'jolnar' ? -1
				: 0 ));

	getArrayOfLiveUnits({fleet, unitFilter}).map(([unitID, unit]) => {

		const { count, destroyed, stats }: SimUnitState = unit;
		let { combatValue, diceCount }: UnitSummary = stats;

		if (count - destroyed < 0) {
			throw new Error(`Must have at least one non-destroyed ${unitID} to fire a volley. Count: ${count}, destroyed: ${destroyed}`)
		}

		if (factionID == 'winnu' && unitID == 'flagship' && enemyShipCount) {
			diceCount = enemyShipCount;
		}

		hits += rollSingleUnitAttack(
			count - destroyed,
			combatValue,
			diceCount,
			factionMod
		);
	});

	return hits;
};

export const sortUnits = (fleet: [UnitID, SimUnitState][]) =>
	fleet.sort(([_a, aUnit], [_b, bUnit]) => aUnit.stats.cost - bUnit.stats.cost);


export const assignHits = (hits: number, fleet: Record<UnitID, SimUnitState>, unitFilter?: UnitID[], sustainRound?: boolean): number => {

	const sortedLiveUnits = sortUnits(
		getArrayOfLiveUnits({fleet, unitFilter})
			.filter(([_, { count, damaged, destroyed, stats }]) =>
				!sustainRound
				|| ( stats.sustainDamage && count - damaged > 0 && count - destroyed > 0 )
			)
	);

	if (sustainRound && sortedLiveUnits.some(([_, unit]): boolean => !unit.stats.sustainDamage)) {
		console.log(sortedLiveUnits.every(([_, { stats }]) => !stats.sustainDamage));
		throw new Error('Units that cannot sustain damage should have been weeded out already.');
	}

	for (const [_, unit] of sortedLiveUnits) {

		if (unit.stats.sustainDamage && unit.destroyed > unit.damaged) {
			throw new Error('Units that can sustain damage must be damaged before they are destroyed.')
		}

		// Units should be marked as damaged, even if they're about to be destroyed.
		const damagingHits: number = Math.min(hits, unit.count - unit.damaged);
		const destroyingHits: number = Math.min(hits, unit.count - unit.destroyed);

		// On sustain round, lower hits by remaining undamaged.
		if (sustainRound) {
			unit.damaged += damagingHits;
			hits -= damagingHits;
		} else {
			unit.damaged += Math.min(damagingHits, destroyingHits);
			unit.destroyed += destroyingHits;
			hits -= destroyingHits;
		}
	}

	return hits;
};

const antiFighterBarrage = (barragingFleet: Record<UnitID, SimUnitState>, barragedFighters: SimUnitState) => {

	if (barragedFighters.count == 0) return;

	const hits: number = typedEntries(barragingFleet)
		.filter(([_, { count, stats }]) => count > 0 && stats.antiFighterBarrage)
		.map(([_, { count, stats }]) => {
			// This is flagging on lint, but no undefined values will make it through the previous filter.
			const { value, diceCount } = stats.antiFighterBarrage;
			return rollSingleUnitAttack(count, value, diceCount, 0);
		})
		.reduce((a, b) => a + b, 0);

	barragedFighters.destroyed = Math.min(hits, barragedFighters.count);
};

// Todo: This is wrong. 1 dread vs 3 PDS should be ~50/50 but it's 0/100.
// Space Cannon Offense (space combat) targets ships; Space Cannon Defense (ground combat)
// targets the invading ground forces instead, so the caller supplies which unit types are valid targets.
const spaceCannon = (activeFleet: Record<UnitID, SimUnitState>, targetedFleet: Record<UnitID, SimUnitState>, targetFilter: UnitID[]) => {

	if (Object.entries(targetedFleet).length == 0) return;

	let hits: number = typedEntries(activeFleet)
		.filter(([_, unit]) => unit.count > 0 && unit.stats.spaceCannon)
		.map(([_, { count, stats }]) => {
			// This is flagging on lint, but no undefined values will make it through the previous filter.
			const { value, diceCount } = stats.spaceCannon;
			return rollSingleUnitAttack(count, value, diceCount, 0); // Todo: I believe no faction gets +/- 1 on AFB because it's an ability not an attack, but should confirm.
		})
		.reduce((a, b) => a + b, 0);

	hits = assignHits(hits, targetedFleet, targetFilter, true);
	if (hits > 0) assignHits(hits, targetedFleet, targetFilter, false);
};

// Attacker-only, pre-ground-combat action. Blocked by the defender's Planetary Shield unless the
// attacker has a unit that bypasses it (e.g. War Sun). Hits land on the defender's ground forces.
const bombardment = (attackerFleet: Record<UnitID, SimUnitState>, defenderFleet: Record<UnitID, SimUnitState>) => {

	const shieldActive: boolean = typedEntries(defenderFleet)
		.some(([_, unit]) => unit.count - unit.destroyed > 0 && unit.stats.planetaryShield);

	const shieldBypassed: boolean = typedEntries(attackerFleet)
		.some(([_, unit]) => unit.count - unit.destroyed > 0 && unit.stats.bypassPlanetaryShield);

	if (shieldActive && !shieldBypassed) return;

	let hits: number = typedEntries(attackerFleet)
		.filter(([_, unit]) => unit.count - unit.destroyed > 0 && unit.stats.bombardment)
		.map(([_, { count, destroyed, stats }]) => {
			const { value, diceCount } = stats.bombardment;
			return rollSingleUnitAttack(count - destroyed, value, diceCount, 0);
		})
		.reduce((a, b) => a + b, 0);

	hits = assignHits(hits, defenderFleet, GROUND_UNIT_IDS, true);
	if (hits > 0) assignHits(hits, defenderFleet, GROUND_UNIT_IDS, false);
};

// Get ship count for Winnu's flagship dice count.
export const getEnemyShipCount = (fleet: Record<UnitID, SimUnitState>): number =>
	Object.entries(fleet)
		.map(([unitID, unit]) => (['fighter', 'infantry', 'pds'].includes(unitID) ? 0 : unit.count - unit.destroyed))
		.reduce((a, b) => a + b);

// Regular combat rounds shared by both space and ground combat, restricted to whichever unit
// types are eligible to fight (SPACE_UNIT_IDS or GROUND_UNIT_IDS).
const runCombatRounds = (
	attackerFleet: Record<UnitID, SimUnitState>,
	attackerFactionID: FactionID,
	defenderFleet: Record<UnitID, SimUnitState>,
	defenderFactionID: FactionID,
	unitFilter: UnitID[],
): number => {

	let attackerFleetCount: number = getArrayOfLiveUnits({ fleet: attackerFleet, unitFilter }).length;
	let defenderFleetCount: number = getArrayOfLiveUnits({ fleet: defenderFleet, unitFilter }).length;
	let l: number = 0;

	// Loop through these until one side wins
	while (attackerFleetCount > 0 && defenderFleetCount > 0) {

		let attackerHits: number = rollAllUnitAttacks(
			attackerFleet,
			attackerFactionID,
			(attackerFactionID == 'winnu' ? getEnemyShipCount(defenderFleet) : undefined),
			unitFilter
		);

		let defenderHits: number = rollAllUnitAttacks(
			defenderFleet,
			defenderFactionID,
			(defenderFactionID == 'winnu' ? getEnemyShipCount(attackerFleet) : undefined),
			unitFilter
		);

		// Sustain damage, if able
		attackerHits = assignHits(attackerHits, defenderFleet, unitFilter, true);
		defenderHits = assignHits(defenderHits, attackerFleet, unitFilter, true);

		// Assign hits
		if (attackerHits > 0) attackerHits = assignHits(attackerHits, defenderFleet, unitFilter, false);
		if (defenderHits > 0) defenderHits = assignHits(defenderHits, attackerFleet, unitFilter, false);

		// Check while loop conditions
		attackerFleetCount = getArrayOfLiveUnits({ fleet: attackerFleet, unitFilter }).length;
		defenderFleetCount = getArrayOfLiveUnits({ fleet: defenderFleet, unitFilter }).length;

		// Protect against endless loops
		l++
		if (l > 1000) {
			throw new Error(`Potential endless loop in runCombatRounds().`)
		}
	}

	if (attackerFleetCount > 0 && defenderFleetCount <= 0) return 0;
	if (attackerFleetCount <= 0 && defenderFleetCount > 0) return 2;
	else return 1;
};

const combat = (
	attackerFleet: Record<UnitID, SimUnitState>,
	attackerFactionID: FactionID,
	defenderFleet: Record<UnitID, SimUnitState>,
	defenderFactionID: FactionID,
	combatType: CombatType,
): number => {

	if (combatType == 'Ground') {

		// Space Cannon Defense fires before anything else and hits the invading ground forces, not ships.
		spaceCannon(defenderFleet, attackerFleet, GROUND_UNIT_IDS);

		bombardment(attackerFleet, defenderFleet);

		return runCombatRounds(attackerFleet, attackerFactionID, defenderFleet, defenderFactionID, GROUND_UNIT_IDS);
	}

	// Space Cannon Offense fires before Anti-Fighter Barrage.
	spaceCannon(attackerFleet, defenderFleet, SPACE_UNIT_IDS);
	spaceCannon(defenderFleet, attackerFleet, SPACE_UNIT_IDS);

	antiFighterBarrage(attackerFleet, defenderFleet.fighter);
	antiFighterBarrage(defenderFleet, attackerFleet.fighter);

	return runCombatRounds(attackerFleet, attackerFactionID, defenderFleet, defenderFactionID, SPACE_UNIT_IDS);
};

const resetCombat = (fleet: Record<UnitID, SimUnitState>) =>
	Object.entries(fleet).map(([_, unit]) => {
		unit.damaged = 0;
		unit.destroyed = 0;
	});

export const toSimUnits = (units: Record<UnitID, PlayerUnitState>, factionID: FactionID): Record<UnitID, SimUnitState> => {
	return Object.fromEntries(
		typedEntries(units)
			.map(([unitID, unit]) => {
				const stats: UnitSummary = getUnitStats({ unitID, factionID, upgraded: unit.upgraded });

				return [
					unitID,
					{ ...unit, damaged: 0, destroyed: 0, factionID, stats },
				];
			})
    ) as Record<UnitID, SimUnitState>;
}

export const TOTAL_SIMULATIONS = 50000;
export const SIMULATION_BATCH_SIZE = 1000;

// Generator function that "yields" results in batches of SIMULATION_BATCH_SIZE.
// Allows App.tsx to call 50 loops of 1000 without blocking the main thread for the entire run.
function* battleSimulation(attacker: Player, defender: Player, options: BattleSimulationOptions): Generator<BattleSimulationResults, void, void> {

	const winTallies: BattleSimulationResults = [0, 0, 0]; // attacker, draw, defender

	const attackerFleet: Record<UnitID, SimUnitState> = toSimUnits(attacker.config.units, attacker.config.factionID);
	const defenderFleet: Record<UnitID, SimUnitState> = toSimUnits(defender.config.units, defender.config.factionID);

	const unitFilter: UnitID[] = (options.combatType == 'Ground' ? GROUND_UNIT_IDS : SPACE_UNIT_IDS);

	const attackerFleetCount: number = getArrayOfLiveUnits({ fleet: attackerFleet, unitFilter }).length;
	const defenderFleetCount: number = getArrayOfLiveUnits({ fleet: defenderFleet, unitFilter }).length;

	if (attackerFleetCount == 0 && defenderFleetCount == 0) { yield [0, 100, 0]; return; }
	if (attackerFleetCount >= 1 && defenderFleetCount == 0) { yield [100, 0, 0]; return; }
	if (attackerFleetCount == 0 && defenderFleetCount >= 1) { yield [0, 0, 100]; return; }

	for (let i = 0; i < TOTAL_SIMULATIONS; i++) {

		const result = combat(attackerFleet, attacker.config.factionID, defenderFleet, defender.config.factionID, options.combatType);

		resetCombat(attackerFleet);
		resetCombat(defenderFleet);

		// attacker win = 0, draw = 1, defender win = 2
		winTallies[result]++;

		if ((i + 1) % SIMULATION_BATCH_SIZE == 0) {
			yield calculatePercentages(winTallies, i + 1);
		}
	};
};

export default battleSimulation;
