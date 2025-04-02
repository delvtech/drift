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
import type { EmptyObject, OneOf } from "src/utils/types";

export interface Adapter extends ReadAdapter, Partial<WriteAdapter> {}

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

  /**
   * Submits a raw signed transaction. For
   * [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) transactions, the raw
   * form must be the network form. This means it includes the blobs, KZG
   * commitments, and KZG proofs.
   * @returns The transaction hash of the submitted transaction.
   */
  sendRawTransaction(transaction: Bytes): Promise<Hash>;

  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]>;

  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: SimulateWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>>;

  encodeDeployData<TAbi extends Abi>(
    params: EncodeDeployDataParams<TAbi>,
  ): Bytes;

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes;

  encodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes;

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionDataParams<TAbi, TFunctionName>,
  ): DecodedFunctionData<TAbi, TFunctionName>;

  decodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(
    params: DecodeFunctionReturnParams<TAbi, TFunctionName>,
  ): FunctionReturn<TAbi, TFunctionName>;
}

export interface WriteAdapter {
  getSignerAddress(): Promise<Address>;

  /**
   * Signs and submits a transaction.
   */
  sendTransaction(params: SendTransactionParams): Promise<Hash>;

  /**
   * Deploys a contract using the specified bytecode and constructor arguments.
   * @returns The transaction hash of the submitted transaction.
   */
  deploy<TAbi extends Abi>(params: DeployParams<TAbi>): Promise<Hash>;

  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<Hash>;
}

export interface ReadWriteAdapter extends ReadAdapter, WriteAdapter {}

// Method parameter types //

/**
 * Params for a contract instance.
 */
export interface ContractParams<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
}

// Encode/Decode //

export type EncodeDeployDataParams<TAbi extends Abi = Abi> = {
  abi: TAbi;
  bytecode: Bytes;
} & ArgsParam<ConstructorArgs<TAbi>>;

export type EncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = {
  abi: TAbi;
  fn: TFunctionName;
} & ArgsParam<FunctionArgs<TAbi, TFunctionName>>;

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
> = ContractParams<TAbi> & {
  fn: TFunctionName;
} & ArgsParam<FunctionArgs<TAbi, TFunctionName>> &
  ReadOptions;

// Write //

export type SimulateWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = ContractParams<TAbi> & {
  fn: TFunctionName;
} & ArgsParam<FunctionArgs<TAbi, TFunctionName>> &
  TransactionOptions;

export interface WriteOptions extends TransactionOptions {
  onMined?: (receipt: TransactionReceipt | undefined) => void;
}

export type WriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = SimulateWriteParams<TAbi, TFunctionName> & WriteOptions;

// Deploy //

export type DeployParams<TAbi extends Abi = Abi> =
  EncodeDeployDataParams<TAbi> & WriteOptions;

// Call //

// https://github.com/ethereum/execution-apis/blob/7c9772f95c2472ccfc6f6128dc2e1b568284a2da/src/eth/execute.yaml#L1
export interface CallOptions
  extends ReadOptions,
    TransactionOptions,
    Eip4844Options {}

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

// Internal //

/**
 * A dynamic arguments parameter that is optional if the arguments are empty.
 * @internal
 */
type ArgsParam<Args> = EmptyObject extends Args
  ? {
      args?: Args;
    }
  : {
      args: Args;
    };
