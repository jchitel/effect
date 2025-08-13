import { Data } from "effect";
import type { Prompt } from "../../Prompt.js";

/** @internal */
export const Action = Data.taggedEnum<Prompt.ActionDefinition>();
