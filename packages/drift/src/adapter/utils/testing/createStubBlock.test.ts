import type { Block } from "src/adapter/types/Block";
import { createStubBlock } from "src/exports/testing";
import { describe, expect, it } from "vitest";

describe("createStubBlock", () => {
  const hexRegex = /^0x[a-f0-9]*$/;

  it("creates a stub block", () => {
    const block = createStubBlock();
    expect(block).toMatchObject({
      extraData: expect.stringMatching(hexRegex),
      gasLimit: expect.any(BigInt),
      gasUsed: expect.any(BigInt),
      hash: expect.stringMatching(hexRegex),
      logsBloom: expect.stringMatching(hexRegex),
      miner: expect.stringMatching(hexRegex),
      mixHash: expect.stringMatching(hexRegex),
      nonce: expect.any(BigInt),
      number: expect.any(BigInt),
      parentHash: expect.stringMatching(hexRegex),
      receiptsRoot: expect.stringMatching(hexRegex),
      sha3Uncles: expect.stringMatching(hexRegex),
      size: expect.any(BigInt),
      stateRoot: expect.stringMatching(hexRegex),
      timestamp: expect.any(BigInt),
      transactions: expect.any(Array),
      transactionsRoot: expect.stringMatching(hexRegex),
    } as Block);
  });
});
