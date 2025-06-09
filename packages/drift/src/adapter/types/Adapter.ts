import type { Abi, Address, Bytes, Hash } from "src/adapter/types/Abi";
import type { BlockIdentifier, BlockTag } from "src/adapter/types/Block";
import type { EventFilter, EventLog, EventName } from "src/adapter/types/Event";
import type {
  ConstructorArgs,
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type { Network } from "src/adapter/types/Network";
import type {
  Eip4844Options,
  TransactionOptions,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import type { DynamicProperty, NarrowTo, OneOf } from "src/utils/types";

/**
 * An interface for interacting with a blockchain network and its contracts,
 * required by all Drift client APIs.
 */
export interface Adapter extends ReadAdapter, Partial<WriteAdapter> {}

/**
 * A read-only interface for interacting with a blockchain network and its
 * contracts, required by all Drift client APIs.
 */
export interface ReadAdapter extends Network {
  /**
   * Executes a new message call immediately without creating a transaction on
   * the block chain.
   * @returns The return value of the executed function.
   *
   * @example
   * ```ts
   * const data = await drift.call({
   *   to: tokenAddress,
   *   data: drift.encodeFunctionData({
   *     abi: erc20.abi,
   *     fn: "transfer",
   *     args: { to, amount },
   *   }),
   * });
   *
   * if (data) {
   *   const decoded = drift.decodeFunctionReturn({
   *     abi: erc20.abi,
   *     fn: "transfer",
   *     data,
   *   });
   * }
   * ```
   *
   * Calls can also be made using a bytecode instead of an address, sometimes
   * referred to as a "deployless" call. The contract is temporarily created
   * using the bytecode and the function is called on it.
   *
   * ```ts
   * const data = await drift.call({
   *   bytecode: MockErc20Example.bytecode,
   *   data: drift.encodeFunctionData({
   *     abi: MockErc20Example.abi,
   *     fn: "name",
   *   }),
   * });
   * ```
   */
  call(params: CallParams): Promise<Bytes>;

  multicall<
    TCalls extends { abi: Abi }[],
    TAllowFailure extends boolean = true,
  >(
    params: MulticallParams<TCalls, TAllowFailure>,
  ): Promise<MulticallReturn<TCalls, TAllowFailure>>;

  /**
   * Submits a raw signed transaction. For
   * [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) transactions, the raw
   * form must be the network form. This means it includes the blobs, KZG
   * commitments, and KZG proofs.
   * @returns The transaction hash of the submitted transaction.
   */
  sendRawTransaction(transaction: Bytes): Promise<Hash>;

  /**
   * Get a list of logs for a contract event.
   */
  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]>;

  /**
   * Calls a `pure` or `view` function on a contract.
   * @returns The decoded return value of the function.
   */
  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  /**
   * Call a state-mutating function on a contract without sending a transaction.
   * @returns The decoded return value of the function.
   */
  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: SimulateWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  /**
   * Encodes the constructor call data for a contract deployment.
   */
  encodeDeployData<TAbi extends Abi>(
    params: EncodeDeployDataParams<TAbi>,
  ): Bytes;

  /**
   * Encodes the call data for a function on a contract.
   */
  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes;

  /**
   * Encodes the return value of a function on a contract.
   */
  encodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes;

  /**
   * Decodes the call data for a function on a contract.
   */
  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ): DecodedFunctionData<TAbi, TFunctionName>;

  /**
   * Decodes the return value of a function on a contract.
   */
  decodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionReturnParams<TAbi, TFunctionName>,
  ): FunctionReturn<TAbi, TFunctionName>;
}

/**
 * A write-only interface for signing and submitting transactions.
 */
export interface WriteAdapter {
  /**
   * Gets the address of the account that will be used to sign transactions.
   * @returns The address of the signer.
   */
  getSignerAddress(): Promise<Address>;

  /**
   * Signs and submits a transaction.
   * @returns The transaction hash of the submitted transaction.
   */
  sendTransaction(params: SendTransactionParams): Promise<Hash>;

  /**
   * Creates, signs, and submits a contract creation transaction using the
   * specified bytecode and constructor arguments.
   * @returns The transaction hash of the submitted transaction.
   */
  deploy<TAbi extends Abi>(params: DeployParams<TAbi>): Promise<Hash>;

  /**
   * Creates, signs, and submits a transaction for a state-mutating contract
   * function.
   * @returns The transaction hash of the submitted transaction.
   */
  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<Hash>;
}

/**
 * A read-write interface for interacting with a blockchain network and
 * its contracts, required by all read-write Drift client APIs.
 */
export interface ReadWriteAdapter extends ReadAdapter, WriteAdapter {}

// Method parameter types //

/**
 * Params for a contract instance.
 */
export interface ContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
}

/**
 * Base params for a function call.
 */
export type FunctionCallParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = ContractParams<TAbi> & {
  fn: TFunctionName;
} & DynamicProperty<"args", FunctionArgs<TAbi, TFunctionName>>;

// Encode/Decode //

export type EncodeDeployDataParams<TAbi extends Abi = Abi> = {
  abi: TAbi;
  bytecode: Bytes;
} & DynamicProperty<"args", ConstructorArgs<TAbi>>;

export type EncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = {
  abi: TAbi;
  fn: TFunctionName;
} & DynamicProperty<"args", FunctionArgs<TAbi, TFunctionName>>;

export interface EncodeFunctionReturnParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> {
  abi: TAbi;
  fn: TFunctionName;
  value: FunctionReturn<TAbi, TFunctionName>;
}

