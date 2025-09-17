import type {
  Abi,
  Address,
  Bytes,
  Hash,
  HexString,
} from "src/adapter/types/Abi";
import type { Block, BlockIdentifier, BlockTag } from "src/adapter/types/Block";
import type { EventFilter, EventLog, EventName } from "src/adapter/types/Event";
import type {
  ConstructorArgs,
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  Eip4844Options,
  Transaction,
  TransactionOptions,
  TransactionReceipt,
  WalletCallsReceipt,
} from "src/adapter/types/Transaction";
import type {
  DynamicProperty,
  Eval,
  NarrowTo,
  OneOf,
  Replace,
} from "src/utils/types";

// TODO: Cleanup and reorganize to make it easier to maintain and scale.

/**
 * An interface for interacting with a blockchain network and its contracts,
 * required by all Drift client APIs.
 */
export interface Adapter extends ReadAdapter, Partial<WriteAdapter> {}

/**
 * A read-only interface for interacting with a blockchain network and its
 * contracts, required by all Drift client APIs.
 */
export interface ReadAdapter {
  /**
   * Get the chain ID of the network.
   */
  getChainId(): Promise<number>;

  /**
   * Get the current block number.
   */
  getBlockNumber(): Promise<bigint>;

  /**
   * Get a block from a block tag, number, or hash. If no argument is provided,
   * the latest block is returned.
   */
  getBlock<T extends BlockIdentifier | undefined = undefined>(
    block?: T,
  ): Promise<GetBlockReturn<T>>;

  /**
   * Get the balance of native currency for an account.
   */
  getBalance(params: GetBalanceParams): Promise<bigint>;

  /**
   * Returns an estimate of the current price per gas in wei.
   */
  getGasPrice(): Promise<bigint>;

  /**
   * Get a transaction from a transaction hash.
   */
  getTransaction(
    params: GetTransactionParams,
  ): Promise<Transaction | undefined>;

  /**
   * Wait for a transaction to be mined.
   * @returns The transaction receipt.
   */
  waitForTransaction(
    params: WaitForTransactionParams,
  ): Promise<TransactionReceipt | undefined>;

  /**
   * Submits a raw signed transaction. For
   * [EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) transactions, the raw
   * form must be the network form. This means it includes the blobs, KZG
   * commitments, and KZG proofs.
   * @returns The transaction hash of the submitted transaction.
   */
  sendRawTransaction(transaction: Bytes): Promise<Hash>;

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

  /**
   * Get a list of logs for a contract event.
   */
  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]>;

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
   * Generates and returns an estimate of how much gas is necessary to allow the
   * transaction to complete.
   *
   * **Note:** The estimate may be significantly more than the amount of gas
   * actually used by the transaction, for a variety of reasons including EVM
   * mechanics and node performance.
   */
  estimateGas<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(transaction: EstimateGasParams<TAbi, TFunctionName>): Promise<bigint>;

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

  multicall<
    TCalls extends readonly unknown[] = any[],
    TAllowFailure extends boolean = true,
  >(
    params: MulticallParams<TCalls, TAllowFailure>,
  ): Promise<NoInfer<MulticallReturn<TCalls, TAllowFailure>>>;
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
   * Queries what capabilities a wallet supports.
   */
  getWalletCapabilities<const TChainIds extends readonly number[] = []>(
    params?: GetWalletCapabilitiesParams<TChainIds>,
  ): Promise<WalletCapabilities<TChainIds>>;

  /**
   * Get the status of a call batch that was sent via {@linkcode sendCalls}.
   */
  getCallsStatus<TId extends HexString>(
    batchId: TId,
  ): Promise<WalletCallsStatus<TId>>;

  /**
   * Requests that a wallet shows information about a given call batch that was
   * sent via {@linkcode sendCalls}.
   */
  showCallsStatus(batchId: HexString): Promise<void>;

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

  /**
   * Requests that a wallet submits a batch of calls.
   */
  sendCalls<const TCalls extends readonly unknown[] = any[]>(
    params: SendCallsParams<TCalls>,
  ): Promise<SendCallsReturn>;
}

