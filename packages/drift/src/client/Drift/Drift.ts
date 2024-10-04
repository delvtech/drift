import type { Abi } from "abitype";
import type {
  Adapter,
  AdapterDecodeFunctionDataParams,
  AdapterEncodeFunctionDataParams,
  AdapterGetEventsParams,
  AdapterReadParams,
  AdapterWriteParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { ContactEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { TransactionReceipt } from "src/adapter/types/Transaction";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import { createClientCache } from "src/client/ClientCache/createClientCache";
import type { ClientCache, NameSpaceParam } from "src/client/ClientCache/types";
import {
  type Contract,
  type ContractParams,
  ReadContract,
  ReadWriteContract,
} from "src/client/Contract/Contract";
import type { Bytes, TransactionHash } from "src/types";

export type DriftContract<
  TAbi extends Abi,
  TAdapter extends Adapter = Adapter,
> = TAdapter extends ReadWriteAdapter
  ? ReadWriteContract<TAbi>
  : ReadContract<TAbi>;

export interface DriftOptions<TCache extends SimpleCache = SimpleCache>
  extends NameSpaceParam {
  cache?: TCache;
}

// This is the one implementation that combines the Read/ReadWrite concepts in
// favor of a unified entrypoint to the library's top-level API.
export class Drift<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> {
  readonly adapter: TAdapter;
  cache: ClientCache<TCache>;
  namespace?: PropertyKey;

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
      ) => Promise<TransactionHash>
    : undefined;

  // Implementation //

  constructor(
    adapter: TAdapter,
    { cache, namespace }: DriftOptions<TCache> = {},
  ) {
    this.adapter = adapter;
    this.cache = createClientCache(cache);
    this.namespace = namespace;

    // Write-only property assignment //

    const isReadWrite = this.isReadWrite();

    this.getSignerAddress = isReadWrite
      ? () => this.adapter.getSignerAddress()
      : (undefined as any);

    this.write = isReadWrite
      ? async (params) => {
          const writePromise = this.adapter.write(params);

          if (params.onMined) {
            writePromise.then((txHash) => {
              this.adapter.waitForTransaction(txHash).then(params.onMined);
              return txHash;
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

  contract = <TAbi extends Abi, TCache extends ClientCache = ClientCache>({
    abi,
    address,
    cache = this.cache,
    namespace = this.namespace,
  }: ContractParams<TAbi>): Contract<TAbi, TAdapter, TCache> => {
    return (
      this.isReadWrite()
        ? new ReadWriteContract({
            abi,
            adapter: this.adapter,
            address,
            cache,
            namespace,
          })
        : new ReadContract({
            abi,
            adapter: this.adapter,
            address,
            cache,
            namespace,
          })
    ) as Contract<TAbi, TAdapter, TCache>;
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
   * Retrieves specified events from a contract.
   */
  getEvents = async <TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<ContactEvent<TAbi, TEventName>[]> => {
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

export type ReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = NameSpaceParam & AdapterReadParams<TAbi, TFunctionName>;

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
> = NameSpaceParam & AdapterGetEventsParams<TAbi, TEventName>;

export type EncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = AdapterEncodeFunctionDataParams<TAbi, TFunctionName>;

export type DecodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = AdapterDecodeFunctionDataParams<TAbi, TFunctionName>;

function isReadWriteAdapter(adapter: Adapter): adapter is ReadWriteAdapter {
  return "readWriteContract" in adapter;
}
