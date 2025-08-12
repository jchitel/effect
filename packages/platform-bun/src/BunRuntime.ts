import type { RunMain } from "@effect/platform/Runtime";
import * as internal from "./internal/runtime.js";

export const runMain: RunMain = internal.runMain;
