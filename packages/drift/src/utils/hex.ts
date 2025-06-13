export const HEX_REGEX = /^0x[0-9a-fA-F]*$/;

export function isHexString(s: unknown): s is `0x${string}` {
  return typeof s === "string" && HEX_REGEX.test(s);
}

export interface ToHexStringOptions {
  prefix?: boolean;
}

type ToHexStringReturn<TOptions extends ToHexStringOptions> =
  TOptions["prefix"] extends false ? string : `0x${string}`;

/**
 * Converts a value to a hexadecimal string prefixed with '0x'.
 *
 * @param value - The value to convert. If a string is provided, and it's not
 * already a prefixed hexadecimal string, it will be encoded to bytes before
 * conversion.
 * @returns A hexadecimal string prefixed with '0x'.
 */
export function toHexString<TOptions extends ToHexStringOptions>(
  value: string | number | bigint | Uint8Array,
  { prefix = true }: TOptions = {} as TOptions,
): ToHexStringReturn<TOptions> {
  const _prefix = prefix ? "0x" : "";
  if (typeof value === "number" || typeof value === "bigint") {
    return `${_prefix}${value.toString(16)}` as ToHexStringReturn<TOptions>;
  }

  const encoder = new TextEncoder();
  let bytes: Uint8Array;

  if (typeof value === "string") {
    if (isHexString(value)) return value;
    bytes = encoder.encode(value);
  } else {
    bytes = value;
  }

  const hexChars = [...bytes]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${_prefix}${hexChars}` as ToHexStringReturn<TOptions>;
}
