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

const createPlayerConfig = (factionID: FactionID): PlayerConfig => {
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

export interface Player {
    config: PlayerConfig,
    setConfigFaction: Function,
    setUnitCount: Function,
    toggleUpgrade: Function,
    clearUnits: Function,
}

const usePlayer = (initialFaction: FactionID): Player => {
    const [config, setConfig] = useState<PlayerConfig>(() => createPlayerConfig(initialFaction));

    const setConfigFaction = (factionID: FactionID) => {
        setConfig(prev => ({ ...prev, factionID }));
    };

    const setUnitCount = (unitID: UnitID, count: number): void => {
        setConfig(prev => ({
            ...prev, units: {
                ...prev.units, [unitID]: {
                    ...prev.units[unitID],
                    count: Math.min(Math.max(count, 0), 100) // Range: 0 - 100
                }
            }
        }));
    }

    const toggleUpgrade = (unitID: UnitID): void => {
        setConfig(prev => ({
            ...prev, units: {
                ...prev.units, [unitID]: {
                    ...prev.units[unitID],
                    upgraded: !prev.units[unitID]?.upgraded
                }
            }
        }));
    }

    const clearUnits = (): void => {
        setConfig(prev => ({ ...prev, units: createPlayerConfig(prev.factionID).units }));
    }

    return { config, setConfigFaction, setUnitCount, toggleUpgrade, clearUnits };
}

export default usePlayer;