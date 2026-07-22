import factions, { type FactionID } from './Factions';

export type UnitID =
	| "carrier" | "cruiser"  | "destroyer" | "dreadnought" | "fighter" 
	| "flagship" | "warsun" | "infantry" | "mech" | "pds";

export interface UnitDefinition {
	unitID: UnitID;
	name: string;
	reinforcements?: number, // Default to 1 for flagships
	cost: number[];
	combatValue: number[];
	diceCount?: number[]; // Default to 1
	moveSpeed?: number[]; // Default to 0
	capacity?: number[]; // Default to 0
	sustainDamage?: boolean[]; // Default to false
	antiFighterBarrage?: { value: number; diceCount: number }[];
	bombardment?: { value: number; diceCount: number }[];
	spaceCannon?: { value: number; diceCount: number }[];
	planetaryShield?: boolean[],
	bypassPlanetaryShield?: boolean[],
	specialText?: string[];
}

const DEFAULT_UNIT: Partial<UnitDefinition> = {
	diceCount: [1],
	moveSpeed: [1],
	capacity: [0],
	sustainDamage: [false],
	antiFighterBarrage: [],
	bombardment: [],
	spaceCannon: [],
	planetaryShield: [false],
	bypassPlanetaryShield: [false],
	specialText: [],
};

export interface UnitSummary {
	unitID: UnitID,
	name: string,
	upgraded: boolean,
	reinforcements: number,
	cost: number,
	combatValue: number,
	diceCount: number, // Default to 1
	moveSpeed: number, // Default to 0
	capacity: number, // Default to 0
	sustainDamage: boolean, // Default to false
	antiFighterBarrage?: { value: number; diceCount: number },
	bombardment?: { value: number; diceCount: number },
	spaceCannon?: { value: number; diceCount: number },
	planetaryShield?: boolean,
	bypassPlanetaryShield?: boolean,
	specialText?: string,
};

type UnitName = {
	unitID: UnitID,
	name: string
};

export const getUnitNames = (): UnitName[] =>
	units.map(u => ({ unitID: u.unitID, name: u.name }) );

const units: UnitDefinition[] = [

	// NOTE: Flagships and Mechs live on ./constants/Factions

	{
		unitID: 'carrier',
		name: 'Carrier',
		reinforcements: 4,
		cost: [3],
		combatValue: [9],
		moveSpeed: [1, 2],
		capacity: [4, 6],
	},

	{
		unitID: 'cruiser',
		name: 'Cruiser',
		reinforcements: 8,
		cost: [2],
		combatValue: [7, 6],
		moveSpeed: [2, 3],
		capacity: [0, 1],
	},

	{
		unitID: 'destroyer',
		name: 'Destroyer',
		reinforcements: 8,
		cost: [1],
		combatValue: [9, 8],
		moveSpeed: [2],
		capacity: [0],
		antiFighterBarrage: [
			{ value: 9, diceCount: 2 },
			{ value: 6, diceCount: 3 },
		],
		specialText: [
			null,
			'Direct Hit cards are no longer effective against this type of ship.'
		],
	},

	{
		unitID: 'dreadnought',
		name: 'Dreadnought',
		reinforcements: 5,
		cost: [4],
		combatValue: [5],
		moveSpeed: [1, 2],
		capacity: [1],
		sustainDamage: [true],
		bombardment: [
			{ value: 5, diceCount: 1 },
		],
		specialText: [
			null,
			"\"Direct Hit\" cards are no longer effective against this type of ship.",
		],
	},

	{
		unitID: 'fighter',
		name: 'Fighter',
		reinforcements: 10,
		cost: [0.5],
		combatValue: [9, 8],
		moveSpeed: [0, 2],
		specialText: [
			'This unit may not move without being transported.',
			"This unit may move without being transported. Fighters in excess of your ships' capacity count against your fleet pool."
		],
	},

	{
		unitID: 'flagship',
		name: 'Flagship',
		reinforcements: 1,
		cost: [8],
		combatValue: [7],
		moveSpeed: [1],
		capacity: [3],
		sustainDamage: [true],
	},

	{
		unitID: 'warsun',
		name: 'War Sun',
		reinforcements: 2,
		cost: [null, 12],
		combatValue: [null, 3],
		diceCount: [null, 3],
		moveSpeed: [null, 2],
		capacity: [null, 6],
		sustainDamage: [null, true],
		bombardment: [
			null,
			{ value: 3, diceCount: 3 },
		],
		bypassPlanetaryShield: [null, true],
		specialText: [
			"Can't build without research.",
			"Other players' units in this system lose their Planetary Shield ability."
		],
	},

	{
		unitID: 'infantry',
		name: 'Infantry',
		reinforcements: 12,
		cost: [0.5],
		combatValue: [8, 7],
		specialText: [
			null,
			"After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system."
		],
	},

	{
		unitID: 'mech',
		name: 'Mech',
		reinforcements: 4,
		cost: [2],
		combatValue: [6],
		sustainDamage: [true],
	},

	{
		unitID: 'pds',
		name: 'PDS',
		reinforcements: 3,
		cost: [0],
		combatValue: [],
		spaceCannon: [
			{ value: 6, diceCount: 1 },
			{ value: 5, diceCount: 1 },
		],
		planetaryShield: [true],
		specialText: [
			null,
			"You may use this unit's SPACE CANNON against ships that are adjacent to this unit's system.",
		],
	},

];

