import type { Abi } from "abitype";
import { OxAdapter } from "src/adapter/OxAdapter";
import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  Adapter,
  AdapterDecodeFunctionDataParams,
  AdapterEncodeFunctionDataParams,
  AdapterWriteParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { ContractEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { NetworkWaitForTransactionParams } from "src/adapter/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import { isReadWriteAdapter } from "src/adapter/utils/isReadWriteAdapter";
import { createClientCache } from "src/cache/ClientCache/createClientCache";
import type {
  BalanceKeyParams,
  BlockKeyParams,
  ChainIdKeyParams,
  ClientCache,
  EventsKeyParams,
  NameSpaceParam,
  ReadKeyParams,
  TransactionKeyParams,
} from "src/cache/ClientCache/types";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import { Contract, type ContractParams } from "src/client/contract/Contract";
import type { AdapterParam } from "src/client/types";
import type { Pretty } from "src/utils/types";

export type DriftParams<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = Pretty<
  {
    cache?: TCache;
  } & NameSpaceParam &
    AdapterParam<TAdapter>
>;

export class Drift<
  TAdapter extends Adapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
> {
  adapter: TAdapter;
  cache: ClientCache<TCache>;
  cacheNamespace?: PropertyKey;

  // Write-only property definitions //

  getSignerAddress: TAdapter extends ReadWriteAdapter
    ? () => Promise<Address>
    : undefined;

  write: TAdapter extends ReadWriteAdapter
    ? <
        TAbi extends Abi,
        TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
      >(
        params: WriteParams<TAbi, TFunctionName>,
      ) => Promise<Hash>
    : undefined;

  // Implementation //

  constructor({
    cache,
    cacheNamespace,
    ...rest
  }: DriftParams<TAdapter, TCache> = {}) {
    this.cache = createClientCache(cache);
    this.cacheNamespace = cacheNamespace;
    this.adapter = rest.adapter ?? (new OxAdapter(rest) as Adapter as TAdapter);

    // Write-only property assignment //

    this.getSignerAddress = this.adapter
      .getSignerAddress as this["getSignerAddress"];
    this.write = this.adapter.write as this["write"];
  }

  protected async initCacheNamespace(): Promise<PropertyKey> {
    return (
      this.cacheNamespace ??
      this.getChainId().then((id) => {
        this.cacheNamespace = id;
        return id;
      })
    );
  }

  // The following functions are defined as arrow function properties rather
  // than typical class methods to ensure they maintain the correct `this`
  // context when passed as callbacks.

  isReadWrite = (): this is Drift<ReadWriteAdapter, TCache> =>
    isReadWriteAdapter(this.adapter);

  contract = <TAbi extends Abi, TContractCache extends SimpleCache = TCache>({
    abi,
    address,
    cache = this.cache as SimpleCache as TContractCache,
    cacheNamespace = this.cacheNamespace,
  }: Omit<ContractParams<TAbi, TAdapter, TContractCache>, "adapter">) =>
    new Contract({
      abi,
      adapter: this.adapter,
      address,
      cache,
      cacheNamespace,
    });

  /**
   * Get the chain ID of the network.
   */
  getChainId = async (params?: GetChainIdParams): Promise<number> => {
    const key = this.cache.chainIdKey({
      cacheNamespace: this.cacheNamespace,
      ...params,
    });

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return this.adapter.getChainId().then((id) => {
      this.cache.set(key, id);
      return id;
    });
  };

  /**
   * Get the current block number.
   */
  getBlockNumber = async (): Promise<bigint> => this.adapter.getBlockNumber();

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock = async (params?: GetBlockParams): Promise<Block | undefined> => {
    const cacheNamespace =
      params?.cacheNamespace ??
      this.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initCacheNamespace());

    const key = this.cache.blockKey({
      cacheNamespace,
      ...params,
    });

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return this.adapter.getBlock(params).then((block) => {
      this.cache.set(key, block);
      return block;
    });
  };

  /**
   * Get the balance of native currency for an account.
   */
  getBalance = async (params: GetBalanceParams): Promise<bigint> => {
    const cacheNamespace =
      params?.cacheNamespace ??
      this.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initCacheNamespace());

    const key = this.cache.balanceKey({
      cacheNamespace,
      ...params,
    });

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return this.adapter.getBalance(params).then((balance) => {
      this.cache.set(key, balance);
      return balance;
    });
  };

  /**
   * Get a transaction from a transaction hash.
   */
  getTransaction = async (
    params: GetTransactionParams,
  ): Promise<Transaction | undefined> => {
    const cacheNamespace =
      params?.cacheNamespace ??
      this.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initCacheNamespace());

    const key = this.cache.transactionKey({
      cacheNamespace,
      ...params,
    });

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return this.adapter.getTransaction(params).then((tx) => {
      this.cache.set(key, tx);
      return tx;
    });
  };

  /**
   * Wait for a transaction to be mined.
   */
  waitForTransaction = async (
    params: WaitForTransactionParams,
  ): Promise<TransactionReceipt | undefined> => {
    const cacheNamespace =
      params?.cacheNamespace ??
      this.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initCacheNamespace());

    const key = this.cache.transactionKey({
      cacheNamespace,
      ...params,
    });

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return this.adapter.waitForTransaction(params).then((tx) => {
      this.cache.set(key, tx);
      return tx;
    });
  };

  /**
   * Retrieves specified events from a contract.
   */
  getEvents = async <TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<ContractEvent<TAbi, TEventName>[]> => {
    const cacheNamespace =
      params?.cacheNamespace ??
      this.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initCacheNamespace());

    const key = this.cache.eventsKey({
      cacheNamespace,
      ...params,
    });

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return this.adapter.getEvents(params).then((result) => {
      this.cache.set(key, result);
      return result;
    });
  };

  /**
   * Reads a specified function from a contract.
   */
  read = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> => {
    const cacheNamespace =
      params?.cacheNamespace ??
      this.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initCacheNamespace());

    const key = this.cache.readKey({
      cacheNamespace,
      ...params,
    });

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    return this.adapter.read(params).then((result) => {
      this.cache.set(key, result);
      return result;
    });
  };

  /**
   * Simulates a write operation on a specified function of a contract.
   */
  simulateWrite = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: SimulateWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> => {
    return this.adapter.simulateWrite(params);
  };

  /**
   * Encodes a function call into calldata.
   */
  encodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: EncodeFunctionDataParams<TAbi, TFunctionName>,
  ): Bytes => {
    return this.adapter.encodeFunctionData(params);
  };

  /**
   * Decodes a string of function calldata into it's arguments and function
   * name.
   */
  decodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ): DecodedFunctionData<TAbi, TFunctionName> => {
    return this.adapter.decodeFunctionData(params);
  };
}

export type GetChainIdParams = Pretty<ChainIdKeyParams>;

export type GetBlockParams = Pretty<BlockKeyParams>;

export type GetBalanceParams = Pretty<BalanceKeyParams>;

export type GetTransactionParams = Pretty<TransactionKeyParams>;

export type WaitForTransactionParams = Pretty<
  TransactionKeyParams & NetworkWaitForTransactionParams
>;

export type ReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = ReadKeyParams<TAbi, TFunctionName>;

export type SimulateWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = AdapterWriteParams<TAbi, TFunctionName>;

export type WriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = AdapterWriteParams<TAbi, TFunctionName>;

export type GetEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = Pretty<EventsKeyParams<TAbi, TEventName>>;

export type EncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = AdapterEncodeFunctionDataParams<TAbi, TFunctionName>;

export type DecodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Pretty<AdapterDecodeFunctionDataParams<TAbi, TFunctionName>>;
