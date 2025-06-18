import { createDrift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { useMemo } from "react";
import { driftStore } from "src/lib/drift";
import { usePublicClient, useWalletClient } from "wagmi";

export function useDrift() {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  return useMemo(() => {
    if (!publicClient) return undefined;
    const drift = createDrift({
      adapter: viemAdapter({ publicClient, walletClient }),
      store: driftStore,
    });
    return drift;
  }, [publicClient, walletClient]);
}
