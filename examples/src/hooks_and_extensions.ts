import { type Address, createDrift, erc20 } from "@delvtech/drift";
import { fixed } from "@gud/math";

// Create a Drift client.
const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});

// A simple hook to log cache hits.
drift.hooks.on("before:read", async ({ args: [params] }) => {
  const cachedValue = await drift.cache.getRead(params);
  if (cachedValue !== undefined) {
    console.group("✅ Cache hit:");
    console.table({
      address: params.address,
      fn: params.fn,
      ...params.args,
      block: params.block,
      cachedValue,
    });
    console.groupEnd();
  }
});

// An example of an extended contract client with a custom method which combines
// multiple read calls to return a formatted balance.
const contract = drift
  .contract({
    abi: erc20.abi,
    address: "0xAc37729B76db6438CE62042AE1270ee574CA7571",
  })
  .extend({
    async getFormattedBalance(account: Address) {
      const [balance, decimals] = await Promise.all([
        this.read("balanceOf", { account }),
        this.read("decimals"),
      ]);
      return fixed(balance, decimals).format();
    },
  });

console.table({
  contractAddress: contract.address,
  name: await contract.read("name"),
  balance: await contract.read("balanceOf", { account: contract.address }),
  formatted: await contract.getFormattedBalance(contract.address), // <- "balanceOf" will be read from cache
});
