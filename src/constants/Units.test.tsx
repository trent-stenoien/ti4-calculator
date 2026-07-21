import { describe, expect, it } from 'vitest';
import getUnitStats from './Units';

describe('getUnitStats', () => {

	it('resolves base stats when the faction has no override for that unit', () => {
		const stats = getUnitStats({ unitID: 'cruiser', factionID: 'arborec', upgraded: false });

		expect(stats.combatValue).toBe(7);
		expect(stats.diceCount).toBe(1);
		expect(stats.cost).toBe(2);
		expect(stats.sustainDamage).toBe(false);
	});

	it('picks the upgraded ("II") value from stat arrays when upgraded is true', () => {
		const stats = getUnitStats({ unitID: 'cruiser', factionID: 'arborec', upgraded: true });

		expect(stats.combatValue).toBe(6);
	});

	it("merges the Titans of Ul's Saturn Engine cruiser override over the base cruiser", () => {
		const nonUpgraded = getUnitStats({ unitID: 'cruiser', factionID: 'titans', upgraded: false });
		const upgraded = getUnitStats({ unitID: 'cruiser', factionID: 'titans', upgraded: true });

		// combatValue isn't overridden by the faction unit, so it still falls back to the base cruiser.
		expect(nonUpgraded.combatValue).toBe(7);
		expect(upgraded.combatValue).toBe(6);

		// capacity and sustainDamage ARE overridden by the Saturn Engine.
		expect(nonUpgraded.capacity).toBe(1);
		expect(nonUpgraded.sustainDamage).toBe(false);
		expect(upgraded.capacity).toBe(2);
		expect(upgraded.sustainDamage).toBe(true);
	});

	it('defaults combatValue to 0 for units with no combatValue entries (PDS) and exposes spaceCannon', () => {
		const stats = getUnitStats({ unitID: 'pds', factionID: 'arborec', upgraded: false });

		expect(stats.combatValue).toBe(0);
		expect(stats.spaceCannon).toEqual({ value: 6, diceCount: 1 });
	});

	it('resolves base (non-upgraded) Destroyer stats', () => {
		const stats = getUnitStats({ unitID: 'destroyer', factionID: 'arborec', upgraded: false });

		expect(stats.cost).toBe(1);
		expect(stats.combatValue).toBe(9);
		expect(stats.moveSpeed).toBe(2);
		expect(stats.capacity).toBe(0);
		expect(stats.antiFighterBarrage).toEqual({ value: 9, diceCount: 2 });
	});

	it('resolves upgraded ("Destroyer II") stats: improved combat, greatly improved AFB', () => {
		const stats = getUnitStats({ unitID: 'destroyer', factionID: 'arborec', upgraded: true });

		expect(stats.cost).toBe(1);
		expect(stats.combatValue).toBe(8);
		expect(stats.moveSpeed).toBe(2);
		expect(stats.antiFighterBarrage).toEqual({ value: 6, diceCount: 3 });
	});
});