import type { Abi } from "abitype";
import type { Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  Adapter,
  GetEventsParams,
  OnMinedParam,
  ReadParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type {
  ContractGetEventsOptions,
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
import type { SimpleCache } from "src/cache/types";
import {
  BaseClient,
  type ClientConfig,
  type ReadClient,
  type ReadWriteClient,
  ReadonlyError,
} from "src/client/BaseClient";
import type { SerializableKey } from "src/utils/createSerializableKey";
import type { AnyObject, EmptyObject, OneOf, Pretty } from "src/utils/types";

export type ContractConfig<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends BaseClient<TAdapter, TCache> = BaseClient<TAdapter, TCache>,
> = Pretty<
  ContractOptions<TAbi> & ContractClientOptions<TAdapter, TCache, TClient>
>;

export class Contract<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = ReadWriteAdapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends BaseClient<TAdapter, TCache> = BaseClient<TAdapter, TCache>,
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
    this.client = client ?? (new BaseClient(clientConfig) as TClient);
  }

  isReadWrite(): this is Contract<TAbi, ReadWriteClient> {
    return this.client.isReadWrite();
  }

  // Function data //

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

  // Events //

  eventsKey<TEventName extends EventName<TAbi>>(
    ...[event, params]: ContractGetEventsArgs<TAbi, TEventName>
  ) {
    return this.client.eventsKey({
      abi: this.abi,
      address: this.address,
      event,
      ...params,
    });
  }

  preloadEvents<TEventName extends EventName<TAbi>>(
    params: Omit<GetEventsParams<TAbi, TEventName>, "abi" | "address"> & {
      value: readonly EventLog<TAbi, TEventName>[];
    },
  ) {
    return this.client.preloadEvents({
      abi: this.abi,
      address: this.address,
      ...params,
    });
  }

  /**
   * Retrieves specified events from the contract.
   */
  getEvents<TEventName extends EventName<TAbi>>(
    ...[event, params]: ContractGetEventsArgs<TAbi, TEventName>
  ): Promise<EventLog<TAbi, TEventName>[]> {
    return this.client.getEvents({
      abi: this.abi,
      address: this.address,
      event,
      ...params,
    });
  }

  // read //

  partialReadKey<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    params?: ContractReadOptions,
  ): Promise<SerializableKey> {
    return this.client.partialReadKey({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...params,
    });
  }

  readKey<TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args, params]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<SerializableKey> {
    return this.client.readKey({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }

  preloadRead<TFunctionName extends FunctionName<TAbi>>(
    params: Omit<ReadParams<TAbi, TFunctionName>, keyof ContractConfig> & {
      value: FunctionReturn<TAbi, TFunctionName>;
    },
  ) {
    this.client.preloadRead({
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

  invalidateRead<TFunctionName extends FunctionName<TAbi>>(
    ...[fn, args, params]: ContractReadArgs<TAbi, TFunctionName>
  ) {
    return this.client.invalidateRead({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }

  invalidateReadsMatching<TFunctionName extends FunctionName<TAbi>>(
    fn?: TFunctionName,
    args?: FunctionArgs<TAbi, TFunctionName>,
    params?: ContractReadOptions,
  ) {
    return this.client.invalidateReadsMatching({
      abi: this.abi,
      address: this.address,
      fn,
      args,
      ...params,
    });
  }

  // Write //

  /**
   * Simulates a write operation on a specified function of the contract.
   */
  simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[fn, args, params]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.client.simulateWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    });
  }

  /**
   * Writes to a specified function on the contract.
   * @returns The transaction hash of the submitted transaction.
   * @throws A {@linkcode ReadonlyError} if not connected to a signer.
   */
  write<TFunctionName extends FunctionName<TAbi, "payable" | "nonpayable">>(
    ...[fn, args, params]: TClient extends ReadWriteClient
      ? ContractWriteArgs<TAbi, TFunctionName>
      : never
  ): TClient extends ReadWriteClient ? Promise<Hash> : never {
    if (!this.client.isReadWrite()) {
      throw new ReadonlyError();
    }
    return this.client.write({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...params,
    }) as Promise<Hash> as any;
  }

  /**
   * Get the address of the signer for this contract.
   * @throws A {@linkcode ReadonlyError} if not connected to a signer.
   */
  getSignerAddress(
    ..._: TClient extends ReadWriteClient ? [] : never
  ): TClient extends ReadWriteClient ? Promise<Address> : never {
    if (!this.client.isReadWrite()) {
      throw new ReadonlyError();
    }
    return this.client.getSignerAddress() as Promise<Address> as any;
  }
}

export type ReadContract<
  TAbi extends Abi = Abi,
  TClient extends ReadClient = ReadClient,
> = Contract<TAbi, TClient>;

export type ReadWriteContract<
  TAbi extends Abi = Abi,
  TClient extends ReadWriteClient = ReadWriteClient,
> = Contract<TAbi, TClient>;

export interface ContractOptions<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
}

export type ContractClientOptions<
  TAdapter extends Adapter = Adapter,
  TCache extends SimpleCache = SimpleCache,
  TClient extends BaseClient<TAdapter, TCache> = BaseClient<TAdapter, TCache>,
> = OneOf<
  | {
      client?: TClient;
    }
  | ClientConfig<TAdapter, TCache>
>;

export type ContractEncodeFunctionDataArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = Abi extends TAbi
  ? [functionName: TFunctionName, args?: AnyObject]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [functionName: TFunctionName, args?: EmptyObject]
    : [functionName: TFunctionName, args: FunctionArgs<TAbi, TFunctionName>];

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

function foo(bar: Contract<Abi, Adapter>) {
  if (bar.isReadWrite()) {
    bar.write(
      "foo",
      { a: 1, b: 2 },
      {
        maxFeePerGas: 1n,
      },
    );
  }
}
