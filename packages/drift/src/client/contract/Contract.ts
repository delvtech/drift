import type { Abi } from "abitype";
import { OxAdapter } from "src/adapter/OxAdapter";
import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  Adapter,
  OnMinedParam,
  ReadAdapter,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type {
  ContractWriteOptions as BaseContractWriteOptions,
  ContractGetEventsOptions,
  ContractReadOptions,
} from "src/adapter/types/Contract";
import type { ContractEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import { isReadWriteAdapter } from "src/adapter/utils/isReadWriteAdapter";
import { createClientCache } from "src/cache/ClientCache/createClientCache";
import type {
  ClientCache,
  EventsKeyParams,
  NameSpaceParam,
  ReadKeyParams,
} from "src/cache/ClientCache/types";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import type { AdapterParam } from "src/client/types";
import { DriftError } from "src/error/DriftError";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { AnyObject, EmptyObject, Pretty } from "src/utils/types";

export type ContractParams<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = Pretty<
  {
    abi: TAbi;
    address: Address;
    cache?: TCache;
  } & NameSpaceParam &
    AdapterParam<TAdapter>
>;

export class Contract<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
> {
  abi: TAbi;
  adapter: TAdapter;
  address: Address;
  cache: ClientCache<TCache>;
  cacheNamespace?: NameSpaceParam["cacheNamespace"];

  constructor({
    abi,
    address,
    cache,
    cacheNamespace,
    ...rest
  }: ContractParams<TAbi, TAdapter, TCache>) {
    this.abi = abi;
    this.address = address;
    this.cache = createClientCache(cache);
    this.cacheNamespace = cacheNamespace;
    this.adapter = rest.adapter ?? (new OxAdapter(rest) as Adapter as TAdapter);
  }

  isReadWrite(): this is Contract<TAbi, ReadWriteAdapter, TCache> {
    return isReadWriteAdapter(this.adapter);
  }

  // Events //

  /**
   * Retrieves specified events from the contract.
   */
  async getEvents<TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
  ): Promise<ContractEvent<TAbi, TEventName>[]> {
    const key = this.eventsKey(event, options);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return this.adapter
      .getEvents({
        abi: this.abi,
        address: this.address,
        event,
        ...options,
      })
      .then((events) => {
        this.cache.set(key, events);
        return events;
      });
  }

  preloadEvents<TEventName extends EventName<TAbi>>(
    params: Omit<EventsKeyParams<TAbi, TEventName>, keyof ContractParams> & {
      value: readonly ContractEvent<TAbi, TEventName>[];
    },
  ) {
    return this.cache.preloadEvents({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      ...params,
    });
  }

  eventsKey<TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
  ): SerializableKey {
    return this.cache.eventsKey({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      event,
      ...options,
    });
  }

  // read //

  /**
   * Reads a specified function from the contract.
   */
  async read<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    const key = this.readKey(
      fn,
      args as FunctionArgs<TAbi, TFunctionName>,
      options,
    );
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return this.adapter
      .read({
        abi: this.abi as Abi,
        address: this.address,
        fn,
        args,
        ...options,
      })
      .then((events) => {
        this.cache.set(key, events);
        return events;
      });
  }

  preloadRead<TFunctionName extends FunctionName<TAbi>>(
    params: Omit<ReadKeyParams<TAbi, TFunctionName>, keyof ContractParams> & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ) {
    this.cache.preloadRead({
      cacheNamespace: this.cacheNamespace,
      // TODO: Cleanup type casting required due to an incompatibility between
      // `Omit` and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      ...params,
    });
  }

  invalidateRead<TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ) {
    return this.cache.invalidateRead({
      cacheNamespace: this.cacheNamespace,
      // TODO: Cleanup type casting required due to an incompatibility between
      // `Omit` and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  }

  invalidateReadsMatching<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ) {
    return this.cache.invalidateReadsMatching({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  }

  readKey<TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): SerializableKey {
    return this.cache.readKey({
      cacheNamespace: this.cacheNamespace,
      // TODO: Cleanup type casting required due to an incompatibility between
      // `Omit` and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  }

  partialReadKey<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ): SerializableKey {
    return this.cache.partialReadKey({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  }

  // ...rest //

  /**
   * Simulates a write operation on a specified function of the contract.
   */
  async simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[fn, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.adapter.simulateWrite({
      // TODO: Cleanup type casting required due to an incompatibility between
      // distributive types and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  }

  /**
   * Encodes a function call into calldata.
   */
  encodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args]: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ): Bytes {
    return this.adapter.encodeFunctionData({
      // TODO: Cleanup type casting required due to an incompatibility between
      // distributive types and the conditional args param.
      abi: this.abi as Abi,
      fn,
      args,
    });
  }

  /**
   * Decodes a string of function calldata into it's arguments and function
   * name.
   */
  decodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(data: Bytes): DecodedFunctionData<TAbi, TFunctionName> {
    return this.adapter.decodeFunctionData({
      abi: this.abi,
      data,
    });
  }

  // Read-Write //

  /**
   * Get the address of the signer for this contract.
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
   * Writes to a specified function on the contract.
   * @returns The transaction hash of the submitted transaction.
   * @throws If the adapter is not a `ReadWriteAdapter`.
   */
  write<TFunctionName extends FunctionName<TAbi, "payable" | "nonpayable">>(
    ...params: TAdapter extends ReadWriteAdapter
      ? ContractWriteArgs<TAbi, TFunctionName>
      : never
  ): TAdapter extends ReadWriteAdapter ? Promise<Hash> : never {
    if (!isReadWriteAdapter(this.adapter)) {
      throw new DriftError("Adapter does not support read-write operations.");
    }
    const [fn, args, options] = params;
    return this.adapter.write({
      // TODO: Cleanup type casting required due to an incompatibility
      // between distributive types and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    }) as Promise<Hash> as any;
  }
}

export type ReadContract<
  TAbi extends Abi = Abi,
  TAdapter extends ReadAdapter = ReadAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Contract<TAbi, TAdapter, TCache>;

export type ReadWriteContract<
  TAbi extends Abi = Abi,
  TAdapter extends ReadWriteAdapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
> = Contract<TAbi, TAdapter, TCache>;

export type ContractGetEventsArgs<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> = [event: TEventName, options?: ContractGetEventsOptions<TAbi, TEventName>];

export type ContractReadArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Abi extends TAbi
  ? [
      functionName: TFunctionName,
      args?: AnyObject,
      options?: ContractReadOptions,
    ]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [
        functionName: TFunctionName,
        args?: EmptyObject,
        options?: ContractReadOptions,
      ]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: ContractReadOptions,
      ];

export interface ContractWriteOptions
  extends BaseContractWriteOptions,
    OnMinedParam {}

export type ContractWriteArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = Abi extends TAbi
  ? [
      functionName: TFunctionName,
      args?: AnyObject,
      options?: ContractWriteOptions,
    ]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [
        functionName: TFunctionName,
        args?: EmptyObject,
        options?: ContractWriteOptions,
      ]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: ContractWriteOptions,
      ];

export type ContractEncodeFunctionDataArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Abi extends TAbi
  ? [functionName: TFunctionName, args?: AnyObject]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [functionName: TFunctionName, args?: EmptyObject]
    : [functionName: TFunctionName, args: FunctionArgs<TAbi, TFunctionName>];
