import { OxAdapter, type OxAdapterConfig } from "src/adapter/OxAdapter";
import type {
  Adapter,
  ReadAdapter,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import {
  LruSimpleCache,
  type LruSimpleCacheConfig,
} from "src/cache/LruSimpleCache";
import type { SimpleCache } from "src/cache/types";
import { cachedFn } from "src/cache/utils";
import { ClientCache } from "src/client/cache/ClientCache";
import type { HookRegistry } from "src/client/hooks/HookRegistry";
import {
  type MethodHooks,
  MethodInterceptor,
} from "src/client/hooks/MethodInterceptor";
import type { Eval, Extended, OneOf } from "src/utils/types";

/**
 * A client for interacting with a network through an {@linkcode Adapter} with
 * {@link ClientCache caching} and {@link HookRegistry hooks}.
 */
export type Client<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = TAdapter & {
  adapter: TAdapter;
  cache: ClientCache<TCache>;
  hooks: HookRegistry<MethodHooks<TAdapter>>;
  isReadWrite(): this is Client<ReadWriteAdapter, TCache>;
  extend<T extends Partial<Extended<Client>>>(
    props: T & ThisType<T & Client<TAdapter, TCache>>,
  ): T & Client<TAdapter, TCache>;
};

/**
 * A read-only {@linkcode Client} for fetching data from a network.
 */
export type ReadClient<
  TAdapter extends ReadAdapter = ReadAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Client<TAdapter, TCache>;

/**
 * A read-write {@linkcode Client} with access to a signer.
 */
export type ReadWriteClient<
  TAdapter extends ReadWriteAdapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Client<TAdapter, TCache>;

/**
 * Base options for configuring a {@linkcode Client}.
 */
export interface ClientOptions<TCache extends SimpleCache = SimpleCache> {
  cache?: TCache | LruSimpleCacheConfig;
  chainId?: number;
}

/**
 * Options for configuring the adapter of a {@linkcode Client}.
 */
export type ClientAdapterOptions<T extends Adapter = Adapter> = OneOf<
  | {
      /**
       * The adapter to use for network interactions. The resulting client will
       * extend the adapter's prototype, picking up all of its methods and
       * copying all of its properties.
       */
      adapter?: T;
    }
  | OxAdapterConfig
>;

/**
 * Configuration for creating a {@linkcode Client}.
 */
export type ClientConfig<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = Eval<ClientOptions<TCache> & ClientAdapterOptions<TAdapter>>;

/**
 * Creates a new {@linkcode Client} instance that extends the provided adapter
 * or the default {@linkcode OxAdapter}.
 *
 * @param config - The configuration to use for the client.
 */
export function createClient<
  TAdapter extends Adapter = OxAdapter,
  TCache extends SimpleCache = LruSimpleCache,
>({
  adapter,
  cache,
  chainId,
  ...adapterConfig
}: ClientConfig<TAdapter, TCache> = {}): Client<TAdapter, TCache> {
  adapter ??= new OxAdapter(adapterConfig) as Adapter as TAdapter;
  const interceptor = new MethodInterceptor<TAdapter>();

  // Handle cache config
  if (cache && !("clear" in cache)) {
    cache = new LruSimpleCache(cache) as SimpleCache as TCache;
  }

  // Prepare client properties
  const clientProps: Client<TAdapter, TCache> = {
    ...adapter,
    adapter,
    hooks: interceptor.hooks,
    cache: new ClientCache({
      store: cache,
      namespace: () => clientProps.getChainId(),
    }),

    isReadWrite(): this is Client<ReadWriteAdapter, TCache> {
      return typeof this.adapter.write === "function";
    },

    extend(props) {
      return Object.assign(this, props) as any;
    },

    // Cached methods //

    async getChainId() {
      chainId ??= await adapter.getChainId();
      return chainId;
    },

    getBlock(params) {
      return cachedFn({
        cache: this.cache,
        key: this.cache.blockKey(params),
        fn: () => this.adapter.getBlock(params),
      });
    },

    getBalance(params) {
      return cachedFn({
        cache: this.cache,
        key: this.cache.balanceKey(params),
        fn: () => this.adapter.getBalance(params),
      });
    },

    getTransaction(params) {
      return cachedFn({
        cache: this.cache,
        key: this.cache.transactionKey(params),
        fn: () => this.adapter.getTransaction(params),
      });
    },

    waitForTransaction(params) {
      return cachedFn({
        cache: this.cache,
        key: this.cache.transactionReceiptKey(params),
        fn: () => this.adapter.waitForTransaction(params),
      });
    },

    call(params) {
      return cachedFn({
        cache: this.cache,
        key: this.cache.callKey(params),
        fn: () => this.adapter.call(params),
      });
    },

    getEvents(params) {
      return cachedFn({
        cache: this.cache,
        key: this.cache.eventsKey(params),
        fn: async () => this.adapter.getEvents(params),
      });
    },

    read(params) {
      return cachedFn({
        cache: this.cache,
        key: this.cache.readKey(params),
        fn: () => this.adapter.read(params),
      });
    },
  };

  // Extend the adapter prototype to copy over its methods without calling its
  // constructor. This allows the client to be used as a drop-in replacement for
  // the adapter.
  const adapterPrototype = Object.getPrototypeOf(adapter);
  function Client() {}
  Object.defineProperties(Client, {
    name: {
      value: `Client<${adapter.constructor.name}>`,
      enumerable: false,
      writable: false,
      configurable: true,
    },
  });
  Client.prototype = Object.create(adapterPrototype, {
    constructor: {
      value: Client,
      enumerable: false,
      writable: true,
      configurable: true,
    },
    [Symbol.toStringTag]: {
      value: Client.name,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });

  const client: Client<TAdapter, TCache> = Object.create(
    Client.prototype,
    Object.getOwnPropertyDescriptors(clientProps),
  );

  return interceptor.createProxy(client);
}