export interface DecodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> {
  abi: TAbi;
  data: Bytes;
  // TODO: This is optional and only used to determine the return type, but is
  // there another way to get the return type based on the function selector in
  // the data?
  fn?: TFunctionName;
}

export interface DecodeFunctionReturnParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> {
  abi: TAbi;
  data: Bytes;
  fn: TFunctionName;
}

// Events //

/**
 * A block number or tag used to specify the start or end of a range.
 */
export type RangeBlock = BlockTag | bigint;

/**
 * A block number or tag used to specify the start or end of a mined range.
 */
export type MinedRangeBlock = Exclude<RangeBlock, "pending">;

/**
 * Options for narrowing an event query.
 */
export interface GetEventsOptions<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> {
  filter?: EventFilter<TAbi, TEventName>;
  fromBlock?: RangeBlock;
  toBlock?: RangeBlock;
}

/**
 * Params for getting events.
 */
export interface GetEventsParams<
  TAbi extends Abi = Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> extends ContractParams<TAbi>,
    GetEventsOptions<TAbi, TEventName> {
  event: TEventName;
}

// Read //

/**
 * Options for reading contract state.
 */
// https://github.com/ethereum/execution-apis/blob/main/src/eth/execute.yaml#L1
export interface ReadOptions<
  T extends BlockIdentifier | undefined = BlockIdentifier,
> {
  block?: T;
}

/**
 * Params for calling a contract function.
 */
export type ReadParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi, "pure" | "view"> = FunctionName<
    TAbi,
    "pure" | "view"
  >,
> = FunctionCallParams<TAbi, TFunctionName> & ReadOptions;

// Write //

/**
 * Options for simulating a transaction.
 */
export interface SimulateWriteOptions extends ReadOptions, TransactionOptions {}

export type SimulateWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = FunctionCallParams<TAbi, TFunctionName> & SimulateWriteOptions;

/**
 * Options for writing state by calling a contract function.
 */
export interface WriteOptions extends TransactionOptions {
  onMined?: (receipt: TransactionReceipt | undefined) => void;
}

export type WriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = FunctionCallParams<TAbi, TFunctionName> & WriteOptions;

// Deploy //

export type DeployParams<TAbi extends Abi = Abi> =
  EncodeDeployDataParams<TAbi> & WriteOptions;

// Call //

// https://github.com/ethereum/execution-apis/blob/7c9772f95c2472ccfc6f6128dc2e1b568284a2da/src/eth/execute.yaml#L1
export interface CallOptions extends SimulateWriteOptions, Eip4844Options {}

export type CallParams = {
  data?: Bytes;
} & OneOf<
  | {
      /**
       * The address to call.
       */
      to: Address;
    }
  | {
      /**
       * A contract bytecode to temporarily deploy and call.
       */
      bytecode: Bytes;
    }
> &
  CallOptions;

// Multicall //

/**
 * @internal
 */
export type MulticallCalls<TCalls extends { abi: Abi }[] = { abi: Abi }[]> = {
  [K in keyof TCalls]: NarrowTo<
    FunctionCallParams<
      TCalls[K]["abi"],
      NarrowTo<
        FunctionName<TCalls[K]["abi"]>,
        NarrowTo<FunctionCallParams, TCalls[K]>["fn"]
      >
    >,
    TCalls[K]
  >;
};

/**
 * Options for multicall operations.
 */
export interface MulticallOptions<TAllowFailure extends boolean = boolean>
  extends ReadOptions,
    TransactionOptions {
  multicallAddress?: Address;
  allowFailure?: TAllowFailure;
}

export type MulticallParams<
  TCalls extends { abi: Abi }[] = { abi: Abi }[],
  TAllowFailure extends boolean = boolean,
> = {
  calls: MulticallCalls<TCalls>;
} & MulticallOptions<TAllowFailure>;

/**
 * The result object for single multicall call.
 */
export type MulticallCallResult<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OneOf<
  | {
      success: true;
      value: FunctionReturn<TAbi, TFunctionName>;
    }
  | {
      success: false;
      error: Error;
    }
>;

export type MulticallReturn<
  TCalls extends { abi: Abi }[] = { abi: Abi }[],
  TAllowFailure extends boolean = boolean,
> = MulticallCalls<TCalls> extends infer T extends { abi: Abi; fn: string }[]
  ? {
      [K in keyof T]: T[K] extends {
        fn: infer TFunctionName extends FunctionName<T[K]["abi"]>;
      }
        ? TAllowFailure extends true
          ? MulticallCallResult<T[K]["abi"], TFunctionName>
          : FunctionReturn<T[K]["abi"], TFunctionName>
        : TAllowFailure extends true
          ? MulticallCallResult<T[K]["abi"], FunctionName<T[K]["abi"]>>
          : FunctionReturn<T[K]["abi"], FunctionName<T[K]["abi"]>>;
    }
  : never;

// Send transaction //

// https://github.com/ethereum/execution-apis/blob/40088597b8b4f48c45184da002e27ffc3c37641f/src/eth/submit.yaml#L1
export type SendTransactionParams = {
  /**
   * The data to send with the transaction.
   */
  data: Bytes;
} & OneOf<
  | (Eip4844Options & {
      /**
       * The address to send the transaction to.
       */
      to: Address;
    })
  | {
      /**
       * The address to send the transaction to or `undefined` for a contract
       * creation.
       */
      to?: Address;
    }
> &
  WriteOptions;
