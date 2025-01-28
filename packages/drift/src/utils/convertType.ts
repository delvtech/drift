/**
 * Recursively converts a type to a new type. The `predicateFn` is
 * used to determine if the `converterFn` should be run on the value.
 *
 * The function first checks the value itself, if the `predicateFn` returns
 * false and the value is an array or object, the function will recursively
 * check each item in the array or object.
 *
 * @param value - The value to convert primitive types in.
 * @param predicateFn - A function that returns true if the `converterFn` should
 * be run on the value.
 * @param converterFn - A function that converts the value to a new type.
 * @returns - The converted value.
 *
 * @example
 * // Convert all bigints to string.
 * convertType(
 *   { a: 100n, b: { c: 200n }, d: [300n] },
 *   (value) => typeof value === "bigint",
 *   (value) => value.toString(),
 * );
 * // => { a: "100", b: { c: "200" }, d: ["300"] }
 */
export function convertType<T, TOriginal, TNew>(
  value: T,
  predicateFn: (value: any) => value is TOriginal,
  converterFn: (value: TOriginal) => TNew,
): Converted<T, TOriginal, TNew> {
  if (predicateFn(value)) {
    return converterFn(value) as Converted<T, TOriginal, TNew>;
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      convertType(item, predicateFn, converterFn),
    ) as Converted<T, TOriginal, TNew>;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        key,
        convertType(value, predicateFn, converterFn),
      ]),
    ) as Converted<T, TOriginal, TNew>;
  }

  return value as Converted<T, TOriginal, TNew>;
}

/**
 * Convert all properties in `T` whose values are of type `U` to type `V`. If
 * `T` is `U`, convert `T` itself to `V`.
 *
 * @example
 * ```ts
 * type Converted = Converted<{ a: string, b: number }, string, number>;
 * // { a: number, b: number }
 *
 * type ConvertedSimple = Converted<100n, bigint, number>;
 * // number
 *
 * type NotConverted = Converted<"foo", bigint, number>;
 * // "foo"
 * ```
 */
export type Converted<T, U, V> = T extends U
  ? V
  : T extends Array<infer Inner>
    ? Converted<Inner, U, V>[]
    : T extends object
      ? { [K in keyof T]: Converted<T[K], U, V> }
      : T;
