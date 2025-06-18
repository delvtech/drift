import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "src/App";
import { queryClient } from "src/lib/react-query";
import { wagmiConfig } from "src/lib/wagmi";
import { WagmiProvider } from "wagmi";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<RainbowKitProvider>
					<App />
				</RainbowKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	</StrictMode>,
);
