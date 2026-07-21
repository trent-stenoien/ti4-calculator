import type { FactionID } from "../constants/Factions";
import getUnitStats, { type UnitID, type UnitSummary } from "../constants/Units";
import type { Player, PlayerUnitState } from "./Player";
import typedEntries from "./TypedEntries";

export interface SimUnitState extends PlayerUnitState {
	damaged: number;  // How many have sustained damage
	destroyed: number;  // How many have been destroyed
	factionID: FactionID;
	stats: UnitSummary;
};

type BattleSimulationProps = {
	attacker: Player,
	defender: Player,
	options?: Object, // Placeholder for future OptionsProp
};

export type BattleSimulationResults = [number, number, number];

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

export const getArrayOfLiveUnits = (fleet: Record<UnitID, SimUnitState>, sustain?: boolean, factionID?: FactionID): [UnitID, SimUnitState][] =>
	typedEntries(fleet)
		// Filter out all 0 counts and all units with 100% destroyed.
		.filter(([unitID, unit]) => unit.count > 0 && unit.count > unit.destroyed)

		// During sustain damage round, filter out units that can't currently sustain. Otherwise, return all.
		.filter(([unitID, unit]) => {
			if (sustain) {
				const hasUndamagedUnits: boolean = unit.count > unit.damaged;
				if (unit.stats.sustainDamage || !hasUndamagedUnits) return false;
			}
			return true;
		});
	

const rollAllUnitAttacks = (fleet: Record<UnitID, SimUnitState>, factionID: FactionID, enemyShipCount?: number): number => {

	let hits = 0;

	// Saardak: +1, Jol-Nar: -1, All others: 0
	const factionMod: number = (
		factionID == 'sardakk' ? 1
			: (factionID == 'jolnar' ? -1
				: 0 ));

	getArrayOfLiveUnits(fleet).map(([unitID, unit]) => {

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

export const assignHits = (hits: number, fleet: Record<UnitID, SimUnitState>, factionID: FactionID, sustainRound?: boolean): number => {

	const sortedLiveUnits = sortUnits(
		getArrayOfLiveUnits(fleet)
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
// Todo: Combine this into a single "special attack" function that passes in the attack type.
const spaceCannon = (activeFleet: Record<UnitID, SimUnitState>, targetedFleet: Record<UnitID, SimUnitState>) => {

	if (Object.entries(targetedFleet).length == 0) return;

	let hits: number = typedEntries(activeFleet)
		.filter(([_, unit]) => unit.count > 0 && unit.stats.spaceCannon)
		.map(([_, { count, stats }]) => {
			// This is flagging on lint, but no undefined values will make it through the previous filter.
			const { value, diceCount } = stats.spaceCannon;
			return rollSingleUnitAttack(count, value, diceCount, 0); // Todo: I believe no faction gets +/- 1 on AFB because it's an ability not an attack, but should confirm.
		})
		.reduce((a, b) => a + b, 0);

	hits = assignHits(hits, targetedFleet, targetedFleet.carrier.factionID, true);
	if (hits > 0) assignHits(hits, targetedFleet, targetedFleet.carrier.factionID);
};

// Get ship count for Winnu's flagship dice count.
export const getEnemyShipCount = (fleet: Record<UnitID, SimUnitState>): number =>
	Object.entries(fleet)
		.map(([unitID, unit]) => (['fighter', 'infantry', 'pds'].includes(unitID) ? 0 : unit.count - unit.destroyed))
		.reduce((a, b) => a + b);

const combat = (
	attackerFleet: Record<UnitID, SimUnitState>,
	attackerFactionID: FactionID,
	defenderFleet: Record<UnitID, SimUnitState>,
	defenderFactionID: FactionID,
): number => {

	console.log(attackerFleet, defenderFleet)

	// Todo: AFB, bombardment, space cannon here.
	antiFighterBarrage(attackerFleet, defenderFleet.fighter);
	antiFighterBarrage(defenderFleet, attackerFleet.fighter);

	spaceCannon(attackerFleet, defenderFleet);
	spaceCannon(defenderFleet, attackerFleet);

	let attackerFleetCount: number = getArrayOfLiveUnits(attackerFleet).length;
	let defenderFleetCount: number = getArrayOfLiveUnits(defenderFleet).length;
	let l: number = 0;

	// Loop through these until one side wins
	while (attackerFleetCount > 0 && defenderFleetCount > 0) {

		let attackerHits: number = rollAllUnitAttacks(
			attackerFleet,
			attackerFactionID,
			(attackerFactionID == 'winnu' ? getEnemyShipCount(defenderFleet) : undefined)
		);

		let defenderHits: number = rollAllUnitAttacks(
			defenderFleet,
			defenderFactionID,
			(defenderFactionID == 'winnu' ? getEnemyShipCount(attackerFleet) : undefined)
		);

		// Sustain damage
		attackerHits = assignHits(attackerHits, defenderFleet, defenderFactionID, true);
		defenderHits = assignHits(defenderHits, attackerFleet, attackerFactionID, true);

		if (attackerHits > 0) attackerHits = assignHits(attackerHits, defenderFleet, defenderFactionID);
		if (defenderHits > 0) defenderHits = assignHits(defenderHits, attackerFleet, attackerFactionID);

		attackerFleetCount = getArrayOfLiveUnits(attackerFleet).length;
		defenderFleetCount = getArrayOfLiveUnits(defenderFleet).length;

		// Protect against endless loops
		l++
		if (l > 1000) {
			throw new Error(`Potential endless loop in combat().`)
		}
	}

	if (attackerFleetCount > 0 && defenderFleetCount <= 0) return 0;
	if (attackerFleetCount <= 0 && defenderFleetCount > 0) return 2;
	else return 1;
};

const resetCombat = (fleet: Record<UnitID, SimUnitState>) =>
	Object.entries(fleet).map(([unitID, unit]) => {
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

const battleSimulation = ({ attacker, defender }: BattleSimulationProps): BattleSimulationResults => {

	const simulations = 1000;
	const winTallies: BattleSimulationResults = [0, 0, 0]; // attacker, draw, defender

	const attackerFleet: Record<UnitID, SimUnitState> = toSimUnits(attacker.config.units, attacker.config.factionID);
	const defenderFleet: Record<UnitID, SimUnitState> = toSimUnits(defender.config.units, defender.config.factionID);

	const attackerFleetCount: number = getArrayOfLiveUnits(attackerFleet).length;
	const defenderFleetCount: number = getArrayOfLiveUnits(defenderFleet).length;

	if (attackerFleetCount == 0 && defenderFleetCount == 0) return [0, 100, 0];
	if (attackerFleetCount >= 1 && defenderFleetCount == 0) return [100, 0, 0];
	if (attackerFleetCount == 0 && defenderFleetCount >= 1) return [0, 0, 100];

	for (let i = 0; i < simulations; i++) {

		const result = combat(attackerFleet, attacker.config.factionID, defenderFleet, defender.config.factionID);

		resetCombat(attackerFleet);
		resetCombat(defenderFleet);

		// attacker win = 0, draw = 1, defender win = 2
		winTallies[result]++;
	};

	return calculatePercentages(winTallies, simulations);
};

export default battleSimulation;
