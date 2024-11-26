import type { Abi } from "abitype";
import isMatch from "lodash.ismatch";
import { OxAdapter, type OxAdapterConfig } from "src/adapter/OxAdapter";
import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  Adapter,
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadAdapter,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockParams,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import {
  LruSimpleCache,
  type LruSimpleCacheConfig,
} from "src/cache/LruSimpleCache";
import type { SimpleCache } from "src/cache/types";
import { DriftError } from "src/error/DriftError";
import {
  type SerializableKey,
  createSerializableKey,
} from "src/utils/createSerializableKey";
import type { OneOf, Pretty } from "src/utils/types";

export type ClientConfig<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = Pretty<ClientAdapterOptions<TAdapter> & ClientCacheOptions<TCache>>;

export type ReadClient<
  TAdapter extends ReadAdapter = ReadAdapter,
  TCache extends SimpleCache = SimpleCache,
> = BaseClient<TAdapter, TCache>;

export type ReadWriteClient<
  TAdapter extends ReadWriteAdapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
> = BaseClient<TAdapter, TCache>;

/**
 * A client for interacting with a network through an adapter and cache.
 *
 * This class is not intended for direct use in apps, but rather as a base class
 * for other clients.
 */
// TODO: Consider using a similar pattern as the `StubStore` for the cache or
// implement a generalized plugins/hooks layer that can be used by the cache
// operations and other plugins.
export class BaseClient<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> {
  adapter: TAdapter;
  cache: TCache;
  protected _id?: PropertyKey;

  constructor({
    adapter,
    cache,
    id,
    ...adapterConfig
  }: ClientConfig<TAdapter, TCache> = {}) {
    this.adapter =
      adapter ?? (new OxAdapter(adapterConfig) as Adapter as TAdapter);

    if (cache && "clear" in cache) {
      this.cache = cache;
    } else {
      const { max = 500, ...rest } = cache ?? {};
      this.cache = new LruSimpleCache({
        max,
        ...rest,
      }) as SimpleCache as TCache;
    }

    this._id = id;
  }

  isReadWrite(): this is BaseClient<ReadWriteAdapter, TCache> {
    return typeof this.adapter.write === "function";
  }

  /**
   * Ensures the id is set, fetching the chain id as a fallback.
   */
  async getId(): Promise<PropertyKey> {
    if (typeof this._id !== "undefined") return this._id;

    // NOTE: It's important that the chain id is fetched directly from the
    // adapter and the id is set before calling preloadChainId to avoid
    // infinite loops from re-entering key generation.
    const chainId = await this.adapter.getChainId();
    this._id = chainId;
    this.preloadChainId(chainId);

    return this._id;
  }

  // Chain ID //

  async chainIdKey(): Promise<SerializableKey> {
    const id = await this.getId();
    return createSerializableKey([id, "chainId"]);
  }

  async preloadChainId(value: number) {
    const key = await this.chainIdKey();
    return this.cache.set(key, value);
  }

  /**
   * Get the chain ID of the network.
   */
  async getChainId(): Promise<number> {
    return this._cachedCallback({
      key: await this.chainIdKey(),
      callback: this.adapter.getChainId,
    });
  }

  // Block //

  /**
   * Get the current block number.
   */
  async getBlockNumber(): Promise<bigint> {
    return this.adapter.getBlockNumber();
  }

  async blockKey({
    blockHash,
    blockNumber,
    blockTag,
  }: GetBlockParams = {}): Promise<SerializableKey> {
    const id = await this.getId();
    return createSerializableKey([
      id,
      "block",
      { blockHash, blockNumber, blockTag },
    ]);
  }

  async preloadBlock({
    value,
    ...params
  }: {
    value: Block;
  } & GetBlockParams): Promise<void> {
    const key = await this.blockKey(params);
    return this.cache.set(key, value);
  }

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  async getBlock(params?: GetBlockParams): Promise<Block | undefined> {
    return this._cachedCallback({
      key: await this.blockKey(params),
      callback: () => this.adapter.getBlock(params),
    });
  }

