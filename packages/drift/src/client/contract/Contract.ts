import type { Abi, Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  Adapter,
  GetEventsParams,
  OnMinedParam,
  ReadAdapter,
  ReadParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type {
  ContractGetEventsOptions,
  ContractParams,
  ContractReadOptions,
  ContractWriteOptions,
} from "src/adapter/types/Contract";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import {
  type Client,
  type ClientConfig,
  type ReadWriteClient,
  createClient,
} from "src/client/Client";
import type { CacheStore } from "src/store/types";
import type {
  AnyObject,
  EmptyObject,
  Eval,
  Extended,
  OneOf,
} from "src/utils/types";

/**
 * An interface for interacting with a smart contract through a drift
 * {@linkcode Client}.
 */
export type Contract<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = Adapter,
  TCache extends CacheStore = CacheStore,
  TClient extends Client<TAdapter, TCache> = Client<TAdapter, TCache>,
> = TAdapter extends ReadWriteAdapter
  ? ReadWriteContract<TAbi, TAdapter, TCache, TClient>
  : ReadContract<TAbi, TAdapter, TCache, TClient>;

/**
 * A read-only {@linkcode Contract} instance for fetching data from a smart
 * contract through a drift {@linkcode Client}.
 */
export class ReadContract<
  TAbi extends Abi = Abi,
  TAdapter extends ReadAdapter = ReadAdapter,
  TCache extends CacheStore = CacheStore,
  TClient extends Client<TAdapter, TCache> = Client<TAdapter, TCache>,
> {
  abi: TAbi;
  address: Address;
  client: TClient;

  constructor({
    abi,
    address,
    client,
    ...clientConfig
  }: ContractConfig<TAbi, TAdapter, TCache, TClient>) {
    this.abi = abi;
    this.address = address;
    this.client = (client ??
      createClient(clientConfig as ClientConfig)) as TClient;
  }

  get cache(): TClient["cache"] {
    return this.client.cache;
  }

  isReadWrite(): this is Contract<TAbi, ReadWriteClient> {
    return this.client.isReadWrite();
  }

  extend<T extends Partial<Extended<this>>>(
    props: T & ThisType<T & this>,
  ): T & this {
    return Object.assign(this, props);
  }

  // Encoding //

  /**
   * Encodes a function call into calldata.
   */
  encodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args]: ContractEncodeFunctionDataArgs<TAbi, TFunctionName>
  ) {
    return this.client.encodeFunctionData({
      abi: this.abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });
  }

  /**
   * Encodes a function return data for a contract method.
   */
  encodeFunctionReturn<TFunctionName extends FunctionName<TAbi>>(
    fn: TFunctionName,
    value: FunctionReturn<TAbi, TFunctionName>,
  ) {
    return this.client.encodeFunctionReturn({
      abi: this.abi,
      fn,
      value,
    });
  }

  // Decoding //

  /**
   * Decodes a string of function calldata into it's arguments and function
   * name.
   */
  decodeFunctionData<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(data: Bytes): DecodedFunctionData<TAbi, TFunctionName> {
    return this.client.decodeFunctionData({
      abi: this.abi,
      data,
    });
  }

  /**
   * Decodes a string of function return data into it's return value.
   */
  decodeFunctionReturn<
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(fn: TFunctionName, data: Bytes): FunctionReturn<TAbi, TFunctionName> {
    return this.client.decodeFunctionReturn({
      abi: this.abi,
      fn,
      data,
    });
  }

  // Events //

  eventsKey<TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: ContractGetEventsOptions<TAbi, TEventName>,
  ) {
    return this.client.cache.eventsKey({
      abi: this.abi,
      address: this.address,
      event,
      ...options,
    });
  }

  preloadEvents<TEventName extends EventName<TAbi>>(
    params: Omit<GetEventsParams<TAbi, TEventName>, "abi" | "address"> & {
      value: readonly EventLog<TAbi, TEventName>[];
    },
  ) {
    return this.client.cache.preloadEvents({
      abi: this.abi,
      address: this.address,
      ...params,
    });
  }

  /**
   * Retrieves specified events from the contract.
   */
  getEvents<TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: ContractGetEventsOptions<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]> {
    return this.client.getEvents({
      abi: this.abi,
      address: this.address,
      event,
      ...options,
    });
  }

  // read //

  partialReadKey<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    params?: ContractReadOptions,
  ) {
    return this.cache.partialReadKey({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...params,
    });
  }

  readKey<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, params]: ContractReadArgs<TAbi, TFunctionName>
  ) {
    return this.cache.readKey({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }

  preloadRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    params: Omit<
      ReadParams<TAbi, TFunctionName>,
      keyof ContractParams<TAbi>
    > & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ) {
    return this.cache.preloadRead({
      abi: this.abi as Abi,
      address: this.address,
      ...params,
    });
  }

  /**
   * Reads a specified function from the contract.
   */
  read<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, params]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.client.read({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }

  invalidateRead<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, params]: ContractReadArgs<TAbi, TFunctionName>
  ) {
    return this.cache.invalidateRead({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }

  invalidateReadsMatching<
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    params?: ContractReadOptions,
  ) {
    return this.cache.invalidateReadsMatching({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...params,
    });
  }

  /**
   * Simulates a write operation on a specified function of the contract.
   */
  simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[fn, args, params]: ContractSimulateWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.client.simulateWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }
}

