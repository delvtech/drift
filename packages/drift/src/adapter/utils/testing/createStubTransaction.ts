import type { Transaction } from "src/adapter/types/Transaction";
import { getRandomAddress } from "src/utils/testing/getRandomAddress";
import { getRandomHash } from "src/utils/testing/getRandomHash";

/**
 * Creates a stub transaction for testing.
 * @param override - Override default values
 */
export function createStubTransaction(
  override: Partial<Transaction> = {},
): Transaction {
  return {
    blockHash: getRandomHash(),
    blockNumber: 1n,
    from: getRandomAddress(),
    gas: 21000n,
    transactionHash: getRandomHash(),
    input: "0x",
    nonce: 1n,
    to: getRandomAddress(),
    transactionIndex: 0n,
    value: 0n,
    // TODO: Verify type
    type: "0x02",
    ...override,
  };
}
