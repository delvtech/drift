import { type Address, createDrift } from "@delvtech/drift";
import { erc20 } from "@delvtech/drift/testing";
import { fixed, initSync, wasmBuffer } from "@delvtech/fixed-point-wasm";

initSync(wasmBuffer);

const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

// Create a Drift client
const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});

// Make read calls
const tokenName = await drift.read({
  abi: erc20.abi,
  address: tokenAddress,
  fn: "name",
});

// Create a contract instance
const token = drift.contract({
  abi: erc20.abi,
  address: tokenAddress,
});

const balance = await token.read("balanceOf", {
  account: token.address,
});

// Extend the contract instance with custom methods
const extendedToken = token.extend({
  async getFormattedBalance(account: Address) {
    const balance = await this.read("balanceOf", { account });
    const decimals = await this.read("decimals");
    return fixed(balance, decimals).format();
  },
});

const formattedBalance = await extendedToken.getFormattedBalance(token.address);

console.table({
  name: tokenName,
  address: token.address,
  balance,
  formatted: formattedBalance,
});