  // Balance //

  async balanceKey({
    address,
    block,
  }: GetBalanceParams): Promise<SerializableKey> {
    const id = await this.getId();
    return createSerializableKey([id, "balance", { address, block }]);
  }

  async preloadBalance({
    value,
    ...params
  }: {
    value: bigint;
  } & GetBalanceParams): Promise<void> {
    const key = await this.balanceKey(params);
    return this.cache.set(key, value);
  }

  /**
   * Get the balance of native currency for an account.
   */
  async getBalance(params: GetBalanceParams): Promise<bigint> {
    return this._cachedCallback({
      key: await this.balanceKey(params),
      callback: () => this.adapter.getBalance(params),
    });
  }

  async invalidateBalance(params: GetBalanceParams): Promise<void> {
    const key = await this.balanceKey(params);
    return this.cache.delete(key);
  }

  // Transaction //

  async transactionKey({
    hash,
  }: GetTransactionParams): Promise<SerializableKey> {
    const id = await this.getId();
    return createSerializableKey([id, "transaction", { hash }]);
  }

  async preloadTransaction({
    value,
    ...params
  }: {
    value: Transaction;
  } & GetTransactionParams): Promise<void> {
    const key = await this.transactionKey(params);
    return this.cache.set(key, value);
  }

  /**
   * Get a transaction from a transaction hash.
   */
  async getTransaction(
    params: GetTransactionParams,
  ): Promise<Transaction | undefined> {
    return this._cachedCallback({
      key: await this.transactionKey(params),
      callback: () => this.adapter.getTransaction(params),
    });
  }

  // Transaction receipt //

  async transactionReceiptKey({
    hash,
  }: GetTransactionParams): Promise<SerializableKey> {
    const id = await this.getId();
    return createSerializableKey([id, "transactionReceipt", { hash }]);
  }

  async preloadTransactionReceipt({
    value,
    ...params
  }: {
    value: TransactionReceipt;
  } & GetTransactionParams): Promise<void> {
    const key = await this.transactionReceiptKey(params);
    return this.cache.set(key, value);
  }

  /**
   * Wait for a transaction to be mined and get the transaction receipt.
   */
  async waitForTransaction(
    params: WaitForTransactionParams,
  ): Promise<TransactionReceipt | undefined> {
    return this._cachedCallback({
      key: await this.transactionReceiptKey(params),
      callback: () => this.adapter.waitForTransaction(params),
    });
  }

  // Function data //

  /**
   * Encodes a function call into calldata.
   */
  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes {
    return this.adapter.encodeFunctionData(params);
  }

