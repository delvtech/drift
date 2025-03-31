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
import type { Store } from "src/store/types";
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

  // NOTE: These methods are all async to accommodate dynamic namespace
  // resolution and external cache implementations.

  // Events //

  /**
   * Get the key used to store event logs from {@linkcode Contract.getEvents}.
   */
  async eventsKey<TEventName extends EventName<TAbi>>(
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
   * Add event logs to the cache for {@linkcode Contract.getEvents}.
   */
  async preloadEvents<TEventName extends EventName<TAbi>>(
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
   * Get cached event logs from {@linkcode Contract.getEvents}.
   */
  async getEvents<TEventName extends EventName<TAbi>>(
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
   * Get a partial key used to store a {@linkcode Contract.read read} return.
   */
  partialReadKey<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ReadOptions,
  ) {
    return this.#clientCache.partialReadKey({
      abi: this.#abi,
      address: this.#address,
      fn,
      args,
      ...options,
    } as ReadParams);
  }

  /**
   * Get the key used to store a {@linkcode Contract.read read} return.
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
   * Add a {@linkcode Contract.read read} return to the cache.
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
   * Get a cached {@linkcode Contract.read read} return.
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
   * Delete a {@linkcode Contract.read read} return from the cache.
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
   * Delete all {@linkcode Contract.read} returns from the cache that match
   * partial params.
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
   * Clear the entire cache.
   */
  clear() {
    return this.#clientCache.clear();
  }
}
