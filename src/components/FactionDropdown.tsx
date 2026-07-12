import factions from '../constants/Factions';

function FactionDropdown() {
    return (
        <div className="row">
            <div className="column left">
                <select name="faction" id="faction-select" className="left">
                    {factions
                        .map((faction) => {
                        return (
                            <option
                                key={faction.key + 'Attacker'}
                                value={faction.key}>
                                {faction.name.replaceAll('The', '')}
                            </option>
                        );
                    }) }
                </select>
            </div>
            <div className="column center">Faction</div>
            <div className="column left">
                <select name="faction" id="faction-select" className="right">
                    {factions
                        .map((faction) => {
                            return (
                                <option
                                    key={faction.key + 'Attacker'}
                                    value={faction.key}>
                                    {faction.name.replaceAll('The', '')}
                                </option>
                            );
                        })}
                </select>
            </div>
        </div>
    )
}

export default FactionDropdown;


// <div>Factions</div>
//     <option value="barony">Barony of Letnev</option>
//     <option value="sol">Empire of Sol</option>