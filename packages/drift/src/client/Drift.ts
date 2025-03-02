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
import type { Store } from "src/store/types";

export type Drift<
  TAdapter extends Adapter = Adapter,
  TStore extends Store = Store,
> = Client<
  TAdapter,
  TStore,
  {
    contract<TAbi extends Abi>(
      params: ContractParams<TAbi>,
    ): Contract<TAbi, TAdapter, TStore, Drift<TAdapter, TStore>>;
  }
>;

export type DriftConfig<
  TAdapter extends Adapter = Adapter,
  TStore extends Store = Store,
> = ClientConfig<TAdapter, TStore>;

export function createDrift<
  TAdapter extends Adapter = OxAdapter,
  TStore extends Store = LruStore,
>(config: DriftConfig<TAdapter, TStore> = {}): Drift<TAdapter, TStore> {
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
