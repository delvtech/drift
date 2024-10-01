import { objectToArray } from "src/contract/utils/objectToArray";
import { IERC20 } from "src/utils/testing/IERC20";
import { describe, expect, it } from "vitest";

describe("objectToArray", () => {
  it("correctly converts objects into arrays", async () => {
    const transferArgsArray = objectToArray({
      abi: IERC20.abi,
      type: "function",
      name: "transfer",
      kind: "inputs",
      value: {
        to: "0x123",
        value: 123n,
      },
    });
    expect(transferArgsArray).toEqual(["0x123", 123n]);

    // empty parameter names (index keys)
    const votesArgsArray = objectToArray({
      abi: exampleAbi,
      type: "function",
      name: "votes",
      kind: "inputs",
      value: {
        "0": "0x123",
        "1": 0n,
      },
    });
    expect(votesArgsArray).toEqual(["0x123", 0n]);
  });

  const emptyArray = objectToArray({
    abi: IERC20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
    value: {},
  });
  expect(emptyArray).toEqual([]);

  const emptyArrayFromUndefined = objectToArray({
    abi: IERC20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
  });
  expect(emptyArrayFromUndefined).toEqual([]);
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
