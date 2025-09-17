import { AbiEncoder } from "src/adapter/AbiEncoder";
import { deploy } from "src/adapter/methods/deploy";
import { multicall } from "src/adapter/methods/multicall";
import { read } from "src/adapter/methods/read";
import { simulateWrite } from "src/adapter/methods/simulateWrite";
import { write } from "src/adapter/methods/write";
import type {
  Abi,
  Address,
  Bytes,
  Hash,
  HexString,
} from "src/adapter/types/Abi";
import type {
  // biome-ignore lint/correctness/noUnusedImports: Used for JSDoc links
  Adapter,
  CallParams,
  DeployParams,
  EstimateGasParams,
  GetBalanceParams,
  GetBlockReturn,
  GetEventsParams,
  GetTransactionParams,
  GetWalletCapabilitiesParams,
  MulticallParams,
  MulticallReturn,
  ReadAdapter,
  ReadParams,
  ReadWriteAdapter,
  SendCallsParams,
  SendCallsReturn,
  SendTransactionParams,
  SimulateWriteParams,
  WaitForTransactionParams,
  WalletCallsStatus,
  WalletCapabilities,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { BlockIdentifier } from "src/adapter/types/Block";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";

export interface BaseAdapterOptions {
  /**
   * The default polling frequency for polling calls (e.g.
   * {@linkcode Adapter.waitForTransaction waitForTransaction}) in milliseconds.
   * @default 4_000 // 4 seconds
   */
  pollingInterval?: number;
  /**
   * The default timeout for polling calls (e.g.
   * {@linkcode Adapter.waitForTransaction waitForTransaction}) in milliseconds.
   * @default 60_000 // 1 minute
   */
  pollingTimeout?: number;
  /**
   * The default Multicall3 address to use for the
   * {@linkcode Adapter.multicall} method.
   * @default "0xcA11bde05977b3631167028862bE2a173976CA11"
   *
   * @see [Multicall3](https://www.multicall3.com)
   */
  multicallAddress?: Address;
}

export abstract class BaseReadAdapter
  extends AbiEncoder
  implements ReadAdapter
{
  static DEFAULT_POLLING_INTERVAL = 4_000 as const;
  static DEFAULT_TIMEOUT = 60_000 as const; // 1 minute

  pollingInterval: number;
  pollingTimeout: number;
  multicallAddress: Address | undefined;

  constructor({
    pollingInterval = BaseReadAdapter.DEFAULT_POLLING_INTERVAL,
    pollingTimeout = BaseReadAdapter.DEFAULT_TIMEOUT,
    multicallAddress,
  }: BaseAdapterOptions = {}) {
    super();
    this.pollingInterval = pollingInterval;
    this.pollingTimeout = pollingTimeout;
    this.multicallAddress = multicallAddress;
  }

  // Abstract methods //

  abstract getChainId(): Promise<number>;
  abstract getBlockNumber(): Promise<bigint>;
  abstract getBlock<T extends BlockIdentifier | undefined = undefined>(
    blockId?: T,
  ): Promise<GetBlockReturn<T>>;
  abstract getBalance(params: GetBalanceParams): Promise<bigint>;
  abstract getGasPrice(): Promise<bigint>;
  abstract getTransaction(
    params: GetTransactionParams,
  ): Promise<Transaction | undefined>;
  abstract waitForTransaction(
    params: WaitForTransactionParams,
  ): Promise<TransactionReceipt | undefined>;
  abstract sendRawTransaction(transaction: Bytes): Promise<Hash>;
  abstract getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>(
    params: GetEventsParams<TAbi, TEventName>,
  ): Promise<EventLog<TAbi, TEventName>[]>;
  abstract call(params: CallParams): Promise<Bytes>;
  abstract estimateGas<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(transaction: EstimateGasParams<TAbi, TFunctionName>): Promise<bigint>;

  // Default implementations //

  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >(
    params: ReadParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return read(this, params);
  }

  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: SimulateWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return simulateWrite(this, params);
  }

  multicall<
    TCalls extends readonly unknown[],
    TAllowFailure extends boolean = true,
  >({
    multicallAddress = this.multicallAddress,
    ...restParams
  }: MulticallParams<TCalls, TAllowFailure>): Promise<
    MulticallReturn<TCalls, TAllowFailure>
  > {
    return multicall(this, { multicallAddress, ...restParams });
  }
}

export abstract class BaseReadWriteAdapter
  extends BaseReadAdapter
  implements ReadWriteAdapter
{
  // Abstract methods //

  abstract getSignerAddress(): Promise<Address>;
  abstract getWalletCapabilities<
    const TChainIds extends readonly number[] = [],
  >(
    params: GetWalletCapabilitiesParams<TChainIds>,
  ): Promise<WalletCapabilities<TChainIds>>;
  abstract getCallsStatus<TId extends HexString>(
    batchId: TId,
  ): Promise<WalletCallsStatus<TId>>;
  abstract showCallsStatus(batchId: HexString): Promise<void>;
  abstract sendTransaction(params: SendTransactionParams): Promise<Hash>;
  abstract sendCalls<const TCalls extends readonly unknown[] = any[]>(
    params: SendCallsParams<TCalls>,
  ): Promise<SendCallsReturn>;

  // Default method implementations //

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: SimulateWriteParams<TAbi, TFunctionName>,
  ): Promise<FunctionReturn<TAbi, TFunctionName>> {
    return simulateWrite(this, {
      ...params,
      from:
        params.from || (await this.getSignerAddress().catch(() => undefined)),
    });
  }

  deploy<TAbi extends Abi>(params: DeployParams<TAbi>): Promise<Hash> {
    return deploy(this, params);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>): Promise<Hash> {
    return write(this, params);
  }
}
