import type { Adapter, ReadAdapter, ReadWriteAdapter } from "@delvtech/drift";
import { ViemReadAdapter } from "src/ReadAdapter";
import { ViemReadWriteAdapter } from "src/ReadWriteAdapter";
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
>): TWalletClient extends undefined ? ReadAdapter : ReadWriteAdapter {
  return walletClient
    ? new ViemReadWriteAdapter({ publicClient, walletClient })
    : (new ViemReadAdapter({ publicClient }) as Adapter as ReadWriteAdapter);
}
