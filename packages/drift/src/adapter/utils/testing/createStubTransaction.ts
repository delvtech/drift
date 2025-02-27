import type { Transaction } from "src/adapter/types/Transaction";
import { getRandomAddress } from "src/utils/testing/getRandomAddress";
import { getRandomHex } from "src/utils/testing/getRandomHex";
import { getRandomInt } from "src/utils/testing/getRandomInt";

/**
 * Creates a stub transaction for testing.
 * @param override - Override default values
 */
export function createStubTransaction(
  overrides: Partial<Transaction> = {},
): Transaction {
  return {
    blockHash: getRandomHex(),
    blockNumber: 1n,
    from: getRandomAddress(),
    gas: BigInt(getRandomInt(21_000, 210_000)),
    transactionHash: getRandomHex(),
    input: "0x",
    nonce: 1n,
    to: getRandomAddress(),
    transactionIndex: 0n,
    value: 0n,
    type: "0x02",
    ...overrides,
  };
}
