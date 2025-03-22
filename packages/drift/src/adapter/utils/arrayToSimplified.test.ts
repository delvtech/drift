import { arrayToSimplified } from "src/adapter/utils/arrayToSimplified";
import { IERC20 } from "src/artifacts/IERC20";
import { describe, expect, it } from "vitest";

describe("arrayToSimplified", () => {
  it("correctly converts arrays into simplified types", async () => {
    const transferArgsObject = arrayToSimplified({
      abi: IERC20.abi,
      name: "transfer",
      kind: "inputs",
      values: ["0x123", 123n],
    });
    expect(transferArgsObject).toEqual({
      to: "0x123",
      amount: 123n,
    });

    // empty parameter names (index keys)
    const votesArgsObject = arrayToSimplified({
      abi: exampleAbi,
      name: "votes",
      kind: "inputs",
      values: ["0x123", 0n],
    });
    expect(votesArgsObject).toEqual({
      "0": "0x123",
      "1": 0n,
    });

    const balanceOfOutput = arrayToSimplified({
      abi: IERC20.abi,
      name: "balanceOf",
      kind: "outputs",
      values: [123n],
    });
    expect(balanceOfOutput).toEqual(123n);
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