/**
 * A read-write interface for interacting with a blockchain network and
 * its contracts, required by all read-write Drift client APIs.
 */
export interface ReadWriteAdapter extends ReadAdapter, WriteAdapter {}

// Method parameter types //

// Balance //

export interface GetBalanceParams {
  address: Address;
  block?: BlockIdentifier;
}

// Block //

/**
 * The awaited return type of a {@linkcode Network.getBlock} call considering
 * the provided {@linkcode BlockIdentifier}.
 */
export type GetBlockReturn<T extends BlockIdentifier | undefined = undefined> =
  T extends BlockTag | undefined ? Block<T> : Block<T> | undefined;

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

// Get transaction //

export interface GetTransactionParams {
  hash: Hash;
}

export interface WaitForTransactionParams extends GetTransactionParams {
  /**
   * The number of milliseconds to wait for the transaction until rejecting
   * the promise.
   */
  timeout?: number;
}

// Call //

export interface TargetCallParams {
  /**
   * The address to send the call to.
   */
  to: Address;
  /**
   * The hash of the contract method signature and encoded parameters.
   */
  data?: Bytes;
}

export interface BytecodeCallParams {
  /**
   * A contract bytecode to temporarily deploy and call.
   */
  bytecode: Bytes;
  /**
   * The hash of the contract method signature and encoded parameters.
   */
  data: Bytes;
}

export interface EncodedDeployCallParams {
  /**
   * The contract code and encoded parameters.
   */
  data: Bytes;
}

// https://github.com/ethereum/execution-apis/blob/7c9772f95c2472ccfc6f6128dc2e1b568284a2da/src/eth/execute.yaml#L1
export interface CallOptions extends TransactionOptions {
  block?: BlockIdentifier;
}

export type CallParams = OneOf<
  | (TargetCallParams & Eip4844Options)
  | BytecodeCallParams
  | EncodedDeployCallParams
> &
  CallOptions;

// Functions //

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
> = Eval<
  ContractParams<TAbi> & {
    fn: TFunctionName;
  }