function updateUnit(unit: UnitDefinition, factionUnit: Partial<UnitDefinition>) {
	return { ...DEFAULT_UNIT, ...unit, ...factionUnit };
};

const resolveUnitDefinition = (unitID: UnitID, factionID: FactionID): UnitDefinition => {

	const baseUnit: UnitDefinition = units.find(u => u.unitID == unitID);

	const factionUnit: Partial<UnitDefinition> =
		factions
			.find(f => f.factionID == factionID)
			.factionUnits
			.find(u => u.unitID == unitID);

	// Coalesce to faction unit, when available.
	return (factionUnit ? updateUnit(baseUnit, factionUnit) : updateUnit(baseUnit, {}));
};

// A unit only has a real upgrade ("II") level if at least one of its stat arrays
// has a second entry; units whose arrays are all length 1 have identical stats
// regardless of the `upgraded` flag, so there's nothing to toggle.
export const canUpgrade = (unitID: UnitID, factionID: FactionID): boolean => {

	const unit = resolveUnitDefinition(unitID, factionID);

	return [
		unit.cost,
		unit.combatValue,
		unit.diceCount,
		unit.moveSpeed,
		unit.capacity,
		unit.sustainDamage,
		unit.antiFighterBarrage,
		unit.bombardment,
		unit.spaceCannon,
		unit.planetaryShield,
		unit.bypassPlanetaryShield,
	].some(field => (field?.length ?? 0) > 1);
};

type getUnitStatsProps = {
	unitID: UnitID,
	factionID: FactionID,
	upgraded: boolean,
};

const getUnitStats = ({ unitID, factionID, upgraded }: getUnitStatsProps): UnitSummary => {

	const unit: UnitDefinition = resolveUnitDefinition(unitID, factionID);

	// Upgrade arrays are either length of 1, others are 2.
	// Non-upgraded values are always first, upgraded values are always last.
	const index: number = (upgraded ? -1 : 0);

	return ({
		unitID,
		name: unit.name + (upgraded ? ' I' : ' II'),
		upgraded,
		reinforcements: unit.reinforcements ?? 1,
		cost: unit.cost.at(index),
		combatValue: unit.combatValue.at(index) ?? 0,
		diceCount: unit.diceCount.at(index) ?? 1,
		moveSpeed: unit.moveSpeed.at(index) ?? 0,
		capacity: unit.capacity.at(index) ?? 0,
		sustainDamage: unit.sustainDamage.at(index) ?? false,
		antiFighterBarrage: unit.antiFighterBarrage.at(index) ?? null,
		bombardment: unit.bombardment.at(index) ?? null,
		spaceCannon: unit.spaceCannon.at(index) ?? null,
		planetaryShield: unit.planetaryShield.at(index) ?? null,
		bypassPlanetaryShield: unit.bypassPlanetaryShield.at(index) ?? null,
		specialText: unit.specialText.at(index) ?? null,
	});
}

// NOTE: No need for a getFleetStats function; stats initialize/update when:
//		users load the page (fleet is empty)
//		users increase count from 0 to X (pull one)
//		upgrade units (update existing, if more than 0)
//		change factions (update faction units only; 1-2 units plus mech/flagship)

export default getUnitStats;