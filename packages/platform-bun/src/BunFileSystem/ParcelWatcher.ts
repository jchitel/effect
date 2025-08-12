import type { WatchBackend } from "@effect/platform/FileSystem";
import type { Layer } from "effect/Layer";
import * as internal from "../internal/fileSystem/parcelWatcher.js";

/**
 * You can provide this Layer to use `@parcel/watcher` as the backend for watching files.
 */
export const layer: Layer<WatchBackend> = internal.layer;