> &
  DynamicProperty<"args", FunctionArgs<TAbi, TFunctionName>>;

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
export interface ReadOptions {
  block?: BlockIdentifier;
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

// Multicall //

/**
 * Parameters for a multicall call, which can be a function call or a target
 * call.
 */
export type MulticallCallParams<
  TAbi extends Abi | undefined = Abi | undefined,
  TFunctionName extends FunctionName<NarrowTo<Abi, TAbi>> | undefined =
    | FunctionName<NarrowTo<Abi, TAbi>>
    | undefined,
> = TAbi extends Abi
  ? FunctionCallParams<
      TAbi,
      TFunctionName extends FunctionName<TAbi>
        ? TFunctionName
        : FunctionName<TAbi>
    > &
      Partial<Record<keyof TargetCallParams, undefined>>
  : TargetCallParams & Partial<Record<keyof FunctionCallParams, undefined>>;

/**
 * @internal
 */
export type MulticallCalls<TCalls extends readonly unknown[] = unknown[]> = {
  [K in keyof TCalls]: TCalls[K] extends { abi: infer TAbi extends Abi }
    ? MulticallCallParams<
        TAbi,
        NarrowTo<{ fn: FunctionName<TAbi> }, TCalls[K]>["fn"]
      > extends infer TParams
      ? NarrowTo<TParams, Replace<TParams, TCalls[K]>>
      : never
    : MulticallCallParams;
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

/**
 * Params for multicall operations.
 */
export interface MulticallParams<
  TCalls extends readonly unknown[] = unknown[],
  TAllowFailure extends boolean = boolean,
> extends MulticallOptions<TAllowFailure> {
  calls: MulticallCalls<TCalls>;
}

/**
 * The result object for single multicall call.
 */
export type MulticallCallResult<TCall = any> = OneOf<
  | {
      success: true;
      value: TCall extends {
        abi: infer TAbi extends Abi;
        fn: infer TFunctionName extends string;
      }
        ? FunctionReturn<TAbi, NarrowTo<FunctionName<TAbi>, TFunctionName>>
        : Bytes;
    }
  | {
      success: false;
      error: Error;
    }
>;

export type MulticallReturn<
  TCalls extends readonly unknown[] = unknown[],
  TAllowFailure extends boolean = boolean,
> = {
  [K in keyof TCalls]: TAllowFailure extends true
    ? MulticallCallResult<TCalls[K]>
    : Extract<MulticallCallResult<TCalls[K]>, { value: unknown }>["value"];
};

// EIP-5792 - Wallet Call API //
// https://www.eip5792.xyz
// https://github.com/ethereum/EIPs/blob/828e5493db76aa0e61660e4a0d38e582c0f4c0a5/EIPS/eip-5792.md

/**
 * The capabilities of a wallet, as defined by EIP-5792.
 */
export type WalletCapability = {
  [capability: string]: unknown;
  atomic?: {
    status: "supported" | "ready" | "unsupported";
  };
  atomicBatch?: {
    supported: boolean;
  };
  paymasterService?: {
    status: "supported" | "ready" | "unsupported";
  };
};

/**
 * Params for querying a wallet's capabilities.
 */
export interface GetWalletCapabilitiesParams<
  TChainIds extends readonly number[] = number[],
> {
  /**
   * The wallet address to query capabilities for. Defaults to the connected
   * signer address.
   */
  address?: Address;
  /**
   * The chain IDs to query capabilities for. If not provided, the wallet
   * should return capabilities for all chains it supports.
   */
  chainIds?: TChainIds;
}

/**
 * The capabilities of a wallet by chain id, as defined by EIP-5792.
 */
export type WalletCapabilities<TChainIds extends readonly number[] = number[]> =
  TChainIds extends readonly []
    ? {
        [chainId: number]: WalletCapability;
      }
    : {
        [K in TChainIds[number]]: WalletCapability;
      };

type WalletCallsVersion = "2.0.0" | (string & {});

/**
 * The status of a wallet call batch, as defined by EIP-5792.
 */
export interface WalletCallsStatus<TId extends HexString = HexString> {
  /**
   * The version of the API being used.
   */
  version: WalletCallsVersion;
  chainId: number;

  /**
   * The call batch identifier.
   */
  id: TId;

  /**
   * Current state of the batch.
   */
  status:
    | "pending"
    | "confirmed"
    | "failed"
    | "reverted"
    | "partially-reverted";

  /**
   * The actual status code of the batch.
   * - `1xx`: Pending states
   *   - `100`: Batch has been received by the wallet but has not completed execution onchain
   * - `2xx`: Confirmed states
   *   - `200`: Batch has been included onchain without reverts
   * - ``4xx``: Offchain failures
   *   - `400`: Batch has not been included onchain and wallet will not retry
   * - `5xx`: Chain rules failures
   *   - `500`: Batch reverted completely and only changes related to gas charge may have been included onchain
   * - `6xx`: Partial chain rules failures
   *   - `600`: Batch reverted partially and some changes related to batch calls may have been included onchain
   */
  statusCode: number;

  /**
   * Whether the wallet executed the calls atomically or not. If `true`, the
   * wallet executed all calls in a single transaction. If `false`, the wallet
   * executed the calls in multiple transactions.
   */
  atomic: boolean;

  /**
   * The receipts associated with the call batch, if available. The structure
   * depends on the atomic field:
   * - If atomic is `true`, this may be a single receipt or an array of
   *   receipts, corresponding to how the batch was included onchain.
   * - If atomic is `false`, this must be an array of receipts for all
   *   transactions containing batch calls that were included onchain.
   */
  receipts?: WalletCallsReceipt[];

  /**
   * Capability-specific metadata.
   */
  capabilities?: {
    [capability: string]: unknown;
  };
}

/**
 * @internal
 */
export type WalletCapabilityOptions<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  [key: string]: unknown;
  optional?: boolean;
} & T;

/**
 * Capability-specific options for EIP-5792 calls.
 */
export type WalletCapabilitiesOptions = {
  [capability: string]: WalletCapabilityOptions;
} & {
  paymasterService?: WalletCapabilityOptions<{
    url: `https://${string}` | `http://${string}`;
    context?: Record<string, any>;
  }>;
};

/**
 * Options for an EIP-5792 call.
 */
export interface WalletCallOptions {
  /**
   * Value in wei to send with this call.
   * @default 0n
   */
  value?: bigint;
  /**
   * Call-specific capability parameters.
   */
  capabilities?: WalletCapabilitiesOptions;
}

/**
 * Parameters for a wallet call, which can be a function call, deploy call, or
 * a target call.
 */
export type WalletCallParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OneOf<
  | TargetCallParams
  | FunctionCallParams<TAbi, TFunctionName>
  | EncodeDeployDataParams<TAbi>
  | EncodedDeployCallParams
> &
  WalletCallOptions;

export interface SendCallsOptions {
  /**
   * The version of the wallet calls API to use.
   *
   * @default "2.0.0"
   */
  version?: WalletCallsVersion;

