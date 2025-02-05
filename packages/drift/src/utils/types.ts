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
 * has to do with distributing conditional types.
 */
export type AwaitedReturnType<T extends AnyFunction> = T extends (
  ...args: any
) => MaybePromise<infer U>
  ? U
  : never;

/**
 * Combines members of an intersection into a readable type.
 * @see https://x.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 */
// This is not meant for internal use. It's a public alias for the internal
// `Eval` that uses a name users might be more familiar with.
export type Pretty<T> = Eval<T>;

/**
 * Forces TypeScript to evaluate and expand a type instead of displaying it as a
 * reference.
 *
 * @internal
 * @privateRemarks
 * The `& {}` intersection trick works because it forces TypeScript to create a
 * new object type rather than just reference the existing one. It's like
 * telling TypeScript "give me a new type that has all these properties" instead
 * of "just point to this other type."
 */
export type Eval<T> = { [K in keyof T]: T[K] } & {};

/**
 * Replace properties in `T` with properties in `U`.
 */
export type ReplaceProps<T, U> = Omit<T, keyof U> & U;

/**
 * Make all properties in `T` whose keys are in the union `K` required and
 * non-nullable.
 */
export type RequiredKeys<T, K extends keyof T> = ReplaceProps<
  T,
  {
    [U in K]-?: NonNullable<T[U]>;
  }
>;

/**
 * Make all properties in `T` whose keys are in the union `K` optional.
 */
export type OptionalKeys<T, K extends keyof T> = ReplaceProps<
  T,
  {
    [OptionalKey in K]?: T[OptionalKey];
  }
>;

/** Recursively make all properties in T partial. */
export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

/**
 * Get a union of all property keys on `T` that are functions
 */
export type FunctionKey<T> = keyof {
  [K in keyof T as T[K] extends AnyFunction ? K : never]: never;
};

/**
 * Convert members of a union to an intersection.
 *
 * @example
 * ```ts
 * type Union = { a: number } | { b: string };
 * type Intersection = UnionToIntersection<Union>;
 * // { a: number } & { b: string }
 * ```
 *
 * @privateRemarks
 * This works by taking advantage of [distributive conditional
 * types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types),
 * which allows conditional types to be applied to each member of a union type
 * individually, and [contravarience in function argument
 * types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-6.html#strict-function-types).
 *
 * The conditional type `T extends any ? (x: T) => any : never` is used to
 * create a function type for each member of the union that takes the member as
 * an argument.
 *
 * Then, the union of function types is checked to see if it can be assigned to
 * a single function type with an inferred argument type. TypeScript infers the
 * argument type as the intersection of the union members since it's the only
 * argument type that satisfies all members of the function type union.
 */
export type UnionToIntersection<T> = (
  T extends any
    ? (member: T) => any
    : never
) extends (member: infer R) => any
  ? R
  : never;

/**
 * Merge the keys of a union or intersection of objects into a single type.
 *
 * @example
 * ```ts
 * type GetBlockOptions = {
 *   includeTransactions?: boolean | undefined
 * } & (
 *   | {
 *       blockHash?: string | undefined;
 *       blockNumber?: never | undefined;
 *       blockTag?: never | undefined;
 *     }
 *   | {
 *       blockHash?: never | undefined;
 *       blockNumber?: bigint | undefined;
 *       blockTag?: never | undefined;
 *     }
 *   | {
 *       blockHash?: never | undefined;
 *       blockNumber?: never | undefined;
 *       blockTag?: string | undefined;
 *     }
 * )
 *
 * type Merged = MergeKeys<GetBlockOptions>;
 * // {
 * //   includeTransactions?: boolean | undefined;
 * //   blockHash?: string | undefined;
 * //   blockNumber?: bigint | undefined;
 * //   blockTag?: string | undefined;
 * // }
 * ```
 */
export type MergeKeys<T> = UnionToIntersection<T> extends infer I
  ? {
      // Each key of the intersection is first checked against the union type,
      // T. If it exists in every member of T, then T[K] will be a union of
      // the value types. Otherwise, I[K] is used. I[K] is the value type of
      // the key in the intersection which will be `never` for keys with
      // conflicting value types.
      [K in keyof I]: K extends keyof T ? T[K] : I[K];
    }
  : never;

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
export type OneOf<T extends AnyObject> = UnionToIntersection<T> extends infer I
  ? T extends infer Ty
    ? Eval<
        Ty & {
          [K in Exclude<keyof I, keyof T>]?: never;
        }
      >
    : never
  : never;

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
 * Return `T` if defined, otherwise return `U`.
 */
export type Fallback<T, U> = undefined extends T ? U : Exclude<T, undefined>;
