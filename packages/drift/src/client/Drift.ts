import type { OxAdapter } from "src/adapter/OxAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type { Adapter } from "src/adapter/types/Adapter";
import type { ContractParams } from "src/adapter/types/Contract";
import {
  type Client,
  type ClientConfig,
  createClient,
} from "src/client/Client";
import { type Contract, createContract } from "src/client/contract/Contract";
import type { LruStore } from "src/store/LruStore";
import type { CacheStore } from "src/store/types";

export type Drift<
  TAdapter extends Adapter = Adapter,
  TCache extends CacheStore = CacheStore,
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
  TCache extends CacheStore = CacheStore,
> = ClientConfig<TAdapter, TCache>;

export function createDrift<
  TAdapter extends Adapter = OxAdapter,
  TCache extends CacheStore = LruStore,
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
