import FactionDropdown from './components/FactionDropdown'
import UnitRows from './components/UnitRows'
import usePlayer, { type Player } from './utils/Player';

function App() {
    const attacker = usePlayer("arborec");
    const defender = usePlayer("arborec");

    console.log(attacker.config.factionID, attacker.config.units);

    return (
        <div>
            <h1>TI4 Battle Calculator</h1>
            <div className="calc">
                <FactionDropdown attacker={attacker} defender={defender} />
                <UnitRows attacker={attacker} defender={defender} />
            </div>
        </div>
    )
}

export default App

/*
Later:

Add options: riskDH, calcCost, detailedResults, etc
    Handle planetary shield here???: y/n checkbox
    Mentak mech: 

                    <div className="calc-row">
                        <select name="faction" id="faction-select">
                            <option value="barony">Barony of Letnev</option>
                            <option value="sol">Empire of Sol</option>
                        </select>
                        <div>Factions</div>
                        <select name="faction" id="faction-select">
                            <option value="barony">Barony of Letnev</option>
                            <option value="sol">Empire of Sol</option>
                        </select>
                    </div>
*/