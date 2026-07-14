import { getUnitNames, type UnitID } from '../constants/Units';
import type { Player, PlayerUnitState } from '../utils/Player';

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
            <div key={unitID + label + "Upgrade"} className="upgrade">
                <input
                    type="checkbox"
                    title="upgrade"

                    checked={upgraded}
                    onChange={e => {
                        e.preventDefault();
                        toggleUpgrade(unitID)
                    }}
                />
            </div>
            <input
                key={unitID + label + "Count"}
                type="number"
                value={count}
                onChange={e => {
                    e.preventDefault();
                    setUnitCount(unitID, Number(e.target.value))
                }}
            />
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