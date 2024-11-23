import { ViemReadAdapter } from "src/ViemReadAdapter";
import { ViemReadWriteAdapter } from "src/ViemReadWriteAdapter";
import type { PublicClient, WalletClient } from "viem";

export interface ViemAdapterParams<
  TPublicClient extends PublicClient = PublicClient,
  TWalletClient extends WalletClient | undefined = WalletClient | undefined,
> {
  publicClient: TPublicClient;
  walletClient?: TWalletClient;
}

export function viemAdapter<
  TPublicClient extends PublicClient,
  TWalletClient extends WalletClient | undefined = undefined,
>({
  publicClient,
  walletClient,
}: ViemAdapterParams<
  TPublicClient,
  TWalletClient
>): TWalletClient extends WalletClient
  ? ViemReadWriteAdapter<TPublicClient, TWalletClient>
  : ViemReadAdapter<TPublicClient> {
  return walletClient
    ? (new ViemReadWriteAdapter({ publicClient, walletClient }) as any)
    : (new ViemReadAdapter({
        publicClient,
      }) as any);
}
