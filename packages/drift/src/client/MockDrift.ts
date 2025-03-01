import type { MockAdapter } from "src/adapter/MockAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type { ContractParams } from "src/adapter/types/Contract";
import type { Client } from "src/client/Client";
import { type MockClientConfig, createMockClient } from "src/client/MockClient";
import { MockContract } from "src/client/contract/MockContract";
import type { LruStore } from "src/store/LruStore";
import type { CacheStore } from "src/store/types";

export type MockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends CacheStore = CacheStore,
> = Client<
  TAdapter,
  TCache,
  {
    contract<TAbi extends Abi>({
      abi,
      address,
    }: ContractParams<TAbi>): MockContract<
      TAbi,
      TAdapter,
      TCache,
      MockDrift<TAdapter, TCache>
    >;
  }
>;

export function createMockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends CacheStore = LruStore,
>(
  config: MockClientConfig<TAdapter, TCache> = {},
): MockDrift<TAdapter, TCache> {
  return createMockClient(config).extend({
    contract({ abi, address }) {
      return new MockContract({
        abi,
        address,
        client: this,
      });
    },
  });
}
