import type { Block } from "src/adapter/types/Block";
import { getRandomAddress } from "src/utils/testing/getRandomAddress";
import { getRandomHash } from "src/utils/testing/getRandomHash";

/**
 * Creates a stub block for testing.
 * @param override - Override default values
 */
export function createStubBlock(override: Partial<Block> = {}): Block {
  return {
    extraData: "0x",
    gasLimit: 30000000n,
    gasUsed: 21000n,
    hash: getRandomHash(),
    logsBloom: "0x0",
    miner: getRandomAddress(),
    mixHash: getRandomHash(),
    nonce: 1n,
    number: 1n,
    parentHash: getRandomHash(),
    receiptsRoot: getRandomHash(),
    sha3Uncles: getRandomHash(),
    size: 1000n,
    stateRoot: getRandomHash(),
    timestamp: 1700000000n,
    transactions: [],
    transactionsRoot: getRandomHash(),
    ...override,
  };
}
