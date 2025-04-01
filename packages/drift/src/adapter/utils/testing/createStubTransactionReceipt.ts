import type { TransactionReceipt } from "src/adapter/types/Transaction";
import { randomAddress } from "src/utils/testing/randomAddress";
import { randomHex } from "src/utils/testing/randomHex";

/**
 * Creates a stub transaction receipt for testing.
 * @param override - Override default values
 */
export function createStubTransactionReceipt(
  overrides: Partial<TransactionReceipt> = {},
): TransactionReceipt {
  return {
    blockHash: randomHex(),
    blockNumber: 1n,
    contractAddress: randomAddress(),
    cumulativeGasUsed: 0n,
    effectiveGasPrice: 0n,
    from: randomHex(),
    gasUsed: 0n,
    logsBloom: randomHex(),
    status: "success",
    to: randomAddress(),
    transactionHash: randomHex(),
    transactionIndex: 0n,
    ...overrides,
  };
}
