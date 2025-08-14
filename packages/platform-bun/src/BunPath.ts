import type { Path } from "@effect/platform/Path";
import type { Layer } from "effect";
import * as internal from "./internal/path.js";

export const layer: Layer.Layer<Path> = internal.layer;

export const layerPosix: Layer.Layer<Path> = internal.layerPosix;

export const layerWin32: Layer.Layer<Path> = internal.layerWin32;
