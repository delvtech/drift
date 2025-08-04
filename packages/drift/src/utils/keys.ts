import stringify from "safe-stable-stringify";

type Stringified<T> = string | Extract<T, undefined>;

/**
 * Converts a raw key to a stringified version, handling `BigInt` values by
 * appending 'n'. This is useful for ensuring that keys can be safely serialized
 * and deserialized.
 *
 * @param rawKey - The raw key to be stringified.
 * @returns A stringified version of the key.
 */
export function stringifyKey<T>(rawKey: T): Stringified<T> {
  return stringify(rawKey, (_, v) => {
    if (typeof v === "bigint") {
      return `${v}n`;
    }
    return v;
  }) as Stringified<T>;
}

/**
 * Parses a stringified key back to its original form, converting 'n' suffixed
 * integer strings back to `BigInt`. This is useful for retrieving keys that were
 * previously stringified with {@linkcode stringifyKey}.
 *
 * @param stringifiedKey - The stringified key to be parsed.
 * @returns The original key, with `BigInt` values restored.
 */
export function parseKey<T = any>(stringifiedKey: string): T {
  return JSON.parse(stringifiedKey, (_, v) => {
    if (typeof v === "string" && /^-?\d+n$/.test(v)) {
      return BigInt(v.slice(0, -1));
    }
    return v;
  }) as T;
}
