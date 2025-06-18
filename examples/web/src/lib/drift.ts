import { createDrift, LruStore } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { type GetPublicClientParameters, getPublicClient } from "@wagmi/core";
import { wagmiConfig } from "src/lib/wagmi";

export const driftStore = new LruStore({
  max: 500,
  ttl: 60_000, // 1 minute TTL to match the queryClient's staleTime
});

export function getDrift(
  params?: GetPublicClientParameters<typeof wagmiConfig>,
) {
  const publicClient = getPublicClient(wagmiConfig, params) as any;
  return createDrift({
    adapter: viemAdapter({ publicClient }),
    store: driftStore,
  });
}
