import type { Block } from "src/adapter/types/Block";
import { randomAddress } from "src/utils/testing/randomAddress";
import { randomHex } from "src/utils/testing/randomHex";
import type { Eval, Replace, Writable } from "src/utils/types";

/**
 * Creates a stub block for testing.
 * @param override - Override default values
 */
export function createStubBlock<
  const T extends Partial<Block> = Partial<Block>,
>(overrides: T = {} as T): Eval<Replace<Block, Writable<T>>> {
  return {
    extraData: "0x",
    gasLimit: 30000000n,
    gasUsed: 108_000_000n,
    hash: randomHex(),
    logsBloom: "0x0",
    miner: randomAddress(),
    mixHash: randomHex(),
    nonce: 1n,
    number: 1n,
    parentHash: randomHex(),
    receiptsRoot: randomHex(),
    sha3Uncles: randomHex(),
    size: 100_000n,
    stateRoot: randomHex(),
    timestamp: BigInt(Date.now()) / 1000n,
    transactions: [],
    transactionsRoot: randomHex(),
    ...overrides,
  };
}
