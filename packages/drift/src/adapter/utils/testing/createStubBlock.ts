import type { Block } from "src/adapter/types/Block";
import { getRandomAddress } from "src/utils/testing/getRandomAddress";
import { getRandomHex } from "src/utils/testing/getRandomHex";

/**
 * Creates a stub block for testing.
 * @param override - Override default values
 */
export function createStubBlock(override: Partial<Block> = {}): Block {
  return {
    extraData: "0x",
    gasLimit: 30000000n,
    gasUsed: 108_000_000n,
    hash: getRandomHex(),
    logsBloom: "0x0",
    miner: getRandomAddress(),
    mixHash: getRandomHex(),
    nonce: 1n,
    number: 1n,
    parentHash: getRandomHex(),
    receiptsRoot: getRandomHex(),
    sha3Uncles: getRandomHex(),
    size: 100_000n,
    stateRoot: getRandomHex(),
    timestamp: BigInt(Date.now()) / 1000n,
    transactions: [],
    transactionsRoot: getRandomHex(),
    ...override,
  };
}
