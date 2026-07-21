import { useState } from "react";
import type { FactionID } from "../constants/Factions";
import type { UnitID } from "../constants/Units";

export interface PlayerUnitState {
    count: number;
    upgraded: boolean;
}

interface PlayerConfig {
    factionID: FactionID;
    units: Record<UnitID, PlayerUnitState>;
}

function createPlayerConfig(factionID: FactionID): PlayerConfig {
    return {
        factionID,
        units: {
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
        }
    };
}

// Range: 0-100
const boundCount = (count: number):number => Math.min(Math.max(count, 0), 100);

export interface Player {
    config: PlayerConfig,
    setConfigFaction: Function,
    setUnitCount: Function,
    toggleUpgrade: Function,
    clearUnits: Function,
}

function usePlayer(initialFaction: FactionID): Player {
    const [config, setConfig] = useState<PlayerConfig>(() => createPlayerConfig(initialFaction));

    function setConfigFaction(factionID: FactionID) {
        setConfig(prev => ({ ...prev, factionID }));

        // Update flagship, mech, and faction units in BattleSim
    };

    function setUnitCount(unitID: UnitID, count: number) {
        setConfig(prev => ({
            ...prev, units: {
                ...prev.units, [unitID]: {
                    ...prev.units[unitID],
                    count: boundCount(count)
                }
            }
        }));
    }

    function toggleUpgrade(unitID: UnitID) {

        setConfig(prev => ({
            ...prev, units: {
                ...prev.units, [unitID]: {
                    ...prev.units[unitID],
                    upgraded: !prev.units[unitID]?.upgraded
                }
            }
        }));
    }

    function clearUnits() {
        setConfig(prev => ({ ...prev, units: createPlayerConfig(prev.factionID).units }));
    }

    return { config, setConfigFaction, setUnitCount, toggleUpgrade, clearUnits };
}

export default usePlayer;