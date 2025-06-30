import { createDrift } from "@delvtech/drift";

export const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});
