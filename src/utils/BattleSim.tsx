import { useState } from "react";
import type { Player, PlayerUnitState } from "./Player";

interface SimUnitState extends PlayerUnitState {
	damaged: number;  // How many have sustained damage
	destroyed: number;  // How many have been destroyed
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

const runSimulation = (attacker: Player, defender: Player, options?): number => {

	// Placeholder for actual sim
	const result = Math.random() * 10;

	const bounds = [2,7];

	return (
		Math.round(result) <= bounds[0] ? 0
			: Math.round(result) < bounds[1] ? 1
				: 2
	);
};

const battleSimulation = ({ attacker, defender, options }: BattleSimulationProps): BattleSimulationResults => {

	// const [results, setResults] = useState<BattleSimulationResults>([0, 100, 0]);

	const simulations = 1000;
	const winTallies: BattleSimulationResults = [0, 0, 0]; // Att, Draw, Def

	for (let i = 0; i < simulations; i++) {

		const result = runSimulation(attacker, defender);

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