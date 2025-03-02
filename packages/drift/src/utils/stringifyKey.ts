import stringify from "safe-stable-stringify";

export function stringifyKey<T>(rawKey: T): Stringified<T> {
  return stringify(rawKey, (_, v) => {
    if (typeof v === "bigint") {
      return v.toString();
    }
    return v;
  }) as Stringified<T>;
}

type Stringified<T> = string | Extract<T, undefined>;
