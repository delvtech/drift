import type { TransactionReceipt } from "src/adapter/types/Transaction";
import { getRandomAddress } from "src/utils/testing/getRandomAddress";
import { getRandomHash } from "src/utils/testing/getRandomHash";

/**
 * Creates a stub transaction receipt for testing.
 * @param override - Override default values
 */
export function createStubTransactionReceipt(
  override: Partial<TransactionReceipt> = {},
): TransactionReceipt {
  return {
    blockHash: getRandomHash(),
    blockNumber: 1n,
    cumulativeGasUsed: 0n,
    effectiveGasPrice: 0n,
    from: getRandomAddress(),
    gasUsed: 0n,
    logsBloom: getRandomHash(),
    status: "success",
    to: getRandomAddress(),
    transactionHash: getRandomHash(),
    transactionIndex: 0n,
    ...override,
  };
}
