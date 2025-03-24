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
import type { AnyObject, EmptyObject, OneOf } from "src/utils/types";

export interface Adapter extends ReadAdapter, Partial<WriteAdapter> {}

export interface ReadAdapter extends Network {
  call(params: CallParams): Promise<Bytes>;

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

  write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<Hash>;

  /**
   * Deploys a contract using the specified bytecode and constructor arguments.
   * @returns The transaction hash of the submitted transaction.
   */
  deploy<TAbi extends Abi>(params: DeployParams<TAbi>): Promise<Hash>;
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

// Encode/Decode parameters //

export type EncodeDeployDataParams<TAbi extends Abi = Abi> = {
  abi: TAbi;
  bytecode: Bytes;
} & ArgsParam<TAbi, ConstructorArgs<TAbi>>;

export type EncodeFunctionDataParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = {
  abi: TAbi;
  fn: TFunctionName;
} & ArgsParam<TAbi, FunctionArgs<TAbi, TFunctionName>>;

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

// Event parameters //

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

// Read parameters //

/**
 * Options for reading contract state.
 */
// https://github.com/ethereum/execution-apis/blob/main/src/eth/execute.yaml#L1
export interface ReadOptions<T extends BlockIdentifier = BlockIdentifier> {
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
} & ArgsParam<TAbi, FunctionArgs<TAbi, TFunctionName>> &
  ReadOptions;

// Write parameters //

export interface WriteOptions extends TransactionOptions {
  onMined?: (receipt: TransactionReceipt | undefined) => void;
}

export type SimulateWriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = ContractParams<TAbi> & {
  fn: TFunctionName;
} & ArgsParam<TAbi, FunctionArgs<TAbi, TFunctionName>> &
  TransactionOptions;

// Read //

export type WriteParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = SimulateWriteParams<TAbi, TFunctionName> & WriteOptions;

// Deploy parameters //

export type DeployParams<TAbi extends Abi = Abi> =
  EncodeDeployDataParams<TAbi> & WriteOptions;

// Call parameters //

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
       * A contract address to call.
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

// Internal //

/**
 * A dynamic arguments parameter that:
 * - Widens to an optional `AnyObject` if the ABI is not known.
 * - Is optional if the ABI is not known or if the arguments are empty.
 * - Is required if the ABI is known and the arguments are not empty.
 *
 * @internal
 */
type ArgsParam<TAbi extends Abi, Args> = Abi extends TAbi
  ? {
      args?: AnyObject;
    }
  : EmptyObject extends Args
    ? {
        args?: Args;
      }
    : {
        args: Args;
      };
