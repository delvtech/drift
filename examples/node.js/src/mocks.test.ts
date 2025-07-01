import assert from "node:assert";
import test from "node:test";
import { type Address, type Drift, erc4626 } from "@delvtech/drift";
import { createMockDrift, randomAddress } from "@delvtech/drift/testing";

// Simple function that fetches share balance and converts to assets
async function getUserAssetValue(
  drift: Drift,
  vaultAddress: Address,
  userAddress: Address,
) {
  const vault = drift.contract({ abi: erc4626.abi, address: vaultAddress });

  const shares = await vault.read("balanceOf", { account: userAddress });
  const assets = await vault.read("convertToAssets", { shares });

  return assets;
}

// Test case for getUserAssetValue function
test("getUserAssetValue returns user's shares converted to assets", async () => {
  // Set up mocks
  const userAddress = randomAddress();
  const vaultAddress = randomAddress();
  const mockDrift = createMockDrift();
  const mockVault = mockDrift.contract({
    abi: erc4626.abi,
    address: vaultAddress,
  });

  // Stub the vault's return values using `on*` methods //

  // Return 100 shares for the user's address
  mockVault
    .onRead("balanceOf", { account: userAddress })
    .resolves(BigInt(100e18));

  // Simulate the conversion logic: 1 share = 1.5 assets
  mockVault
    .onRead("convertToAssets")
    .callsFake(
      async (params) => (params.args.shares * BigInt(1.5e18)) / BigInt(1e18),
    );

  // Call the function under test
  const assetValue = await getUserAssetValue(
    mockDrift,
    vaultAddress,
    userAddress,
  );

  // Assert the expected result
  assert.strictEqual(assetValue, BigInt(150e18));
});
