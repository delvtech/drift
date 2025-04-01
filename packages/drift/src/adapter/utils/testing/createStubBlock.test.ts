import type { Block } from "src/adapter/types/Block";
import { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
import { HEX_REGEX } from "src/utils/isHexString";
import { describe, expect, it } from "vitest";

describe("createStubBlock", () => {
  it("creates a stub block with overrides", () => {
    const block = createStubBlock({
      number: 123n, // <--
    });
    expect(block).toMatchObject({
      extraData: expect.stringMatching(HEX_REGEX),
      gasLimit: expect.any(BigInt),
      gasUsed: expect.any(BigInt),
      hash: expect.stringMatching(HEX_REGEX),
      logsBloom: expect.stringMatching(HEX_REGEX),
      miner: expect.stringMatching(HEX_REGEX),
      mixHash: expect.stringMatching(HEX_REGEX),
      nonce: expect.any(BigInt),
      number: 123n, // <--
      parentHash: expect.stringMatching(HEX_REGEX),
      receiptsRoot: expect.stringMatching(HEX_REGEX),
      sha3Uncles: expect.stringMatching(HEX_REGEX),
      size: expect.any(BigInt),
      stateRoot: expect.stringMatching(HEX_REGEX),
      timestamp: expect.any(BigInt),
      transactions: expect.any(Array),
      transactionsRoot: expect.stringMatching(HEX_REGEX),
    } satisfies Block);
  });
});
