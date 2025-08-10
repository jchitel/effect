import * as PgDrizzle from "@effect/sql-drizzle/Pg";
import { Layer } from "effect";
import { PgContainer } from "./utils-pg.js";

export const DrizzlePgLive = PgDrizzle.layer.pipe(
    Layer.provideMerge(PgContainer.ClientLive),
);
