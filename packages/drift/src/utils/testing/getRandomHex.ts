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
  let hex = prefix;
  const length = bytes * 2 - prefix.length;
  for (let i = 0; i < length; i++) {
    hex += getRandomHexChar();
  }
  return `0x${hex}`;
}

export function getRandomHexChar() {
  return Math.floor(Math.random() * 16).toString(16);
}
