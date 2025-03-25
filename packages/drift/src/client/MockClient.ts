import type { DefaultAdapterOptions } from "src/adapter/DefaultAdapter";
import { MockAdapter } from "src/adapter/MockAdapter";
import {
  type Client,
  type ClientOptions,
  createClient,
} from "src/client/Client";
import type { LruStore } from "src/store/LruStore";
import type { Store } from "src/store/types";

export type MockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = Client<TAdapter, TStore>;

export type MockClientOptions<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = Partial<Omit<ClientOptions<TAdapter, TStore>, keyof DefaultAdapterOptions>>;

export function createMockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = LruStore,
>({
  adapter = new MockAdapter() as TAdapter,
  chainId,
  ...config
}: MockClientOptions<TAdapter, TStore> = {}): MockClient<TAdapter, TStore> {
  if (!adapter.stubs.has("getChainId")) {
    adapter.onGetChainId().resolves(chainId ?? 0);
  }
  return createClient({
    adapter,
    chainId,
    ...config,
  });
}
