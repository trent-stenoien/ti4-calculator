import { useEffect } from 'react';
import './App.css'
import FactionDropdown from './components/FactionDropdown'
import UnitRow from './components/UnitRow'
import GetUnit, { type UnitSummary } from './constants/Units';

function App() {

    useEffect(() => {
        const unitName = 'Cruiser';
        const faction = 'titans';
        const upgraded = false;
        // const upgraded = true;

        const unit: UnitSummary = GetUnit({ unitName, faction, upgraded });

        console.log(unitName, faction, upgraded);
        console.log(unit);

    }, []);

    return (
        <div>
            <h1>TI4 Battle Calculator</h1>
            <div className="calc">
                <FactionDropdown />
                <UnitRow text="Flagship" reinforcements={1} />
                <UnitRow text="War Sun" reinforcements={2} />
                <UnitRow text="Dreadnought" reinforcements={5} />
                <UnitRow text="Carrier" reinforcements={4} />
                <UnitRow text="Cruiser" reinforcements={8} />
                <UnitRow text="Destroyer" reinforcements={8} />
                <UnitRow text="Fighter" reinforcements={10} />
                <UnitRow text="Mech" reinforcements={4} />
                <UnitRow text="Infantry" reinforcements={12} />
                <UnitRow text="PDS" reinforcements={6} />
            </div>
        </div>
    )
}

export default App

/*
Later:

Add options: riskDH, calcCost, detailedResults, etc

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