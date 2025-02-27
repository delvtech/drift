export function isHexString(s: unknown): s is `0x${string}` {
  return typeof s === "string" && s.startsWith("0x");
}
