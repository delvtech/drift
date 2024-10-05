export type EmptyObject = Record<PropertyKey, never>;
export type AnyObject = Record<PropertyKey, any>;

export type MaybePromise<T> = T | Promise<T>;

export type AnyFunction = (...args: any) => any;

/**
 * Combines members of an intersection into a readable type.
 * @see https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Replace properties in `T` with properties in `U`.
 */
export type ReplaceKeys<T, U> = Prettify<Omit<T, keyof U> & U>;

/**
 * Make all properties in `T` whose keys are in the union `K` required and
 * non-nullable.
 */
export type RequiredKeys<T, K extends keyof T> = ReplaceKeys<
  T,
  {
    [U in K]-?: NonNullable<T[U]>;
  }
>;

/**
 * Make all properties in `T` whose keys are in the union `K` optional.
 */
export type OptionalKeys<T, K extends keyof T> = ReplaceKeys<
  T,
  {
    [U in K]?: T[U];
  }
>;

/** Recursively make all properties in T partial. */
export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

/**
 * Get a union of all property keys on `T` that are functions
 */
export type FunctionKey<T> = Exclude<
  {
    [K in keyof T]: T[K] extends AnyFunction ? K : never;
  }[keyof T],
  undefined
>;

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
