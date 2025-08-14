import type * as Chunk from "./Chunk.js";
import type * as HashSet from "./HashSet.js";
import * as internal from "./internal/stm/tSet.js";
import type * as Option from "./Option.js";
import type { Predicate } from "./Predicate.js";
import type * as STM from "./STM.js";
import type * as TMap from "./TMap.js";

export const TSetTypeId: unique symbol = internal.TSetTypeId;

export type TSetTypeId = typeof TSetTypeId;

/**
 * Transactional set implemented on top of `TMap`.
 *
 * @category models
 */
export interface TSet<in out A> {
    /** @internal */
    readonly tMap: TMap.TMap<A, void>;
}

/**
 * Removes a single element from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const remove: {
    <A>(value: A): (self: TSet<A>) => STM.STM<void>;
    <A>(self: TSet<A>, value: A): STM.STM<void>;
} = internal.remove;

/**
 * Removes elements from the set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const removeAll: {
    <A>(iterable: Iterable<A>): (self: TSet<A>) => STM.STM<void>;
    <A>(self: TSet<A>, iterable: Iterable<A>): STM.STM<void>;
} = internal.removeAll;

/**
 * Removes entries from a `TSet` that satisfy the specified predicate and returns the removed entries
 * (or `void` if `discard = true`).
 *
 * @since 2.0.0
 * @category mutations
 */
export const removeIf: {
    <A>(
        predicate: Predicate<A>,
        options: {
            readonly discard: true;
        },
    ): (self: TSet<A>) => STM.STM<void>;
    <A>(
        predicate: Predicate<A>,
        options?: {
            readonly discard: false;
        },
    ): (self: TSet<A>) => STM.STM<Array<A>>;
    <A>(
        self: TSet<A>,
        predicate: Predicate<A>,
        options: {
            readonly discard: true;
        },
    ): STM.STM<void>;
    <A>(
        self: TSet<A>,
        predicate: Predicate<A>,
        options?: {
            readonly discard: false;
        },
    ): STM.STM<Array<A>>;
} = internal.removeIf;

/**
 * Retains entries in a `TSet` that satisfy the specified predicate and returns the removed entries
 * (or `void` if `discard = true`).
 *
 * @since 2.0.0
 * @category mutations
 */
export const retainIf: {
    <A>(
        predicate: Predicate<A>,
        options: {
            readonly discard: true;
        },
    ): (self: TSet<A>) => STM.STM<void>;
    <A>(
        predicate: Predicate<A>,
        options?: {
            readonly discard: false;
        },
    ): (self: TSet<A>) => STM.STM<Array<A>>;
    <A>(
        self: TSet<A>,
        predicate: Predicate<A>,
        options: {
            readonly discard: true;
        },
    ): STM.STM<void>;
    <A>(
        self: TSet<A>,
        predicate: Predicate<A>,
        options?: {
            readonly discard: false;
        },
    ): STM.STM<Array<A>>;
} = internal.retainIf;

/**
 * Returns the set's cardinality.
 *
 * @since 2.0.0
 * @category getters
 */
export const size: <A>(self: TSet<A>) => STM.STM<number> = internal.size;

/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeFirst: {
    <A, B>(pf: (a: A) => Option.Option<B>): (self: TSet<A>) => STM.STM<B>;
    <A, B>(self: TSet<A>, pf: (a: A) => Option.Option<B>): STM.STM<B>;
} = internal.takeFirst;

/**
 * Takes the first matching value, or retries until there is one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeFirstSTM: {
    <A, B, E, R>(
        pf: (a: A) => STM.STM<B, Option.Option<E>, R>,
    ): (self: TSet<A>) => STM.STM<B, E, R>;
    <A, B, E, R>(
        self: TSet<A>,
        pf: (a: A) => STM.STM<B, Option.Option<E>, R>,
    ): STM.STM<B, E, R>;
} = internal.takeFirstSTM;

/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeSome: {
    <A, B>(
        pf: (a: A) => Option.Option<B>,
    ): (self: TSet<A>) => STM.STM<[B, ...Array<B>]>;
    <A, B>(
        self: TSet<A>,
        pf: (a: A) => Option.Option<B>,
    ): STM.STM<[B, ...Array<B>]>;
} = internal.takeSome;

/**
 * Takes all matching values, or retries until there is at least one.
 *
 * @since 2.0.0
 * @category mutations
 */
export const takeSomeSTM: {
    <A, B, E, R>(
        pf: (a: A) => STM.STM<B, Option.Option<E>, R>,
    ): (self: TSet<A>) => STM.STM<[B, ...Array<B>], E, R>;
    <A, B, E, R>(
        self: TSet<A>,
        pf: (a: A) => STM.STM<B, Option.Option<E>, R>,
    ): STM.STM<[B, ...Array<B>], E, R>;
} = internal.takeSomeSTM;

/**
 * Collects all elements into a `Chunk`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toChunk: <A>(self: TSet<A>) => STM.STM<Chunk.Chunk<A>> =
    internal.toChunk;

/**
 * Collects all elements into a `HashSet`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toHashSet: <A>(self: TSet<A>) => STM.STM<HashSet.HashSet<A>> =
    internal.toHashSet;

/**
 * Collects all elements into a `Array`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toArray: <A>(self: TSet<A>) => STM.STM<Array<A>> =
    internal.toArray;

/**
 * Collects all elements into a `ReadonlySet`.
 *
 * @since 2.0.0
 * @category destructors
 */
export const toReadonlySet: <A>(self: TSet<A>) => STM.STM<ReadonlySet<A>> =
    internal.toReadonlySet;

/**
 * Atomically updates all elements using a pure function.
 *
 * @since 2.0.0
 * @category mutations
 */
export const transform: {
    <A>(f: (a: A) => A): (self: TSet<A>) => STM.STM<void>;
    <A>(self: TSet<A>, f: (a: A) => A): STM.STM<void>;
} = internal.transform;

/**
 * Atomically updates all elements using a transactional function.
 *
 * @since 2.0.0
 * @category mutations
 */
export const transformSTM: {
    <A, R, E>(
        f: (a: A) => STM.STM<A, E, R>,
    ): (self: TSet<A>) => STM.STM<void, E, R>;
    <A, R, E>(
        self: TSet<A>,
        f: (a: A) => STM.STM<A, E, R>,
    ): STM.STM<void, E, R>;
} = internal.transformSTM;

/**
 * Atomically transforms the set into the union of itself and the provided
 * set.
 *
 * @since 2.0.0
 * @category mutations
 */
export const union: {
    <A>(other: TSet<A>): (self: TSet<A>) => STM.STM<void>;
    <A>(self: TSet<A>, other: TSet<A>): STM.STM<void>;
} = internal.union;
