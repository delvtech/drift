import type { DefaultAdapter } from "src/adapter/DefaultAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type { Adapter } from "src/adapter/types/Adapter";
import {
  type Client,
  type ClientOptions,
  createClient,
} from "src/client/Client";
import type { ClientCache } from "src/client/cache/ClientCache";
import {
  type Contract,
  type ContractBaseOptions,
  createContract,
} from "src/client/contract/Contract";
import type { HookRegistry } from "src/client/hooks/HookRegistry";
import type { LruStore } from "src/store/LruStore";
import type { Store } from "src/store/types";

/**
 * A client for interacting with an Ethereum network through an
 * {@linkcode Adapter} with {@link ClientCache caching} and
 * {@link HookRegistry hooks}.
 *
 * Streamlined clients for interacting with specific contracts can be created
 * using the {@linkcode Drift.contract} method.
 */
export type Drift<
  TAdapter extends Adapter = Adapter,
  TStore extends Store = Store,
> = Client<
  TAdapter,
  TStore,
  {
    contract<TAbi extends Abi, TThis extends Drift<TAdapter, TStore>>(
      this: TThis,
      options: ContractBaseOptions<TAbi>,
    ): Contract<
      TAbi,
      TThis["adapter"],
      TStore,
      Drift<TThis["adapter"], TStore>
    >;
  }
>;

export type DriftOptions<
  TAdapter extends Adapter = Adapter,
  TStore extends Store = Store,
> = ClientOptions<TAdapter, TStore>;

export function createDrift<
  TAdapter extends Adapter = DefaultAdapter,
  TStore extends Store = LruStore,
>(config: DriftOptions<TAdapter, TStore> = {}): Drift<TAdapter, TStore> {
  return createClient(config).extend({
    contract(options) {
      return createContract({
        ...options,
        client: this,
      });
    },
  });
}
