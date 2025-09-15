import { createDrift, LruStore, type Store } from "@gud/drift";
import { viemAdapter } from "@gud/drift-viem";
import {
    type GetPublicClientParameters,
    type GetWalletClientParameters,
    getPublicClient,
    getWalletClient,
} from "@wagmi/core";
import { type WagmiConfig, wagmiConfig } from "src/lib/wagmi";

export const driftStore = new LruStore({
  max: 500,
  ttl: 60_000, // 1 minute TTL to match the queryClient's staleTime
});

export type GetDriftViemOptions = GetPublicClientParameters<WagmiConfig> &
  GetWalletClientParameters<WagmiConfig> & {
    store?: Store;
  };

export async function getDrift(options?: GetDriftViemOptions) {
  const publicClient = getPublicClient(wagmiConfig, options);
  const walletClient = await getWalletClient(wagmiConfig, options).catch(
    () => undefined,
  );
  return createDrift({
    adapter: viemAdapter({ publicClient, walletClient }),
    store: options?.store || driftStore,
  });
}
