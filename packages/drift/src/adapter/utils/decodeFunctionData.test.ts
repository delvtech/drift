import { decodeFunctionData } from "src/adapter/utils/decodeFunctionData";
import { describe, expect, it } from "vitest";

describe("decodeFunctionData", () => {
  it("decodes function data correctly", () => {
    const decoded = decodeFunctionData({
      abi: [
        {
          type: "function",
          name: "version",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "pure",
        },
      ] as const,
      data: "0x54fd4d50",
    });

    expect(decoded).toEqual({
      functionName: "version",
      args: {},
    });
  });
});
