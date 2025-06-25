import type { MockAdapter } from "src/adapter/MockAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type { Client } from "src/client/Client";
import type { ContractBaseOptions } from "src/client/contract/Contract";
import { MockContract } from "src/client/contract/MockContract";
import {
  createMockClient,
  type MockClientOptions,
} from "src/client/MockClient";
import type { LruStore } from "src/store/LruStore";
import type { Store } from "src/store/Store";

export type MockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = Client<
  TAdapter,
  TStore,
  {
    contract<TAbi extends Abi, TThis extends MockDrift<TAdapter, TStore>>(
      this: TThis,
      options: ContractBaseOptions<TAbi>,
    ): MockContract<TAbi, TThis["adapter"], TThis["cache"]["store"], TThis>;
    contract<TAbi extends Abi>(
      options: ContractBaseOptions<TAbi>,
    ): MockContract<TAbi, TAdapter, TStore, MockDrift<TAdapter, TStore>>;
  }
>;

export function createMockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = LruStore,
>(
  options: MockClientOptions<TAdapter, TStore> = {},
): MockDrift<TAdapter, TStore> {
  return createMockClient(options).extend({
    contract(
      options: ContractBaseOptions,
    ): MockContract<Abi, TAdapter, TStore, MockDrift<TAdapter, TStore>> {
      return new MockContract({
        ...options,
        client: this,
      });
    },
  });
}
