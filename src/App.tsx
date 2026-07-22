import { useEffect, useState } from 'react';
import FactionDropdown from './components/FactionDropdown'
import Results from './components/Results';
import UnitRows from './components/UnitRows';
import FleetCost from './components/FleetCost';
import ControlRow from './components/ControlRow';
import Info from './components/Info';
import battleSimulation, { type BattleSimulationResults, type CombatType } from './utils/BattleSim';
import usePlayer, { type Player } from './utils/Player';

function App() {

    const [results, setResults] = useState<BattleSimulationResults>([0, 100, 0]);
    const [combatType, setCombatType] = useState<CombatType>('Space');

    const attacker: Player = usePlayer("arborec");
    const defender: Player = usePlayer("arborec");

    useEffect(() => {
        let cancelled = false;
        const simulation = battleSimulation(attacker, defender, { combatType });

        const runBatch = () => {
            if (cancelled) return;

            const { value, done } = simulation.next();
            if (!done) {
                setResults(value);
                setTimeout(runBatch, 0);
            }
        };

        runBatch();

        return () => { cancelled = true; };
    }, [attacker, defender, combatType]);

    return (
        <div>
            <h1>TI4 Battle Calculator</h1>
            <div className="calc">
                <FactionDropdown attacker={attacker} defender={defender} />
                <UnitRows attacker={attacker} defender={defender} />
                <FleetCost attacker={attacker} defender={defender} />
                <ControlRow attacker={attacker} defender={defender} combatType={combatType} setCombatType={setCombatType} />
                <h2 className="results-heading">Results</h2>
                <Results results={results} />
            </div>
            <Info />
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