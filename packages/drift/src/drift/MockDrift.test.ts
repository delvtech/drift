import { MockDrift } from "src/drift/MockDrift";
import { IERC20 } from "src/utils/testing/IERC20";
import { describe, expect, it } from "vitest";

describe("MockDrift", () => {
  it("Creates mock read-write contracts", async () => {
    const mockDrift = new MockDrift();
    const mockContract = mockDrift.contract({
      abi: IERC20.abi,
      address: "0xVaultAddress",
    });

    mockContract.stubRead({
      functionName: "symbol",
      value: "FOO",
    });
    expect(await mockContract.read("symbol")).toBe("FOO");

    // expect(
    //   await mockDrift.read({
    //     abi: IERC20.abi,
    //     address: "0xVaultAddress",
    //     fn: "symbol",
    //   }),
    // ).toBe("FOO");

    mockContract.stubWrite("approve", "0xHash");
    expect(
      await mockContract.write("approve", {
        spender: "0x1",
        value: 100n,
      }),
    ).toBe("0xHash");
  });
});
