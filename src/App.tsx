import FactionDropdown from './components/FactionDropdown'
import Results from './components/Results';
import UnitRows from './components/UnitRows';
import battleSimulation, { type BattleSimulationResults } from './utils/BattleSim';
import usePlayer, { type Player } from './utils/Player';

function App() {

    const attacker: Player = usePlayer("arborec");
    const defender: Player = usePlayer("arborec");

    // Stand-in for battle results
    const results: BattleSimulationResults = battleSimulation({ attacker, defender });

    return (
        <div>
            <h1>TI4 Battle Calculator</h1>
            <div className="calc">
                <FactionDropdown attacker={attacker} defender={defender} />
                <UnitRows attacker={attacker} defender={defender} />
                <h2 className="results-heading">Results</h2>
                <Results results={results} />
            </div>
        </div>
    );
};

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