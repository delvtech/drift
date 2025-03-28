import type { MockAdapter } from "src/adapter/MockAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type { Client } from "src/client/Client";
import {
  type MockClientOptions,
  createMockClient,
} from "src/client/MockClient";
import type { ContractBaseOptions } from "src/client/contract/Contract";
import { MockContract } from "src/client/contract/MockContract";
import type { LruStore } from "src/store/LruStore";
import type { Store } from "src/store/types";

export type MockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = Client<
  TAdapter,
  TStore,
  {
    contract<TAbi extends Abi>(
      options: ContractBaseOptions<TAbi>,
    ): MockContract<TAbi, TAdapter, TStore, MockDrift<TAdapter, TStore>>;
  }
>;

export function createMockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = LruStore,
>(
  config: MockClientOptions<TAdapter, TStore> = {},
): MockDrift<TAdapter, TStore> {
  return createMockClient(config).extend({
    contract(options) {
      return new MockContract({
        ...options,
        client: this,
      });
    },
  });
}
