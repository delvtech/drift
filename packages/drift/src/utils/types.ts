export type EmptyObject = Record<PropertyKey, never>;

export type MaybePromise<T> = T | Promise<T>;

/**
 * Combines members of an intersection into a readable type.
 * @see https://twitter.com/mattpocockuk/status/1622730173446557697?s=20&t=NdpAcmEFXY01xkqU3KO0Mg
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & unknown;

/** Recursively make all properties in T partial. */
export type DeepPartial<T> = {
  [K in keyof T]?: DeepPartial<T[K]>;
};

/**
 * Make all properties in `T` whose keys are in the union `K` required and
 * non-nullable.
 */
export type RequiredKeys<T, K extends keyof T> = Prettify<
  Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
  }
>;

/**
 * Make all properties in `T` whose keys are in the union `K` optional.
 */
export type OptionalKeys<T, K extends keyof T> = Prettify<
  Omit<T, K> & {
    [P in K]?: T[P];
  }
>;
