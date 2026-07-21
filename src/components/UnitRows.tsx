import { getUnitNames, type UnitID } from '../constants/Units';
import type { Player, PlayerUnitState } from '../utils/Player';

type UpgradeInputProps = {
    unitID: UnitID,
    label: string,
    upgraded: boolean,
    toggleUpgrade: Function
}

const UpgradeInput = ({ unitID, label, upgraded, toggleUpgrade }: UpgradeInputProps) =>
    <div key={unitID + label + "Upgrade"} className="upgrade">
        <input
            type="checkbox"
            title="upgrade"
            checked={upgraded}
            onChange={e => {
                toggleUpgrade(unitID)
            }}
        />
    </div>;

type CountInputProps = {
    unitID: UnitID,
    label: string,
    count: number,
    setUnitCount: Function,
}

const CountInput = ({ unitID, label, count, setUnitCount }: CountInputProps) =>
    <input
        key={unitID + label + "Count"}
        type="number"
        value={count}
        onChange={e => {
            e.preventDefault();
            setUnitCount(unitID, Number(e.target.value))
        }}
    />;

type UnitInputProps = {
    player: Player,
    unitState: PlayerUnitState,
    unitID: UnitID,
    side: string
};

const UnitInput = ({ player, unitState, unitID, side }: UnitInputProps) => {

    const label: string = (side == 'left' ? 'Attacker' : 'Defender');

    const upgraded: boolean = unitState.upgraded;
    const toggleUpgrade: Function = player.toggleUpgrade;

    const count: number = unitState.count;
    const setUnitCount: Function = player.setUnitCount;

    return (
        <div key={unitID + label} className={`column ${side}`}>
            {
                side == 'left'
                    ? <>
                        <UpgradeInput unitID={unitID} label={label} upgraded={upgraded} toggleUpgrade={toggleUpgrade} />
                        <CountInput unitID={unitID} label={label} count={count} setUnitCount={setUnitCount} />
                    </>
                    : <>
                        <CountInput unitID={unitID} label={label} count={count} setUnitCount={setUnitCount} />
                        <UpgradeInput unitID={unitID} label={label} upgraded={upgraded} toggleUpgrade={toggleUpgrade} />
                    </>
            }
            
            
        </div>
    );
};

type UnitRowProps = {
    attacker: Player,
    defender: Player
};

const UnitRows = ({ attacker, defender }: UnitRowProps) =>
    getUnitNames().map(unit => {

        const attackerUnitState: PlayerUnitState = attacker.config.units[unit.unitID];
        const defenderUnitState: PlayerUnitState = defender.config.units[unit.unitID];

        return (
            <div key={unit.unitID} className="row">
                <UnitInput player={attacker} unitState={attackerUnitState} unitID={unit.unitID} side='left' />
                <div className="column center">{unit.name}</div>
                <UnitInput player={defender} unitState={defenderUnitState} unitID={unit.unitID} side='right' />
            </div>
        );
    });

export default UnitRows;