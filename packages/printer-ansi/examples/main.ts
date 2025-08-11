import * as Ansi from "@effect/printer-ansi/Ansi";
import * as Doc from "@effect/printer-ansi/AnsiDoc";

const doc = Doc.hsep([
    Doc.text("red"),
    Doc.align(
        Doc.vsep([
            Doc.hsep([
                Doc.text("blue+u"),
                Doc.text("bold").pipe((x) => Doc.annotate(x, Ansi.bold)),
                Doc.text("blue+u"),
            ]).pipe((x) =>
                Doc.annotate(x, Ansi.combine(Ansi.blue, Ansi.underlined)),
            ),
            Doc.text("red"),
        ]),
    ),
]).pipe((x) => Doc.annotate(x, Ansi.red));

console.log(Doc.render(doc, { style: "pretty" }));
