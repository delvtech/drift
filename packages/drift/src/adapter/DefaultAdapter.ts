import {
  AbiEvent,
  Address,
  Block,
  Provider,
  RpcTransport,
  Transaction,
  TransactionReceipt,
} from "ox";
import { AbiEncoder } from "src/adapter/AbiEncoder";
import type {
  Abi,
  Address as AddressType,
  Bytes,
  Hash,
  HexString,
} from "src/adapter/types/Abi";
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
import type { BlockIdentifier, BlockTag } from "src/adapter/types/Block";
import type { EventArgs, EventLog, EventName } from "src/adapter/types/Event";
import type {
  ConstructorArgs,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockReturn,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type {
  Eip4844Options,
  TransactionOptions,
  TransactionReceipt as TransactionReceiptType,
  Transaction as TransactionType,
} from "src/adapter/types/Transaction";
import { _decodeFunctionReturn } from "src/adapter/utils/decodeFunctionReturn";
import { encodeBytecodeCallData } from "src/adapter/utils/encodeBytecodeCallData";
import { prepareFunctionData } from "src/adapter/utils/encodeFunctionData";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParams } from "src/adapter/utils/prepareParams";
import { IMulticall3 } from "src/artifacts/IMulticall3";
import { DriftError } from "src/error/DriftError";
import { isHexString } from "src/utils/isHexString";

export interface DefaultAdapterOptions {
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
  multicallAddress?: AddressType;
}

export class DefaultReadAdapter extends AbiEncoder implements ReadAdapter {
  provider: Provider.Provider;
  pollingInterval: number;
  pollingTimeout: number;
  multicallAddress: AddressType;

  static DEFAULT_POLLING_INTERVAL = 4_000 as const;
  static DEFAULT_TIMEOUT = 60_000 as const; // 1 minute
  static DEFAULT_MULTICALL_ADDRESS =
    "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

  constructor({
    rpcUrl,
    pollingInterval = DefaultReadAdapter.DEFAULT_POLLING_INTERVAL,
    pollingTimeout = DefaultReadAdapter.DEFAULT_TIMEOUT,
    multicallAddress = DefaultReadAdapter.DEFAULT_MULTICALL_ADDRESS,
  }: DefaultAdapterOptions = {}) {
    super();
    try {
      const provider = rpcUrl
        ? RpcTransport.fromHttp(rpcUrl)
        : "ethereum" in globalThis
          ? (globalThis as any).ethereum
          : undefined;

      if (!provider) {
        throw new DriftError("No provider found");
      }

      this.provider = Provider.from(provider);
    } catch (e) {
      handleError(e);
    }
    this.pollingInterval = pollingInterval;
    this.pollingTimeout = pollingTimeout;
    this.multicallAddress = multicallAddress;
  }

  getChainId() {
    return this.provider
      .request({
        method: "eth_chainId",
      })
      .then(Number)
      .catch(handleError);
  }

  getBlockNumber() {
    return this.provider
      .request({
        method: "eth_blockNumber",
      })
      .then(BigInt)
      .catch(handleError);
  }

  getBlock<T extends BlockIdentifier | undefined = undefined>(
    blockId?: T,
  ): Promise<GetBlockReturn<T>> {
    return this.provider
      .request(
        isHexString(blockId)
          ? {
              method: "eth_getBlockByHash",
              params: [blockId, false],
            }
          : {
              method: "eth_getBlockByNumber",
              params: [prepareBlockParam(blockId), false],
            },
      )
      .then(Block.fromRpc)
      .then((block) =>
        block
          ? {
              ...block,
              nonce: BigInt(block.nonce),
              transactions: block.transactions.slice(),
            }
          : undefined,
      )
      .catch(handleError) as Promise<GetBlockReturn<T>>;
  }

  getBalance(params: GetBalanceParams): Promise<bigint> {
    return this.provider
      .request({
        method: "eth_getBalance",
        params: [params.address, prepareBlockParam(params.block)],
      })
      .then(BigInt)
      .catch(handleError);
  }

  async getTransaction({
    hash,
  }: GetTransactionParams): Promise<TransactionType | undefined> {
    const tx = await this.provider
      .request({
        method: "eth_getTransactionByHash",
        params: [hash],
      })
      .catch(handleError);
    if (tx) {
      const { to, transactionIndex, ...parsed } = Transaction.fromRpc(tx);
      return {
        ...parsed,
        to: to || undefined,
        transactionIndex: BigInt(transactionIndex),
        transactionHash: parsed.hash,
      };
    }
    return undefined;
  }

