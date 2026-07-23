import { describe, expect, it } from 'vitest';
import type { UnitID } from '../constants/Units';
import type { PlayerUnitState } from './Player';
import { assignHits, getArrayOfLiveUnits, toSimUnits, SPACE_UNIT_IDS } from './BattleSim';

const emptyUnits = (): Record<UnitID, PlayerUnitState> => ({
	carrier: { count: 0, upgraded: false },
	cruiser: { count: 0, upgraded: false },
	destroyer: { count: 0, upgraded: false },
	dreadnought: { count: 0, upgraded: false },
	fighter: { count: 0, upgraded: false },
	flagship: { count: 0, upgraded: false },
	warsun: { count: 0, upgraded: false },
	infantry: { count: 0, upgraded: false },
	mech: { count: 0, upgraded: false },
	pds: { count: 0, upgraded: false },
});

// Commenting out for now, not sure if I'll need it later.
// const makePlayer = (factionID: FactionID, overrides: Partial<Record<UnitID, PlayerUnitState>> = {}): Player => ({
// 	config: {
// 		factionID,
// 		units: { ...emptyUnits(), ...overrides },
// 	},
// 	setConfigFaction: () => {},
// 	setUnitCount: () => {},
// 	toggleUpgrade: () => { },
// 	clearUnits: () => { },
// });

describe('assignHits', () => {

	it('assigns hits cheapest-unit-first, tracking damaged and destroyed counts', () => {
		const fleet = toSimUnits(
			emptyUnits(),
			'arborec',
		);
		fleet.cruiser = { ...fleet.cruiser, count: 1 };
		fleet.dreadnought = { ...fleet.dreadnought, count: 2 };

		const unitFilter: UnitID[] = SPACE_UNIT_IDS;

		const remaining = assignHits(3, fleet, unitFilter);

		expect(remaining).toBe(0);
		expect(fleet.cruiser.destroyed).toBe(1);
		expect(fleet.dreadnought.destroyed).toBe(2);
	});

	it('lets only sustain-capable units absorb hits as damage (not destruction) during a sustain round', () => {
		const fleet = toSimUnits(emptyUnits(), 'arborec');
		fleet.dreadnought = { ...fleet.dreadnought, count: 2 }; // sustainDamage: true
		fleet.cruiser = { ...fleet.cruiser, count: 1 };         // sustainDamage: false

		const unitFilter: UnitID[] = SPACE_UNIT_IDS;

		const remaining = assignHits(2, fleet, unitFilter, true);

		expect(remaining).toBe(0);
		expect(fleet.dreadnought.damaged).toBe(2);
		expect(fleet.dreadnought.destroyed).toBe(0);
		// Non-sustain-capable units are excluded from the sustain round entirely.
		expect(fleet.cruiser.damaged).toBe(0);
		expect(fleet.cruiser.destroyed).toBe(0);
	});

	it('spills leftover hits past a destroyed cheap unit onto the next cheapest unit', () => {
		const fleet = toSimUnits(emptyUnits(), 'arborec');
		fleet.cruiser = { ...fleet.cruiser, count: 1 };
		fleet.dreadnought = { ...fleet.dreadnought, count: 1 };

		const unitFilter: UnitID[] = SPACE_UNIT_IDS;

		const remaining = assignHits(2, fleet, unitFilter);

		expect(remaining).toBe(0);
		expect(fleet.cruiser.destroyed).toBe(1);
		expect(fleet.dreadnought.destroyed).toBe(1);
	});
});

describe('getArrayOfLiveUnits', () => {

	it('excludes units with zero count and units that are fully destroyed', () => {
		const fleet = toSimUnits(emptyUnits(), 'arborec');
		fleet.fighter = { ...fleet.fighter, count: 3 };
		fleet.infantry = { ...fleet.infantry, count: 2 };
		fleet.infantry.destroyed = 2;

		const unitFilter: UnitID[] = SPACE_UNIT_IDS;

		const live = getArrayOfLiveUnits({ fleet, unitFilter });

		expect(live.map(([unitID]) => unitID)).toEqual(['fighter']);
	});
});

describe('battleSimulation', () => {
});
