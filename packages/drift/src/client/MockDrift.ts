import type { Abi } from "abitype";
import type { MockAdapter } from "src/adapter/MockAdapter";
import type { ContractParams } from "src/adapter/types/Contract";
import type { LruSimpleCache } from "src/cache/LruSimpleCache";
import type { SimpleCache } from "src/cache/types";
import type { Client } from "src/client/Client";
import { type MockClientConfig, createMockClient } from "src/client/MockClient";
import { MockContract } from "src/client/contract/MockContract";

export type MockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Client<TAdapter, TCache> & {
  contract<TAbi extends Abi>({
    abi,
    address,
  }: ContractParams<TAbi>): MockContract<
    TAbi,
    TAdapter,
    TCache,
    MockDrift<TAdapter, TCache>
  >;
};

export function createMockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = LruSimpleCache,
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
