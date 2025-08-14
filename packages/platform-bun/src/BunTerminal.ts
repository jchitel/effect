/**
 * @since 1.0.0
 */
import type { Terminal, UserInput } from "@effect/platform/Terminal";
import type { Effect, Layer, Scope } from "effect";
import * as InternalTerminal from "./internal/terminal.js";
/**
 * @since 1.0.0
 * @category constructors
 */
export const make: (
    shouldQuit?: (input: UserInput) => boolean,
) => Effect.Effect<Terminal, never, Scope.Scope> = InternalTerminal.make;

/**
 * @since 1.0.0
 * @category layer
 */
export const layer: Layer.Layer<Terminal> = InternalTerminal.layer;
