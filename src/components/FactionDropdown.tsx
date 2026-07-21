import factions, { type FactionID } from '../constants/Factions';
import type { Player } from '../utils/Player';

type FactionDropdownProps = {
    player: Player,
    side: string
}

function FactionDropdown({ player, side }: FactionDropdownProps) {

    const label: string = (side == 'left' ? 'Attacker' : 'Defender');
    const value: FactionID = player.config.factionID;
    const onChange: Function = player.setConfigFaction;

    return (
        <div className={`column ${side}`}>
            <select
                id="faction-select"
                name="faction"
                aria-label={"faction" + label}
                value={value}
                onChange={e => onChange(e.target.value as FactionID)}
                className={side}
            >
                {factions
                    .map(f => {
                        return (
                            <option
                                key={f.factionID + label}
                                value={f.factionID}>
                                {f.name.replaceAll('The', '')}
                            </option>
                        );
                    })
                }
            </select>
        </div>
    )
}

type FactionDropdownRowProps = {
    attacker: Player,
    defender: Player
};

function FactionDropdownRow({ attacker, defender }: FactionDropdownRowProps) {
    return (
        <div key="faction" className="row faction-row">
            <FactionDropdown player={attacker} side='left' />
            <div className="column center">Faction</div>
            <FactionDropdown player={defender} side='right' />
        </div>
    )
}

export default FactionDropdownRow;