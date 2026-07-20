import { useState } from 'react';
import type { UnitID } from '../constants/Units';
import type { Player } from '../utils/Player';

type ClearButtonProps = {
    player: Player,
    label: string,
    side: string
};

const ClearButton = ({ player, label, side }: ClearButtonProps) => {

    const setUnitCount: Function = player.setUnitCount;

    function clearUnits() {
        (Object.keys(player.config.units) as UnitID[]).forEach(unitID => {
            setUnitCount(unitID, 0);
        });
    }

    return (
        <div className={`column ${side}`}>
            <button type="button" onClick={clearUnits}>{label}</button>
        </div>
    );
};

type CombatTypeToggleProps = {
    combatType: string,
    setCombatType: Function
};

const CombatTypeToggle = ({ combatType, setCombatType }: CombatTypeToggleProps) => (
    <div className="column center">
        <button
            type="button"
            onClick={() => setCombatType(combatType === 'Space' ? 'Ground' : 'Space')}
        >
            {combatType} Combat
        </button>
    </div>
);

type ControlRowProps = {
    attacker: Player,
    defender: Player
};

const ControlRow = ({ attacker, defender }: ControlRowProps) => {

    const [combatType, setCombatType] = useState<string>('Space');

    return (
        <div className="row control-row">
            <ClearButton player={attacker} label="Clear Attacker" side="left" />
            <CombatTypeToggle combatType={combatType} setCombatType={setCombatType} />
            <ClearButton player={defender} label="Clear Defender" side="right" />
        </div>
    );
};

export default ControlRow;
