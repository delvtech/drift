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
  ConstructorArgs,
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
import type { EmptyObject, Eval, Extended, OneOf } from "src/utils/types";

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

export type ContractBaseOptions<TAbi extends Abi = Abi> = Eval<
  ContractParams<TAbi> & {
    /**
     * The earliest block number to use for function calls and event queries.
     * If defined, the {@linkcode ReadOptions.block block} option of the
     * {@linkcode Contract.read read} method will be overridden when set to
     * `"earliest"` or a lower block number; and the
     * {@linkcode GetEventsOptions.fromBlock fromBlock} option of the
     * {@linkcode Contract.getEvents getEvents} method will be overridden when
     * `undefined`, `"earliest"`, or a lower block number.
     *
     * @example
     * ```ts
     * const contract = createContract({
     *   abi,
     *   address,
     *   client,
     *   epochBlock: 22147561n,
     * });
     *
     * const totalSupply = await contract.read("totalSupply", [], {
     *   block: 100n, // <- overridden with `this.epochBlock`
     * });
     *
     * const approvals = await contract.getEvents("Approval"); // <- `fromBlock` set to `this.epochBlock`
     *
     * const transfers = await contract.getEvents("Transfer", {
     *   fromBlock: "earliest", // <- overridden with `this.epochBlock`
     * });
     * ```
     */
    epochBlock?: bigint;
  }
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
  ContractBaseOptions<TAbi> &
    OneOf<
      | {
          client?: TClient;
        }
      | ClientOptions<TAdapter, TStore>
    >
>;

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
  epochBlock?: bigint;

  constructor({
    abi,
    address,
    epochBlock,
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
    this.epochBlock = epochBlock;
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
   * Encodes a contract deploy call into calldata.
   */
  encodeDeployData(
    ...[bytecode, args]: ContractEncodeDeployDataArgs<TAbi>
  ): Bytes {
    return this.client.encodeDeployData({
      abi: this.abi,
      bytecode,
      args: args as ConstructorArgs<TAbi>,
    });
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
    { fromBlock, ...options }: GetEventsOptions<TAbi, TEventName> = {},
  ): Promise<EventLog<TAbi, TEventName>[]> {
    if (
      this.epochBlock &&
      (!fromBlock ||
        fromBlock === "earliest" ||
        (typeof fromBlock === "bigint" && fromBlock < this.epochBlock))
    ) {
      fromBlock = this.epochBlock;
    }
    return this.client.getEvents({
      abi: this.abi,
      address: this.address,
      event,
      fromBlock,
      ...options,
    });
  }

  /**
   * Reads a specified function from the contract.
   */
  read<TFunctionName extends FunctionName<TAbi, "pure" | "view">>(
    ...[fn, args, options]: ContractReadArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    let { block, ...restOptions } = options || {};
    if (
      this.epochBlock &&
      (block === "earliest" ||
        (typeof block === "bigint" && block < this.epochBlock))
    ) {
      block = this.epochBlock;
    }
    return this.client.read({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      block,
      ...restOptions,
    });
  }

  /**
   * Simulates a write operation on a specified function of the contract.
   */
  simulateWrite<
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    ...[fn, args, options]: ContractSimulateWriteArgs<TAbi, TFunctionName>
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return this.client.simulateWrite({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...options,
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
   * Get the address of the signer for this contract.
   */
  getSignerAddress(): Promise<Address> {
    return this.client.getSignerAddress();
  }

  /**
   * @returns The transaction hash of the submitted transaction.
   */
  write<TFunctionName extends FunctionName<TAbi, "payable" | "nonpayable">>(
    ...[fn, args, options]: ContractWriteArgs<TAbi, TFunctionName>
  ): Promise<Hash> {
    return this.client.write({
      abi: this.abi,
      address: this.address,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
      ...options,
    });
  }
}

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
  epochBlock,
  client,
  ...clientOptions
}: ContractOptions<TAbi, TAdapter, TStore, TClient>): Contract<
  TAbi,
  TClient["adapter"],
  TClient["cache"]["store"],
  TClient
> {
  client = (client || createClient(clientOptions)) as TClient;

  if (client.isReadWrite()) {
    return new ReadWriteContract({
      abi,
      address,
      client,
      epochBlock,
    }) as Contract<TAbi, TAdapter, TStore, TClient>;
  }

  return new ReadContract({ abi, address, client, epochBlock }) as Contract<
    TAbi,
    TAdapter,
    TStore,
    TClient
  >;
}

// Parameter types //

export type ContractEncodeDeployDataArgs<TAbi extends Abi = Abi> =
  EmptyObject extends ConstructorArgs<TAbi>
    ? [bytecode: Bytes, args?: ConstructorArgs<TAbi>]
    : [bytecode: Bytes, args: ConstructorArgs<TAbi>];

export type ContractEncodeFunctionDataArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = EmptyObject extends FunctionArgs<TAbi, TFunctionName>
  ? [functionName: TFunctionName, args?: FunctionArgs<TAbi, TFunctionName>]
  : [functionName: TFunctionName, args: FunctionArgs<TAbi, TFunctionName>];

export type ContractReadArgs<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = EmptyObject extends FunctionArgs<TAbi, TFunctionName>
  ? [
      functionName: TFunctionName,
      args?: FunctionArgs<TAbi, TFunctionName>,
      options?: ReadOptions,
    ]
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
> = EmptyObject extends FunctionArgs<TAbi, TFunctionName>
  ? [
      functionName: TFunctionName,
      args?: FunctionArgs<TAbi, TFunctionName>,
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
> = EmptyObject extends FunctionArgs<TAbi, TFunctionName>
  ? [
      functionName: TFunctionName,
      args?: FunctionArgs<TAbi, TFunctionName>,
      options?: WriteOptions,
    ]
  : [
      functionName: TFunctionName,
      args: FunctionArgs<TAbi, TFunctionName>,
      options?: WriteOptions,
    ];
