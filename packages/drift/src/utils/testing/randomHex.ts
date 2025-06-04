import type { HexString } from "src/adapter/types/Abi";

/**
 * Get a random hex string of a given byte length.
 *
 * @param bytes - The number of bytes to generate.
 * @param prefix - The prefix to add to the hex string after the 0x.
 *
 * @example
 * ```ts
 * const data = randomHex(32, "d00d");
 * // -> "0xd00dffe96681c09cc931e1d059a7eddf729ef9e58eebc412bd6f167cb7ecfe88"
 * ```
 */
export function randomHex(bytes = 32, prefix = ""): HexString {
  const paddedPrefix = prefix.length % 2 ? `${prefix}0` : prefix;
  // Short-circuit if the prefix is longer than the desired byte length
  if (paddedPrefix.length / 2 > bytes) {
    return `0x${paddedPrefix.slice(0, bytes * 2)}`;
  }
  const ints = new Uint8Array(bytes - paddedPrefix.length / 2);
  crypto.getRandomValues(ints);
  const hex = Array.from(ints, (b) => b.toString(16).padStart(2, "0")).join("");
  return `0x${paddedPrefix}${hex}`;
}
