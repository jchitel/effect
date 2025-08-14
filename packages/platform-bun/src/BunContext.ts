import type * as FileSystem from "@effect/platform/FileSystem";
import type * as Path from "@effect/platform/Path";
import type * as Terminal from "@effect/platform/Terminal";
import { Layer, pipe } from "effect";
import * as BunFileSystem from "./BunFileSystem.js";
import * as BunPath from "./BunPath.js";
import * as BunTerminal from "./BunTerminal.js";

export type BunContext = FileSystem.FileSystem | Path.Path | Terminal.Terminal;

export const layer: Layer.Layer<BunContext> = pipe(
    Layer.mergeAll(BunPath.layer, BunTerminal.layer),
    Layer.provideMerge(BunFileSystem.layer),
);
