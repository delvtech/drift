import { arrayToObject } from "src/adapter/utils/arrayToObject";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

describe("arrayToObject", () => {
  it("correctly converts arrays into objects", async () => {
    const transferArgsObject = arrayToObject({
      abi: erc20.abi,
      name: "transfer",
      kind: "inputs",
      values: ["0x123", 123n],
    });
    expect(transferArgsObject).toEqual({
      to: "0x123",
      amount: 123n,
    });

    // empty parameter names (index keys)
    const votesArgsObject = arrayToObject({
      abi: exampleAbi,
      name: "votes",
      kind: "inputs",
      values: ["0x123", 0n],
    });
    expect(votesArgsObject).toEqual({
      "0": "0x123",
      "1": 0n,
    });

    const balanceInput = arrayToObject({
      abi: erc20.abi,
      name: "balanceOf",
      kind: "inputs",
      values: ["0x123"],
    });
    expect(balanceInput).toEqual({ account: "0x123" });
  });
});

const exampleAbi = [
  {
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
    ],
    name: "votes",
    outputs: [],
    stateMutability: "view",
    type: "function",
  },
] as const;
