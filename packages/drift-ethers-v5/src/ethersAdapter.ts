import type { Signer } from "ethers";
import { EthersReadAdapter } from "src/EthersReadAdapter";
import { EthersReadWriteAdapter } from "src/EthersReadWriteAdapter";
import type { Provider } from "src/types";

export interface EthersAdapterParams<
  TProvider extends Provider = Provider,
  TSigner extends Signer | undefined = Signer | undefined,
> {
  provider?: TProvider;
  signer?: TSigner;
}

export function ethersAdapter<const TParams extends EthersAdapterParams>(
  { provider, signer } = {} as TParams,
): EthersAdapter<TParams["provider"], TParams["signer"]> {
  return signer
    ? (new EthersReadWriteAdapter({ provider, signer }) as any)
    : (new EthersReadAdapter({
        provider,
      }) as any);
}

export type EthersAdapter<
  TProvider extends Provider | undefined = Provider,
  TSigner extends Signer | undefined = undefined,
> = (
  TProvider extends Provider
    ? TProvider
    : Provider
) extends infer TProvider extends Provider
  ? TSigner extends Signer
    ? EthersReadWriteAdapter<TProvider, TSigner>
    : EthersReadAdapter<TProvider>
  : never;
