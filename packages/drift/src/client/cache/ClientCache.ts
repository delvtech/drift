import type { Abi, Bytes } from "src/adapter/types/Abi";
import type {
  CallParams,
  GetEventsParams,
  ReadParams,
} from "src/adapter/types/Adapter";
import type { Block, BlockIdentifier } from "src/adapter/types/Block";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type {
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetTransactionParams,
} from "src/adapter/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import type { Client } from "src/client/Client";
import { LruStore } from "src/store/LruStore";
import type { Store } from "src/store/types";
import { deleteMatches } from "src/store/utils/deleteMatches";
import { stringifyKey } from "src/utils/stringifyKey";
import type { MaybePromise, Replace } from "src/utils/types";

export type ClientCacheOptions<T extends Store = Store> = {
  /**
   * The namespace to use for client operations or a function that returns the
   * namespace.
   */
  namespace: PropertyKey | (() => MaybePromise<PropertyKey>);

  /**
   * The underlying cache implementation.
   *
   * @default
   * // in-memory Least Recently Used (LRU) cache
   * new LruStore()
   *
   * @see {@linkcode LruStore}
   */
  store?: T;
};

/**
 * A cache for drift {@linkcode Client} operations.
 */
export class ClientCache<T extends Store = Store> {
  namespace: ClientCacheOptions["namespace"];
  store: T;

  constructor({
    namespace,
    store = new LruStore() as unknown as T,
  }: ClientCacheOptions<T>) {
    this.namespace = namespace;
    this.store = store;
  }

  // NOTE: These methods are all async to accommodate dynamic namespace
  // resolution and external cache implementations.

  // Block //

  /**
   * Get the key used to store a block.
   */
  async blockKey(block?: BlockIdentifier): Promise<string> {
    return this.#createKey("block", { block });
  }

  /**
   * Add a block to the cache.
   */
  async preloadBlock<T extends BlockIdentifier>({
    value,
    block,
  }: {
    block?: T;
    value: Block<T>;
  }): Promise<void> {
    const key = await this.blockKey(block);
    return this.store.set(key, value);
  }

  /**
   * Get a cached block.
   */
  async getBlock<T extends BlockIdentifier>(
    block?: T,
  ): Promise<Block<T> | undefined> {
    const key = await this.blockKey(block);
    return this.store.get(key);
  }

  /**
   * Delete a block from the cache.
   */
  async invalidateBlock<T extends BlockIdentifier>(block?: T): Promise<void> {
    const key = await this.blockKey(block);
    return this.store.delete(key);
  }

  // Balance //

  /**
   * Get the key used to store an account's balance.
   */
  async balanceKey({ address, block }: GetBalanceParams): Promise<string> {
    return this.#createKey("balance", { address, block });
  }

  /**
   * Add an account's balance to the cache.
   */
  async preloadBalance({
    value,
    ...params
  }: {
    value: bigint;
  } & GetBalanceParams): Promise<void> {
    const key = await this.balanceKey(params);
    return this.store.set(key, value);
  }

  /**
   * Get the cached balance for an account.
   */
  async getBalance(params: GetBalanceParams): Promise<bigint | undefined> {
    const key = await this.balanceKey(params);
    return this.store.get(key);
  }

  /**
   * Delete an account's balance from the cache.
   */
  async invalidateBalance(params: GetBalanceParams): Promise<void> {
    const key = await this.balanceKey(params);
    return this.store.delete(key);
  }

  // Transaction //

  /**
   * Get the key used to store a transaction.
   */
  async transactionKey({ hash }: GetTransactionParams): Promise<string> {
    return this.#createKey("transaction", { hash });
  }

  /**
   * Add a transaction to the cache.
   */
  async preloadTransaction({
    value,
    ...params
  }: {
    value: Transaction;
  } & GetTransactionParams): Promise<void> {
    const key = await this.transactionKey(params);
    return this.store.set(key, value);
  }

  /**
   * Get a cached transaction.
   */
  async getTransaction(
    params: GetTransactionParams,
  ): Promise<Transaction | undefined> {
    const key = await this.transactionKey(params);
    return this.store.get(key);
  }

  /**
   * Delete a transaction from the cache.
   */
  async invalidateTransaction(params: GetTransactionParams): Promise<void> {
    const key = await this.transactionKey(params);
    return this.store.delete(key);
  }

  // Transaction Receipt //

  /**
   * Get the key used to store a transaction receipt.
   */
  async transactionReceiptKey({ hash }: GetTransactionParams): Promise<string> {
    return this.#createKey("transactionReceipt", { hash });
  }

  /**
   * Add a transaction receipt to the cache.
   */
  async preloadTransactionReceipt({
    value,
    ...params
  }: {
    value: TransactionReceipt;
  } & GetTransactionParams): Promise<void> {
    const key = await this.transactionReceiptKey(params);
    return this.store.set(key, value);
  }

  /**
   * Get a cached transaction receipt.
   */
  async getTransactionReceipt(
    params: GetTransactionParams,
  ): Promise<Transaction | undefined> {
    const key = await this.transactionReceiptKey(params);
    return this.store.get(key);
  }

