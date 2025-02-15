import { decodeFunctionReturn } from "src/adapter/utils/decodeFunctionReturn";
import { encodeFunctionReturn } from "src/adapter/utils/encodeFunctionReturn";
import { createDrift } from "src/client/Drift";
import { describe, expect, it } from "vitest";

const abi = [
  {
    name: "names",
    type: "function",
    inputs: [],
    outputs: [
      { name: "names", type: "string[]" },
      { name: "", type: "uint256" },
    ],
    stateMutability: "view",
  },
] as const;

describe("encodeFunctionReturn", () => {
  it("correctly encodes function return data", async () => {
    await createDrift({ rpcUrl: "http://localhost:8545" }).getChainId();
    const returnData = encodeFunctionReturn({
      abi,
      fn: "names",
      value: { names: ["delv", "drift"], "1": 123n },
    });
    expect(returnData).toMatch(/^0x[a-fA-F0-9]+$/);
    const decodedReturn = decodeFunctionReturn({
      abi,
      data: returnData,
      fn: "names",
    });
    expect(decodedReturn).toEqual({
      names: ["delv", "drift"],
      1: 123n,
    });
  });
});
