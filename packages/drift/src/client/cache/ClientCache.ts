import isMatch from "lodash.ismatch";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type {
  CallParams,
  GetEventsParams,
  ReadParams,
} from "src/adapter/types/Adapter";
import type { Block, BlockIdentifier } from "src/adapter/types/Block";
import type {
  ContractParams,
  ContractReadOptions,
} from "src/adapter/types/Contract";
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
import { LruStore } from "src/store/LruStore";
import type { CacheStore } from "src/store/types";
import { createSerializableKey } from "src/utils/createSerializableKey";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { MaybePromise } from "src/utils/types";

export type ClientCacheConfig<T extends CacheStore = CacheStore> = {
  /**
   * The namespace to use for client operations or a function that returns the
   * namespace.
   */
  namespace: PropertyKey | (() => MaybePromise<PropertyKey>);

  /**
   * The underlying cache implementation. Defaults to an in-memory LRU cache.
   */
  store?: T;
};

/**
 * An extended {@linkcode CacheStore} with additional API methods for use in
 * Drift clients.
 */
export class ClientCache<T extends CacheStore = CacheStore>
  implements CacheStore
{
  namespace: PropertyKey | (() => MaybePromise<PropertyKey>);
  store: T;

  constructor({
    namespace,
    store = new LruStore() as CacheStore as T,
  }: ClientCacheConfig<T>) {
    this.namespace = namespace;
    this.store = store;
  }

  // NOTE: These methods are all async to allow for dynamic namespace
  // resolution and external cache implementations.

  // Namespace //

  async resolveNamespace(): Promise<PropertyKey> {
    if (typeof this.namespace === "function") {
      this.namespace = await this.namespace();
    }
    return this.namespace;
  }

  async createNamespacedKey(
    ...parts: NonNullable<unknown>[]
  ): Promise<SerializableKey> {
    const namespace = await this.resolveNamespace();
    return createSerializableKey([namespace, ...parts]);
  }

  // Block //

  async blockKey(block?: BlockIdentifier): Promise<SerializableKey> {
    return this.createNamespacedKey("block", { block });
  }

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

  // Balance //

  async balanceKey({
    address,
    block,
  }: GetBalanceParams): Promise<SerializableKey> {
    return this.createNamespacedKey("balance", { address, block });
  }

  async preloadBalance({
    value,
    ...params
  }: {
    value: bigint;
  } & GetBalanceParams): Promise<void> {
    const key = await this.balanceKey(params);
    return this.store.set(key, value);
  }

  async invalidateBalance(params: GetBalanceParams): Promise<void> {
    const key = await this.balanceKey(params);
    return this.store.delete(key);
  }

  // Transaction //

  async transactionKey({
    hash,
  }: GetTransactionParams): Promise<SerializableKey> {
    return this.createNamespacedKey("transaction", { hash });
  }

  async preloadTransaction({
    value,
    ...params
  }: {
    value: Transaction;
  } & GetTransactionParams): Promise<void> {
    const key = await this.transactionKey(params);
    return this.store.set(key, value);
  }

  // Transaction Receipt //

  async transactionReceiptKey({
    hash,
  }: GetTransactionParams): Promise<SerializableKey> {
    return this.createNamespacedKey("transactionReceipt", { hash });
  }

  async preloadTransactionReceipt({
    value,
    ...params
  }: {
    value: TransactionReceipt;
  } & GetTransactionParams): Promise<void> {
    const key = await this.transactionReceiptKey(params);
    return this.store.set(key, value);
  }

  // Call //

  async callKey({
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
  }: CallParams): Promise<SerializableKey> {
    return this.createNamespacedKey("call", {
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

  async invalidateCall(params: CallParams): Promise<void> {
    const key = await this.callKey(params);
    return this.store.delete(key);
  }

  async invalidateCallsMatching(params: CallParams): Promise<void> {
    const key = await this.callKey(params);
    return this._deleteMatches(key);
  }

  // Events //

  async eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    address,
    event,
    filter,
    fromBlock = "earliest",
    toBlock = "latest",
  }: GetEventsParams<TAbi, TEventName>): Promise<SerializableKey> {
    return this.createNamespacedKey("events", {
      address,
      event,
      filter,
      fromBlock,
      toBlock,
    });
  }

  async preloadEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    value,
    ...params
  }: {
    value: readonly EventLog<TAbi, TEventName>[];
  } & GetEventsParams<TAbi, TEventName>): Promise<void> {
    const key = await this.eventsKey(params);
    return this.store.set(key, value);
  }

  // Read //

  async partialReadKey<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ address, args, block, fn }: PartialReadParams<TAbi, TFunctionName>) {
    return this.createNamespacedKey("read", {
      address,
      args,
      block,
      fn,
    });
  }

  async readKey<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>) {
    return this.partialReadKey(params as PartialReadParams);
  }

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

  async invalidateRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: ReadParams<TAbi, TFunctionName>): Promise<void> {
    const key = await this.readKey(params);
    return this.store.delete(key);
  }

  async invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(params: PartialReadParams<TAbi, TFunctionName>): Promise<void> {
    const matchKey = await this.partialReadKey(params);
    return this._deleteMatches(matchKey);
  }

  // Store Operations //

  async *entries<T>(): AsyncGenerator<[SerializableKey, T]> {
    for await (const entry of this.store.entries()) {
      yield entry;
    }
  }

  async find<T>(
    predicate: (value: T, key: SerializableKey) => boolean,
  ): Promise<T | undefined> {
    return this.store.find(predicate);
  }

  async has(key: SerializableKey): Promise<boolean> {
    return this.store.has(key);
  }

  async get<T>(key: SerializableKey): Promise<T | undefined> {
    return this.store.get(key);
  }

  async set<T>(key: SerializableKey, value: T): Promise<void> {
    return this.store.set(key, value);
  }

  async delete(key: SerializableKey): Promise<void> {
    return this.store.delete(key);
  }

  async clear(): Promise<void> {
    return this.store.clear();
  }

  // Internal //

  private async _deleteMatches(matchKey: SerializableKey): Promise<void> {
    const operations: MaybePromise<void>[] = [];

    for await (const [key] of this.store.entries()) {
      if (key === matchKey) {
        operations.push(this.store.delete(key));
      } else if (
        typeof key === "object" &&
        typeof matchKey === "object" &&
        isMatch(key, matchKey)
      ) {
        operations.push(this.store.delete(key));
      }
    }

    await Promise.all(operations);
  }
}

// Required due to incompatibility between the conditional `FunctionArgsParam`
// type and `Partial` type.
interface PartialReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi, "pure" | "view"> = FunctionName<
    TAbi,
    "pure" | "view"
  >,
> extends ContractParams<TAbi>,
    ContractReadOptions {
  fn?: TFunctionName;
  args?: FunctionArgs<TAbi, TFunctionName>;
}
