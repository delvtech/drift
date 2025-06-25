import { createDrift, type Store } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import {
  type GetPublicClientParameters,
  type GetWalletClientParameters,
  getPublicClient,
  getWalletClient,
} from "@wagmi/core";
import { driftStore } from "src/config/drift";
import { type WagmiConfig, wagmiConfig } from "src/config/wagmi";

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
