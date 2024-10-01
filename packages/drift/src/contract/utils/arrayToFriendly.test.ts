import { arrayToFriendly } from "src/contract/utils/arrayToFriendly";
import { IERC20 } from "src/utils/testing/IERC20";
import { describe, expect, it } from "vitest";

describe("arrayToFriendly", () => {
  it("correctly converts arrays with multiple items into objects", async () => {
    const transferArgsObject = arrayToFriendly({
      abi: IERC20.abi,
      type: "function",
      name: "transfer",
      kind: "inputs",
      values: ["0x123", 123n],
    });
    expect(transferArgsObject).toEqual({
      to: "0x123",
      value: 123n,
    });

    // empty parameter names (index keys)
    const votesArgsObject = arrayToFriendly({
      abi: exampleAbi,
      type: "function",
      name: "votes",
      kind: "inputs",
      values: ["0x123", 0n],
    });
    expect(votesArgsObject).toEqual({
      "0": "0x123",
      "1": 0n,
    });
  });

  it("returns the item from arrays with a single item", async () => {
    const balanceInput = arrayToFriendly({
      abi: IERC20.abi,
      type: "function",
      name: "balanceOf",
      kind: "inputs",
      values: ["0x123"],
    });
    expect(balanceInput).toEqual("0x123");
  });

  it("Converts an empty arrays into undefined", async () => {
    const notDefined = arrayToFriendly({
      abi: IERC20.abi,
      type: "function",
      name: "symbol",
      kind: "inputs",
      values: [],
    });
    expect(notDefined).toBeUndefined();
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
