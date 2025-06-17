import type { TransactionReceipt } from "src/adapter/types/Transaction";
import { randomAddress } from "src/utils/testing/randomAddress";
import { randomHex } from "src/utils/testing/randomHex";
import type { Eval, Replace, Writable } from "src/utils/types";

/**
 * Creates a stub transaction receipt for testing.
 * @param override - Override default values
 */
export function createStubTransactionReceipt<
  const T extends Partial<TransactionReceipt> = TransactionReceipt,
>(overrides: T = {} as T): Eval<Replace<TransactionReceipt, Writable<T>>> {
  return {
    blockHash: randomHex(32),
    blockNumber: 1n,
    contractAddress: randomAddress(),
    cumulativeGasUsed: 0n,
    effectiveGasPrice: 0n,
    from: randomAddress(),
    gasUsed: 0n,
    logsBloom: randomHex(256),
    status: "success",
    to: randomAddress(),
    transactionHash: randomHex(32),
    transactionIndex: 0n,
    ...overrides,
  };
}
