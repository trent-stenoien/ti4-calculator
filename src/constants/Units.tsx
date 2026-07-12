type Mod = {
	upgradeNum?: number,
	upgradeBool?: boolean,
	factionModObjs?: {}
};

type Unit = {
	name: string,
	reinforcements: number,
	cost: number,
	combat: number,
	combatMods?: Mod,
	move?: number,
	moveMods?: Mod,
	capacity?: number,
	capacityMods?: Mod,
	sustain?: boolean,
	sustainMods?: Mod,
};

export type UnitSummary = {
	name: string,
	reinforcements: number,
	cost: number,
	combat: number,
	move: number,
	capacity: number,
	sustain: boolean,
};

type GetUnitProps = {
	unitName: string,
	faction: string,
	upgraded: boolean
};

const ModifyNumVal = ((val: number = 0, mods: Mod = {}, faction: string, upgraded: boolean): number => {

	// Upgrade mod
	let upgradeNum = mods.upgradeNum ?? 0;
	if (!upgraded) upgradeNum = 0;

	// Faction Mod
	const factionModObjs = mods.factionModObjs ?? {};
	const factionModObj = Object.keys(factionModObjs).includes(faction) ? factionModObjs[faction] : null;
	const factionModUpgraded = factionModObj ? factionModObj.factionModUpgraded : false;

	let factionMod = factionModObj ? factionModObj.factionMod : 0;
	if (factionMod != 0 && factionModUpgraded && !upgraded) {
		factionMod = 0;
	};

	return val + upgradeNum + factionMod;
});

const ModifyBoolVal = ((val: boolean = false, mods: Mod = {}, faction: string, upgraded: boolean): boolean => {

	// Upgrade mod
	let upgradeBool = mods.upgradeBool ?? false;
	if (!upgraded) upgradeBool = false;

	// Faction Mod
	const factionModObjs = mods.factionModObjs ?? {};
	const factionModObj = Object.keys(factionModObjs).includes(faction) ? factionModObjs[faction] : null;
	const factionModUpgraded = factionModObj ? factionModObj.factionModUpgraded : false;

	let factionMod = factionModObj ? factionModObj.factionMod : 0;
	if (factionMod != 0 && factionModUpgraded && !upgraded) {
		factionMod = 0;
	};

	return [val, upgradeBool, factionMod].includes(true);
});

const GetUnit = ({ unitName, faction, upgraded }: GetUnitProps): UnitSummary => {

	const unit: Unit = units.find(u => u.name == unitName);

	unit.combat = ModifyNumVal(unit.combat, unit.combatMods, faction, upgraded);
	unit.move = ModifyNumVal(unit.move, unit.moveMods, faction, upgraded);
	unit.capacity = ModifyNumVal(unit.capacity, unit.capacityMods, faction, upgraded);
	unit.sustain = ModifyBoolVal(unit.sustain, unit.sustainMods, faction, upgraded);

	return {
		name: unit.name,
		reinforcements: unit.reinforcements,
		cost: unit.cost,
		combat: unit.combat,
		move: unit.move,
		capacity: unit.capacity,
		sustain: unit.sustain,
	};
}

const units: Unit[] = [
	{
		name: 'Carrier',
		reinforcements: 4,
		cost: 3,
		combat: 9,
		move: 1,
		capacity: 4,
		capacityMods: {
			upgradeNum: 2,
			factionModObjs: {
				sol: {
					factionMod: 2
				}
			}
		},
		sustain: false,
		sustainMods: {
			factionModObjs: {
				sol: {
					factionModUpgraded: true,
					factionMod: true
				}
			}
		},
	},

	{
		name: 'Cruiser',
		reinforcements: 8,
		cost: 2,
		combat: 7,
		combatMods: {
			upgradeNum: -1,
		},
		move: 2,
		moveMods: {
			upgradeNum: 1,
		},
		capacity: 0,
		capacityMods: {
			upgradeNum: 1,
			factionModObjs: {
				mentak: {
					factionModUpgraded: true,
					factionMod: 1,
				},
				titans: {
					factionMod: 1,
				},
			},
		},
		sustain: false,
		sustainMods: {
			factionModObjs: {
				titans: {
					factionModUpgraded: true,
					factionMod: true
				}
			}
		},
	},

	// {
	// 	name: 'name',
	// 	reinforcements: ?,
	// 	cost: ?,
	// 	combat: ?,
	// 	combatMods: {
	// 		upgradeNum: ?,
	// 		factionModObjs: {
	// 			??: {
	// 				factionModUpgraded: ?,
	// 				factionMod: ?,
	// 			},
	// 		},
	// 	},
	// 	move: ?,
	// 	moveMods: {
	// 		upgradeNum: ?,
	// 		factionModObjs: {
	// 			??: {
	// 				factionModUpgraded: ?,
	// 				factionMod: ?,
	// 			},
	// 		},
	// 	},
	// 	capacity: ?,
	// 	capacityMods: {
	// 		upgradeNum: ?,
	// 		factionModObjs: {
	// 			??: {
	// 						factionModUpgraded: ?,
	// 						factionMod: ?,
	// 			},
	// 		},
	// 	},
	// 	sustain: false,
	// 	sustainMods: {
	// 		upgradeBool: ?,
	// 		factionModObjs: {
	// 			??: {
	// 				factionModUpgraded: true,
	// 				factionMod: true
	// 			},
	// 		},
	// 	},
	// },
];

export default GetUnit;