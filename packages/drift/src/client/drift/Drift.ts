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
import { DriftError } from "src/error/DriftError";
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

  constructor({
    cache,
    cacheNamespace,
    ...rest
  }: DriftParams<TAdapter, TCache> = {}) {
    this.cache = createClientCache(cache);
    this.cacheNamespace = cacheNamespace;
    this.adapter = rest.adapter ?? (new OxAdapter(rest) as Adapter as TAdapter);
  }

  protected async initNamespace(): Promise<PropertyKey> {
    if (this.cacheNamespace) return this.cacheNamespace;
    const id = await this.getChainId();
    this.cacheNamespace = id;
    this.cache.preloadChainId({
      cacheNamespace: id,
      value: id,
    });
    return id;
  }

  isReadWrite(): this is Drift<ReadWriteAdapter, TCache> {
    return isReadWriteAdapter(this.adapter);
  }

  contract<TAbi extends Abi, TContractCache extends SimpleCache = TCache>({
    abi,
    address,
    cache = this.cache as SimpleCache as TContractCache,
    cacheNamespace = this.cacheNamespace,
  }: Omit<ContractParams<TAbi, TAdapter, TContractCache>, "adapter">) {
    return new Contract({
      abi,
      adapter: this.adapter,
      address,
      cache,
      cacheNamespace,
    });
  }

  /**
   * Get the chain ID of the network.
   */
  async getChainId(params?: GetChainIdParams): Promise<number> {
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
  }

  /**
   * Get the current block number.
   */
  async getBlockNumber(): Promise<bigint> {
    return this.adapter.getBlockNumber();
  }

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  async getBlock(params?: GetBlockParams): Promise<Block | undefined> {
    const cacheNamespace =
      params?.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initNamespace());

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
  }

  /**
   * Get the balance of native currency for an account.
   */
  async getBalance(params: GetBalanceParams): Promise<bigint> {
    const cacheNamespace =
      params?.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initNamespace());

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
  }

  /**
   * Get a transaction from a transaction hash.
   */
  async getTransaction(
    params: GetTransactionParams,
  ): Promise<Transaction | undefined> {
    const cacheNamespace =
      params?.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initNamespace());

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
  }

  /**
   * Wait for a transaction to be mined.
   */
  async waitForTransaction(
    params: WaitForTransactionParams,
  ): Promise<TransactionReceipt | undefined> {
    const cacheNamespace =
      params?.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initNamespace());

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
  }

  /**
   * Retrieves specified events from a contract.
   */
  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<ContractEvent<TAbi, TEventName>[]> {
    const cacheNamespace =
      params?.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initNamespace());

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
    const cacheNamespace =
      params?.cacheNamespace ??
      // Only await the async init fn if no value is already set.
      (await this.initNamespace());

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
  }

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

  /**
   * Get the address of the signer for this instance.
   * @throws If the adapter is not a `ReadWriteAdapter`.
   */
  getSignerAddress(
    ..._: TAdapter extends ReadWriteAdapter ? [] : never
  ): TAdapter extends ReadWriteAdapter ? Promise<Address> : never {
    if (!isReadWriteAdapter(this.adapter)) {
      throw new DriftError("Adapter does not support read-write operations.");
    }
    return this.adapter.getSignerAddress() as Promise<Address> as any;
  }

  /**
   * Writes to a specified function on a contract.
   * @returns The transaction hash of the submitted transaction.
   * @throws If the adapter is not a `ReadWriteAdapter`.
   */
  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[params]: TAdapter extends ReadWriteAdapter
      ? [params: AdapterWriteParams<TAbi, TFunctionName>]
      : never
  ): TAdapter extends ReadWriteAdapter ? Promise<Hash> : never {
    if (!isReadWriteAdapter(this.adapter)) {
      throw new DriftError("Adapter does not support read-write operations.");
    }
    return this.adapter.write(params) as Promise<Hash> as any;
  }
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
