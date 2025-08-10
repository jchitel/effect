import { identity } from "./Function.js";

export declare const unifySymbol: unique symbol;
export type unifySymbol = typeof unifySymbol;

export declare const typeSymbol: unique symbol;
export type typeSymbol = typeof typeSymbol;

export declare const ignoreSymbol: unique symbol;
export type ignoreSymbol = typeof ignoreSymbol;

type MaybeReturn<F> = F extends () => infer R ? R : NonNullable<F>;

type Values<X extends [any, any]> = X extends [infer A, infer Ignore]
    ? Exclude<keyof A, Ignore> extends infer k
        ? k extends keyof A
            ? MaybeReturn<A[k]>
            : never
        : never
    : never;

type Ignore<X> = X extends { [ignoreSymbol]?: infer Obj }
    ? keyof NonNullable<Obj>
    : never;

type ExtractTypes<X> = X extends {
    [typeSymbol]?: infer _Type;
    [unifySymbol]?: infer _Unify;
}
    ? [NonNullable<_Unify>, Ignore<X>]
    : never;

type FilterIn<A> = A extends any
    ? typeSymbol extends keyof A
        ? A
        : never
    : never;

type FilterOut<A> = A extends any
    ? typeSymbol extends keyof A
        ? never
        : A
    : never;

export type Unify<A> =
    Values<ExtractTypes<FilterIn<A> & { [typeSymbol]: A }>> extends infer Z
        ? Z | Exclude<A, Z> | FilterOut<A>
        : never;

export const unify: {
    <
        Args extends Array<any>,
        Args2 extends Array<any>,
        Args3 extends Array<any>,
        Args4 extends Array<any>,
        Args5 extends Array<any>,
        T,
    >(
        x: (
            ...args: Args
        ) => (
            ...args: Args2
        ) => (...args: Args3) => (...args: Args4) => (...args: Args5) => T,
    ): (
        ...args: Args
    ) => (
        ...args: Args2
    ) => (...args: Args3) => (...args: Args4) => (...args: Args5) => Unify<T>;
    <
        Args extends Array<any>,
        Args2 extends Array<any>,
        Args3 extends Array<any>,
        Args4 extends Array<any>,
        T,
    >(
        x: (
            ...args: Args
        ) => (...args: Args2) => (...args: Args3) => (...args: Args4) => T,
    ): (
        ...args: Args
    ) => (...args: Args2) => (...args: Args3) => (...args: Args4) => Unify<T>;
    <
        Args extends Array<any>,
        Args2 extends Array<any>,
        Args3 extends Array<any>,
        T,
    >(
        x: (...args: Args) => (...args: Args2) => (...args: Args3) => T,
    ): (...args: Args) => (...args: Args2) => (...args: Args3) => Unify<T>;
    <Args extends Array<any>, Args2 extends Array<any>, T>(
        x: (...args: Args) => (...args: Args2) => T,
    ): (...args: Args) => (...args: Args2) => Unify<T>;
    <Args extends Array<any>, T>(
        x: (...args: Args) => T,
    ): (...args: Args) => Unify<T>;
    <T>(x: T): Unify<T>;
} = identity as any;
