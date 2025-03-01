import { MockAdapter } from "src/adapter/MockAdapter";
import type { OxAdapterConfig } from "src/adapter/OxAdapter";
import {
  type Client,
  type ClientConfig,
  createClient,
} from "src/client/Client";
import type { LruStore } from "src/store/LruStore";
import type { CacheStore } from "src/store/types";

export type MockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends CacheStore = CacheStore,
> = Client<TAdapter, TCache>;

export type MockClientConfig<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends CacheStore = CacheStore,
> = Partial<Omit<ClientConfig<TAdapter, TCache>, keyof OxAdapterConfig>>;

export function createMockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends CacheStore = LruStore,
>({
  adapter = new MockAdapter() as TAdapter,
  chainId,
  ...config
}: MockClientConfig<TAdapter, TCache> = {}): MockClient<TAdapter, TCache> {
  if (!adapter.stubs.has("getChainId")) {
    adapter.onGetChainId().resolves(chainId ?? 0);
  }
  return createClient({
    adapter,
    chainId,
    ...config,
  });
}
