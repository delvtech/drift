import {
  http,
  type PublicClient,
  type WalletClient,
  createPublicClient,
  createWalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const publicClient: PublicClient = createPublicClient({
  transport: http(process.env.RPC_URL),
});

export const walletClient: WalletClient | undefined = process.env
  .WALLET_PRIVATE_KEY
  ? createWalletClient({
      account: privateKeyToAccount(
        process.env.WALLET_PRIVATE_KEY as `0x${string}`,
      ),
      transport: http(process.env.RPC_URL),
    })
  : undefined;
