import type { AnyObject, FunctionKey, MaybeAwaited } from "src/utils/types";

/**
 * Hooks for modifying the behavior of an object's methods.
 *
 * @example
 * ```ts
 * class Dev {
 *   wakeUp() {}
 *   code() {}
 *   sleep() {}
 * }
 *
 * type DevHooks = MethodHooks<Dev>;
 * // => {
 * //   "before:wakeUp": (payload: {...}) => MaybePromise<void>;
 * //   "before:code": (payload: {...}) => MaybePromise<void>;
 * //   "before:sleep": (payload: {...}) => MaybePromise<void>;
 * //   "after:wakeUp": (payload: {...}) => MaybePromise<void>;
 * //   "after:code": (payload: {...}) => MaybePromise<void>;
 * //   "after:sleep": (payload: {...}) => MaybePromise<void>;
 * // }
 * ```
 */
export type MethodHooks<T extends AnyObject = AnyObject> = {
  [K in FunctionKey<T> as K extends string ? `before:${K}` : never]: <
    TArgs extends Parameters<T[K]>,
  >(payload: {
    /** The arguments passed to the method */
    readonly args: TArgs;
    /** Override the arguments and continue */
    setArgs: <TArgs extends Parameters<T[K]>>(...args: TArgs) => void;
    /** Set the result and return early */
    resolve: (value: Awaited<ReturnType<T[K]>>) => void;
  }) => ReturnType<T[K]> extends Promise<any> ? Promise<void> : void;
} & {
  [K in FunctionKey<T> as K extends string ? `after:${K}` : never]: <
    TArgs extends Parameters<T[K]>,
  >(payload: {
    /** The arguments that were passed to the method */
    readonly args: TArgs;
    /** The result returned by the method */
    readonly result: MaybeAwaited<ReturnType<T[K]>>;
    /** Override the result and continue */
    setResult: (value: MaybeAwaited<ReturnType<T[K]>>) => void;
  }) => ReturnType<T[K]> extends Promise<any> ? Promise<void> : void;
};
