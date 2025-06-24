import {
  BrowserProvider,
  getDefaultProvider,
  JsonRpcProvider,
  type Networkish,
} from "ethers";
import type { EthersOptions } from "src/drift/ethers/types";

export async function getEthers(network?: Networkish, options?: EthersOptions) {
  if (import.meta.env.VITE_RPC_URL) {
    const provider = new JsonRpcProvider(
      import.meta.env.VITE_RPC_URL,
      network,
      options,
    );
    return {
      provider,
      signer: await provider.getSigner().catch(() => undefined),
    };
  }

  if (window.ethereum) {
    const provider = new BrowserProvider(window.ethereum, network, options);
    return {
      provider,
      signer: await provider.getSigner().catch(() => undefined),
    };
  }

  return {
    provider: getDefaultProvider(network, options),
  };
}
