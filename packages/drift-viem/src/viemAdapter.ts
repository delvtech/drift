import type { OneOf } from "@gud/drift";
import type { AnyClient } from "src/publicClient";
import { ViemReadAdapter } from "src/ViemReadAdapter";
import { ViemReadWriteAdapter } from "src/ViemReadWriteAdapter";
import type { WalletClient } from "viem";

export interface ViemAdapterParams<
  TPublicClient extends AnyClient = AnyClient,
  TWalletClient extends WalletClient | undefined = WalletClient | undefined,
> {
  publicClient: TPublicClient;
  walletClient?: TWalletClient;
}

export function viemAdapter<const TParams extends ViemAdapterParams>({
  publicClient,
  walletClient,
}: TParams): ViemAdapter<TParams["publicClient"], TParams["walletClient"]> {
  return walletClient
    ? (new ViemReadWriteAdapter({ publicClient, walletClient }) as any)
    : (new ViemReadAdapter({
        publicClient,
      }) as any);
}

export type ViemAdapter<
  TPublicClient extends AnyClient = AnyClient,
  TWalletClient extends WalletClient | undefined = undefined,
> = OneOf<
  TWalletClient extends WalletClient
    ? ViemReadWriteAdapter<TPublicClient, TWalletClient>
    : ViemReadAdapter<TPublicClient>
>;
