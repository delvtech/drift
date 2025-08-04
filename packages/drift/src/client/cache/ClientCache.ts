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
// biome-ignore lint/correctness/noUnusedImports: Used for JSDoc links
import type { Client } from "src/client/Client";
import { LruStore } from "src/store/LruStore";
import type { Store } from "src/store/Store";
import { deleteMatches } from "src/store/utils/deleteMatches";
import { stringifyKey } from "src/utils/keys";
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
  // resolution and async store implementations.

  /**
   * Clear the entire cache.
   *
   * **Warning**: This operation is not namespaced and will delete everything in
   * the store. This is a full reset.
   */
  async clear(): Promise<void> {
    return this.store.clear();
  }

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
   * Delete a block in the cache to ensure {@linkcode Client.getBlock}
   * re-fetches it when requested.
   */
  async invalidateBlock<T extends BlockIdentifier>(block?: T): Promise<void> {
    const key = await this.blockKey(block);
    return this.store.delete(key);
  }

  /**
   * Delete all blocks in the cache to ensure {@linkcode Client.getBlock}
   * re-fetches them when requested.
   */
  async clearBlocks(): Promise<void> {
    return deleteMatches({
      store: this.store,
      matchKey: this.blockKey(),
    });
  }

  // Balance //

  #partialBalanceKey({ address, block }: Partial<GetBalanceParams> = {}) {
    return this.#createKey("balance", { address, block });
  }

  /**
   * Get the key used to store an account's balance.
   */
  async balanceKey(params: GetBalanceParams): Promise<string> {
    return this.#partialBalanceKey(params);
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
   * Delete an account's balance in the cache to ensure
   * {@linkcode Client.getBalance} re-fetches it when called.
   */
  async invalidateBalance(params: GetBalanceParams): Promise<void> {
    const key = await this.balanceKey(params);
    return this.store.delete(key);
  }

  /**
   * Delete all account balances in the cache to ensure
   * {@linkcode Client.getBalance} re-fetches them when called.
   */
  async clearBalances(): Promise<void> {
    return deleteMatches({
      store: this.store,
      matchKey: this.#partialBalanceKey(),
    });
  }

  // Transaction //

  #partialTransactionKey({ hash }: Partial<GetTransactionParams> = {}) {
    return this.#createKey("transaction", { hash });
  }

  /**
   * Get the key used to store a transaction.
   */
  async transactionKey({ hash }: GetTransactionParams): Promise<string> {
    return this.#partialTransactionKey({ hash });
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
   * Delete a transaction in the cache to ensure
   * {@linkcode Client.getTransaction} re-fetches it when called.
   */
  async invalidateTransaction(params: GetTransactionParams): Promise<void> {
    const key = await this.transactionKey(params);
    return this.store.delete(key);
  }

  /**
   * Delete all transactions in the cache to ensure
   * {@linkcode Client.getTransaction} re-fetches them when called.
   */
  async clearTransactions(): Promise<void> {
    return deleteMatches({
      store: this.store,
      matchKey: this.#partialTransactionKey(),
    });
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

  #partialCallKey({
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
  }: Partial<CallParams> = {}) {
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
   * Get the key used to store a call result.
   */
  async callKey(params: CallParams): Promise<string> {
    return this.#partialCallKey(params);
  }

  /**
   * Add a call result to the cache.
   */
  async preloadCall({
    preloadValue,
    ...params
  }: {
    /**
     * The return value to preload.
     */
    preloadValue: Bytes;
    /**
     * **IMPORTANT**: This is the {@linkcode CallParams.value}, not the return
     * value to preload. Use {@linkcode preloadValue} instead.
     */
    value?: CallParams["value"];
  } & CallParams): Promise<void> {
    const key = await this.callKey(params);
    return this.store.set(key, preloadValue);
  }

  /**
   * Get a cached call result.
   */
  async getCall(params: CallParams): Promise<Bytes | undefined> {
    const key = await this.callKey(params);
    return this.store.get(key);
  }

  /**
   * Delete a call result in the cache to ensure {@linkcode Client.call}
   * re-sends the request when called.
   */
  async invalidateCall(params: CallParams): Promise<void> {
    const key = await this.callKey(params);
    return this.store.delete(key);
  }

  /**
   * Delete all call results in the cache that match partial params to ensure
   * {@linkcode Client.call} re-sends matching requests when called.
   */
  async invalidateCallsMatching(params?: Partial<CallParams>): Promise<void> {
    return deleteMatches({
      store: this.store,
      matchKey: this.#partialCallKey(params),
    });
  }

  /**
   * Delete all call results in the cache to ensure {@linkcode Client.call}
   * re-sends all requests when called.
   */
  async clearCalls(): Promise<void> {
    return this.invalidateCallsMatching();
  }

  // Events //

  /**
   * Get the key used to store an event query.
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
   * Add an event query to the cache.
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
   * Get a cached event query.
   */
  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[] | undefined> {
    const key = await this.eventsKey(params);
    return this.store.get(key);
  }

  // Read //

  #partialReadKey<
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
   * Get the key used to store a read result.
   */
  async readKey<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>): Promise<string> {
    return this.#partialReadKey(params);
  }

  /**
   * Add a read result to the cache.
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
   * Get a cached read result.
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
   * Delete a read result in the cache to ensure {@linkcode Client.read}
   * re-fetches it when called.
   */
  async invalidateRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>): Promise<void> {
    const key = await this.readKey(params);
    return this.store.delete(key);
  }

  /**
   * Delete all read results in the cache that match partial params to ensure
   * {@linkcode Client.read} re-fetches matching reads when called.
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
      matchKey: this.#partialReadKey(params),
    });
  }

  /**
   * Delete all read results in the cache to ensure {@linkcode Client.read}
   * re-fetches them when called.
   */
  async clearReads(): Promise<void> {
    return this.invalidateReadsMatching();
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
