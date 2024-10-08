import { ViemReadAdapter } from "src/ViemReadAdapter";
import { ViemReadWriteAdapter } from "src/ViemReadWriteAdapter";
import type { PublicClient, WalletClient } from "viem";

export interface ViemAdapterParams<
  TPublicClient extends PublicClient = PublicClient,
  TWalletClient extends WalletClient | undefined = undefined,
> {
  publicClient: TPublicClient;
  walletClient?: TWalletClient;
}

export function viemAdapter<
  TPublicClient extends PublicClient,
  TWalletClient extends WalletClient | undefined,
>({
  publicClient,
  walletClient,
}: ViemAdapterParams<
  TPublicClient,
  TWalletClient
>): TWalletClient extends undefined ? ViemReadAdapter : ViemReadWriteAdapter {
  return walletClient
    ? new ViemReadWriteAdapter({ publicClient, walletClient })
    : (new ViemReadAdapter({
        publicClient,
      }) as ViemReadWriteAdapter);
}
