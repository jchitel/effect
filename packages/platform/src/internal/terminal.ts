import { Context } from "effect";
import type * as Terminal from "../Terminal.js";

/** @internal */
export const tag = Context.GenericTag<Terminal.Terminal>(
    "@effect/platform/Terminal",
);
