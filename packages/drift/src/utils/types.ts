export type EmptyObject = Record<PropertyKey, never>;
export type AnyObject = Record<PropertyKey, any>;

export type AnyFunction = (...args: any) => any;

export type MaybePromise<T> = T | Promise<T>;
export type MaybeAwaited<T> = T extends Promise<infer U> ? MaybePromise<U> : T;

/**
 * Unwrap the return type of a function that may return a promise.
 *
 * @internal
 * @privateRemarks
 * This fixes type errors that arise when trying to return
 * `Awaited<ReturnType<T>>` even though it's basically the same thing. I need to
 * do some more research to understand why this is necessary. I'm guessing it
 * has to do with distributive conditional types.
 */
export type AwaitedReturnType<T extends AnyFunction> = T extends (
  ...args: any
) => MaybePromise<infer U>
  ? U
  : never;

/**
 * Forces TypeScript to evaluate and expand a type instead of displaying it as a
 * reference.
 *
 * @remarks
 * The `& {}` intersection trick works because it forces TypeScript to create a
 * new object type rather than just reference the existing one.
 */
export type Eval<T> = { [K in keyof T]: T[K] } & {};

/**
 * Replace properties in `T` with properties in `U`.
 */
export type Replace<T, U> = Omit<T, keyof U> & U;

/**
 * Make all properties in `T` whose keys are in the union `K` required and
 * non-nullable. Similar to `Required` but only applies to a subset of keys.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Make all properties in `T` whose keys are in the union `K` optional. Similar
 * to `Partial` but only applies to a subset of keys.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Get a superset of `T` that allows for arbitrary properties.
 *
 * @example
 *
 * ```ts
 * interface Order {
 *   account: `0x${string}`;
 *   amount: bigint;
 * }
 *
 * const order1: Order = {
 *   account: "0x123",
 *   amount: 100n,
 *   getStatus() { ... }
 *   // ^ Error: Object literal may only specify known properties, and 'getStatus' does not exist in type 'Order'.
 * };
 *
 * // No errors! 🎉
 * const order2: Extended<Order> = {
 *   account: "0x123",
 *   amount: 100n,
 *   getStatus() { ... }
 * };
 * ```
 *
 */
export type Extended<T extends AnyObject> = T &
  Record<Exclude<PropertyKey, keyof T>, any>;

/**
 * Get a union of all keys on `T` that are functions
 */
export type FunctionKey<T> = keyof {
  [K in keyof T as T[K] extends Function ? K : never]: never;
};

/**
 * Get a union of all keys from all members of `T`.
 */
export type UnionKey<T> = T extends T ? keyof T : never;

/**
 * Construct a type in which only a single member of `T` is valid at a time.
 *
 * @example
 * ```ts
 * type U = OneOf<
 *   | {
 *       a: string;
 *     }
 *   | {
 *       b: string;
 *       c: number;
 *     }
 * >;
 * // {
 * //   a: string;
 * //   b?: undefined;
 * //   c?: undefined;
 * // } | {
 * //   a?: undefined;
 * //   b: string;
 * //   c: number;
 * // }
 * ```
 */
export type OneOf<T extends AnyObject> = UnionKey<T> extends infer K extends
  PropertyKey
  ? T extends T
    ? Eval<
        T & {
          [_ in Exclude<K, keyof T>]?: never;
        }
      >
    : never
  : never;
