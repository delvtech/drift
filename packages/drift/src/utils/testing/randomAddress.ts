import type { Address } from "src/adapter/types/Abi";
import { randomHex } from "src/utils/testing/randomHex";

/**
 * Get a random address for testing.
 */
export function randomAddress(prefix = ""): Address {
  return randomHex(20, prefix);
}
