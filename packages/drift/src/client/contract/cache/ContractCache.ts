import type { Abi, Address } from "src/adapter/types/Abi";
import type {
  ContractParams,
  GetEventsOptions,
  GetEventsParams,
  ReadOptions,
  ReadParams,
} from "src/adapter/types/Adapter";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type {
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import {
  ClientCache,
  type ClientCacheOptions,
} from "src/client/cache/ClientCache";
import type { Contract, ContractReadArgs } from "src/client/contract/Contract";
import type { Store } from "src/store/Store";
import type { Eval, OneOf } from "src/utils/types";

export type ContractCacheOptions<
  TAbi extends Abi = Abi,
  TStore extends Store = Store,
> = Eval<
  {
    abi: TAbi;
    address: Address;
  } & OneOf<
    | {
        clientCache: ClientCache<TStore>;
      }
    | ClientCacheOptions<TStore>
  >
>;

/**
 * A cache for Drift {@linkcode Contract} operations.
 */
export class ContractCache<TAbi extends Abi, TStore extends Store = Store> {
  #abi: TAbi;
  #address: Address;
  #clientCache: ClientCache<TStore>;

  constructor({
    abi,
    address,
    ...clientCacheOrOptions
  }: ContractCacheOptions<TAbi, TStore>) {
    const clientCache = clientCacheOrOptions.clientCache
      ? clientCacheOrOptions.clientCache
      : new ClientCache(clientCacheOrOptions);
    this.#abi = abi;
    this.#address = address;
    this.#clientCache = clientCache;
  }

  get store() {
    return this.#clientCache.store;
  }

  /**
   * Clear the entire cache.
   *
   * **Warning**: This operation is not scoped to the contract and will delete
   * everything in the store. This is a full reset.
   */
  clear() {
    return this.#clientCache.clear();
  }

  // Events //

  /**
   * Get the key used to store an event query.
   */
  eventsKey<TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: GetEventsOptions<TAbi, TEventName>,
  ) {
    return this.#clientCache.eventsKey({
      abi: this.#abi,
      address: this.#address,
      event,
      ...options,
    });
  }

  /**
   * Add an event query to the cache.
   */
  preloadEvents<TEventName extends EventName<TAbi>>(
    params: Omit<
      GetEventsParams<TAbi, TEventName>,
      keyof ContractParams<TAbi>
    > & {
      value: readonly EventLog<TAbi, TEventName>[];
    },
  ) {
    return this.#clientCache.preloadEvents({
      abi: this.#abi,
      address: this.#address,
      ...params,
    });
  }

  /**
   * Get a cached event query.
   */
  getEvents<TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: GetEventsOptions<TAbi, TEventName>,
  ) {
    return this.#clientCache.getEvents({
      abi: this.#abi,
      address: this.#address,
      event,
      ...options,
    });
  }

  // Read //

  /**
   * Get the key used to store a read result.
   */
  readKey<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ) {
    return this.#clientCache.readKey({
      abi: this.#abi,
      address: this.#address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...options,
    });
  }

  /**
   * Add a read result to the cache.
   */
  preloadRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    params: Omit<
      ReadParams<TAbi, TFunctionName>,
      keyof ContractParams<TAbi>
    > & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ) {
    return this.#clientCache.preloadRead({
      abi: this.#abi as Abi,
      address: this.#address,
      ...params,
    });
  }

  /**
   * Get a cached read result.
   */
  getRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ) {
    return this.#clientCache.getRead({
      abi: this.#abi,
      address: this.#address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...options,
    });
  }

  /**
   * Delete a read result in the cache to ensure {@linkcode Contract.read}
   * re-fetches it when called.
   */
  invalidateRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ) {
    return this.#clientCache.invalidateRead({
      abi: this.#abi,
      address: this.#address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...options,
    });
  }

  /**
   * Delete all read results in the cache for this contract that match partial
   * params to ensure {@linkcode Client.read} re-fetches matching reads when
   * called.
   */
  invalidateReadsMatching<
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    fn?: TFunctionName,
    args?: Partial<FunctionArgs<TAbi, TFunctionName>>,
    options?: ReadOptions,
  ) {
    return this.#clientCache.invalidateReadsMatching({
      abi: this.#abi,
      address: this.#address,
      fn,
      args,
      ...options,
    } as ReadParams);
  }

  /**
   * Delete all read results in the cache for this contract to ensure
   * {@linkcode Contract.read} re-fetches them when called.
   */
  async clearReads(): Promise<void> {
    return this.#clientCache.invalidateReadsMatching({
      abi: this.#abi as Abi,
      address: this.#address,
    });
  }
}
