import { MockAdapter } from "src/adapter/MockAdapter";
import type { OxAdapterConfig } from "src/adapter/OxAdapter";
import {
  type Client,
  type ClientConfig,
  createClient,
} from "src/client/Client";
import type { LruStore } from "src/store/LruStore";
import type { Store } from "src/store/types";

export type MockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = Client<TAdapter, TStore>;

export type MockClientConfig<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = Store,
> = Partial<Omit<ClientConfig<TAdapter, TStore>, keyof OxAdapterConfig>>;

export function createMockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TStore extends Store = LruStore,
>({
  adapter = new MockAdapter() as TAdapter,
  chainId,
  ...config
}: MockClientConfig<TAdapter, TStore> = {}): MockClient<TAdapter, TStore> {
  if (!adapter.stubs.has("getChainId")) {
    adapter.onGetChainId().resolves(chainId ?? 0);
  }
  return createClient({
    adapter,
    chainId,
    ...config,
  });
}
