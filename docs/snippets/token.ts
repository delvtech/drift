import { createDrift, erc20 } from "@delvtech/drift";

export const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});

export const token = drift.contract({
  abi: erc20.abi,
  address: "0x...",
});