  /**
   * Decodes a string of function calldata into it's arguments and function
   * name.
   */
  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ): DecodedFunctionData<TAbi, TFunctionName> {
    return this.adapter.decodeFunctionData(params);
  }

  // Events //

  async eventsKey<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    address,
    event,
    filter,
    fromBlock,
    toBlock,
  }: GetEventsParams<TAbi, TEventName>): Promise<SerializableKey> {
    const id = await this.getId();
    return createSerializableKey([
      id,
      "events",
      { address, event, filter, fromBlock, toBlock },
    ]);
  }

  async preloadEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    value,
    ...params
  }: {
    value: readonly EventLog<TAbi, TEventName>[];
  } & GetEventsParams<TAbi, TEventName>): Promise<void> {
    const key = await this.eventsKey(params);
    return this.cache.set(key, value);
  }

  /**
   * Retrieves specified events from a contract.
   */
  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]> {
    return this._cachedCallback({
      key: await this.eventsKey(params),
      callback: () => this.adapter.getEvents(params),
    });
  }

  // Read //

  async partialReadKey<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ address, args, block, fn }: Partial<ReadParams<TAbi, TFunctionName>>) {
    const id = await this.getId();
    return createSerializableKey([
      id,
      "read",
      {
        address,
        args,
        block,
        fn,
      },
    ]);
  }

  async readKey<TAbi extends Abi, TFunctionName extends FunctionName<TAbi>>(
    params: ReadParams<TAbi, TFunctionName>,
  ) {
    return this.partialReadKey(params);
  }

  async preloadRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({
    value,
    ...params
  }: {
    value: FunctionReturn<TAbi, TFunctionName>;
  } & ReadParams<TAbi, TFunctionName>): Promise<void> {
    const key = await this.readKey(params as ReadParams);
    return this.cache.set(key, value);
  }

  /**
   * Reads a specified function from a contract.
   */
  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this._cachedCallback({
      key: await this.readKey(params),
      callback: () => this.adapter.read(params),
    });
  }

  async invalidateRead<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: ReadParams<TAbi, TFunctionName>): Promise<void> {
    const key = await this.readKey(params);
    return this.cache.delete(key);
  }

  async invalidateReadsMatching<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: Partial<ReadParams<TAbi, TFunctionName>>): Promise<void> {
    const matchKey = await this.partialReadKey(params);

    for (const [key] of this.cache.entries()) {
      if (key === matchKey) {
        this.cache.delete(key);
      } else if (
        typeof key === "object" &&
        typeof matchKey === "object" &&
        isMatch(key, matchKey)
      ) {
        this.cache.delete(key);
      }
    }
  }

  // Write //

  /**
   * Simulates a write operation on a specified function of a contract.
   */
  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: SimulateWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.adapter.simulateWrite(params);
  }

  /**
   * Writes to a specified function on a contract.
   * @returns The transaction hash of the submitted transaction.
   * @throws A {@linkcode ReadonlyError} if not connected to a signer.
   */
  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[params]: TAdapter extends ReadWriteAdapter
      ? [params: WriteParams<TAbi, TFunctionName>]
      : never
  ): TAdapter extends ReadWriteAdapter ? Promise<Hash> : never {
    if (!this.isReadWrite()) {
      throw new ReadonlyError();
    }
    return this.adapter.write(params) as Promise<Hash> as any;
  }

  /**
   * Get the address of the signer for this instance.
   * @throws A {@linkcode ReadonlyError} if not connected to a signer.
   */
  getSignerAddress(
    ..._: TAdapter extends ReadWriteAdapter ? [] : never
  ): TAdapter extends ReadWriteAdapter ? Promise<Address> : never {
    if (!this.isReadWrite()) {
      throw new ReadonlyError();
    }
    return this.adapter.getSignerAddress() as Promise<Address> as any;
  }

  // Internal //

  /**
   * Fetches a value from the cache or calls the callback and caches the result.
   */
  private async _cachedCallback<TCallback extends (...args: any[]) => any>({
    key,
    callback,
  }: {
    key: SerializableKey;
    callback: TCallback;
  }): Promise<Awaited<ReturnType<TCallback>>> {
    if (this.cache.has(key)) {
      return this.cache.get(key) as Awaited<ReturnType<TCallback>>;
    }
    const value = await callback();
    this.cache.set(key, value);
    return value;
  }
}

/**
 * A union of options for configuring the adapter used by a Drift client.
 */
export type ClientAdapterOptions<T extends Adapter = Adapter> = OneOf<
  | {
      adapter?: T;
    }
  | OxAdapterConfig
>;

export interface ClientCacheOptions<TCache extends SimpleCache = SimpleCache> {
  cache?: TCache | LruSimpleCacheConfig;
  /**
   * An id to distinguish this instance from others in the cache.
   */
  id?: PropertyKey;
}

/**
 * An error thrown by a Drift client.
 */
export class ClientError extends DriftError {}

/**
 * An error thrown when attempting to perform a write operation with a
 * read-only adapter.
 *
 * @see {@linkcode ReadAdapter} and {@linkcode ReadWriteAdapter}
 */
export class ReadonlyError extends ClientError {
  constructor() {
    super("Adapter does not support write operations.");
  }
}
