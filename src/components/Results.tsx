import type { BattleSimulationResults } from "../utils/BattleSim";

interface ResultsProps {
    results: BattleSimulationResults
};

const Results = ({ results }: ResultsProps) => {

    // Ensure results sum up to 100 (+/- 1).
    // 0 is also allowed as inital/empty state.
    if ( ![0, 99, 100, 101].includes( results.reduce((a,b) => a+b) ) ) {
        throw new Error("Win percentages must add up to 100.");
    }

    const segments = [
        { key: "attacker", label: "Attacker", shortLabel: "Att", pct: results[0] },
        { key: "draw", label: "Draw", shortLabel: "D", pct: results[1] },
        { key: "defender", label: "Defender", shortLabel: "Def", pct: results[2] },
    ].filter(s => s.pct > 0);

    // Fallback so the bar never renders empty. Draw = 100%
    const toRender = segments.length > 0
        ? segments
        : [{ key: "draw", label: "Draw", pct: 100 }];

    return (
        <div className="results">
            {toRender.map(({ key, label, pct }) => (
                <div key={key} className={`results-segment ${key}`} style={{ flexBasis: `${pct}%` }}>
                    <span className="results-label">{label}</span>
                    <span className="results-pct">{Math.round(pct)}%</span>
                </div>
            ))}
        </div>
    );
};

export default Results;