import assert from "node:assert";
import { afterEach, describe, it } from "node:test";
import { erc4626 } from "@gud/drift";
import { createMockDrift, randomAddress } from "@gud/drift/testing";
import { ReadVault } from "./sdk_client";

// Create mocks
const accountAddress = randomAddress();
const vaultAddress = randomAddress();
const mockDrift = createMockDrift();
const mockVault = mockDrift.contract({
  abi: erc4626.abi,
  address: vaultAddress,
});

describe("ReadVault", () => {
  // Reset mocks after each test
  afterEach(() => {
    mockDrift.reset();
  });

  describe("getAssetValue", () => {
    it("returns an account's shares converted to assets", async () => {
      // Set up method responses with or without specific parameters
      mockVault
        .onRead("balanceOf", { account: accountAddress })
        .resolves(BigInt(100e18));
      mockVault
        .onRead("convertToAssets")
        .callsFake(
          async (params) =>
            (params.args.shares * BigInt(1.5e18)) / BigInt(1e18),
        );

      // Call the code under test
      const vault = new ReadVault(vaultAddress, mockDrift);
      const assetValue = await vault.getAssetValue(accountAddress);

      // Assert the expected result
      assert.strictEqual(assetValue, BigInt(150e18));
    });
  });
});
