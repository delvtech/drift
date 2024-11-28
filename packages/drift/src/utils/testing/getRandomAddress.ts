import type { Address } from "src/adapter/types/Abi";
import { getRandomHex } from "src/utils/getRandomHex";

/**
 * Get a random address for testing.
 */
export function getRandomAddress(prefix = "addr"): Address {
  return `0x${prefix}${Array.from({ length: 40 - prefix.length }, () =>
    getRandomHex(),
  )}`;
}
