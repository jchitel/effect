import * as Args from "@effect/cli/Args";
import * as Descriptor from "@effect/cli/CommandDescriptor";
import * as Options from "@effect/cli/Options";

const afterFlag = Options.integer("after").pipe((x) =>
    Options.withAlias(x, "A"),
);
const beforeFlag = Options.integer("before").pipe((x) =>
    Options.withAlias(x, "B"),
);
export const options: Options.Options<[number, number]> = Options.all([
    afterFlag,
    beforeFlag,
]);

export const args: Args.Args<string> = Args.text();

export const command: Descriptor.Command<{
    readonly name: "grep";
    readonly options: [number, number];
    readonly args: string;
}> = Descriptor.make("grep", options, args);
