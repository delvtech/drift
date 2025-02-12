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

export function viemAdapter<const TConfig extends ViemAdapterParams>({
  publicClient,
  walletClient,
}: TConfig): ViemAdapter<TConfig["publicClient"], TConfig["walletClient"]> {
  return walletClient
    ? (new ViemReadWriteAdapter({ publicClient, walletClient }) as any)
    : (new ViemReadAdapter({
        publicClient,
      }) as any);
}

export type ViemAdapter<
  TPublicClient extends PublicClient = PublicClient,
  TWalletClient extends WalletClient | undefined = WalletClient | undefined,
> = TWalletClient extends WalletClient
  ? ViemReadWriteAdapter<TPublicClient, TWalletClient>
  : ViemReadAdapter<TPublicClient>;
