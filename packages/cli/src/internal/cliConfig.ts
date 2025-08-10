import * as Context from "effect/Context";
import * as Layer from "effect/Layer";
import type * as CliConfig from "../CliConfig.js";

/** @internal */
export const make = (
    params?: Partial<CliConfig.CliConfig>,
): CliConfig.CliConfig => ({
    ...defaultConfig,
    ...params,
});

/** @internal */
export const Tag = Context.GenericTag<CliConfig.CliConfig>(
    "@effect/cli/CliConfig",
);

/** @internal */
export const defaultConfig: CliConfig.CliConfig = {
    isCaseSensitive: false,
    autoCorrectLimit: 2,
    finalCheckBuiltIn: false,
    showAllNames: true,
    showBuiltIns: true,
    showTypes: true,
};

/** @internal */
export const defaultLayer: Layer.Layer<CliConfig.CliConfig> = Layer.succeed(
    Tag,
    defaultConfig,
);

/** @internal */
export const layer = (
    config?: Partial<CliConfig.CliConfig>,
): Layer.Layer<CliConfig.CliConfig> => Layer.succeed(Tag, make(config));

/** @internal */
export const normalizeCase = (
    self: CliConfig.CliConfig,
    text: string,
): string => (self.isCaseSensitive ? text : text.toLowerCase());
