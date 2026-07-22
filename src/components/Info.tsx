import { useState } from 'react';

type SectionProps = {
    title: string;
    items: string[];
    defaultOpen?: boolean;
};

const Section = ({ title, items, defaultOpen = false }: SectionProps) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className={`info-section${open ? ' open' : ''}`}>
            <h3>
                <button
                    type="button"
                    className="info-section-toggle"
                    onClick={() => setOpen(prev => !prev)}
                    aria-expanded={open}
                >
                    {title} {open ? '▾' : '▸'}
                </button>
            </h3>
            {open && (
                <ul>
                    {items.map(item => <li key={item}>{item}</li>)}
                </ul>
            )}
        </div>
    );
};

const Info = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`info${expanded ? ' expanded' : ''}`}>
            <button
                type="button"
                className="info-toggle"
                onClick={() => setExpanded(prev => !prev)}
                aria-expanded={expanded}
            >
                Info {expanded ? '▲' : '▼'}
            </button>
            {expanded && (
                <div className="info-content">
                    <p>
                        This React app runs Twilight Imperium 4th Edition combats between two fleets/armies to
                        estimate approximate win/draw percentages. This Monte Carlo simulator updates results 1k similated
                        battles at a time until a total of 50k similations have been run.
                    </p>
                    <p>
                        Found a bug or have a suggestion? <a href="mailto:trent.stenoien@gmail.com?subject=TI4%20Calculator%20Suggestion">Let me know</a>.
                    </p>
                    <Section
                        title="Implemented"
                        items={[
                            'Regular combat',
                            'Special abilities: AFB, bombardment, space cannon, planetary shield',
                            'Ground vs Space combat',
                            'Upgrades and Faction Units',
                        ]}
                    />
                    <Section
                        title="Known issues with deployed features"
                        items={['(None so far as I know.)']}
                    />
                    <Section
                        title="Need to Implement"
                        items={[
                            'Most Flagship and Mech special texts.',
                            'Avoid Direct Hit options',
                            'Action Cards',
                            'Tech options: Plasma Scoring, Duranium Armor, etc.',
                            'Faction options: Non-Euclidean Shielding, Gravleash Maneuvers, etc.',
                            'Promissary notes',
                            'Agents & Commanders',
                            'Relics',
                            'Agendas',
                        ]}
                    />
                </div>
            )}
        </div>
    );
};

export default Info;
