# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server.
- `npm run build` — type-check (`tsc -b`) then production build (`vite build`).
- `npm run lint` — run oxlint (config: `.oxlintrc.json`). This project uses **oxlint**, not ESLint.
- `npm run preview` — preview a production build.

There is no test runner configured in this repo (no `test` script, no test framework in `package.json`).

## Architecture

This is a single-page React 19 + TypeScript + Vite app (no router, no backend) that Monte-Carlo simulates Twilight Imperium 4th Edition space combat between two fleets and reports win/draw/loss percentages. The React Compiler (`babel-plugin-react-compiler`) is enabled via `@vitejs/plugin-react`.

### Data layer: units and factions are data, not classes

- `src/constants/Units.tsx` defines the base stat block for every `UnitID` (carrier, cruiser, destroyer, dreadnought, fighter, flagship, warsun, infantry, mech, pds) as a `UnitDefinition`.
- `src/constants/Factions.tsx` defines all 30+ `FactionID`s, each with an optional `factionUnits: Partial<UnitDefinition>[]` that overrides specific unit fields (e.g. a faction's unique flagship/mech stats, or a buffed cruiser).
- Most stat fields on `UnitDefinition` are **arrays indexed by upgrade level**: index `0` is the non-upgraded ("I") value, the last index is the upgraded ("II") value. `getUnitStats({ unitID, factionID, upgraded })` in `Units.tsx` resolves the final `UnitSummary` for one unit by: finding the base unit, finding the faction's override (if any), shallow-merging override over base, then picking `.at(0)` or `.at(-1)` per field depending on `upgraded`.
- `DEFAULT_UNIT` supplies fallback values (dice count 1, no sustain damage, etc.) for fields a `UnitDefinition` omits.
- When adding/editing faction abilities that affect combat math (AFB, bombardment, space cannon, sustain damage, planetary shield, faction dice modifiers), update both the data in `Factions.tsx`/`Units.tsx` *and* the corresponding logic in `BattleSim.tsx` — the data alone doesn't do anything.

### Player state

- `src/utils/Player.tsx` exports a `usePlayer(initialFaction)` hook that owns one side's config: `{ factionID, units: Record<UnitID, { count, upgraded }> }`. It returns `{ config, setConfigFaction, setUnitCount, toggleUpgrade }`.
- `App.tsx` calls `usePlayer` twice (attacker, defender) — the two sides are independent hook instances, not a shared reducer.
- Unit counts are clamped to 0–100 via `boundCount`.

### Battle simulation

- `src/utils/BattleSim.tsx` : `battleSimulation({ attacker, defender })` converts each `Player.config` into `SimUnitState` fleets (via `toSimUnits`, which attaches resolved `UnitSummary` stats), then runs `combat()` 1000 times, tallying attacker win / draw / defender win, and returns a `[attackerPct, drawPct, defenderPct]` tuple (`BattleSimulationResults`) that always sums to ~100.
- Per combat round: anti-fighter barrage and space cannon resolve first (`antiFighterBarrage`, `spaceCannon`), then units roll to-hit (`rollAllUnitAttacks`/`rollSingleUnitAttack`) using a d10-equivalent (`Math.round(Math.random() * 10)`) against each unit's `combatValue`, with a faction-wide dice modifier (Sardakk N'orr +1, Jol-Nar −1) applied via `factionMod`.
- Hit assignment (`assignHits`) sorts live units cheapest-first (`sortUnits` by `stats.cost`) and applies hits there first; a separate sustain-damage sub-pass runs before the destroy pass, and units that can sustain damage must be marked damaged before destroyed (enforced with thrown errors on invariant violations).
- Winnu's flagship has a variable dice count equal to the opponent's non-fighter ship count (`getEnemyShipCount`); this is special-cased directly in `rollAllUnitAttacks`.
- `combat()` loops rounds until one fleet has zero live units (`getArrayOfLiveUnits`), with a hard cap of 1000 rounds (throws if exceeded — treat this as a signal of a real combat-math bug, not something to raise the cap on).
- Ground combat, bombardment, and planetary shields are **not implemented yet** — see the `Todo:` comments in `BattleSim.tsx` (the current space-cannon-vs-shield interaction is called out there as known-wrong) and the `Later:` block at the bottom of `App.tsx` for planned options (riskDH, calcCost, detailedResults, planetary shield handling, Mentak mech, etc).

### UI structure

- `src/components/` has one file per calculator "row" (`FactionDropdown`, `UnitRows`, `ControlRow`, `Results`), each rendering side-by-side attacker (left) / defender (right) columns and taking the two `Player` objects (or a single `Player` + `side` label) as props.
- `src/utils/TypedEntries.tsx` wraps `Object.entries` with a cast back to `[K, V][]` — use it instead of raw `Object.entries` when iterating a `Record<UnitID, ...>` or similar so keys keep their literal type instead of widening to `string`.
