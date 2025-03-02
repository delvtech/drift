import { OxAdapter, type OxAdapterConfig } from "src/adapter/OxAdapter";
import type {
  Adapter,
  ReadAdapter,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { Block, BlockIdentifier } from "src/adapter/types/Block";
import { ClientCache } from "src/client/cache/ClientCache";
import { BlockNotFoundError } from "src/client/errors";
import type { HookRegistry } from "src/client/hooks/HookRegistry";
import {
  type MethodHooks,
  MethodInterceptor,
} from "src/client/hooks/MethodInterceptor";
import { LruStore, type LruStoreConfig } from "src/store/LruStore";
import type { Store } from "src/store/types";
import { getOrSet } from "src/store/utils";
import type { Eval, Extended, OneOf } from "src/utils/types";

/**
 * A client for interacting with a network through an {@linkcode Adapter} with
 * {@link ClientCache caching} and {@link HookRegistry hooks}.
 */
export type Client<
  TAdapter extends Adapter = Adapter,
  TStore extends Store = Store,
  TExtension extends object = {},
> = {
  adapter: TAdapter;
  cache: ClientCache<TStore>;
  hooks: HookRegistry<MethodHooks<TAdapter>> &
    // Intersect with the default adapter to avoid type errors in generic
    // contexts where the keys of the adapter are unknown.
    HookRegistry<MethodHooks<Adapter>>;
  isReadWrite(): this is Client<ReadWriteAdapter>;
  extend<T extends object>(
    props: Extended<
      // Using distributive conditional types here ensures that T is inferred as
      // all properties not present by default on the Client, which when
      // intersected with Client<TAdapter, TStore, TExtension> results in the
      // full expected return type. This is necessary to correctly infer the
      // required props and return type on a dynamic interface.
      T extends any ? Omit<T, keyof Client | keyof TExtension> : T
    > &
      Partial<Client & TExtension> &
      ThisType<Client<TAdapter, TStore, TExtension & T>>,
  ): Client<TAdapter, TStore, Eval<TExtension & T>>;
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
  TStore extends Store = Store,
> = Client<TAdapter, TStore>;

/**
 * A read-write {@linkcode Client} with access to a signer.
 */
export type ReadWriteClient<
  TAdapter extends ReadWriteAdapter = ReadWriteAdapter,
  TStore extends Store = Store,
> = Client<TAdapter, TStore>;

/**
 * Base options for configuring a {@linkcode Client}.
 */
export interface ClientOptions<T extends Store = Store> {
  // Accept LRU config if LRU can be assigned to T
  store?: LruStore extends T ? T | LruStoreConfig : T;
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
  TStore extends Store = Store,
> = Eval<ClientOptions<TStore> & ClientAdapterOptions<TAdapter>>;

/**
 * Creates a new {@linkcode Client} instance that extends the provided adapter
 * or the default {@linkcode OxAdapter}.
 *
 * @param config - The configuration to use for the client.
 */
export function createClient<
  TAdapter extends Adapter = OxAdapter,
  TStore extends Store = LruStore,
>({
  adapter: maybeAdapter,
  store: storeOrConfig,
  chainId,
  ...adapterConfig
}: ClientConfig<TAdapter, TStore> = {}): Client<TAdapter, TStore> {
  const interceptor = new MethodInterceptor<TAdapter>();

  // Handle adapter config
  const adapter = (maybeAdapter || new OxAdapter(adapterConfig)) as TAdapter;

  // Handle cache config
  const isConfig = !storeOrConfig || !("clear" in storeOrConfig);
  const store = (
    isConfig ? new LruStore(storeOrConfig) : storeOrConfig
  ) as TStore;

  // Prepare client properties
  const clientProps: Client<TAdapter, TStore> = {
    ...adapter,
    adapter,
    hooks: interceptor.hooks,
    cache: new ClientCache({
      store,
      namespace: () => clientProps.getChainId(),
    }),

    isReadWrite(): this is Client<ReadWriteAdapter, TStore> {
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
      return getOrSet({
        store: this.cache,
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
      return getOrSet({
        store: this.cache,
        key: this.cache.balanceKey(params),
        fn: () => this.adapter.getBalance(params),
      });
    },

    getTransaction(params) {
      return getOrSet({
        store: this.cache,
        key: this.cache.transactionKey(params),
        fn: () => this.adapter.getTransaction(params),
      });
    },

    waitForTransaction(params) {
      return getOrSet({
        store: this.cache,
        key: this.cache.transactionReceiptKey(params),
        fn: () => this.adapter.waitForTransaction(params),
      });
    },

    call(params) {
      return getOrSet({
        store: this.cache,
        key: this.cache.callKey(params),
        fn: () => this.adapter.call(params),
      });
    },

    getEvents({ fromBlock = "earliest", toBlock = "latest", ...restParams }) {
      const params = { fromBlock, toBlock, ...restParams };
      return getOrSet({
        store: this.cache,
        key: this.cache.eventsKey(params),
        fn: async () => this.adapter.getEvents(params),
      });
    },

    read(params) {
      return getOrSet({
        store: this.cache,
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

  const client: Client<TAdapter, TStore> = Object.create(
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
