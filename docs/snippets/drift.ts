import { createDrift } from "@gud/drift";

export const drift = createDrift({
  rpcUrl: process.env.RPC_URL,
});
