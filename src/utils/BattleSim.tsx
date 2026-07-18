import type { FactionID } from "../constants/Factions";
import getUnitStats, { getUnitNames, type UnitID, type UnitSummary } from "../constants/Units";
import type { Player, PlayerUnitState } from "./Player";

interface SimUnitState extends PlayerUnitState {
	damaged: number;  // How many have sustained damage
	destroyed: number;  // How many have been destroyed
	factionID: FactionID
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

const rollSingleUnitAttack = (count: number, combatValue: number, diceCount: number) => {

	let hits = 0;
	let shots = count * diceCount;

	for (let i = 0; i < shots; i++) {
		const roll = Math.round(Math.random() * 10);
		if (roll >= combatValue) {
			hits++;
		}
	}

	return hits;
}

const getArrayOfLiveUnits = (fleet: Record<UnitID, SimUnitState>, sustain?: boolean, factionID?: FactionID): [UnitID, SimUnitState][] =>
	(Object.entries(fleet) as [UnitID, SimUnitState][])

		// Filter out all 0 counts and all units with 100% destroyed.
		.filter(u => u[1].count > 0 && u[1].count > u[1].destroyed)

		// During sustain damage round, filter out units that can't currently sustain. Otherwise, return all.
		.filter(u => {
			if (sustain) {
				const canSustain: boolean = getUnitStats({ unitID: u[0], factionID, upgraded: u[1].upgraded }).sustainDamage == true;
				const hasUndamagedUnits: boolean = u[1].count > u[1].damaged;
				if (!canSustain || !hasUndamagedUnits) return false;
			}
			return true;
		});
	

const rollAllUnitAttacks = (fleet: Record<UnitID, SimUnitState>, factionID: FactionID): number => {

	let hits = 0;

	getArrayOfLiveUnits(fleet).map(u => {
		const unitID: UnitID = u[0];
		const { count, upgraded, damaged, destroyed }: SimUnitState = u[1];
		const { combatValue, diceCount }: UnitSummary = getUnitStats({ unitID, factionID, upgraded });

		if (count - destroyed < 0) {
			throw new Error(`Must have at least one non-destroyed ${unitID} to fire a volley. Count: ${count}, destroyed: ${destroyed}`)
		}

		hits += rollSingleUnitAttack(count - destroyed, combatValue, diceCount);
	});

	return hits;
};

const assignHits = (hits: number, fleet: Record<UnitID, SimUnitState>, factionID: FactionID, sustain?: boolean): number => {

	const liveUnits = getArrayOfLiveUnits(fleet);
	// Todo: Need a sorting algorithm
	// liveUnits.sort(u => orderUnitsForHits());

	for (const [unitID, unitState] of liveUnits) {
		if (hits <= 0) break;


		// convert this into "fleet[unitID]"?

		console.log(unitState)

		const { sustainDamage }: UnitSummary = getUnitStats({ unitID, factionID, upgraded: unitState.upgraded });

		const aliveCount = unitState.count - unitState.destroyed;
		const damagedCount = unitState.damaged; // Already-damaged, still alive
		const undamagedCount = aliveCount - damagedCount;

		if (sustainDamage) {

			// Damaged units need 1 more hit to die; undamaged units need 2 hits to die.
			const capacity = damagedCount + undamagedCount * 2;

			if (hits >= capacity) {

				unitState.destroyed += aliveCount;
				unitState.damaged = 0;
				hits -= capacity;
			} else {
				// Finish off already-damaged units first
				const finishDamaged = Math.min(hits, damagedCount);
				unitState.destroyed += finishDamaged;
				unitState.damaged -= finishDamaged;
				hits -= finishDamaged;

				// Remaining hits: two hits destroy an undamaged unit, one hit damages it
				const undamagedDestroyed = Math.floor(hits / 2);
				const remainder = hits % 2;

				unitState.destroyed += undamagedDestroyed;
				unitState.damaged += remainder;

				hits = 0;
			}
		} else {
			const capacity = aliveCount;

			if (hits >= capacity) {
				unitState.destroyed += aliveCount;
				hits -= capacity;
			} else {
				unitState.destroyed += hits;
				hits = 0;
			}
		}
		console.log('after', unitState)
	}

	return hits; // leftover hits if the whole fleet was wiped out before hits ran out
};

const combat = (
	attackerFleet: Record<UnitID, SimUnitState>,
	attackerFactionID: FactionID,
	defenderFleet: Record<UnitID, SimUnitState>,
	defenderFactionID: FactionID,
): number => {

	let attackerFleetCount: number = getArrayOfLiveUnits(attackerFleet).length;
	let defenderFleetCount: number = getArrayOfLiveUnits(defenderFleet).length;
	let l: number = 0;

	console.log(attackerFleetCount, defenderFleetCount);

	// Todo: AFB, bombardment, space cannon here.


	// Loop through these until one side wins
	while (attackerFleetCount > 0 && defenderFleetCount > 0) {

		let attackerHits: number = rollAllUnitAttacks(attackerFleet, attackerFactionID);
		let defenderHits: number = rollAllUnitAttacks(defenderFleet, defenderFactionID);

		// Sustain damage
		attackerHits = assignHits(attackerHits, defenderFleet, defenderFactionID, true);
		defenderHits = assignHits(defenderHits, attackerFleet, attackerFactionID, true);

		if (attackerHits > 0) attackerHits = assignHits(attackerHits, defenderFleet, defenderFactionID);
		if (defenderHits > 0) defenderHits = assignHits(defenderHits, attackerFleet, attackerFactionID);

		attackerFleetCount = getArrayOfLiveUnits(attackerFleet).length;
		defenderFleetCount = getArrayOfLiveUnits(defenderFleet).length;

		console.log('loop', getArrayOfLiveUnits(attackerFleet), getArrayOfLiveUnits(defenderFleet), attackerHits, defenderHits);

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

function toSimUnits(units: Record<UnitID, PlayerUnitState>): Record<UnitID, SimUnitState> {
    return Object.fromEntries(
        Object.entries(units).map(([id, unit]) => [
            id,
            { ...unit, damaged: 0, destroyed: 0 },
        ])
    ) as Record<UnitID, SimUnitState>;
}

const battleSimulation = ({ attacker, defender }: BattleSimulationProps): BattleSimulationResults => {

	const simulations = 1000;
	const winTallies: BattleSimulationResults = [0, 0, 0]; // attacker, draw, defender

	const attackerFleet: Record<UnitID, SimUnitState> = toSimUnits(attacker.config.units);
	const defenderFleet: Record<UnitID, SimUnitState> = toSimUnits(defender.config.units);

	if (getArrayOfLiveUnits(attackerFleet).length == 0
		&& getArrayOfLiveUnits(defenderFleet).length == 0) return [0, 100, 0];
	if (getArrayOfLiveUnits(attackerFleet).length > 0
		&& getArrayOfLiveUnits(defenderFleet).length == 0) return [100, 0, 0];
	if (getArrayOfLiveUnits(attackerFleet).length == 0
		&& getArrayOfLiveUnits(defenderFleet).length > 0) return [0, 0, 100];

	for (let i = 0; i < simulations; i++) {

		const result = combat(attackerFleet, attacker.config.factionID, defenderFleet, defender.config.factionID);

		// attacker win = 0, draw = 1, defender win = 2
		winTallies[result]++;
	};

	return calculatePercentages(winTallies, simulations);
};

export default battleSimulation;


// NOTE: Winnu flagship needs custom dice count.
// "When this unit makes a combat roll, it rolls a number of
// dice equal to the number of your opponent's non-fighter ships in this system."

// Mentak mech: Other players' ground forces on this planet cannot use SUSTAIN DAMAGE.

// NRA mech: Can fight in space at 8x2. Loses sustain damage.