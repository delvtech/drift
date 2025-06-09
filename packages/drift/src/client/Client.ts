import {
  DefaultAdapter,
  type DefaultAdapterOptions,
} from "src/adapter/DefaultAdapter";
import type {
  Adapter,
  MulticallCallResult,
  MulticallCalls,
  ReadParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { Block, BlockIdentifier } from "src/adapter/types/Block";
import type { GetBlockReturn } from "src/adapter/types/Network";
import { ClientCache } from "src/client/cache/ClientCache";
import { BlockNotFoundError } from "src/client/errors";
import type { HookRegistry } from "src/client/hooks/HookRegistry";
import {
  type MethodHooks,
  MethodInterceptor,
} from "src/client/hooks/MethodInterceptor";
import { LruStore, type LruStoreOptions } from "src/store/LruStore";
import type { Store } from "src/store/Store";
import { getOrSet } from "src/store/utils/getOrSet";
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
  /**
   * The {@linkcode Adapter} used by the client for network interactions.
   */
  adapter: TAdapter;

  /**
   * A cache for storing responses from the adapter using the provided
   * {@linkcode Store}.
   */
  cache: ClientCache<TStore>;

  /**
   * Hooks for intercepting and modifying method calls or responses on the
   * client.
   */
  hooks: HookRegistry<MethodHooks<TAdapter & TExtension>> &
    // Intersect with default Adapter hooks to ensure autocomplete works in
    // generic contexts where TAdapter isn't resolved to a specific type.
    HookRegistry<MethodHooks<Adapter>>;

  /**
   * Returns `true` if the client can send transactions.
   */
  isReadWrite(): this is Client<ReadWriteAdapter, TStore, TExtension>;

  /**
   * Extends the client with additional properties.
   */
  extend<T extends object>(
    props: Extended<
      // Using distributive conditional types here ensures that T is inferred as
      // all properties not present by default on the Client, which when
      // intersected with Client<TAdapter, TStore, TExtension> results in the
      // full expected return type. This is necessary to correctly infer the
      // required props and return type on a dynamic interface.
      T extends T ? Omit<T, keyof Client | keyof TExtension> : T
    > &
      Partial<Client & TExtension> &
      ThisType<Client<TAdapter, TStore, TExtension & T>>,
  ): Client<TAdapter, TStore, Eval<TExtension & T>>;

  getBlock<
    T extends BlockIdentifier | undefined = undefined,
    TOptions extends GetBlockOptions = {},
  >(
    block?: T,
    options?: Eval<GetBlockOptions & TOptions>,
  ): Promise<GetBlockWithOptionsReturn<T, TOptions>>;
} & TAdapter &
  TExtension;

export interface GetBlockOptions {
  /**
   * Whether to throw a {@linkcode BlockNotFoundError} if the block isn't found.
   * Setting this to true will remove `undefined` from the return type.
   * @default false
   */
  throws?: boolean;
}

/**
 * The awaited return type of a {@linkcode Client.getBlock} call considering the
 * provided {@linkcode BlockIdentifier} and {@linkcode GetBlockOptions}.
 */
export type GetBlockWithOptionsReturn<
  T extends BlockIdentifier | undefined = undefined,
  TOptions extends GetBlockOptions = {},
> = TOptions extends { throws: true } ? Block<T> : GetBlockReturn<T>;

/**
 * Configuration options for creating a {@linkcode Client}.
 */
export type ClientOptions<
  TAdapter extends Adapter = Adapter,
  TStore extends Store = Store,
> = Eval<
  OneOf<
    | {
        /**
         * The adapter to use for network interactions. The resulting client will
         * extend the adapter's prototype, inheriting all of its methods and
         * copying all of its properties.
         */
        adapter?: TAdapter;
      }
    | DefaultAdapterOptions
  > & {
    // Accept LRU config if LRU can be assigned to TStore
    store?: LruStore extends TStore ? TStore | LruStoreOptions : TStore;

    /**
     * The chain ID to use for the client. Fetched from the adapter by default.
     */
    chainId?: number;
  }
>;

