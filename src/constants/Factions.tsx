import type { UnitID, UnitDefinition } from './Units';

export type FactionID =
    | "arborec" | "argent" | "barony" | "saar" | "keleres"
    | "rebellion" | "deepwrought" | "hacan" | "muaat" | "empyrean"
    | "sol" | "firmament" | "obsidian" | "ghosts" | "bastion" | "L1Z1X"
    | "mahact" | "mentak" | "naalu" | "nra" | "nekro"
    | "nomad" | "rnc" | "sardakk" | "titans" | "jolnar"
    | "cabal" | "winnu" | "xxcha" | "yin" | "yssaril";

interface FactionDefinition {
    factionID: FactionID;
    name: string;
    factionUnits?: Partial<UnitDefinition>[];
};

export const factions: FactionDefinition[] = [

    {
        factionID: "arborec",
        name: "The Arborec",
        factionUnits: [
            {
                unitID: "flagship",
                name: 'Duha Menaimon',
                diceCount: [2],
                capacity: [5],
                specialText: ['After you activate this system, you may produce up to 5 units in this system.'],
            },
            {
                unitID: "mech",
                name: 'Letani Behemoth',
                planetaryShield: [true],
                specialText: ['Production 2. DEPLOY: When you use MITOSIS faction ability you may replace 1 of your infantry with 1 mech from your reinforcements instead'],
            },
            {
                unitID: "infantry",
                name: "Letani Warrior",
                specialText: [
                    'Production 1',
                    'Production 2. After this unit is destroyed, roll 1 die. If the result is 6 or greater, place the unit on this card.At the start of your next turn, place each unit that is on this card on a planet you control in your home system.'
                ],
            },
        ],
    },

    {
        factionID: "argent",
        name: "The Argent Flight",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Quetzecoatl",
                diceCount: [2],
                specialText: ["Other players cannot use Space Cannon against your ships in this system."],
            },
            {
                unitID: "mech",
                name: 'Aerie Sentinel',
                planetaryShield: [true],
                specialText: ['This unit does not count against capacity if it is being transported or if it is in a space area with 1 or more of your ships that has capacity values.'],
            },
            {
                unitID: "destroyer",
                name: "Strike Wing Alpha",
                combatValue: [8, 7],
                capacity: [1],
                specialText: ['When this unit uses ANTI-FIGHTER BARRAGE, each result of 9 or 10 also destroys 1 of your opponent\'s infantry in the space area of the active system'],
            },
        ],
    },

    {
        name: "The Barony of Letnev",
        factionID: "barony",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Arc Secundus",
                combatValue: [5],
                diceCount: [2],
                bombardment: [{ value: 5, diceCount: 3 }],
                specialText: ["Other players' units in this system lose Planetary Shield. At the start of each space combat round, repair this ship."],
            },
            {
                unitID: "mech",
                name: 'Dunlain Reaper',
                planetaryShield: [true],
                specialText: ['This unit does not count against capacity if it is being transported or if it is in a space area with 1 or more of your ships that has capacity values.'],
            },
        ],
    },

    {
        name: "The Clan of Saar",
        factionID: "saar",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Son of Ragh",
                combatValue: [5],
                diceCount: [2],
                antiFighterBarrage: [{ value: 6, diceCount: 4 }],
            },
            {
                unitID: "mech",
                name: 'Dunlain Reaper',
                specialText: ['DEPLOY: After you gain control of a planet, you may spend 1 trade good to place 1 mech on that planet.'],
            },
        ],
    },

    {
        name: "The Council Keleres",
        factionID: "keleres",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Artemiris",
                diceCount: [2],
                capacity: [6],
                specialText: ["Other players must spend 2 influence to activate the system that contains this ship."],
            },
            {
                unitID: "mech",
                name: 'Omniopiares',
                specialText: ['Other players must spend 1 influence to commit ground forces to the planet that contains this unit.'],
            },
        ],
    },

    {
        name: "The Crimson Rebellion",
        factionID: "rebellion",
        // Thunder's Edge expansion
        factionUnits: [
            {
                unitID: "flagship",
                name: "Quietus",
                combatValue: [5],
                diceCount: [2],
                specialText: ["While this unit is in a system that contains an active breach, other players' units in systems with active breaches lose all their unit abilities."]
            },
            {
                unitID: "mech",
                name: 'Revenant',
                specialText: ['DEPLOY: During the "Commit Ground Forces" step of your tactical action in a system that contains an active breach, you may commit 1 mech, even if you have no units in the system.'],
            },
            {
                unitID: "destroyer",
                name: 'Exile',
                combatValue: [8, 7],
                specialText: ["At the end of any player's combat in this unit's system or an adjacent system, you may place 1 inactive breach in that system."],
            },
        ],
    },

    {
        name: "The Deepwrought Scholarate",
        factionID: "deepwrought",
        // Thunder's Edge expansion
        factionUnits: [
            {
                unitID: "flagship",
                name: "D.W.S Luminous",
                diceCount: [2],
                capacity: [6],
                specialText: ["This ship can move through systems that contain your units, even if other players' units are present; if it would, apply +1 to its move value for each of those systems."]
            },
            {
                unitID: "mech",
                name: 'Eanautic',
                specialText: ['Production 1. When another player activates this system, if this unit is coexisting, you may move it and any of your infantry on its planet to a planet you control in your home system.'],
            },
        ],
    },

    {
        name: "The Emirates of Hacan",
        factionID: "hacan",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Wrath of Kenara",
                diceCount: [2],
                specialText: ["After you roll a die during space combat in this system, you may spend 1 trade good to apply +1 to the result."]
            },
            {
                unitID: "mech",
                name: 'Pride of Kenara',
                specialText: ["This planet's card may be traded as part of a transaction; if you do, move all of your units from this planet to another planet you control."],
            },
        ],
    },

    {
        name: "The Embers of Muaat",
        factionID: "muaat",
        factionUnits: [
            {
                unitID: "flagship",
                name: "The Inferno",
                combatValue: [5],
                diceCount: [2],
                specialText: ["ACTION: Spend 1 token from your strategy pool to place 1 cruiser in this unit's system."]
            },
            {
                unitID: "mech",
                name: 'Ember Colossus',
                specialText: ["When you use your STAR FORGE faction ability in this system or an adjacent system, you may place 1 infantry from your reinforcements with this unit."],
            },
            {
                unitID: 'warsun',
                name: 'Prototype War Sun',
                cost: [12, 10],
                combatValue: [3],
                diceCount: [3],
                moveSpeed: [2],
                capacity: [6],
                sustainDamage: [true],
                bombardment: [
                    { value: 3, diceCount: 3 },
                ],
                bypassPlanetaryShield: [true],
                specialText: [
                    "Other players' units in this system lose their Planetary Shield ability."
                ],
            },
        ],
    },

    {
        name: "The Empyrean",
        factionID: "empyrean",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Dynamo",
                combatValue: [5],
                diceCount: [2],
                specialText: ["After any player's unit in this system or an adjacent system uses Sustain Damage, you may spend 2 influence to repair that unit."]
            },
            {
                unitID: "mech",
                name: 'Watcher',
                specialText: ["You may remove this unit from a system that contains or is adjacent to another player's units to cancel an action card played by that player."],
            },
        ],
    },

    {
        name: "The Federation of Sol",
        factionID: "sol",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Genesis",
                combatValue: [5],
                diceCount: [2],
                capacity: [12],
                specialText: ["At the end of the status phase, place 1 infantry from your reinforcements in this system's space area."]
            },
            {
                unitID: "mech",
                name: 'ZS Thunderbolt M2',
                specialText: ["DEPLOY: After you use your ORBITAL DROP faction ability you may spend 3 resources to place 1 mech on that planet."],
            },
            {
                unitID: "carrier",
                name: 'Advanced Carrier',
                capacity: [6, 8],
                sustainDamage: [false, true],
            },
            {
                unitID: "infantry",
                name: "Spec Ops",
                combatValue: [7, 6],
            },
        ],
    },

    {
        name: "The Firmament",
        factionID: "firmament",
        // Thunder's Edge expansion. Graduates into "The Obsidian" (factionID: "obsidian") during play
        factionUnits: [
            {
                unitID: "flagship",
                name: "Heaven's Eye",
                combatValue: [5],
                diceCount: [2],
                specialText: ["If the active system contains units that belong to a player who has a control token on one of your plots, apply +1 to this ship's move value and repair it at the end of every combat round."]
            },
            {
                unitID: "mech",
                name: 'Viper EX-23',
                specialText: ["When ground forces are committed to this planet, you may choose for your units to coexist, if they were not already. Flip this card if your faction becomes the Obsidian."],
            },
        ],
    },

    {
        name: "The Obsidian",
        factionID: "obsidian",
        // Thunder's Edge expansion. See note on "firmament" above.
        factionUnits: [
            {
                unitID: "flagship",
                name: "Heaven's Hollow",
                combatValue: [5],
                diceCount: [3],
            },
            {
                unitID: "mech",
                name: 'Viper Hollow',
                specialText: ["If this unit was coexisting when this card flipped to this side, gain control of its planet; the other player's units are now coexisting."],
            },
        ],
    },

    {
        name: "The Ghosts of Creuss",
        factionID: "ghosts",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Hil Colish",
                combatValue: [5],
                specialText: ["This ship's system contains a delta wormhole. During movement, this ship may move before or after your other ships."]
            },
            {
                unitID: "mech",
                name: 'Icarus Drive',
                specialText: ["After any player activates a system, you may remove this unit from the game board to place or move a Creuss wormhole token into this system."],
            },
        ],
    },

    {
        name: "Last Bastion",
        factionID: "bastion",
        // Thunder's Edge expansion
        factionUnits: [
            {
                unitID: "flagship",
                name: "The Egeiro",
                combatValue: [9],
                specialText: ["Apply +1 to the results of each of this unit's combat rolls for each non-home system that contains a planet you control. Production 1."]
            },
            {
                unitID: "mech",
                name: 'A3 Valiance',
                specialText: ["When this unit is destroyed, if it was galvanized, galvanize up to 3 of your infantry in its system."],
            },
        ],
    },

    {
        name: "The L1Z1X Mindnet",
        factionID: "L1Z1X",
        factionUnits: [
            {
                unitID: "flagship",
                name: "[0.0.1]",
                combatValue: [5],
                diceCount: [2],
                capacity: [5],
                specialText: ["During a space combat, hits produced by this ship and by your dreadnoughts in this system must be assigned to non-fighter ships if able."]
            },
            {
                unitID: "mech",
                name: 'Annihilator',
                bombardment: [{ value: 8, diceCount: 1 }],
                specialText: ["While not participating in ground combat, this unit can use its BOMBARDMENT ability on planets in its system as if it were a ship."],
            },
            {
                unitID: "dreadnought",
                name: 'Super-Dreadnought',
                combatValue: [5, 4],
                capacity: [2],
                bombardment: [
                    { value: 5, diceCount: 1 },
                    { value: 4, diceCount: 1 },
                ],
            },
        ],
    },

    {
        name: "The Mahact Gene-Sorcerers",
        factionID: "mahact",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Arvicon Rex",
                combatValue: [5],
                diceCount: [2],
                specialText: ["During combat against an opponent whose command token is not in your fleet pool, apply +2 to the results of this unit's combat rolls."]
            },
            {
                unitID: "mech",
                name: 'Starlancer',
                specialText: ["After a player whose command token is in your fleet pool activates this system, you may spend their token from your fleet pool to end their turn; they gain that token."],
            },
            {
                unitID: "infantry",
                name: "Crimson Legionnaire",
                specialText: [
                    "After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good.",
                    "After this unit is destroyed, gain 1 commodity or convert 1 of your commodities to a trade good. Then, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system."
                ],
            },
        ],
    },

    {
        name: "The Mentak Coalition",
        factionID: "mentak",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Fourth Moon",
                diceCount: [2],
                specialText: ["Other players' ships in this system cannot use Sustain Damage."]
            },
            {
                unitID: "mech",
                name: 'Moll Terminus',
                specialText: ["Other players' ground forces on this planet cannot use SUSTAIN DAMAGE."],
            },
            {
                unitID: "cruiser",
                name: 'Corsair',
                specialText: ["If the active system contains another player's non-fighter ships, this unit can move through systems that contain other players' ships."],
            },
        ],
    },

    {
        name: "The Naalu Collective",
        factionID: "naalu",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Matriarch",
                combatValue: [9],
                diceCount: [2],
                capacity: [6],
                specialText: ["During an invasion in this system, you may commit fighters to planets as if they were ground forces. When combat ends, return those units to the space area."]
            },
            {
                unitID: "mech",
                name: 'Iconoclast',
                specialText: ["During combat against an opponent who has at least 1 relic fragment, apply +2 to the results of this unit's combat rolls."],
            },
            {
                unitID: "fighter",
                name: 'Hybrid Crystal Fighter',
                combatValue: [8, 7],
                specialText: ["This unit may move without being transported.  Each fighter in excess of your ships' capacity counts as 1/2 of a ship against your fleet pool."],
            },
        ],
    },

    {
        name: "The Naaz-Rokha Alliance",
        factionID: "nra",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Visz el Vir",
                combatValue: [9],
                diceCount: [2],
                capacity: [4],
                specialText: ["Your mechs in this system roll 1 additional die during combat."]
            },
            {
                unitID: "mech",
                name: 'Eidolon',
                diceCount: [2],
                specialText: ["Can fight in space battles, but combat value/dice drops to 8(x2)."],
            },
        ],
    },

    {
        name: "The Nekro Virus",
        factionID: "nekro",
        factionUnits: [
            {
                unitID: "flagship",
                name: "The Alastor",
                combatValue: [9],
                diceCount: [2],
                specialText: ["At the start of a space combat, choose any number of your ground forces in this system to participate in that combat as if they were ships."]
            },
            {
                unitID: "mech",
                name: 'Mordred',
                specialText: ["During combat against an opponent who has an \"X\" or \"Y\" token on 1 or more of their technologies, apply +2 to the result of each of this unit's combat rolls."],
            },
        ],
    },

    {
        name: "The Nomad",
        factionID: "nomad",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Memoria",
                combatValue: [7, 5],
                diceCount: [2],
                moveSpeed: [1, 2],
                capacity: [3, 6],
                antiFighterBarrage: [{ value: 8, diceCount: 3 }, { value: 5, diceCount: 3 }],
                specialText: ["You may treat this unit as if it were adjacent to systems that contain one or more of your mechs."]
            },
            {
                unitID: "mech",
                name: 'Quantum Manipulator',
                specialText: ["While this unit is in a space area during combat, you may use its SUSTAIN DAMAGE ability to cancel a hit that is produced against your ships in this system."],
            },
        ],
    },

    {
        name: "The Ral Nel Consortium",
        factionID: "rnc",
        // Thunder's Edge expansion
        factionUnits: [
            {
                unitID: "flagship",
                name: "Last Dispatch",
                combatValue: [8],
                diceCount: [2],
                moveSpeed: [2],
                capacity: [4],
                sustainDamage: [true],
                specialText: ["When this unit retreats, you may destroy 1 ship in the active system that does not have Sustain Damage."]
            },
            {
                unitID: "mech",
                name: 'Alarum',
                specialText: ["At the end of a round of combat on this planet, you may move up to 2 of your ground forces to this planet from planets in adjacent systems."],
            },
            {
                unitID: "destroyer",
                name: 'Linkship',
                moveSpeed: [3, 4],
                specialText: ["This unit can use the SPACE CANNON ability of one of your structures in its space area; each structure can only be triggered once."],
            },
        ],
    },

    {
        name: "Sardakk N'orr",
        factionID: "sardakk",
        factionUnits: [
            {
                unitID: "flagship",
                name: "C'Morran N'orr",
                combatValue: [6],
                diceCount: [2],
                specialText: ["Apply +1 to the result of each of your other ships' combat rolls in this system."]
            },
            {
                unitID: "mech",
                name: 'Valkyrie Exoskeleton',
                specialText: ["After this unit uses its SUSTAIN DAMAGE ability during Ground Combat, it produces 1 hit against your opponent's ground forces on this planet."],
            },
            {
                unitID: "dreadnought",
                name: 'Exotrireme',
                bombardment: [
                    { value: 4, diceCount: 2 },
                ],
                specialText: ["This unit cannot be destroyed by \"Direct Hit\" action cards. After a round of space combat, you may destroy this unit to destroy up to 2 ships in this system."]
            },
        ],
    },

    {
        name: "The Titans of Ul",
        factionID: "titans",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Ouranos",
                diceCount: [2],
                specialText: ["DEPLOY: After you activate a system that contains 1 or more of your PDS, you may replace 1 of those PDS with this unit."]
            },
            {
                unitID: "mech",
                name: 'Hecatoncheires',
                specialText: ["DEPLOY: When you would place a PDS on a planet, you may place 1 mech and 1 infantry on that planet instead."],
            },
            {
                unitID: "cruiser",
                name: "Saturn Engine",
                capacity: [1, 2],
                sustainDamage: [false, true],
            },
            {
                unitID: "pds",
                name: "Hel‑Titan",
                combatValue: [7, 6],
                sustainDamage: [true],
                specialText: [
                    "Production 1. This unit is treated as both a structure and a ground force. It cannot be transported.",
                    "Production 1. This unit is treated as both a structure and a ground force. It cannot be transported. You may use this unit's SPACE CANNON against ships that are adjacent to this unit's system."
                ],
            },
        ],
    },

    {
        name: "The Universities of Jol-Nar",
        factionID: "jolnar",
        factionUnits: [
            {
                unitID: "flagship",
                name: "J.N.S. Hylarim",
                combatValue: [6],
                diceCount: [2],
                specialText: ["When making a combat roll for this ship, each result of a 9 or 10, before applying modifiers, produces 2 additional hits."]
            },
            {
                unitID: "mech",
                name: 'Shield Paling',
                specialText: ["Your infantry on this planet are not affected by your FRAGILE faction ability."],
            },
        ],
    },

    {
        name: "The Vuil'Raith Cabal",
        factionID: "cabal",
        factionUnits: [
            {
                unitID: "flagship",
                name: "The Terror Between",
                combatValue: [5],
                diceCount: [2],
                bombardment: [{ value: 5, diceCount: 1 }],
                specialText: ["Capture all other non-structure units that are destroyed in this unit's system, including your own."]
            },
            {
                unitID: "mech",
                name: 'Reanimator',
                specialText: ["When your infantry on this planet are destroyed, place them on your faction sheet; those units are captured."],
            },
        ],
    },

    {
        name: "The Winnu",
        factionID: "winnu",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Salai Sai Corian",
                // diceCount: {count on non-fighter enemy ships in-system}
                specialText: ["When this unit makes a combat roll, it rolls a number of dice equal to the number of your opponent's non-fighter ships in this system."]
            },
            {
                unitID: "mech",
                name: 'Reclaimer',
                specialText: ["After you resolve a tactical action where you gained control of this planet, you may place 1 PDS or 1 Space Dock from your reinforcements on this planet."],
            },
        ],
    },

    {
        name: "The Xxcha Kingdom",
        factionID: "xxcha",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Loncarra Ssodu",
                diceCount: [2],
                spaceCannon: [{ value: 5, diceCount: 3 }],
                specialText: ["You may use this unit's Space Cannon against ships in adjacent systems."]
            },
            {
                unitID: "mech",
                name: 'Indomitus',
                spaceCannon: [{ value: 8, diceCount: 3 }],
                specialText: ["You may use this unit's SPACE CANNON against ships that are in adjacent systems."],
            },
        ],
    },

    {
        name: "The Yin Brotherhood",
        factionID: "yin",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Van Hauge",
                combatValue: [9],
                diceCount: [2],
                specialText: ["When this ship is destroyed, destroy all ships in this system."]
            },
            {
                unitID: "mech",
                name: "Moyin's ashes",
                specialText: ["DEPLOY: When you use your INDOCTRINATION faction ability, you may spend 1 additional influence to replace your opponent's unit with 1 mech instead of 1 infantry."],
            },
        ],
    },

    {
        name: "The Yssaril Tribes",
        factionID: "yssaril",
        factionUnits: [
            {
                unitID: "flagship",
                name: "Y'sia Y'ssrila",
                combatValue: [5],
                diceCount: [2],
                moveSpeed: [2],
                specialText: ["This ship can move through systems that contain other players' ships."]
            },
            {
                unitID: "mech",
                name: 'Blackshade Infiltrator',
                specialText: ["DEPLOY: After you use your STALL TACTICS faction ability, you may place 1 mech on a planet you control."],
            },
        ],
    },
];

export default factions;