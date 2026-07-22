import type { Player } from '../utils/Player';
import type { CombatType } from '../utils/BattleSim';

type ClearButtonProps = {
    player: Player,
    label: string,
    side: string
};

const ClearButton = ({ player, label, side }: ClearButtonProps) => {

    const clearUnits: Function = player.clearUnits;

    return (
        <div className={`column ${side}`}>
            <button type="button" onClick={() => clearUnits()}>{label}</button>
        </div>
    );
};

type CombatTypeToggleProps = {
    combatType: CombatType,
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
    defender: Player,
    combatType: CombatType,
    setCombatType: Function
};

const ControlRow = ({ attacker, defender, combatType, setCombatType }: ControlRowProps) => {

    return (
        <div className="row control-row">
            <ClearButton player={attacker} label="Clear Attacker" side="left" />
            <CombatTypeToggle combatType={combatType} setCombatType={setCombatType} />
            <ClearButton player={defender} label="Clear Defender" side="right" />
        </div>
    );
};

export default ControlRow;
