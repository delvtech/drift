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
 */
// The `& {}` intersection trick works because it forces TypeScript to create a
// new object type rather than just reference the existing one.
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
 * The opposite of {@linkcode Readonly<T>}. Make all properties in `T` mutable.
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

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
 * Get a union of all keys in {@linkcode T} that are required and not assignable
 * to undefined.
 */
export type RequiredValueKey<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

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

/**
 * Extracts and transforms members of a union type `T` based on a filter type
 * `F`. It's similar to `Extract<T, U>` but rather than omitting members of `T`
 * that aren't wholly assignable to `U`, (e.g., omitting `{ a: string }` when
 * `U` is `{ a: 'foo' }`), it narrows values of `T` that the filter type `F` is
 * assignable to (e.g., `{ a: string }` is narrowed to `{ a: 'foo' }`).
 *
 * For each member in `T` (distributing over unions), if it includes all
 * required keys (as determined by {@linkcode RequiredValueKey<F>}), the type is
 * transformed by applying the filter:
 * - For each key `K` in `T` that exists in `F`, if `T[K]` is assignable to
 *   `F[K]`, the original type is kept.
 * - Otherwise, the type from `F[K]` is substituted in.
 *
 * **Important:** If the resulting transformed type is not assignable to the
 * original member of `T`, that union member is omitted from the output.
 *
 * @typeParam T - The union type whose members are to be filtered and
 * transformed.
 * @typeParam F - The filter type specifying required keys and their desired
 * types.
 *
 * @example
 * ```ts
 * type Filtered = ExtractFiltered<
 *   | { i: 0; a: string; c: boolean }
 *   | { i: 1; b: number }
 *   | { i: 2; c: boolean },
 *   { i: number; c: true }
 * >;
 * // -> { i: 0; a: string; c: true } | { i: 2; c: true };
 *
 * type FilteredPartial = ExtractFiltered<{ a: string; b: number; c: boolean }, { a: 'foo' }>;
 * // -> { a: 'foo'; b: number; c: boolean }
 * ```
 *
 * @internal
 */
export type ExtractFiltered<T, F = {}> = T extends T // <- Distribute union
  ? RequiredValueKey<F> extends keyof T
    ? ApplyFilter<T, F> // <- Apply filter to entry
    : never // <- Omit if entry is missing a required value
  : never;

/**
 * Transforms a type `T` based on a filter type `F`, returning `never` if the
 * result is not assignable to `T`.
 *
 * @typeParam T - The type to be transformed.
 * @typeParam F - The filter type specifying the desired transformations.
 *
 * @example
 * ```ts
 * type Filtered = ApplyFilter<
 *   { a: string; b: true },
 *   { a: "foo"; b: boolean }
 * >;
 * // -> { a: 'foo'; b: true }
 *
 * type Filtered2 = ApplyFilter<{ a: string }, { a: number }>;
 * // -> never
 * ```
 *
 * @internal
 */
export type ApplyFilter<T, F> = {
  [K in keyof T]: K extends keyof F
    ? T[K] extends F[K]
      ? T[K] // <- Leave value as-is if it fits the filter
      : F[K] // <- Use filter value otherwise
    : T[K]; // <- Leave value as-is if the key isn't in the filter
} extends infer TF extends T
  ? TF // <- Return the transformed type if it's assignable to T
  : never;
