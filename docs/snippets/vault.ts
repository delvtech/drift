import { createDrift, erc4626 } from "@delvtech/drift";

export const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});

export const vault = drift.contract({
  abi: erc4626.abi,
  address: "0x...", // Vault contract address
});