  async waitForTransaction({
    hash,
    timeout = this.pollingTimeout,
  }: WaitForTransactionParams) {
    return new Promise<TransactionReceiptType | undefined>(
      (resolve, reject) => {
        const getReceipt = (): any =>
          this.provider
            .request({
              method: "eth_getTransactionReceipt",
              params: [hash],
            })
            .then((receipt) => {
              if (receipt) {
                const {
                  to,
                  transactionIndex,
                  contractAddress,
                  ...parsedReceipt
                } = TransactionReceipt.fromRpc(receipt);
                resolve({
                  ...parsedReceipt,
                  to: to || undefined,
                  transactionIndex: BigInt(transactionIndex),
                  contractAddress: contractAddress || undefined,
                });
              } else {
                setTimeout(getReceipt, this.pollingInterval);
              }
            })
            .catch(reject);

        getReceipt();
        setTimeout(() => resolve(undefined), timeout);
      },
    ).catch(handleError);
  }

  sendRawTransaction(transaction: Bytes): Promise<Hash> {
    return this.provider.request({
      method: "eth_sendRawTransaction",
      params: [transaction],
    });
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event,
    filter,
    fromBlock,
    toBlock,
  }: GetEventsParams<TAbi, TEventName>): Promise<EventLog<TAbi, TEventName>[]> {
    const { abiEntry } = prepareParams({
      abi,
      type: "event",
      name: event,
      kind: "inputs",
      value: filter as EventArgs<TAbi, TEventName>,
    });

    const logs = await this.provider
      .request({
        method: "eth_getLogs",
        params: [
          {
            address,
            fromBlock: prepareBlockParam(fromBlock),
            toBlock: prepareBlockParam(toBlock),
            topics: AbiEvent.encode(abiEntry, filter || {}).topics,
          },
        ],
      })
      .catch(handleError);

    return logs.map((log) => {
      return {
        args: AbiEvent.decode(abiEntry, log) as EventArgs<TAbi, TEventName>,
        blockNumber: BigInt(log.blockNumber),
        data: log.data,
        eventName: event,
        transactionHash: log.transactionHash,
      };
    });
  }

  call({ to, data, bytecode, block, ...options }: CallParams): Promise<Bytes> {
    if (bytecode && data) {
      data = encodeBytecodeCallData(bytecode, data);
    }

    return this.provider
      .request({
        method: "eth_call",
        params: [
          {
            to,
            data,
            ...prepareTransactionOptions(options),
          },
          prepareBlockParam(block),
        ],
      })
      .catch(handleError);
  }

  async multicall<
    TCalls extends { abi: Abi }[],
    TAllowFailure extends boolean = true,
  >({
    calls,
    multicallAddress = this.multicallAddress,
    allowFailure = true as TAllowFailure,
    ...options
  }: MulticallParams<TCalls, TAllowFailure>): Promise<
    MulticallReturn<TCalls, TAllowFailure>
  > {
    const results = await this.simulateWrite({
      abi: IMulticall3.abi,
      address: multicallAddress,
      fn: "aggregate3",
      args: {
        calls: calls.map((read) => ({
          target: read.address,
          callData: this.encodeFunctionData({
            abi: read.abi,
            fn: read.fn,
            args: read.args,
          }),
          allowFailure,
        })),
      },
      ...options,
    });

    return results.map(({ returnData, success }, i) => {
      const { abi, fn } = calls[i]!; // Assume a read for each result

      // TODO: If allowFailure is true but the call fails, will it reach this
      // point? And, how will decodeFunctionReturn handle it?
      if (!allowFailure) {
        return this.decodeFunctionReturn({ abi, data: returnData, fn });
      }

      if (!success) {
        return {
          success,
          error: new DriftError(
            // Slice off the `0x` prefix and the first 4 bytes (function
            // selector) to get the error message.
            Buffer.from(returnData.slice(10), "hex").toString(),
          ),
        };
      }

      return {
        success,
        value: this.decodeFunctionReturn({ abi, data: returnData, fn }),
      };
    }) as MulticallReturn<TCalls, TAllowFailure>;
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({
    abi,
    address,
    fn,
    args = {} as FunctionArgs<TAbi, TFunctionName>,
    block,
  }: ReadParams<TAbi, TFunctionName>): Promise<
    FunctionReturn<TAbi, TFunctionName>
  > {
    const { data, abiFn } = prepareFunctionData({ abi, fn, args });
    const returnData = await this.call({ to: address, data, block });
    return _decodeFunctionReturn<TAbi, TFunctionName>({
      abi,
      data: returnData,
      fn: abiFn,
    });
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    abi,
    fn,
    args = {} as FunctionArgs<TAbi, TFunctionName>,
    address,
    ...options
  }: SimulateWriteParams<TAbi, TFunctionName>): Promise<
    FunctionReturn<TAbi, TFunctionName>
  > {
    const { abiFn, data } = prepareFunctionData({ abi, fn, args });
    const result = await this.call({
      data,
      to: address,
      ...options,
    });
    return _decodeFunctionReturn<TAbi, TFunctionName>({
      abi,
      data: result,
      fn: abiFn,
    });
  }
}

