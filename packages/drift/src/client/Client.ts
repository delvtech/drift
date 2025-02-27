import { OxAdapter, type OxAdapterConfig } from "src/adapter/OxAdapter";
import type {
  Adapter,
  ReadAdapter,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { Block, BlockIdentifier } from "src/adapter/types/Block";
import {
  LruSimpleCache,
  type LruSimpleCacheConfig,
} from "src/cache/LruSimpleCache";
import type { SimpleCache } from "src/cache/types";
import { cachedFn } from "src/cache/utils";
import { ClientCache } from "src/client/cache/ClientCache";
import { BlockNotFoundError } from "src/client/errors";
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
  TExtension extends object = {},
> = {
  adapter: TAdapter;
  cache: ClientCache<TCache>;
  hooks: HookRegistry<MethodHooks<TAdapter>> &
    // Intersect with the default adapter to avoid type errors in generic
    // contexts where the keys of the adapter are unknown.
    HookRegistry<MethodHooks<Adapter>>;
  isReadWrite(): this is Client<ReadWriteAdapter>;
  extend<T extends object>(
    props: Extended<
      // Using distributive conditional types here ensures that T is inferred as
      // all properties not present by default on the Client, which when
      // intersected with Client<TAdapter, TCache, TExtension> results in the
      // full expected return type. This is necessary to correctly infer the
      // required props and return type on a dynamic interface.
      T extends any ? Omit<T, keyof Client | keyof TExtension> : T
    > &
      Partial<Client & TExtension> &
      ThisType<Client<TAdapter, TCache, TExtension & T>>,
  ): Client<TAdapter, TCache, Eval<TExtension & T>>;
  getBlockOrThrow<T extends BlockIdentifier | undefined>(
    block?: T,
  ): Promise<Block<T>>;
} & TAdapter &
  TExtension;

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
export interface ClientOptions<T extends SimpleCache = SimpleCache> {
  // Accept LRU config if LRU can be assigned to TCache
  cache?: LruSimpleCache extends T ? T | LruSimpleCacheConfig : T;
  chainId?: number;
}

/**
 * Options for configuring the {@linkcode Adapter} of a {@linkcode Client}.
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
 * Configuration options for creating a {@linkcode Client}.
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
  adapter: maybeAdapter,
  cache: cacheOrConfig,
  chainId,
  ...adapterConfig
}: ClientConfig<TAdapter, TCache> = {}): Client<TAdapter, TCache> {
  const interceptor = new MethodInterceptor<TAdapter>();

  // Handle adapter config
  const adapter = (maybeAdapter || new OxAdapter(adapterConfig)) as TAdapter;

  // Handle cache config
  const isCache = cacheOrConfig && "clear" in cacheOrConfig;
  const cache = (
    isCache ? cacheOrConfig : new LruSimpleCache(cacheOrConfig)
  ) as TCache;

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

    async getBlockOrThrow<T extends BlockIdentifier | undefined>(
      blockId?: T,
    ): Promise<Block<T>> {
      const block = await this.getBlock(blockId);
      if (!block) {
        throw new BlockNotFoundError(blockId);
      }
      return block as Block<T>;
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

    getEvents({ fromBlock = "earliest", toBlock = "latest", ...restParams }) {
      const params = { fromBlock, toBlock, ...restParams };
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

/**
 * Get the {@linkcode ClientConfig} type for a given {@linkcode Client} type.
 */
export type ClientConfigType<TClient extends Client> = ClientConfig<
  TClient["adapter"],
  TClient["cache"]["store"]
>;
