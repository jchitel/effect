import { Args, CliConfig, Command, Options } from "@effect/cli";
import {
    NodeContext,
    NodeKeyValueStore,
    NodeRuntime,
} from "@effect/platform-node";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as NavalFateStore from "./naval-fate/store.js";

const { createShip, moveShip, removeMine, setMine, shoot } =
    Effect.serviceFunctions(NavalFateStore.NavalFateStore);

// naval_fate [-h | --help] [--version]
// naval_fate ship new <name>...
// naval_fate ship move [--speed=<kn>] <name> <x> <y>
// naval_fate ship shoot <x> <y>
// naval_fate mine set <x> <y> [--moored]
// naval_fate mine remove <x> <y> [--moored]

const nameArg = Args.text({ name: "name" }).pipe((x) =>
    Args.withDescription(x, "The name of the ship"),
);
const xArg = Args.integer({ name: "x" }).pipe((x) =>
    Args.withDescription(x, "The x coordinate"),
);
const yArg = Args.integer({ name: "y" }).pipe((x) =>
    Args.withDescription(x, "The y coordinate"),
);
const coordinatesArg = { x: xArg, y: yArg };
const nameAndCoordinatesArg = { name: nameArg, ...coordinatesArg };

const mooredOption = Options.boolean("moored").pipe((x) =>
    Options.withDescription(
        x,
        "Whether the mine is moored (anchored) or drifting",
    ),
);
const speedOption = Options.integer("speed").pipe(
    (x) => Options.withDescription(x, "Speed in knots"),
    (x) => Options.withDefault(x, 10),
);

const shipCommand = Command.make("ship", {
    verbose: Options.boolean("verbose"),
}).pipe((x) => Command.withDescription(x, "Controls a ship in Naval Fate"));

const newShipCommand = Command.make(
    "new",
    {
        name: nameArg,
    },
    ({ name }) =>
        Effect.gen(function* () {
            const { verbose } = yield* shipCommand;
            yield* createShip(name);
            yield* Console.log(`Created ship: '${name}'`);
            if (verbose) {
                yield* Console.log(`Verbose mode enabled`);
            }
        }),
).pipe((x) => Command.withDescription(x, "Create a new ship"));

const moveShipCommand = Command.make(
    "move",
    {
        ...nameAndCoordinatesArg,
        speed: speedOption,
    },
    ({ name, speed, x, y }) =>
        Effect.gen(function* () {
            yield* moveShip(name, x, y);
            yield* Console.log(
                `Moving ship '${name}' to coordinates (${x}, ${y}) at ${speed} knots`,
            );
        }),
).pipe((x) => Command.withDescription(x, "Move a ship"));

const shootShipCommand = Command.make(
    "shoot",
    { ...coordinatesArg },
    ({ x, y }) =>
        Effect.gen(function* () {
            yield* shoot(x, y);
            yield* Console.log(`Shot cannons at coordinates (${x}, ${y})`);
        }),
).pipe((x) => Command.withDescription(x, "Shoot from a ship"));

const mineCommand = Command.make("mine").pipe((x) =>
    Command.withDescription(x, "Controls mines in Naval Fate"),
);

const setMineCommand = Command.make(
    "set",
    {
        ...coordinatesArg,
        moored: mooredOption,
    },
    ({ moored, x, y }) =>
        Effect.gen(function* () {
            yield* setMine(x, y);
            yield* Console.log(
                `Set ${moored ? "moored" : "drifting"} mine at coordinates (${x}, ${y})`,
            );
        }),
).pipe((x) => Command.withDescription(x, "Set a mine at specific coordinates"));

const removeMineCommand = Command.make(
    "remove",
    {
        ...coordinatesArg,
    },
    ({ x, y }) =>
        Effect.gen(function* () {
            yield* removeMine(x, y);
            yield* Console.log(
                `Removing mine at coordinates (${x}, ${y}), if present`,
            );
        }),
).pipe((x) =>
    Command.withDescription(x, "Remove a mine at specific coordinates"),
);

const command = Command.make("naval_fate").pipe(
    (x) =>
        Command.withDescription(
            x,
            "An implementation of the Naval Fate CLI application.",
        ),
    (x) =>
        Command.withSubcommands(x, [
            shipCommand.pipe((x) =>
                Command.withSubcommands(x, [
                    newShipCommand,
                    moveShipCommand,
                    shootShipCommand,
                ]),
            ),
            mineCommand.pipe((x) =>
                Command.withSubcommands(x, [setMineCommand, removeMineCommand]),
            ),
        ]),
);

const ConfigLive = CliConfig.layer({
    showBuiltIns: false,
});

const NavalFateLive = NavalFateStore.layer.pipe(
    Layer.provide(NodeKeyValueStore.layerFileSystem("naval-fate-store")),
);

const MainLayer = Layer.mergeAll(ConfigLive, NavalFateLive, NodeContext.layer);

const cli = Command.run(command, {
    name: "Naval Fate",
    version: "1.0.0",
});

Effect.suspend(() => cli(process.argv)).pipe(
    Effect.provide(MainLayer),
    Effect.tapErrorCause(Effect.logError),
    NodeRuntime.runMain,
);
