import { AbiEncoder } from "src/adapter/AbiEncoder";
import { deploy } from "src/adapter/methods/deploy";
import {
  DEFAULT_MULTICALL_ADDRESS,
  multicall,
} from "src/adapter/methods/multicall";
import { read } from "src/adapter/methods/read";
import { simulateWrite } from "src/adapter/methods/simulateWrite";
import { write } from "src/adapter/methods/write";
import type { Abi, Address, Bytes, Hash } from "src/adapter/types/Abi";
import type {
  CallParams,
  DeployParams,
  GetEventsParams,
  MulticallParams,
  MulticallReturn,
  ReadAdapter,
  ReadParams,
  ReadWriteAdapter,
  SendTransactionParams,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { Adapter } from "src/adapter/types/Adapter";
import type { BlockIdentifier } from "src/adapter/types/Block";
import type { EventLog, EventName } from "src/adapter/types/Event";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockReturn,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";

export interface BaseAdapterOptions {
  rpcUrl?: string;
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
   * {@linkcode Adapter.multicall multicall} method.
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
  pollingInterval: number;
  pollingTimeout: number;
  multicallAddress: Address;

  static DEFAULT_POLLING_INTERVAL = 4_000 as const;
  static DEFAULT_TIMEOUT = 60_000 as const; // 1 minute

  constructor({
    pollingInterval = BaseReadAdapter.DEFAULT_POLLING_INTERVAL,
    pollingTimeout = BaseReadAdapter.DEFAULT_TIMEOUT,
    multicallAddress = DEFAULT_MULTICALL_ADDRESS,
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

  // Default implementations //

  multicall<
    TCalls extends { abi: Abi }[],
    TAllowFailure extends boolean = true,
  >({
    multicallAddress = this.multicallAddress,
    ...restParams
  }: MulticallParams<TCalls, TAllowFailure>): Promise<
    MulticallReturn<TCalls, TAllowFailure>
  > {
    return multicall(this, { multicallAddress, ...restParams });
  }

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
}

export abstract class BaseReadWriteAdapter
  extends BaseReadAdapter
  implements ReadWriteAdapter
{
  // Abstract methods //

  abstract getSignerAddress(): Promise<Address>;
  abstract sendTransaction(params: SendTransactionParams): Promise<Hash>;

  // Default method implementations //

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
