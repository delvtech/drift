import { createDrift } from "@delvtech/drift";
import { ethersAdapter } from "@delvtech/drift-ethers";
import type { Networkish } from "ethers";
import { useMemo } from "react";
import { driftStore } from "src/config/drift";
import type { DriftEthersOptions } from "src/drift/ethers/types";
import { useEthers } from "src/drift/ethers/useEthers";

export function useDrift(network?: Networkish, options?: DriftEthersOptions) {
  const { provider, signer } = useEthers(network, options);

  return useMemo(() => {
    if (!provider) return undefined;

    return createDrift({
      adapter: ethersAdapter({ provider, signer }),
      store: options?.store || driftStore,
    });
  }, [provider, signer, options?.store]);
}
