import type { Transaction } from "src/adapter/types/Transaction";
import { randomAddress } from "src/utils/testing/randomAddress";
import { randomHex } from "src/utils/testing/randomHex";
import { randomInt } from "src/utils/testing/randomInt";

/**
 * Creates a stub transaction for testing.
 * @param override - Override default values
 */
export function createStubTransaction(
  overrides: Partial<Transaction> = {},
): Transaction {
  return {
    blockHash: randomHex(),
    blockNumber: 1n,
    chainId: 1,
    from: randomAddress(),
    gas: BigInt(randomInt(21_000, 210_000)),
    gasPrice: BigInt(randomInt(0.1e9, 10e9)),
    input: "0x",
    nonce: 1n,
    to: randomAddress(),
    transactionHash: randomHex(),
    transactionIndex: 0n,
    type: "0x02",
    value: 0n,
    ...overrides,
  };
}
