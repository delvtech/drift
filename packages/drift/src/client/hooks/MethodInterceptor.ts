import { HookRegistry } from "src/client/hooks/HookRegistry";
import type {
  AnyFunction,
  AnyObject,
  FunctionKey,
  MaybeAwaited,
  MaybePromise,
} from "src/utils/types";

/**
 * A class for intercepting method calls and running hooks before and after
 * execution. Uses a Proxy to automatically intercept method calls.
 */
export class MethodInterceptor<T extends AnyObject = AnyObject> {
  private _hooks = new HookRegistry<MethodHooks>();

  get hooks() {
    return this._hooks as HookRegistry<MethodHooks<T>>;
  }

  /**
   * Creates a proxy that automatically intercepts method calls and runs
   * hooks registered with the interceptor.
   * @param target The object whose methods should be intercepted
   * @returns A proxied version of the target object
   */
  createProxy = <U extends T>(target: U): U => {
    return new Proxy(target, {
      get: (target, prop, receiver) => {
        const value: unknown = Reflect.get(target, prop, receiver);
        if (prop === "constructor" || typeof value !== "function") {
          return value;
        }

        // Wrap the method
        const wrapped = (...args: unknown[]) =>
          this._useMethodHooks({
            method: prop,
            fn: value.bind(receiver),
            args,
          });

        Object.defineProperty(wrapped, "name", {
          get: () => value.name,
        });

        return wrapped;
      },
    });
  };

  private _useMethodHooks({
    method,
    fn,
    args,
  }: {
    method: PropertyKey;
    fn: AnyFunction;
    args: any[];
  }) {
    let skipped = false;
    let result: any = undefined;

    // Call before hook handlers
    const beforeHook: unknown = this._hooks.call(`before:${String(method)}`, {
      get args() {
        return args;
      },
      setArgs: (...newArgs: any) => {
        args = newArgs;
      },
      resolve: (value: any) => {
        if (!skipped) {
          skipped = true;
          result = value;
        }
      },
    });

    const runAfter = () => {
      // Call the function if not already resolved by a before hook
      if (!skipped) {
        result = fn(...args);
      }

      // Call after hook handlers
      const afterHook: unknown = this._hooks.call(`after:${String(method)}`, {
        args,
        get result() {
          return result;
        },
        setResult: (newResult: any) => {
          result = newResult;
        },
      });

      // Handle possible promises in the after hook
      if (afterHook instanceof Promise) {
        return afterHook.then(() => result) as any;
      }
      return result;
    };

    // Handle possible promises in the before hook
    if (beforeHook instanceof Promise) {
      return beforeHook.then(runAfter) as any;
    }
    return runAfter();
  }
}

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
  [K in FunctionKey<T> as `before:${K & string}`]: <
    TArgs extends Parameters<T[K]>,
  >(payload: {
    /** The arguments passed to the method */
    readonly args: TArgs;
    /** Override the arguments and continue */
    setArgs: <TArgs extends Parameters<T[K]>>(...args: TArgs) => void;
    /** Set the result and return early */
    resolve: (value: Awaited<ReturnType<T[K]>>) => void;
  }) => ReturnType<T[K]> extends Promise<any> ? MaybePromise<void> : void;
} & {
  [K in FunctionKey<T> as `after:${K & string}`]: <
    TArgs extends Parameters<T[K]>,
  >(payload: {
    /** The arguments that were passed to the method */
    readonly args: TArgs;
    /** The result returned by the method */
    readonly result: MaybeAwaited<ReturnType<T[K]>>;
    /** Override the result and continue */
    setResult: <TReturn extends ReturnType<T[K]>>(
      value: MaybeAwaited<TReturn>,
    ) => void;
  }) => ReturnType<T[K]> extends Promise<any> ? Promise<void> : void;
};
