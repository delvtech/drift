import type { MockAdapter } from "src/adapter/MockAdapter";
import type { Abi } from "src/adapter/types/Abi";
import type { ContractParams } from "src/adapter/types/Contract";
import type { Client } from "src/client/Client";
import { type MockClientOptions, createMockClient } from "src/client/MockClient";
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
    contract<TAbi extends Abi>({
      abi,
      address,
    }: ContractParams<TAbi>): MockContract<
      TAbi,
      TAdapter,
      TStore,
      MockDrift<TAdapter, TStore>
    >;
  }
>;

export function createMockDrift<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = LruStore,
>(
  config: MockClientOptions<TAdapter, TStore> = {},
): MockDrift<TAdapter, TStore> {
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
