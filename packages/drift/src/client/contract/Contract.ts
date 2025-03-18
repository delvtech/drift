import type { Abi, Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  Adapter,
  ContractParams,
  GetEventsOptions,
  ReadAdapter,
  ReadOptions,
  ReadWriteAdapter,
  WriteOptions,
} from "src/adapter/types/Adapter";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { TransactionOptions } from "src/adapter/types/Transaction";
import {
  type Client,
  type ClientOptions,
  createClient,
} from "src/client/Client";
import { ContractCache } from "src/client/contract/cache/ContractCache";
import type { Store } from "src/store/types";
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
  TStore extends Store = Store,
  TClient extends Client<TAdapter, TStore> = Client<TAdapter, TStore>,
> = TAdapter extends ReadWriteAdapter
  ? ReadWriteContract<TAbi, TAdapter, TStore, TClient>
  : ReadContract<TAbi, TAdapter, TStore, TClient>;

/**
 * A read-only {@linkcode Contract} instance for fetching data from a smart
 * contract through a drift {@linkcode Client}.
 */
export class ReadContract<
  TAbi extends Abi = Abi,
  TAdapter extends ReadAdapter = ReadAdapter,
  TStore extends Store = Store,
  TClient extends Client<TAdapter, TStore> = Client<TAdapter, TStore>,
> {
  abi: TAbi;
  address: Address;
  client: TClient;
  cache: ContractCache<TAbi, TStore>;

  constructor({
    abi,
    address,
    client,
    ...clientOptions
  }: ContractOptions<TAbi, TAdapter, TStore, TClient>) {
    this.abi = abi;
    this.address = address;
    this.client = (client ?? createClient(clientOptions)) as TClient;
    this.cache = new ContractCache({
      abi,
      address,
      clientCache: this.client.cache,
    });
  }

  isReadWrite(): this is Contract<TAbi, ReadWriteAdapter> {
    return this.client.isReadWrite();
  }

  extend<T extends Partial<Extended<this>>>(
    props: T & ThisType<T & this>,
  ): T & this {
    return Object.assign(this, props);
  }

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

  /**
   * Retrieves specified events from the contract.
   */
  getEvents<TEventName extends EventName<TAbi>>(
    event: TEventName,
    options?: GetEventsOptions<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]> {
    return this.client.getEvents({
      abi: this.abi,
      address: this.address,
      event,
      ...options,
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
  TStore extends Store = Store,
  TClient extends Client<TAdapter, TStore> = Client<TAdapter, TStore>,
> extends ReadContract<TAbi, TAdapter, TStore, TClient> {
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
  TStore extends Store = Store,
  TClient extends Client<TAdapter, TStore> = Client<TAdapter, TStore>,
> = OneOf<
  | {
      client?: TClient;
    }
  | ClientOptions<TAdapter, TStore>
>;

/**
 * Configuration options for creating a {@linkcode Contract}.
 */
export type ContractOptions<
  TAbi extends Abi = Abi,
  TAdapter extends Adapter = Adapter,
  TStore extends Store = Store,
  TClient extends Client<TAdapter, TStore> = Client<TAdapter, TStore>,
> = Eval<
  ContractParams<TAbi> & ContractClientOptions<TAdapter, TStore, TClient>
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
  TStore extends Store,
  TClient extends Client<TAdapter, TStore>,
>({
  abi,
  address,
  client: maybeClient,
  ...clientOptions
}: ContractOptions<TAbi, TAdapter, TStore, TClient>): Contract<
  TAbi,
  TClient["adapter"],
  TClient["cache"]["store"],
  TClient
> {
  const client = (maybeClient || createClient(clientOptions)) as TClient;

  if (client.isReadWrite()) {
    return new ReadWriteContract({
      abi,
      address,
      client: client as Client<ReadWriteAdapter, TStore>,
    }) as Contract<TAbi, TAdapter, TStore, TClient>;
  }

  return new ReadContract({ abi, address, client }) as Contract<
    TAbi,
    TAdapter,
    TStore,
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
  ? [functionName: TFunctionName, args?: AnyObject, options?: ReadOptions]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [functionName: TFunctionName, args?: EmptyObject, options?: ReadOptions]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: ReadOptions,
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
      options?: TransactionOptions,
    ]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [
        functionName: TFunctionName,
        args?: EmptyObject,
        options?: TransactionOptions,
      ]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: TransactionOptions,
      ];

export type ContractWriteArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = Abi extends TAbi
  ? [functionName: TFunctionName, args?: AnyObject, options?: WriteOptions]
  : FunctionArgs<TAbi, TFunctionName> extends EmptyObject
    ? [functionName: TFunctionName, args?: EmptyObject, options?: WriteOptions]
    : [
        functionName: TFunctionName,
        args: FunctionArgs<TAbi, TFunctionName>,
        options?: WriteOptions,
      ];
