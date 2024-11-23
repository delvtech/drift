import type { Provider, Signer } from "ethers";
import { EthersReadAdapter } from "src/EthersReadAdapter";
import { EthersReadWriteAdapter } from "src/EthersReadWriteAdapter";

export interface EthersAdapterParams<
  TProvider extends Provider = Provider,
  TSigner extends Signer | undefined = Signer | undefined,
> {
  provider?: TProvider;
  signer?: TSigner;
}

export function ethersAdapter<
  TProvider extends Provider = Provider,
  TSigner extends Signer | undefined = undefined,
>({
  provider,
  signer,
}: EthersAdapterParams<TProvider, TSigner> = {}): TSigner extends Signer
  ? EthersReadWriteAdapter<TProvider, TSigner>
  : EthersReadAdapter<TProvider> {
  return signer
    ? (new EthersReadWriteAdapter({ provider, signer }) as any)
    : (new EthersReadAdapter({
        provider,
      }) as any);
}
