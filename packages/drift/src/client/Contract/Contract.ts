import type { Abi } from "abitype";
import isMatch from "lodash.ismatch";
import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  Adapter,
  ReadAdapter,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type {
  ContractGetEventsOptions,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { ContractEvent, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import { createClientCache } from "src/cache/ClientCache/createClientCache";
import type {
  ClientCache,
  EventsKeyParams,
  NameSpaceParam,
  ReadKeyParams,
} from "src/cache/ClientCache/types";
import { type SimpleCache, createLruSimpleCache } from "src/exports";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { AnyObject, EmptyObject, MaybePromise } from "src/utils/types";

export interface ContractParams<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> extends NameSpaceParam {
  abi: TAbi;
  adapter: TAdapter;
  address: Address;
  cache?: TCache;
}

export type Contract<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
> = TAdapter extends ReadWriteAdapter
  ? ReadWriteContract<TAbi, TAdapter, TCache>
  : ReadContract<TAbi, TAdapter, TCache>;

export interface ReadContractParams<
  TAbi extends Abi = Abi,
  TAdapter extends ReadAdapter = ReadAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends ContractParams<TAbi, TAdapter, TCache> {}

/**
 * Interface representing a readable contract with specified ABI. Provides type
 * safe methods to read and simulate write operations on the contract.
 */
export class ReadContract<
  TAbi extends Abi = Abi,
  TAdapter extends ReadAdapter = ReadAdapter,
  TCache extends SimpleCache = SimpleCache,
> {
  abi: TAbi;
  adapter: TAdapter;
  address: Address;
  cache: ClientCache<TCache>;
  cacheNamespace?: PropertyKey;

  constructor({
    abi,
    adapter,
    address,
    cache = createLruSimpleCache({ max: 500 }) as TCache,
    cacheNamespace,
  }: ReadContractParams<TAbi, TAdapter, TCache>) {
    this.abi = abi;
    this.adapter = adapter;
    this.address = address;
    this.cache = createClientCache(cache);
    this.cacheNamespace = cacheNamespace;
  }

  // Events //

  /**
   * Retrieves specified events from the contract.
   */
  getEvents = async <TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
  ): Promise<ContractEvent<TAbi, TEventName>[]> => {
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
  };

  preloadEvents = <TEventName extends EventName<TAbi>>(
    params: Omit<
      EventsKeyParams<TAbi, TEventName>,
      keyof ReadContractParams
    > & {
      value: readonly ContractEvent<TAbi, TEventName>[];
    },
  ): MaybePromise<void> => {
    return this.cache.preloadEvents({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      ...params,
    });
  };

  eventsKey = <TEventName extends EventName<TAbi>>(
    ...[event, options]: ContractGetEventsArgs<TAbi, TEventName>
  ): SerializableKey => {
    return this.cache.eventsKey({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      event,
      ...options,
    });
  };

  // read //

  /**
   * Reads a specified function from the contract.
   */
  read = <TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> => {
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
  };

  preloadRead = <TFunctionName extends FunctionName<TAbi>>(
    params: Omit<
      ReadKeyParams<TAbi, TFunctionName>,
      keyof ReadContractParams
    > & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ): MaybePromise<void> => {
    this.cache.preloadRead({
      cacheNamespace: this.cacheNamespace,
      // TODO: Cleanup type casting required due to an incompatibility between
      // `Omit` and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      ...params,
    });
  };

  invalidateRead<TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): MaybePromise<void> {
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

  invalidateReadsMatching = <TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ): MaybePromise<void> => {
    const matchKey = this.cache.partialReadKey({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    });

    for (const [key] of this.cache.entries) {
      if (key === matchKey) {
        this.cache.delete(key);
        continue;
      }
      if (
        typeof key === "object" &&
        typeof matchKey === "object" &&
        isMatch(key, matchKey)
      ) {
        this.cache.delete(key);
      }
    }
  };

  readKey = <TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): SerializableKey => {
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
  };

  partialReadKey = <TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    options?: ContractReadOptions,
  ): SerializableKey => {
    return this.cache.partialReadKey({
      cacheNamespace: this.cacheNamespace,
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  };

  // ...rest //

  /**
   * Simulates a write operation on a specified function of the contract.
   */
  simulateWrite = <
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[fn, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> => {
    return this.adapter.simulateWrite({
      // TODO: Cleanup type casting required due to an incompatibility between
      // distributive types and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  };

  /**
   * Encodes a function call into calldata.
   */
  encodeFunctionData = <TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args]: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ): Bytes => {
    return this.adapter.encodeFunctionData({
      // TODO: Cleanup type casting required due to an incompatibility between
      // distributive types and the conditional args param.
      abi: this.abi as Abi,
      fn,
      args,
    });
  };

  /**
   * Decodes a string of function calldata into it's arguments and function
   * name.
   */
  decodeFunctionData = <
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    data: Bytes,
  ): DecodedFunctionData<TAbi, TFunctionName> => {
    return this.adapter.decodeFunctionData({
      abi: this.abi,
      data,
    });
  };
}

export type ReadWriteContractParams<
  TAbi extends Abi = Abi,
  TAdapter extends ReadWriteAdapter = ReadWriteAdapter,
  TCache extends ClientCache = ClientCache,
> = ReadContractParams<TAbi, TAdapter, TCache>;

/**
 * Interface representing a writable contract with specified ABI. Extends
 * IReadContract to also include write operations.
 */
export class ReadWriteContract<
  TAbi extends Abi = Abi,
  TAdapter extends ReadWriteAdapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
> extends ReadContract<TAbi, TAdapter, TCache> {
  /**
   * Get the address of the signer for this contract.
   */
  getSignerAddress = (): Promise<Address> => {
    return this.adapter.getSignerAddress();
  };

  /**
   * Writes to a specified function on the contract.
   * @returns The transaction hash of the submitted transaction.
   */
  write = <TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
    ...[fn, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<Hash> => {
    return this.adapter.write({
      // TODO: Cleanup type casting required due to an incompatibility between
      // distributive types and the conditional args param.
      abi: this.abi as Abi,
      address: this.address,
      fn,
      args,
      ...options,
    });
  };
}

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
