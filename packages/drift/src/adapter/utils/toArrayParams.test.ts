import { toArrayParams } from "src/adapter/utils/toArrayParams";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

describe("toArrayParams", () => {
  it("correctly converts friendly types into arrays", async () => {
    const transferArgsArray = toArrayParams({
      abi: erc20.abi,
      type: "function",
      name: "transfer",
      kind: "inputs",
      value: {
        to: "0x123",
        amount: 123n,
      },
    });
    expect(transferArgsArray).toEqual(["0x123", 123n]);

    // empty parameter names (index keys)
    const votesArgsArray = toArrayParams({
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

  const emptyArray = toArrayParams({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
  });
  expect(emptyArray).toEqual([]);

  const emptyArrayFromUndefined = toArrayParams({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
  });
  expect(emptyArrayFromUndefined).toEqual([]);

  const singleValueArray = toArrayParams({
    abi: erc20.abi,
    type: "function",
    name: "balanceOf",
    kind: "outputs",
    value: 123n,
  });
  expect(singleValueArray).toEqual([123n]);

  const singleValueArrayFromObject = toArrayParams({
    abi: erc20.abi,
    type: "function",
    name: "balanceOf",
    kind: "outputs",
    value: { 0: 123n },
  });
  expect(singleValueArray).toEqual([123n]);
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
