import { arrayToFriendly } from "src/adapter/utils/arrayToFriendly";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

describe("arrayToFriendly", () => {
  it("correctly converts arrays into friendly types", async () => {
    const transferArgsObject = arrayToFriendly({
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
    const votesArgsObject = arrayToFriendly({
      abi: exampleAbi,
      name: "votes",
      kind: "inputs",
      values: ["0x123", 0n],
    });
    expect(votesArgsObject).toEqual({
      "0": "0x123",
      "1": 0n,
    });

    const balanceInput = arrayToFriendly({
      abi: erc20.abi,
      name: "balanceOf",
      kind: "outputs",
      values: [123n],
    });
    expect(balanceInput).toEqual(123n);
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
