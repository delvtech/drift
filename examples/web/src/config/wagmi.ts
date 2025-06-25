import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { mainnet } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Drift Sandbox",
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "0",
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(import.meta.env.VITE_RPC_URL),
  },
});

export type WagmiConfig = typeof wagmiConfig;
