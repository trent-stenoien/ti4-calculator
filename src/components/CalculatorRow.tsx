

type Props {
    text: string

}

function CalculatorRow() {
    return (
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
    )
}

export default CalculatorRow;