import type { Address } from "src/adapter/types/Abi";
import { getRandomHex } from "src/utils/testing/getRandomHex";

/**
 * Get a random address for testing.
 */
export function getRandomAddress(prefix = ""): Address {
  return getRandomHex(20, prefix);
}
