import { createDrift, type Store } from "@gud/drift";
import { viemAdapter } from "@gud/drift-viem";
import { useMemo } from "react";
import { driftStore } from "src/lib/drift";
import {
  type UsePublicClientParameters,
  type UseWalletClientParameters,
  usePublicClient,
  useWalletClient,
} from "wagmi";

export interface UseDriftViemOptions
  extends UsePublicClientParameters,
    UseWalletClientParameters {
  store?: Store;
}

export function useDrift(options?: UseDriftViemOptions) {
  const publicClient = usePublicClient(options);
  const { data: walletClient } = useWalletClient(options);

  return useMemo(() => {
    if (!publicClient) return undefined;

    return createDrift({
      adapter: viemAdapter({ publicClient, walletClient }),
      store: options?.store || driftStore,
    });
  }, [publicClient, walletClient, options?.store]);
}
