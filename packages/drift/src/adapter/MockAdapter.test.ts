import { MockAdapter } from "src/adapter/MockAdapter";
import { IERC20 } from "src/utils/testing/IERC20";
import { describe, expect, it } from "vitest";

describe("MockAdapter", () => {
  it("Includes a mock network", async () => {
    const adapter = new MockAdapter();
    const blockStub = {
      blockNumber: 100n,
      timestamp: 200n,
    };
    adapter.network.stubGetBlock({
      value: blockStub,
    });
    const block = await adapter.network.getBlock();
    expect(block).toBe(blockStub);
  });

  it("Creates mock read contracts", async () => {
    const mockAdapter = new MockAdapter();
    const contract = mockAdapter.readContract(IERC20.abi);
    contract.stubRead({
      functionName: "balanceOf",
      value: 100n,
    });
    const balance = await contract.read("balanceOf", { owner: "0xMe" });
    expect(balance).toBe(100n);
  });

  it("Creates mock read-write contracts", async () => {
    const mockAdapter = new MockAdapter();
    const contract = mockAdapter.readWriteContract(IERC20.abi);
    contract.stubWrite("approve", "0xDone");
    const txHash = await contract.write("approve", {
      spender: "0xYou",
      value: 100n,
    });
    expect(txHash).toBe("0xDone");
  });
});