  // Call //

  /**
   * Get a partial key used to store a call return.
   */
  async partialCallKey({
    to,
    data,
    value,
    from,
    block,
    accessList,
    blobVersionedHashes,
    chainId,
    blobs,
    bytecode,
    nonce,
  }: Partial<CallParams> = {}): Promise<string> {
    return this.#createKey("call", {
      to,
      data,
      value,
      from,
      block,
      accessList,
      blobVersionedHashes,
      chainId,
      blobs,
      bytecode,
      nonce,
    });
  }

  /**
   * Get the key used to store a {@linkcode Client.call} return.
   */
  async callKey(params: CallParams): Promise<string> {
    return this.partialCallKey(params);
  }

  /**
   * Add a {@linkcode Client.call} return to the cache.
   */
  async preloadCall({
    preloadValue,
    ...params
  }: {
    preloadValue: Bytes;
    /**
     * **IMPORTANT**: This is the `value` from the {@linkcode CallParams}, not
     * the value to preload. Use `preloadValue` instead.
     */
    value?: CallParams["value"];
  } & CallParams): Promise<void> {
    const key = await this.callKey(params);
    return this.store.set(key, preloadValue);
  }

  /**
   * Get a cached {@linkcode Client.call} return.
   */
  async getCall(params: CallParams): Promise<Bytes | undefined> {
    const key = await this.callKey(params);
    return this.store.get(key);
  }

  /**
   * Delete a {@linkcode Client.call} return from the cache.
   */
  async invalidateCall(params: CallParams): Promise<void> {
    const key = await this.callKey(params);
    return this.store.delete(key);
  }

  /**
   * Delete all {@linkcode Client.call} returns from the cache that match
   * partial params.
   */
  async invalidateCallsMatching(params?: Partial<CallParams>): Promise<void> {
    return deleteMatches({
      store: this.store,
      matchKey: this.partialCallKey(params),
    });
  }

  // Events //

  /**
   * Get the key used to store event logs from {@linkcode Client.getEvents}.
   */
  async eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    address,
    event,
    filter,
    fromBlock = "earliest",
    toBlock = "latest",
  }: GetEventsParams<TAbi, TEventName>): Promise<string> {
    return this.#createKey("events", {
      address,
      event,
      filter,
      fromBlock,
      toBlock,
    });
  }

  /**
   * Add event logs to the cache for {@linkcode Client.getEvents}.
   */
  async preloadEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    value,
    ...params
  }: {
    value: readonly EventLog<TAbi, TEventName>[];
  } & GetEventsParams<TAbi, TEventName>): Promise<void> {
    const key = await this.eventsKey(params);
    return this.store.set(key, value);
  }

  /**
   * Get cached event logs from {@linkcode Client.getEvents}.
   */
  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[] | undefined> {
    const key = await this.eventsKey(params);
    return this.store.get(key);
  }

  // Read //

  /**
   * Get a partial key used to store a {@linkcode Client.read} return.
   */
  async partialReadKey<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    {
      address,
      args,
      block,
      fn,
    }: Replace<
      Partial<ReadParams<TAbi, TFunctionName>>,
      { args?: Partial<FunctionArgs<TAbi, TFunctionName>> }
    > = {} as any,
  ) {
    return this.#createKey("read", {
      address,
      args,
      block,
      fn,
    });
  }

  /**
   * Get the key used to store a {@linkcode Client.read} return.
   */
  async readKey<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>) {
    return this.partialReadKey(params);
  }

  /**
   * Add a {@linkcode Client.read} return to the cache.
   */
  async preloadRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({
    value,
    ...params
  }: {
    value: FunctionReturn<TAbi, TFunctionName>;
  } & ReadParams<TAbi, TFunctionName>): Promise<void> {
    const key = await this.readKey(params as ReadParams);
    return this.store.set(key, value);
  }

  /**
   * Get a cached {@linkcode Client.read} return.
   */
  async getRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName> | undefined> {
    const key = await this.readKey(params);
    return this.store.get(key);
  }

  /**
   * Delete a {@linkcode Client.read} return from the cache.
   */
  async invalidateRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>): Promise<void> {
    const key = await this.readKey(params);
    return this.store.delete(key);
  }

  /**
   * Delete all {@linkcode Client.read} returns from the cache that match
   * partial params.
   */
  async invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params?: Replace<
      Partial<ReadParams<TAbi, TFunctionName>>,
      { args?: Partial<FunctionArgs<TAbi, TFunctionName>> }
    >,
  ): Promise<void> {
    return deleteMatches({
      store: this.store,
      matchKey: this.partialReadKey(params),
    });
  }

  /**
   * Clear the entire cache.
   */
  async clear(): Promise<void> {
    return this.store.clear();
  }

  // Internal //

  async #resolveNamespace(): Promise<PropertyKey> {
    if (typeof this.namespace === "function") {
      this.namespace = await this.namespace();
    }
    return this.namespace;
  }

  async #createKey(...parts: NonNullable<unknown>[]): Promise<string> {
    const namespace = await this.#resolveNamespace();
    return stringifyKey([namespace, ...parts]);
  }
}
