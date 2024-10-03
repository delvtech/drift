import type { Abi } from "abitype";
import type { Event, EventName } from "src/adapter/contract/types/event";
import type {
  DecodedFunctionData,
  FunctionName,
  FunctionReturn,
} from "src/adapter/contract/types/function";
import type { Adapter, ReadWriteAdapter } from "src/adapter/types";
import { createDriftCache } from "src/cache/DriftCache/createDriftCache";
import type { DriftCache } from "src/cache/DriftCache/types";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import { createCachedReadContract } from "src/cache/utils/createCachedReadContract";
import { createCachedReadWriteContract } from "src/cache/utils/createCachedReadWriteContract";
import type {
  ReadContract,
  ReadWriteContract,
} from "src/contract/types";
import type {
  ContractParams,
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadParams,
  WriteParams,
} from "src/types";

export type DriftContract<
  TAbi extends Abi,
  TAdapter extends Adapter = Adapter,
> = TAdapter extends ReadWriteAdapter
  ? ReadWriteContract<TAbi>
  : ReadContract<TAbi>;

export interface DriftOptions<TCache extends SimpleCache = SimpleCache> {
  cache?: TCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

// This is the one place where the Read/ReadWrite concepts are combined into a
// single class in favor of a unified entrypoint to the Drift API.
export class Drift<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> {
  readonly adapter: TAdapter;
  cache: DriftCache<TCache>;
  namespace?: string;

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
      ) => Promise<string>
    : undefined;

  // Implementation //

  constructor(
    adapter: TAdapter,
    { cache, namespace }: DriftOptions<TCache> = {},
  ) {
    this.adapter = adapter;
    this.cache = createDriftCache(cache);
    this.namespace = namespace;

    // Write-only property assignment //

    const isReadWrite = this.isReadWrite();

    this.getSignerAddress = isReadWrite
      ? () => this.adapter.getSignerAddress()
      : (undefined as any);

    this.write = isReadWrite
      ? async ({ abi, address, fn, args, onMined, ...writeOptions }) => {
          if (isReadWriteAdapter(this.adapter)) {
            const txHash = await createCachedReadWriteContract({
              contract: this.adapter.readWriteContract(abi, address),
              cache: this.cache,
            }).write(fn, args, writeOptions);

            if (onMined) {
              this.adapter.network.waitForTransaction(txHash).then(onMined);
            }

            return txHash;
          }
        }
      : (undefined as any);
  }

  isReadWrite = (): this is Drift<TAdapter & ReadWriteAdapter, TCache> =>
    isReadWriteAdapter(this.adapter);

  contract = <TAbi extends Abi>({
    abi,
    address,
    cache = this.cache,
    namespace = this.namespace,
  }: ContractParams<TAbi>): DriftContract<TAbi, TAdapter> => {
    con
  }

  /**
   * Reads a specified function from a contract.
   */
  read = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({
    abi,
    address,
    fn,
    args,
    ...readOptions
  }: ReadParams<TAbi, TFunctionName>): Promise<
    FunctionReturn<TAbi, TFunctionName>
  > => {
    return createCachedReadContract({
      contract: this.adapter.readContract(abi, address),
      cache: this.cache,
    }).read(fn, args, readOptions);
  };

  /**
   * Simulates a write operation on a specified function of a contract.
   */
  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    abi,
    address,
    fn,
    args,
    ...writeOptions
  }: WriteParams<TAbi, TFunctionName>): Promise<
    FunctionReturn<TAbi, TFunctionName>
  > {
    return createCachedReadContract({
      contract: this.adapter.readContract(abi, address),
      cache: this.cache,
    }).simulateWrite(fn, args, writeOptions);
  }

  /**
   * Retrieves specified events from a contract.
   */
  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event,
    ...params
  }: GetEventsParams<TAbi, TEventName>): Promise<Event<TAbi, TEventName>[]> {
    return createCachedReadContract({
      contract: this.adapter.readContract(abi, address),
      cache: this.cache,
    }).getEvents(event, params);
  }

  /**
   * Encodes a function call into calldata.
   */
  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({
    abi,
    fn,
    args,
  }: EncodeFunctionDataParams<TAbi, TFunctionName>): `0x${string}` {
    return createCachedReadContract({
      contract: this.adapter.readContract(abi, "0x0"),
      cache: this.cache,
    }).encodeFunctionData(fn, args);
  }

  /**
   * Decodes a string of function calldata into it's arguments and function
   * name.
   */
  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >({
    abi,
    data,
  }: DecodeFunctionDataParams<TAbi, TFunctionName>): DecodedFunctionData<
    TAbi,
    TFunctionName
  > {
    return createCachedReadContract({
      contract: this.adapter.readContract(abi, "0x0"),
      cache: this.cache,
    }).decodeFunctionData(data as `0x${string}`);
  }
}

function isReadWriteAdapter(adapter: Adapter): adapter is ReadWriteAdapter {
  return "readWriteContract" in adapter;
}
