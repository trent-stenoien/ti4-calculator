import { canUpgrade, getUnitNames, type UnitID } from '../constants/Units';
import type { FactionID } from '../constants/Factions';
import type { Player, PlayerUnitState } from '../utils/Player';

type UpgradeInputProps = {
    unitID: UnitID,
    label: string,
    upgraded: boolean,
    toggleUpgrade: Function,
    disabled: boolean,
}

const UpgradeInput = ({ unitID, label, upgraded, toggleUpgrade, disabled }: UpgradeInputProps) =>
    <div key={unitID + label + "Upgrade"} className="upgrade">
        <input
            type="checkbox"
            title="upgrade"
            checked={upgraded}
            disabled={disabled}
            onChange={() => {
                toggleUpgrade(unitID)
            }}
        />
    </div>;

type CountInputProps = {
    unitID: UnitID,
    label: string,
    count: number,
    setUnitCount: Function,
    disabled: boolean,
}

const CountInput = ({ unitID, label, count, setUnitCount, disabled }: CountInputProps) =>
    <input
        key={unitID + label + "Count"}
        type="number"
        value={count}
        disabled={disabled}
        onFocus={e => e.target.select()}
        onChange={e => {
            e.preventDefault();
            setUnitCount(unitID, Number(e.target.value))
        }}
    />;

// War Suns can't be built without research; only Muaat starts with the tech, so
// everyone else must have the unit's own upgrade toggled on first.
const isCountDisabled = (unitID: UnitID, factionID: FactionID, upgraded: boolean): boolean =>
    unitID == 'warsun' && !(factionID == 'muaat' || upgraded);

// Most factions' flagships/mechs have no distinct upgraded stat line, so their
// upgrade toggle has nothing to do.
const isUpgradeDisabled = (unitID: UnitID, factionID: FactionID): boolean =>
    (unitID == 'flagship' || unitID == 'mech') && !canUpgrade(unitID, factionID);

type UnitInputProps = {
    player: Player,
    unitState: PlayerUnitState,
    unitID: UnitID,
    side: string
};

const UnitInput = ({ player, unitState, unitID, side }: UnitInputProps) => {

    const label: string = (side == 'left' ? 'Attacker' : 'Defender');

    const factionID: FactionID = player.config.factionID;

    const upgraded: boolean = unitState.upgraded;
    const toggleUpgrade: Function = player.toggleUpgrade;
    const upgradeDisabled: boolean = isUpgradeDisabled(unitID, factionID);

    const count: number = unitState.count;
    const setUnitCount: Function = player.setUnitCount;
    const countDisabled: boolean = isCountDisabled(unitID, factionID, upgraded);

    return (
        <div key={unitID + label} className={`column ${side}`}>
            {
                side == 'left'
                    ? <>
                        <UpgradeInput unitID={unitID} label={label} upgraded={upgraded} toggleUpgrade={toggleUpgrade} disabled={upgradeDisabled} />
                        <CountInput unitID={unitID} label={label} count={count} setUnitCount={setUnitCount} disabled={countDisabled} />
                    </>
                    : <>
                        <CountInput unitID={unitID} label={label} count={count} setUnitCount={setUnitCount} disabled={countDisabled} />
                        <UpgradeInput unitID={unitID} label={label} upgraded={upgraded} toggleUpgrade={toggleUpgrade} disabled={upgradeDisabled} />
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