/**
 * A read-write {@linkcode Contract} with access to a signer for fetching data
 * and submitting transactions through a drift {@linkcode Client}.
 */
export class ReadWriteContract<
  TAbi extends Abi = Abi,
  TAdapter extends ReadWriteAdapter = ReadWriteAdapter,
  TCache extends CacheStore = CacheStore,
  TClient extends Client<TAdapter, TCache> = Client<TAdapter, TCache>,
> extends ReadContract<TAbi, TAdapter, TCache, TClient> {
  /**
   * @returns The transaction hash of the submitted transaction.
   */
  write<TFunctionName extends FunctionName<TAbi, "payable" | "nonpayable">>(
    ...[fn, args, params]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<Hash> {
    return this.client.write({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }

  /**
   * Get the address of the signer for this contract.
   */
  getSignerAddress(): Promise<Address> {
    return this.client.getSignerAddress();
  }
}

/**
 * Options for configuring the {@linkcode Client} of a {@linkcode Contract}.
 */
export type ContractClientOptions<
  TAdapter extends Adapter = Adapter,
  TCache extends CacheStore = CacheStore,
  TClient extends Client<TAdapter, TCache> = Client<TAdapter, TCache>,
> = OneOf<
  | {
      client?: TClient;
    }
  | ClientConfig<TAdapter, TCache>
>;

/**
 * Configuration options for creating a {@linkcode Contract}.
 */
export type ContractConfig<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = Adapter,
  TCache extends CacheStore = CacheStore,
  TClient extends Client<TAdapter, TCache> = Client<TAdapter, TCache>,
> = Eval<
  ContractParams<TAbi> & ContractClientOptions<TAdapter, TCache, TClient>
>;

/**
 * Creates a new {@linkcode Contract} instance for interacting with a smart
 * contract through a drift {@linkcode Client}.
 *
 * @param config - The configuration to use for the contract.
 * @returns
 */
export function createContract<
  TAbi extends Abi,
  TAdapter extends Adapter,
  TCache extends CacheStore,
  TClient extends Client<TAdapter, TCache>,
>({
  abi,
  address,
  client: maybeClient,
  ...clientConfig
}: ContractConfig<TAbi, TAdapter, TCache, TClient>): Contract<
  TAbi,
  TClient["adapter"],
  TClient["cache"]["store"],
  TClient
> {
  const client = (maybeClient ||
    createClient(clientConfig as ClientConfig)) as TClient;

  if (client.isReadWrite()) {
    return new ReadWriteContract({
      abi,
      address,
      client,
    }) as Contract<TAbi, TClient>;
  }

  return new ReadContract({ abi, address, client }) as Contract<
    TAbi,
    TAdapter,
    TCache,
    TClient
  >;
}

export type ContractEncodeFunctionDataArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Abi extends TAbi
  ? [functionName: TFunctionName, args?: AnyObject]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [functionName: TFunctionName, args?: EmptyObject]
    : [functionName: TFunctionName, args: FunctionArgs<TAbi, TFunctionName>];

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

export type ContractSimulateWriteArgs<
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
      options?: ContractWriteOptions & OnMinedParam,
    ]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [
        functionName: TFunctionName,
        args?: EmptyObject,
        options?: ContractWriteOptions & OnMinedParam,
      ]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: ContractWriteOptions & OnMinedParam,
      ];
