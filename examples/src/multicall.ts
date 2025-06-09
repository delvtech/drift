import { createDrift, erc20 } from "@delvtech/drift";

const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});

// Ethereum mainnet DAI
const tokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

const results = await drift.multicall({
  calls: [
    { abi: erc20.abi, address: tokenAddress, fn: "name" },
    { abi: erc20.abi, address: tokenAddress, fn: "symbol" },
    { abi: erc20.abi, address: tokenAddress, fn: "totalSupply" },
    { abi: erc20.abi, address: tokenAddress, fn: "decimals" },
  ],
});
console.table(results);

const values = await drift.multicall({
  calls: [
    { abi: erc20.abi, address: tokenAddress, fn: "name" },
    { abi: erc20.abi, address: tokenAddress, fn: "symbol" },
    { abi: erc20.abi, address: tokenAddress, fn: "totalSupply" },
    { abi: erc20.abi, address: tokenAddress, fn: "decimals" },
  ],
  // Set allowFailure to false to throw an error if any call fails and return
  // the values directly
  allowFailure: false,
});
console.table(values);
