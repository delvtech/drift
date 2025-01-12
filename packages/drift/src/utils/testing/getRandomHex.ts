import type { HexString } from "src/adapter/types/Abi";

/**
 * Get a random hex string of a given byte length.
 * @param bytes - The number of bytes to generate.
 * @param prefix - The prefix to add to the hex string after the 0x.
 *
 * @example
 * ```ts
 * const data = getRandomHex(32, "d00d");
 * // -> "0xd00dffe96681c09cc931e1d059a7eddf729ef9e58eebc412bd6f167cb7ecfe88"
 * ```
 */
export function getRandomHex(bytes = 32, prefix = ""): HexString {
  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  const hex = Array.from(array, (b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  const paddedPrefix = prefix.length % 2 ? `${prefix}0` : prefix;
  return `0x${paddedPrefix}${hex.slice(paddedPrefix.length)}` as HexString;
}