export class DefaultAdapter
  extends DefaultReadAdapter
  implements ReadWriteAdapter
{
  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    from,
    ...restParams
  }: SimulateWriteParams<TAbi, TFunctionName>): Promise<
    FunctionReturn<TAbi, TFunctionName>
  > {
    return super.simulateWrite({
      from: from ?? (await this.getSignerAddress().catch(() => undefined)),
      ...restParams,
    } as SimulateWriteParams<TAbi, TFunctionName>);
  }

  async getSignerAddress(): Promise<AddressType> {
    const [address] = await this.provider
      .request({ method: "eth_accounts" })
      .catch(handleError);
    if (!address) throw new DriftError("No signer address found");
    return Address.checksum(address);
  }

  async sendTransaction({
    data,
    to,
    from,
    onMined,
    ...options
  }: SendTransactionParams): Promise<Hash> {
    const hash = await this.provider
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            data,
            to,
            from: from ?? (await this.getSignerAddress()),
            ...prepareTransactionOptions(options),
          },
        ],
      })
      .catch(handleError);

    if (onMined) {
      this.waitForTransaction({ hash }).then(onMined);
    }

    return hash;
  }

  deploy<TAbi extends Abi>({
    abi,
    bytecode,
    args = {} as ConstructorArgs<TAbi>,
    ...options
  }: DeployParams<TAbi>): Promise<Hash> {
    const data = this.encodeDeployData({ abi, bytecode, args });
    return this.sendTransaction({ data, ...options });
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    abi,
    fn,
    args = {} as FunctionArgs<TAbi, TFunctionName>,
    address,
    ...options
  }: WriteParams<TAbi, TFunctionName>): Promise<Hash> {
    const data = this.encodeFunctionData({ abi, fn, args });
    return this.sendTransaction({ data, to: address, ...options });
  }
}

function prepareBlockParam(block?: BlockIdentifier): HexString | BlockTag {
  if (block === undefined) {
    return "latest";
  }
  if (typeof block === "bigint") {
    return `0x${block.toString(16)}`;
  }
  return block;
}

function prepareTransactionOptions({
  chainId,
  gas,
  gasPrice,
  maxFeePerBlobGas,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  value,
  ...rest
}: TransactionOptions & Eip4844Options) {
  return {
    ...rest,
    chainId:
      chainId === undefined
        ? undefined
        : (`0x${chainId.toString(16)}` as HexString),
    gas: gas === undefined ? undefined : (`0x${gas.toString(16)}` as HexString),
    gasPrice:
      gasPrice === undefined
        ? undefined
        : (`0x${gasPrice.toString(16)}` as HexString),
    maxFeePerBlobGas:
      maxFeePerBlobGas === undefined
        ? undefined
        : (`0x${maxFeePerBlobGas.toString(16)}` as HexString),
    maxFeePerGas:
      maxFeePerGas === undefined
        ? undefined
        : (`0x${maxFeePerGas.toString(16)}` as HexString),
    maxPriorityFeePerGas:
      maxPriorityFeePerGas === undefined
        ? undefined
        : (`0x${maxPriorityFeePerGas.toString(16)}` as HexString),
    nonce:
      nonce === undefined
        ? undefined
        : (`0x${nonce.toString(16)}` as HexString),
    value:
      value === undefined
        ? undefined
        : (`0x${value.toString(16)}` as HexString),
  };
}

declare global {
  interface Window {
    ethereum: any;
  }
}
