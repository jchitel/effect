/**
 * @since 1.0.0
 */
import type { FileSystem } from "@effect/platform/FileSystem";
import type { Path } from "@effect/platform/Path";
import type { QuitException, Terminal } from "@effect/platform/Terminal";
import type {
    Context,
    Effect,
    HashMap,
    HashSet,
    Layer,
    Option,
    Pipeable,
    Types,
} from "effect";
import type { Args } from "./Args.js";
import type { CliApp } from "./CliApp.js";
import type { CliConfig } from "./CliConfig.js";
import type * as Descriptor from "./CommandDescriptor.js";
import type { HelpDoc } from "./HelpDoc.js";
import * as Internal from "./internal/command.js";
import type { Options } from "./Options.js";
import type { Prompt } from "./Prompt.js";
import type { Usage } from "./Usage.js";
import type { ValidationError } from "./ValidationError.js";

/**
 * @since 1.0.0
 * @category type ids
 */
export const TypeId: unique symbol = Internal.TypeId;

/**
 * @since 1.0.0
 * @category type ids
 */
export type TypeId = typeof TypeId;

/**
 * @since 1.0.0
 * @category models
 */
export interface Command<Name extends string, R, E, A>
    extends Pipeable.Pipeable,
        Effect.Effect<A, never, Command.Context<Name>> {
    readonly [TypeId]: TypeId;
    readonly descriptor: Descriptor.Command<A>;
    readonly handler: (_: A) => Effect.Effect<void, E, R>;
    readonly tag: Context.Tag<Command.Context<Name>, A>;
    readonly transform: Command.Transform<R, E, A>;
}

/**
 * @since 1.0.0
 * @category models
 */
export declare namespace Command {
    /**
     * @since 1.0.0
     * @category models
     */
    export interface Context<Name extends string> {
        readonly _: unique symbol;
        readonly name: Name;
    }

    /**
     * @since 1.0.0
     * @category models
     */
    export interface Config {
        readonly [key: string]:
            | Args<any>
            | Options<any>
            | ReadonlyArray<Args<any> | Options<any> | Config>
            | Config;
    }

    /**
     * @since 1.0.0
     * @category models
     */
    export type ParseConfig<A extends Config> = Types.Simplify<{
        readonly [Key in keyof A]: ParseConfigValue<A[Key]>;
    }>;

    type ParseConfigValue<A> =
        A extends ReadonlyArray<infer _>
            ? { readonly [Key in keyof A]: ParseConfigValue<A[Key]> }
            : A extends Args<infer Value>
              ? Value
              : A extends Options<infer Value>
                ? Value
                : A extends Config
                  ? ParseConfig<A>
                  : never;

    interface ParsedConfigTree {
        [key: string]: ParsedConfigNode;
    }

    type ParsedConfigNode =
        | {
              readonly _tag: "Args";
              readonly index: number;
          }
        | {
              readonly _tag: "Options";
              readonly index: number;
          }
        | {
              readonly _tag: "Array";
              readonly children: ReadonlyArray<ParsedConfigNode>;
          }
        | {
              readonly _tag: "ParsedConfig";
              readonly tree: ParsedConfigTree;
          };

    /**
     * @since 1.0.0
     * @category models
     */
    export interface ParsedConfig {
        readonly args: ReadonlyArray<Args<any>>;
        readonly options: ReadonlyArray<Options<any>>;
        readonly tree: ParsedConfigTree;
    }

    /**
     * @since 1.0.0
     * @category models
     */
    export type Transform<R, E, A> = (
        effect: Effect.Effect<void, any, any>,
        config: A,
    ) => Effect.Effect<void, E, R>;
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromDescriptor: {
    <A extends { readonly name: string }>(
        descriptor: Descriptor.Command<A>,
    ): Command<A["name"], never, never, A>;

    <A extends { readonly name: string }, R, E>(
        descriptor: Descriptor.Command<A>,
        handler: (_: A) => Effect.Effect<void, E, R>,
    ): Command<A["name"], R, E, A>;
} = Internal.fromDescriptor;

/**
 * @since 1.0.0
 * @category accessors
 */
export const getHelp: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
    config: CliConfig,
) => HelpDoc = Internal.getHelp;

/**
 * @since 1.0.0
 * @category accessors
 */
export const getNames: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
) => HashSet.HashSet<string> = Internal.getNames;

/**
 * @since 1.0.0
 * @category accessors
 */
export const getBashCompletions: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
    programName: string,
) => Effect.Effect<Array<string>> = Internal.getBashCompletions;

/**
 * @since 1.0.0
 * @category accessors
 */
export const getFishCompletions: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
    programName: string,
) => Effect.Effect<Array<string>> = Internal.getFishCompletions;

/**
 * @since 1.0.0
 * @category accessors
 */
export const getZshCompletions: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
    programName: string,
) => Effect.Effect<Array<string>> = Internal.getZshCompletions;

/**
 * @since 1.0.0
 * @category accessors
 */
export const getSubcommands: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
) => HashMap.HashMap<string, Descriptor.Command<unknown>> =
    Internal.getSubcommands;

