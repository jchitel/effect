import type * as Types from "./Types.js";

export interface TypeLambda {
    readonly In: unknown;
    readonly Out2: unknown;
    readonly Out1: unknown;
    readonly Target: unknown;
}

export type Kind<F extends TypeLambda, In, Out2, Out1, Target> = F extends {
    readonly type: unknown;
}
    ? (F & {
          readonly In: In;
          readonly Out2: Out2;
          readonly Out1: Out1;
          readonly Target: Target;
      })["type"]
    : {
          readonly F: F;
          readonly In: Types.Contravariant<In>;
          readonly Out2: Types.Covariant<Out2>;
          readonly Out1: Types.Covariant<Out1>;
          readonly Target: Types.Invariant<Target>;
      };
