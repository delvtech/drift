import { createDrift } from "@delvtech/drift";
import { Web3Adapter } from "@delvtech/drift-web3";
import { driftStore } from "src/config/drift";
import { getWeb3 } from "src/drift/web3/getWeb3";
import type { DriftWeb3Options } from "src/drift/web3/types";

export function getDrift(options?: DriftWeb3Options) {
  return createDrift({
    adapter: new Web3Adapter(getWeb3(options)),
    store: options?.store ?? driftStore,
  });
}
