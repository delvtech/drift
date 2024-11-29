import type { TransactionReceipt } from "src/adapter/types/Transaction";
import { getRandomAddress } from "src/utils/testing/getRandomAddress";
import { getRandomHex } from "src/utils/testing/getRandomHex";

/**
 * Creates a stub transaction receipt for testing.
 * @param override - Override default values
 */
export function createStubTransactionReceipt(
  override: Partial<TransactionReceipt> = {},
): TransactionReceipt {
  return {
    blockHash: getRandomHex(),
    blockNumber: 1n,
    cumulativeGasUsed: 0n,
    effectiveGasPrice: 0n,
    from: getRandomHex(),
    gasUsed: 0n,
    logsBloom: getRandomHex(),
    status: "success",
    to: getRandomAddress(),
    transactionHash: getRandomHex(),
    transactionIndex: 0n,
    ...override,
  };
}
