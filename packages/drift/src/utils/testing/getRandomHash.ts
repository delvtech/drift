import type { Hash } from "src/adapter/types/Abi";
import { getRandomHex } from "src/utils/getRandomHex";

/**
 * Get a random hash for testing.
 */
export function getRandomHash(prefix = "hash"): Hash {
  return `0x${prefix}${Array.from({ length: 64 - prefix.length }, () =>
    getRandomHex(),
  )}`;
}
