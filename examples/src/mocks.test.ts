import assert from "node:assert";
import test from "node:test";
import {
  type Address,
  type Contract,
  type Drift,
  createDrift,
} from "@delvtech/drift";
import { createMockDrift, randomAddress } from "@delvtech/drift/testing";
import { fixed } from "@delvtech/fixed-point-wasm";
import { ERC4626 } from "src/abis/Erc4626";

class ReadVault {
  contract: Contract<typeof ERC4626.abi>;
  constructor(address: Address, drift: Drift = createDrift()) {
    this.contract = drift.contract({
      abi: ERC4626.abi,
      address,
    });
  }
  async getAssetValue(account: Address): Promise<bigint> {
    const shares = await this.contract.read("balanceOf", { account });
    return this.contract.read("convertToAssets", { shares });
  }
}

test("getAssetValue returns account balances converted to assets", async () => {
  // Set up mocks
  const address = randomAddress();
  const account = randomAddress();
  const mockDrift = createMockDrift();
  const mockContract = mockDrift.contract({ abi: ERC4626.abi, address });

  // Stub the vault's return values using `on*` methods
  mockContract.onRead("balanceOf", { account }).resolves(
    // Return 100 shares for the account
    BigInt(100e18),
  );
  mockContract.onRead("convertToAssets").callsFake(
    // Simulate the conversion of shares to assets
    async (params) => fixed(params.args.shares).mul(1.5e18).bigint,
  );

  // Instantiate your client with the mocked Drift instance
  const readVault = new ReadVault(address, mockDrift);

  // Call the method you want to test
  const accountAssetValue = await readVault.getAssetValue(account);

  // Assert the expected result
  assert.strictEqual(accountAssetValue, BigInt(150e18));
});
