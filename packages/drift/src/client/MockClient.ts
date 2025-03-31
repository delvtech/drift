import { MockAdapter } from "src/adapter/MockAdapter";
import { type Client, createClient } from "src/client/Client";
import type { LruStore, LruStoreOptions } from "src/store/LruStore";
import type { Store } from "src/store/types";

export type MockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = Client<TAdapter, TStore>;

export type MockClientOptions<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = {
  adapter?: TAdapter;
  store?: LruStore extends TStore ? TStore | LruStoreOptions : TStore;
  chainId?: number;
};

export function createMockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = LruStore,
>(
  options: MockClientOptions<TAdapter, TStore> = {},
): MockClient<TAdapter, TStore> {
  const {
    adapter = new MockAdapter() as TAdapter,
    chainId,
    ...restOptions
  } = options;
  if (!adapter.stubs.has("getChainId")) {
    adapter.onGetChainId().resolves(chainId ?? 0);
  }
  return createClient({
    adapter,
    chainId,
    ...restOptions,
  });
}
