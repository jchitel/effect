import type * as PlatformError from "@effect/platform/Error";
import * as KeyValueStore from "@effect/platform/KeyValueStore";
import * as Layer from "effect/Layer";
import * as FileSystem from "./BunFileSystem.js";
import * as Path from "./BunPath.js";

export const layerFileSystem: (
    directory: string,
) => Layer.Layer<KeyValueStore.KeyValueStore, PlatformError.PlatformError> = (
    directory: string,
) =>
    Layer.provide(
        KeyValueStore.layerFileSystem(directory),
        Layer.merge(FileSystem.layer, Path.layer),
    );
