export const HEX_REGEX = /^0x[0-9a-fA-F]+$/;

export function isHexString(s: unknown): s is `0x${string}` {
  return typeof s === "string" && HEX_REGEX.test(s);
}
