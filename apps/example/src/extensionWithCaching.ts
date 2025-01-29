import { type Address, createDrift } from "@delvtech/drift";
import { erc20 } from "@delvtech/drift/testing";
import { fixed, initSync, wasmBuffer } from "@delvtech/fixed-point-wasm";

initSync(wasmBuffer);

// Create a Drift client
const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});

// Log all read operations along with their cached values
drift.hooks.on("before:read", async ({ args: [params] }) => {
  console.group("Hook: before:read");
  console.log(`Reading ${params.fn} with:`, params.args);
  const key = await drift.cache.readKey(params);
  const cachedValue = await drift.cache.get(key);
  console.log("Cached value:", cachedValue);
  console.groupEnd();
});

// Create a contract instance and extend it with a custom method which makes
// multiple read calls to fetch and format the balance of an account.
const contract = drift
  .contract({
    abi: erc20.abi,
    address: "0xAc37729B76db6438CE62042AE1270ee574CA7571",
  })
  .extend({
    async getFormattedBalance(account: Address) {
      console.group("getFormattedBalance");
      const balance = await this.read("balanceOf", { account });
      const decimals = await this.read("decimals");
      console.groupEnd();
      return fixed(balance, decimals).format();
    },
  });

console.table({
  name: await contract.read("name"),
  address: contract.address,
  balance: await contract.read("balanceOf", { account: contract.address }),
  formatted: await contract.getFormattedBalance(contract.address),
});
