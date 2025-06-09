import { createDrift, erc20 } from "@delvtech/drift";

const address = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // Ethereum mainnet DAI
const account = "0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43"; // Coinbase 10

// Client example //

const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});

const results = await drift.multicall({
  calls: [
    { abi: erc20.abi, address, fn: "name" },
    { abi: erc20.abi, address, fn: "symbol" },
    { abi: erc20.abi, address, fn: "totalSupply" },
    { abi: erc20.abi, address, fn: "decimals" },
    { abi: erc20.abi, address, fn: "balanceOf", args: { account } },
  ],
});
console.table(results);

// Allow failure example //

const values = await drift.multicall({
  // Set allowFailure to false to throw an error if any call fails and return
  // the values directly
  allowFailure: false,
  calls: [
    { abi: erc20.abi, address, fn: "name" },
    { abi: erc20.abi, address, fn: "symbol" },
    { abi: erc20.abi, address, fn: "totalSupply" },
    { abi: erc20.abi, address, fn: "decimals" },
    { abi: erc20.abi, address, fn: "balanceOf", args: { account } },
  ],
});
console.table(values);

// Contract client example //

const token = drift.contract({
  abi: erc20.abi,
  address,
});

const results2 = await token.multicall({
  calls: [
    { fn: "name" },
    { fn: "symbol" },
    { fn: "decimals" },
    { fn: "totalSupply" },
    { fn: "balanceOf", args: { account } },
  ],
});
console.table(results2);
