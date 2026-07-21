import { describe, expect, it } from 'vitest';
import type { FactionID } from '../constants/Factions';
import type { UnitID } from '../constants/Units';
import type { Player, PlayerUnitState } from './Player';
import battleSimulation, { assignHits, getArrayOfLiveUnits, toSimUnits } from './BattleSim';

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

const makePlayer = (factionID: FactionID, overrides: Partial<Record<UnitID, PlayerUnitState>> = {}): Player => ({
	config: {
		factionID,
		units: { ...emptyUnits(), ...overrides },
	},
	setConfigFaction: () => {},
	setUnitCount: () => {},
	toggleUpgrade: () => {},
});

describe('assignHits', () => {

	it('assigns hits cheapest-unit-first, tracking damaged and destroyed counts', () => {
		const fleet = toSimUnits(
			emptyUnits(),
			'arborec',
		);
		fleet.cruiser = { ...fleet.cruiser, count: 1 };       // cost 2
		fleet.dreadnought = { ...fleet.dreadnought, count: 2 }; // cost 4

		const remaining = assignHits(3, fleet, 'arborec');

		expect(remaining).toBe(0);
		expect(fleet.cruiser.destroyed).toBe(1);
		expect(fleet.dreadnought.destroyed).toBe(2);
	});

	it('lets only sustain-capable units absorb hits as damage (not destruction) during a sustain round', () => {
		const fleet = toSimUnits(emptyUnits(), 'arborec');
		fleet.dreadnought = { ...fleet.dreadnought, count: 2 }; // sustainDamage: true
		fleet.cruiser = { ...fleet.cruiser, count: 1 };         // sustainDamage: false

		const remaining = assignHits(2, fleet, 'arborec', true);

		expect(remaining).toBe(0);
		expect(fleet.dreadnought.damaged).toBe(2);
		expect(fleet.dreadnought.destroyed).toBe(0);
		// Non-sustain-capable units are excluded from the sustain round entirely.
		expect(fleet.cruiser.damaged).toBe(0);
		expect(fleet.cruiser.destroyed).toBe(0);
	});

	it('spills leftover hits past a destroyed cheap unit onto the next cheapest unit', () => {
		const fleet = toSimUnits(emptyUnits(), 'arborec');
		fleet.cruiser = { ...fleet.cruiser, count: 1 };       // cost 2, 1 hit destroys it
		fleet.dreadnought = { ...fleet.dreadnought, count: 1 }; // cost 4

		const remaining = assignHits(2, fleet, 'arborec');

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

		const live = getArrayOfLiveUnits(fleet);

		expect(live.map(([unitID]) => unitID)).toEqual(['fighter']);
	});
});

describe('battleSimulation', () => {

	it('is a full draw when both fleets are empty', () => {
		const attacker = makePlayer('arborec');
		const defender = makePlayer('arborec');

		expect(battleSimulation({ attacker, defender })).toEqual([0, 100, 0]);
	});

	it('is a guaranteed attacker win when the defender has no units', () => {
		const attacker = makePlayer('arborec', { cruiser: { count: 1, upgraded: false } });
		const defender = makePlayer('arborec');

		expect(battleSimulation({ attacker, defender })).toEqual([100, 0, 0]);
	});

	it('is a guaranteed defender win when the attacker has no units', () => {
		const attacker = makePlayer('arborec');
		const defender = makePlayer('arborec', { cruiser: { count: 1, upgraded: false } });

		expect(battleSimulation({ attacker, defender })).toEqual([0, 0, 100]);
	});

	// Statistical, not exact: real dice rolls via Math.random(), so this asserts a wide
	// tolerance band rather than a precise percentage. The fleet gap is large enough that
	// flakiness risk is negligible.
	it('overwhelmingly favors a much larger, stronger fleet', () => {
		const attacker = makePlayer('arborec', { dreadnought: { count: 20, upgraded: true } });
		const defender = makePlayer('arborec', { fighter: { count: 1, upgraded: false } });

		const [attackerPct] = battleSimulation({ attacker, defender });

		expect(attackerPct).toBeGreaterThanOrEqual(95);
	});
});
