import { createDrift } from "@delvtech/drift";
import { ethersAdapter } from "@delvtech/drift-ethers";
import type { Networkish } from "ethers";
import { driftStore } from "src/config/drift";
import { getEthers } from "src/drift/ethers/getEthers";
import type { DriftEthersOptions } from "src/drift/ethers/types";

export async function getDrift(
  network?: Networkish,
  options?: DriftEthersOptions,
) {
  const { provider, signer } = await getEthers(network, options);
  return createDrift({
    adapter: ethersAdapter({ provider, signer }),
    store: options?.store ?? driftStore,
  });
}