  /**
   * A unique identifier for this batch of calls. If provided, must be a unique
   * string up to 4096 bytes (8194 characters including leading 0x). Must be
   * unique per sender per app. If not provided, the wallet will generate a
   * random ID.
   */
  id?: HexString;

  /**
   * The chain ID to send the calls on. Defaults to the chain ID of the network
   * the wallet is connected to.
   */
  chainId?: number;

  /**
   * The address to send the calls from. Defaults to the connected signer if
   * available. If not provided, the wallet should allow the user to select the
   * address during confirmation.
   */
  from?: Address;

  /**
   * Specifies whether the wallet must execute all calls atomically (in a single
   * transaction) or not. If set to `true`, the wallet MUST execute all calls
   * atomically and contiguously. If set to `false`, the wallet MUST execute
   * calls sequentially (one after another), but they need not be contiguous
   * (other transactions may be interleaved) and some calls may fail
   * independently.
   *
   * @default true
   */
  atomic?: boolean;

  /**
   * An object where the keys are capability names and the values are
   * capability-specific parameters. The wallet MUST support all non-optional
   * capabilities requested or reject the request.
   */
  capabilities?: WalletCapabilitiesOptions;
}

// TODO: onMined
/**
 * Parameters for sending a batch of calls to a wallet.
 */
export interface SendCallsParams<TCalls extends readonly unknown[] = any[]>
  extends SendCallsOptions {
  /**
   * The calls to send. Each call must be a valid function call for the
   * specified ABI.
   */
  calls: {
    [K in keyof TCalls]: NarrowTo<
      { abi: Abi },
      TCalls[K]
    >["abi"] extends infer TAbi extends Abi
      ? WalletCallParams<
          TAbi,
          NarrowTo<{ fn: FunctionName<TAbi> }, TCalls[K]>["fn"]
        > extends infer TParams
        ? NarrowTo<TParams, Replace<TParams, TCalls[K]>>
        : never
      : never;
  };
}

export interface SendCallsReturn {
  /**
   * A call batch identifier that can be used to track the status of the calls.
   */
  id: HexString;
  /**
   * Capability-specific response data.
   */
  capabilities?: {
    [capability: string]: unknown;
  };
}

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
  /**
   * A callback that's called with the transaction receipt when the transaction
   * is mined.
   */
  onMined?: (receipt: TransactionReceipt | undefined) => void;
  /**
   * The timeout for the onMined callback in milliseconds. If the transaction is
   * not mined within this time, the callback will not be called.
   *
   * This is forwarded to the method that will wait for the transaction receipt
   * and inherits it's default.
   */
  onMinedTimeout?: number;
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

// Estimate gas //

export type EstimateGasParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<
    TAbi,
    "nonpayable" | "payable"
  > = FunctionName<TAbi, "nonpayable" | "payable">,
> = OneOf<
  | (TargetCallParams & Eip4844Options)
  | FunctionCallParams<TAbi, TFunctionName>
  | EncodeDeployDataParams<TAbi>
  | EncodedDeployCallParams
> &
  CallOptions;

// Send transaction //

// https://github.com/ethereum/execution-apis/blob/40088597b8b4f48c45184da002e27ffc3c37641f/src/eth/submit.yaml#L1
export type SendTransactionParams = OneOf<
  (TargetCallParams & Eip4844Options) | EncodedDeployCallParams
> &
  WriteOptions;
