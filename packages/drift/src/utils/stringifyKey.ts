import stringify from "safe-stable-stringify";

export function stringifyKey<T>(rawKey: T): Stringified<T> {
  return stringify(rawKey, (_, v) =>
    typeof v === "bigint" ? v.toString() : v,
  ) as Stringified<T>;
}

type Stringified<T> = string | Extract<T, undefined>;
