import { type Address, createDrift, erc20 } from "@delvtech/drift";
import { fixed } from "@gud/math";

// Ethereum mainnet DAI
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

// Create a contract client
const token = drift.contract({
  abi: erc20.abi,
  address: tokenAddress,
});

// Call contract functions
const balance = await token.read("balanceOf", {
  account: token.address,
});

// Extend clients with custom methods
const extendedToken = token.extend({
  async getFormattedBalance(account: Address) {
    const [balance, decimals] = await Promise.all([
      this.read("balanceOf", { account }),
      this.read("decimals"),
    ]);
    return fixed(balance, decimals).format();
  },
});

// Call the extended method
const formattedBalance = await extendedToken.getFormattedBalance(token.address);

console.table({
  name: tokenName,
  address: token.address,
  balance,
  formatted: formattedBalance,
});
