import { MockAdapter } from "src/adapter/MockAdapter";
import type { OxAdapterConfig } from "src/adapter/OxAdapter";
import type { LruSimpleCache } from "src/cache/LruSimpleCache";
import type { SimpleCache } from "src/cache/types";
import {
  type Client,
  type ClientConfig,
  createClient,
} from "src/client/Client";

export type MockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Client<TAdapter, TCache>;

export type MockClientConfig<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Partial<Omit<ClientConfig<TAdapter, TCache>, keyof OxAdapterConfig>>;

export function createMockClient<
  TAdapter extends MockAdapter = MockAdapter,
  TCache extends SimpleCache = LruSimpleCache,
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
