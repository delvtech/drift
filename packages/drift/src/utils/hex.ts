export const HEX_REGEX = /^0x[0-9a-fA-F]*$/;

export interface IsHexStringOptions {
  /**
   * Whether the string is expected to have the '0x' prefix.
   * @default true
   */
  prefix?: boolean;
}

type ConditionalHexStringType<TOptions extends ToHexStringOptions> =
  TOptions["prefix"] extends false ? string : `0x${string}`;

/**
 * Checks if a value is a valid hexadecimal string, optionally checking for
 * the '0x' prefix.
 *
 * @param value - The value to check.
 * @param options - Options to control the check.
 *
 * @example
 * ```ts
 * // Returns true
 * isHexString("0x123abc");
 * isHexString("123abc", { prefix: false });
 *
 * // Returns false
 * isHexString("123abc");
 * isHexString("0x123xyz");
 * isHexString("0x123abc", { prefix: false });
 * ```
 */
export function isHexString<TOptions extends IsHexStringOptions>(
  value: unknown,
  { prefix = true } = {} as TOptions & IsHexStringOptions,
): value is ConditionalHexStringType<TOptions> {
  return (
    typeof value === "string" && HEX_REGEX.test(prefix ? value : `0x${value}`)
  );
}

export interface ToHexStringOptions {
  /**
   * Whether to include the '0x' prefix in the returned string.
   * @default true
   */
  prefix?: boolean;
}

/**
 * Converts a value to a hexadecimal string, optionally prefixed with '0x'.
 *
 * @param value - The value to convert. If a string is provided, and it's not
 * already a valid hex string, it will be encoded to bytes then converted.
 * @param options - Options to control the output format.
 *
 * @example
 * ```ts
 * toHexString(255); // '0xff'
 * toHexString(255n); // '0xff'
 * toHexString("hello"); // '0x68656c6c6f'
 * toHexString(new Uint8Array([104, 101, 108, 108, 111])); // '0x68656c6c6f'
 *
 * toHexString(255, { prefix: false }); // 'ff'
 *
 * // Valid hex strings are returned as-is:
 * toHexString("0xff"); // '0xff'
 * toHexString("ff", { prefix: false }); // 'ff'
 * ```
 */
export function toHexString<TOptions extends ToHexStringOptions>(
  value: string | number | bigint | Uint8Array,
  { prefix = true } = {} as TOptions & ToHexStringOptions,
): ConditionalHexStringType<TOptions> {
  const _prefix = prefix === false ? "" : "0x";

  if (typeof value === "number" || typeof value === "bigint") {
    return `${_prefix}${value.toString(16)}` as ConditionalHexStringType<TOptions>;
  }

  const encoder = new TextEncoder();
  let bytes: Uint8Array;

  if (typeof value === "string") {
    if (isHexString(value, { prefix })) return value;
    bytes = encoder.encode(value);
  } else {
    bytes = value;
  }

  const hexChars = [...bytes]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${_prefix}${hexChars}` as ConditionalHexStringType<TOptions>;
}
