import type { Path } from "@effect/platform/Path";
import type { Layer } from "effect/Layer";
import * as internal from "./internal/path.js";

export const layer: Layer<Path> = internal.layer;

export const layerPosix: Layer<Path> = internal.layerPosix;

export const layerWin32: Layer<Path> = internal.layerWin32;
