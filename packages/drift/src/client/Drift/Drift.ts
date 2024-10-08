import type { Abi } from "abitype";
import type { Bytes, Hash } from "src/adapter/types/Abi";
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
import type { Pretty } from "src/utils/types";

export type DriftOptions<TCache extends SimpleCache = SimpleCache> = Pretty<
  {
    cache?: TCache;
  } & NameSpaceParam
>;

export class Drift<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> {
  adapter: TAdapter;
  cache: ClientCache<TCache>;
  cacheNamespace?: PropertyKey;

  // Write-only property definitions //

  getSignerAddress: TAdapter extends ReadWriteAdapter
    ? () => Promise<string>
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

  constructor(
    adapter: TAdapter,
    { cache, cacheNamespace }: DriftOptions<TCache> = {},
  ) {
    this.adapter = adapter;
    this.cache = createClientCache(cache);
    this.cacheNamespace = cacheNamespace;

    // Write-only property assignment //

    const isReadWrite = this.isReadWrite();

    this.getSignerAddress = isReadWrite
      ? () => this.adapter.getSignerAddress()
      : (undefined as any);

    this.write = isReadWrite
      ? async (params) => {
          const writePromise = this.adapter.write(params);

          if (params.onMined) {
            writePromise.then((hash) => {
              this.adapter.waitForTransaction({ hash }).then(params.onMined);
              return hash;
            });
          }

          return writePromise;
        }
      : (undefined as any);
  }

  // The following functions are defined as arrow function properties rather
  // than typical class methods to ensure they maintain the correct `this`
  // context when passed as callbacks.

  isReadWrite = (): this is Drift<ReadWriteAdapter, TCache> =>
    isReadWriteAdapter(this.adapter);

  contract = <TAbi extends Abi, TContractCache extends SimpleCache = TCache>({
    abi,
    address,
    cache = this.cache.store as SimpleCache as TContractCache,
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
    const key = this.cache.chainIdKey(params);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return this.adapter.getChainId().then((id) => {
      this.cache.set(key, id);
      return id;
    });
  };

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock = async (params?: GetBlockParams): Promise<Block | undefined> => {
    const key = this.cache.blockKey(params);
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
    const key = this.cache.balanceKey(params);
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
  getTransaction = (
    params: GetTransactionParams,
  ): Promise<Transaction | undefined> => {
    const key = this.cache.transactionKey(params);
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
  waitForTransaction = (
    params: WaitForTransactionParams,
  ): Promise<TransactionReceipt | undefined> => {
    const key = this.cache.transactionKey(params);
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
    const key = this.cache.eventsKey(params);
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
    const key = this.cache.readKey(params);
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
> = AdapterWriteParams<TAbi, TFunctionName> & {
  onMined?: (receipt?: TransactionReceipt) => void;
};

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
