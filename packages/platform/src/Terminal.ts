/**
 * @since 1.0.0
 */
import type { Context, Effect, Mailbox, Option, Scope } from "effect";
import { Data } from "effect";
import type { PlatformError } from "./Error.js";
import * as InternalTerminal from "./internal/terminal.js";

/**
 * A `Terminal` represents a command-line interface which can read input from a
 * user and display messages to a user.
 *
 * @since 1.0.0
 * @category models
 */
export interface Terminal {
    /**
     * The number of columns available on the platform's terminal interface.
     */
    readonly columns: Effect.Effect<number>;
    /**
     * Reads input events from the default standard input.
     */
    readonly readInput: Effect.Effect<
        Mailbox.ReadonlyMailbox<UserInput>,
        never,
        Scope.Scope
    >;
    /**
     * Reads a single line from the default standard input.
     */
    readonly readLine: Effect.Effect<string, QuitException>;
    /**
     * Displays text to the the default standard output.
     */
    readonly display: (text: string) => Effect.Effect<void, PlatformError>;
}

/**
 * @since 1.0.0
 * @category model
 */
export interface Key {
    /**
     * The name of the key being pressed.
     */
    readonly name: string;
    /**
     * If set to `true`, then the user is also holding down the `Ctrl` key.
     */
    readonly ctrl: boolean;
    /**
     * If set to `true`, then the user is also holding down the `Meta` key.
     */
    readonly meta: boolean;
    /**
     * If set to `true`, then the user is also holding down the `Shift` key.
     */
    readonly shift: boolean;
}

/**
 * @since 1.0.0
 * @category model
 */
export interface UserInput {
    /**
     * The character read from the user (if any).
     */
    readonly input: Option.Option<string>;
    /**
     * The key that the user pressed.
     */
    readonly key: Key;
}

/**
 * A `QuitException` represents an exception that occurs when a user attempts to
 * quit out of a `Terminal` prompt for input (usually by entering `ctrl`+`c`).
 *
 * @since 1.0.0
 * @category model
 */
export class QuitException extends Data.TaggedError("QuitException")<{}> {}

/**
 * @since 1.0.0
 * @category tag
 */
export const Terminal: Context.Tag<Terminal, Terminal> = InternalTerminal.tag;
