import type * as FiberRefs from "./FiberRefs.js";
import { globalValue } from "./GlobalValue.js";
import { hasProperty, isFunction } from "./Predicate.js";

/**
 * @category symbols
 */
export const NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom");

/**
 * @category symbols
 */
export type NodeInspectSymbol = typeof NodeInspectSymbol;

/**
 * @category models
 */
export interface Inspectable {
    toString(): string;
    toJSON(): unknown;
    [NodeInspectSymbol](): unknown;
}

export const toJSON = (x: unknown): unknown => {
    try {
        if (
            hasProperty(x, "toJSON") &&
            isFunction(x["toJSON"]) &&
            x["toJSON"].length === 0
        ) {
            return x.toJSON();
        } else if (Array.isArray(x)) {
            return x.map(toJSON);
        }
    } catch {
        return {};
    }
    return redact(x);
};

export const format = (x: unknown): string => JSON.stringify(x, null, 2);

export const BaseProto: Inspectable = {
    toJSON() {
        return toJSON(this);
    },
    [NodeInspectSymbol]() {
        return this.toJSON();
    },
    toString() {
        return format(this.toJSON());
    },
};

export abstract class Class {
    abstract toJSON(): unknown;
    [NodeInspectSymbol]() {
        return this.toJSON();
    }
    toString() {
        return format(this.toJSON());
    }
}

export const toStringUnknown = (
    u: unknown,
    whitespace: number | string | undefined = 2,
): string => {
    if (typeof u === "string") {
        return u;
    }
    try {
        return typeof u === "object"
            ? stringifyCircular(u, whitespace)
            : String(u);
    } catch {
        return String(u);
    }
};

export const stringifyCircular = (
    obj: unknown,
    whitespace?: number | string | undefined,
): string => {
    let cache: Array<unknown> = [];
    const retVal = JSON.stringify(
        obj,
        (_key, value) =>
            typeof value === "object" && value !== null
                ? cache.includes(value)
                    ? undefined // circular reference
                    : cache.push(value) &&
                      (redactableState.fiberRefs !== undefined &&
                      isRedactable(value)
                          ? value[symbolRedactable](redactableState.fiberRefs)
                          : value)
                : value,
        whitespace,
    );
    (cache as any) = undefined;
    return retVal;
};

/**
 * @category redactable
 */
export interface Redactable {
    readonly [symbolRedactable]: (fiberRefs: FiberRefs.FiberRefs) => unknown;
}

/**
 * @category redactable
 */
export const symbolRedactable: unique symbol = Symbol.for(
    "effect/Inspectable/Redactable",
);

/**
 * @category redactable
 */
export const isRedactable = (u: unknown): u is Redactable =>
    typeof u === "object" && u !== null && symbolRedactable in u;

const redactableState = globalValue(
    "effect/Inspectable/redactableState",
    () => ({
        fiberRefs: undefined as FiberRefs.FiberRefs | undefined,
    }),
);

/**
 * @category redactable
 */
export const withRedactableContext = <A>(
    context: FiberRefs.FiberRefs,
    f: () => A,
): A => {
    const prev = redactableState.fiberRefs;
    redactableState.fiberRefs = context;
    try {
        return f();
    } finally {
        redactableState.fiberRefs = prev;
    }
};

/**
 * @category redactable
 */
export const redact = (u: unknown): unknown => {
    if (isRedactable(u) && redactableState.fiberRefs !== undefined) {
        return u[symbolRedactable](redactableState.fiberRefs);
    }
    return u;
};
