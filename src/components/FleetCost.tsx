import getUnitStats from '../constants/Units';
import type { Player } from '../utils/Player';
import typedEntries from '../utils/TypedEntries';

const calculateFleetCost = (player: Player): number =>
    typedEntries(player.config.units)
        .filter(([_, unit]) => unit.count > 0)
        .reduce((total, [unitID, unit]) => {
            const { cost } = getUnitStats({ unitID, factionID: player.config.factionID, upgraded: unit.upgraded });
            return total + cost * unit.count;
        }, 0);

type FleetCostProps = {
    attacker: Player,
    defender: Player
};

const FleetCost = ({ attacker, defender }: FleetCostProps) => (
    <div className="row fleet-cost">
        <div className="column left">{calculateFleetCost(attacker)}</div>
        <div className="column center">Fleet Cost</div>
        <div className="column right">{calculateFleetCost(defender)}</div>
    </div>
);

export default FleetCost;