/**
 * @since 1.0.0
 * @category accessors
 */
export const getUsage: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
) => Usage = Internal.getUsage;

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: {
    <Name extends string>(name: Name): Command<Name, never, never, {}>;

    <Name extends string, const Config extends Command.Config>(
        name: Name,
        config: Config,
    ): Command<Name, never, never, Types.Simplify<Command.ParseConfig<Config>>>;

    <Name extends string, const Config extends Command.Config, R, E>(
        name: Name,
        config: Config,
        handler: (
            _: Types.Simplify<Command.ParseConfig<Config>>,
        ) => Effect.Effect<void, E, R>,
    ): Command<Name, R, E, Types.Simplify<Command.ParseConfig<Config>>>;
} = Internal.make;

/**
 * @since 1.0.0
 * @category constructors
 */
export const prompt: <Name extends string, A, R, E>(
    name: Name,
    prompt: Prompt<A>,
    handler: (_: A) => Effect.Effect<void, E, R>,
) => Command<string, R, E, A> = Internal.prompt;

/**
 * @since 1.0.0
 * @category combinators
 */
export const provide: <Name extends string, R, E, A, LR, LE, LA>(
    self: Command<Name, R, E, A>,
    layer: Layer.Layer<LA, LE, LR> | ((_: A) => Layer.Layer<LA, LE, LR>),
) => Command<Name, LR | Exclude<R, LA>, E | LE, A> = Internal.provide;

/**
 * @since 1.0.0
 * @category combinators
 */
export const provideEffect: <Name extends string, R, E, A, I, S, R2, E2>(
    self: Command<Name, R, E, A>,
    tag: Context.Tag<I, S>,
    effect: Effect.Effect<S, E2, R2> | ((_: A) => Effect.Effect<S, E2, R2>),
) => Command<Name, R2 | Exclude<R, I>, E | E2, A> = Internal.provideEffect;

/**
 * @since 1.0.0
 * @category combinators
 */
export const provideEffectDiscard: <Name extends string, R, E, A, R2, E2, _>(
    self: Command<Name, R, E, A>,
    effect: Effect.Effect<_, E2, R2> | ((_: A) => Effect.Effect<_, E2, R2>),
) => Command<Name, R | R2, E | E2, A> = Internal.provideEffectDiscard;

/**
 * @since 1.0.0
 * @category combinators
 */
export const provideSync: <Name extends string, R, E, A, I, S>(
    self: Command<Name, R, E, A>,
    tag: Context.Tag<I, S>,
    service: S | ((_: A) => S),
) => Command<Name, Exclude<R, I>, E, A> = Internal.provideSync;

/**
 * @since 1.0.0
 * @category combinators
 */
export const transformHandler: <Name extends string, R, E, A, R2, E2>(
    self: Command<Name, R, E, A>,
    f: (
        effect: Effect.Effect<void, E, R>,
        config: A,
    ) => Effect.Effect<void, E2, R2>,
) => Command<Name, R | R2, E | E2, A> = Internal.transformHandler;

/**
 * @since 1.0.0
 * @category combinators
 */
export const withDescription: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
    help: string | HelpDoc,
) => Command<Name, R, E, A> = Internal.withDescription;

/**
 * @since 1.0.0
 * @category combinators
 */
export const withHandler: <Name extends string, XR, XE, A, R, E>(
    self: Command<Name, XR, XE, A>,
    handler: (_: A) => Effect.Effect<void, E, R>,
) => Command<Name, R, E, A> = Internal.withHandler;

/**
 * @since 1.0.0
 * @category combinators
 */
export const withSubcommands: <
    Name extends string,
    R,
    E,
    A,
    Subcommand extends readonly [
        Command<any, any, any, any>,
        ...Array<Command<any, any, any, any>>,
    ],
>(
    self: Command<Name, R, E, A>,
    subcommands: Subcommand,
) => Command<
    Name,
    | R
    | Exclude<
          Effect.Effect.Context<ReturnType<Subcommand[number]["handler"]>>,
          Command.Context<Name>
      >,
    E | Effect.Effect.Error<ReturnType<Subcommand[number]["handler"]>>,
    Descriptor.Command.ComputeParsedType<
        A &
            Readonly<{
                subcommand: Option.Option<
                    Descriptor.Command.GetParsedType<
                        Subcommand[number]["descriptor"]
                    >
                >;
            }>
    >
> = Internal.withSubcommands as any;

/**
 * @since 1.0.0
 * @category accessors
 */
export const wizard: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
    prefix: ReadonlyArray<string>,
    config: CliConfig,
) => Effect.Effect<
    Array<string>,
    QuitException | ValidationError,
    FileSystem | Path | Terminal
> = Internal.wizard;

/**
 * @since 1.0.0
 * @category conversions
 */
export const run: <Name extends string, R, E, A>(
    self: Command<Name, R, E, A>,
    config: Omit<CliApp.ConstructorArgs<never>, "command">,
) => (
    args: ReadonlyArray<string>,
) => Effect.Effect<void, E | ValidationError, R | CliApp.Environment> =
    Internal.run;
