import type { Transaction } from "src/adapter/types/Transaction";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { HEX_REGEX } from "src/utils/hex";
import { describe, expect, it } from "vitest";

describe("createStubTransaction", () => {
  it("creates a stub transaction with overrides", () => {
    const block = createStubTransaction({
      transactionHash: "0x123", // <--
    });
    expect(block).toStrictEqual({
      transactionHash: "0x123", // <--
      type: expect.any(String),
      nonce: expect.any(BigInt),
      gas: expect.any(BigInt),
      value: expect.any(BigInt),
      input: expect.stringMatching(HEX_REGEX),
      gasPrice: expect.any(BigInt),
      chainId: expect.any(Number),
      to: expect.stringMatching(HEX_REGEX),
      blockHash: expect.toBeOneOf([
        expect.stringMatching(HEX_REGEX),
        undefined,
      ]),
      blockNumber: expect.toBeOneOf([expect.any(BigInt), undefined]),
      from: expect.toBeOneOf([expect.stringMatching(HEX_REGEX), undefined]),
      transactionIndex: expect.toBeOneOf([expect.any(Number), undefined]),
    } satisfies Transaction);
  });
});
