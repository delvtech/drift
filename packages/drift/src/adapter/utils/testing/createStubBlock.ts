import type { Block } from "src/adapter/types/Block";
import { randomAddress } from "src/utils/testing/randomAddress";
import { randomHex } from "src/utils/testing/randomHex";
import type { Eval, Replace, Writable } from "src/utils/types";

/**
 * Creates a stub block for testing.
 * @param override - Override default values
 */
export function createStubBlock<const T extends Partial<Block> = Block>(
  overrides: T = {} as T,
): Eval<Replace<Block, Writable<T>>> {
  const stub: Block = {
    extraData: "0x",
    gasLimit: 30_000_000n,
    gasUsed: 108_000_000n,
    hash: randomHex(32),
    logsBloom: "0x0",
    miner: randomAddress(),
    mixHash: randomHex(32),
    nonce: 1n,
    number: 1n,
    parentHash: randomHex(32),
    receiptsRoot: randomHex(32),
    sha3Uncles: randomHex(32),
    size: 100_000n,
    stateRoot: randomHex(32),
    timestamp: BigInt(Date.now()) / 1000n,
    transactions: [],
    transactionsRoot: randomHex(32),
  };
  return Object.assign(stub, overrides);
}