/**
 * Creates a new {@linkcode Client} instance that extends the provided adapter
 * or the default {@linkcode DefaultAdapter}.
 *
 * @param config - The configuration to use for the client.
 */
export function createClient<
  TAdapter extends Adapter = DefaultAdapter,
  TStore extends Store = LruStore,
>(options: ClientOptions<TAdapter, TStore> = {}): Client<TAdapter, TStore> {
  let {
    adapter: maybeAdapter,
    store: storeOrOptions,
    chainId,
    ...adapterOptions
  } = options;
  const interceptor = new MethodInterceptor<TAdapter>();

  // Handle adapter options
  const adapter = (maybeAdapter ||
    new DefaultAdapter(adapterOptions)) as TAdapter;

  // Handle cache options
  const isInstance = storeOrOptions && "clear" in storeOrOptions;
  const store = (
    isInstance ? storeOrOptions : new LruStore(storeOrOptions)
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

    async getBlock(blockId?: BlockIdentifier, options?: GetBlockOptions) {
      const block = await getOrSet({
        store: this.cache.store,
        key: this.cache.blockKey(blockId),
        fn: () => this.adapter.getBlock(blockId),
      });
      if (!block && options?.throws) {
        throw new BlockNotFoundError(blockId);
      }
      return block;
    },

    getBalance(params) {
      return getOrSet({
        store: this.cache.store,
        key: this.cache.balanceKey(params),
        fn: () => this.adapter.getBalance(params),
      });
    },

    getTransaction(params) {
      return getOrSet({
        store: this.cache.store,
        key: this.cache.transactionKey(params),
        fn: () => this.adapter.getTransaction(params),
      });
    },

    waitForTransaction(params) {
      return getOrSet({
        store: this.cache.store,
        key: this.cache.transactionReceiptKey(params),
        fn: () => this.adapter.waitForTransaction(params),
      });
    },

    call(params) {
      return getOrSet({
        store: this.cache.store,
        key: this.cache.callKey(params),
        fn: () => this.adapter.call(params),
      });
    },

    async multicall({ calls, ...options }) {
      const uncachedCallIndices = new Map<number, number>();
      const unCachedCalls: MulticallCalls = [];

      // Check the cache for each call to ensure we only fetch uncached calls.
      const finalResults: unknown[] = await Promise.all(
        calls.map(async (call, i) => {
          const cached = await this.cache.getRead({
            ...call,
            block: options?.block,
          });
          if (cached !== undefined) {
            return options.allowFailure === false
              ? cached
              : ({
                  success: true,
                  value: cached,
                } satisfies MulticallCallResult);
          }
          uncachedCallIndices.set(i, unCachedCalls.length);
          unCachedCalls.push(call);
          return undefined;
        }),
      );

      if (!unCachedCalls.length) return finalResults;

      const fetched = await this.adapter.multicall({
        calls: unCachedCalls,
        ...options,
      });

      // Merge cached results with fetched results and return in the same order.
      return Promise.all(
        finalResults.map(async (cachedResult, i) => {
          // If the value was cached, return it directly.
          if (cachedResult !== undefined) return cachedResult;

          const index = uncachedCallIndices.get(i)!;
          const { abi, address, fn, args } = unCachedCalls[index]!;
          const fetchedResult = fetched[index]!;
          let fetchedValue: unknown;

          if (options.allowFailure === false) {
            fetchedValue = fetchedResult;
          } else {
            fetchedValue = (fetchedResult as MulticallCallResult).value;
          }

          // Cache the newly fetched value.
          if (fetchedValue !== undefined) {
            await this.cache.preloadRead({
              abi,
              address,
              fn,
              args,
              block: options?.block,
              value: fetchedValue,
            } as ReadParams & {
              value: unknown;
            });
          }

          return fetchedResult;
        }),
      );
    },

    getEvents({ fromBlock = "earliest", toBlock = "latest", ...restParams }) {
      const params = { fromBlock, toBlock, ...restParams };
      return getOrSet({
        store: this.cache.store,
        key: this.cache.eventsKey(params),
        fn: async () => this.adapter.getEvents(params),
      });
    },

    read(params) {
      return getOrSet({
        store: this.cache.store,
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
