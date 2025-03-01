import type { OxAdapter } from "src/adapter/OxAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type { Adapter } from "src/adapter/types/Adapter";
import type { ContractParams } from "src/adapter/types/Contract";
import type { LruSimpleCache } from "src/cache/LruSimpleCache";
import type { SimpleCache } from "src/cache/types";
import {
  type Client,
  type ClientConfig,
  createClient,
} from "src/client/Client";
import { type Contract, createContract } from "src/client/contract/Contract";

export type Drift<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = Client<
  TAdapter,
  TCache,
  {
    contract<TAbi extends Abi>(
      params: ContractParams<TAbi>,
    ): Contract<TAbi, TAdapter, TCache, Drift<TAdapter, TCache>>;
  }
>;

export type DriftConfig<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = ClientConfig<TAdapter, TCache>;

export function createDrift<
  TAdapter extends Adapter = OxAdapter,
  TCache extends SimpleCache = LruSimpleCache,
>(config: DriftConfig<TAdapter, TCache> = {}): Drift<TAdapter, TCache> {
  return createClient(config).extend({
    contract({ abi, address }) {
      return createContract({
        abi,
        address,
        client: this,
      });
    },
  });
}
