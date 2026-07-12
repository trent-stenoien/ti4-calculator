import { useState } from 'react';

type Props = {
    text: string,
    reinforcements?: number
}

const CalculatorRow = ({ text, reinforcements = 1000 }: Props) => {

    const [attackerCount, setAttackerCount] = useState(0);
    const [defenderCount, setDefenderCount] = useState(0);

    // <button onClick={setAttackerCount(Number(e.target.value))}>-</button>
    // <button onClick={incrementAttacker}>+</button>
    // <button onClick={decrementDefender}>-</button>
    // <button onClick={incrementDefender}>+</button>
    // const decrementAttacker = (e) => setAttackerCount((value) => Math.max(value - 1, 0);
    // const incrementAttacker = (e) => setAttackerCount((value) => Math.min(value + 1, reinforcements));
    // const decrementDefender = () => setAttackerCount((value) => Math.max(value - 1, 0));
    // const incrementDefender = () => setAttackerCount((value) => Math.min(value + 1, reinforcements));

    return (
        <div className="row">
            <div className="column left">
                <div className="upgrade"><input type="checkbox" title="upgrade" /></div>
                <input
                    key={text.toLowerCase().replaceAll(' ', '') + 'Attacker'}
                    type="number"
                    value={attackerCount}
                    onChange={(e) => setAttackerCount(Number(e.target.value))}
                />
            </div>

            <div className="column center">{text}</div>

            <div className="column right">
                <div className="upgrade"><input type="checkbox" title="upgrade" /></div>
                <input
                    key={text + 'Defender'}
                    type="number"
                    value={defenderCount}
                    onChange={(e) => setDefenderCount(Number(e.target.value))}
                />
            </div>
        </div>
    );
}

export default CalculatorRow;