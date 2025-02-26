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
import type { Abi, HexString } from "src/adapter/types/Abi";
import type {
  CallParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type {
  BlockIdentifier,
  BlockTag,
  Block as BlockType,
} from "src/adapter/types/Block";
import type { ContractCallOptions } from "src/adapter/types/Contract";
import type { EventArgs, EventName } from "src/adapter/types/Event";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockParams,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type { TransactionReceipt as TransactionReceiptType } from "src/adapter/types/Transaction";
import { _decodeFunctionReturn } from "src/adapter/utils/decodeFunctionReturn";
import { encodeBytecodeCallData } from "src/adapter/utils/encodeBytecodeCallData";
import { prepareFunctionData } from "src/adapter/utils/encodeFunctionData";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParamsArray } from "src/adapter/utils/prepareParamsArray";
import { DriftError } from "src/error/DriftError";

export interface OxAdapterConfig {
  rpcUrl?: string;
  /**
   * Polling frequency in milliseconds
   * @default 4_000
   */
  pollingInterval?: number;
}

export class OxAdapter extends AbiEncoder implements ReadWriteAdapter {
  provider: Provider.Provider;
  pollingInterval: number;

  static DEFAULT_POLLING_INTERVAL = 4_000;
  static DEFAULT_TIMEOUT = 60_000; // 1 minute

  constructor({
    rpcUrl,
    pollingInterval = OxAdapter.DEFAULT_POLLING_INTERVAL,
  }: OxAdapterConfig = {}) {
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

  getBlock<T extends BlockIdentifier>(params?: GetBlockParams<T>) {
    return this.provider
      .request({
        method: params?.blockHash
          ? "eth_getBlockByHash"
          : "eth_getBlockByNumber",
        params: [
          params?.blockHash ??
            prepareBlockParam(params?.blockNumber ?? params?.blockTag),
          false,
        ],
      })
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
      .catch(handleError) as Promise<BlockType<T> | undefined>;
  }

  getBalance(params: GetBalanceParams) {
    return this.provider
      .request({
        method: "eth_getBalance",
        params: [params.address, prepareBlockParam(params.block)],
      })
      .then(BigInt)
      .catch(handleError);
  }

  async getTransaction({ hash }: GetTransactionParams) {
    const tx = await this.provider
      .request({
        method: "eth_getTransactionByHash",
        params: [hash],
      })
      .catch(handleError);
    if (tx) {
      const parsed = Transaction.fromRpc(tx);
      return {
        ...parsed,
        transactionIndex: BigInt(parsed.transactionIndex),
      };
    }
    return undefined;
  }

  async waitForTransaction({
    hash,
    timeout = OxAdapter.DEFAULT_TIMEOUT,
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
                const parsedReceipt = TransactionReceipt.fromRpc(receipt);
                resolve({
                  ...parsedReceipt,
                  transactionIndex: BigInt(parsedReceipt.transactionIndex),
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

  call({ to, data, bytecode, block, ...options }: CallParams) {
    if (bytecode && data) {
      data = encodeBytecodeCallData(bytecode, data);
    }

    return this.provider.request({
      method: "eth_call",
      params: [
        {
          to,
          data,
          ...prepareCallParams(options),
        },
        prepareBlockParam(block),
      ],
    });
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event,
    filter,
    fromBlock,
    toBlock,
  }: GetEventsParams<TAbi, TEventName>) {
    const { abiEntry } = prepareParamsArray({
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

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ abi, address, fn, args, block }: ReadParams<TAbi, TFunctionName>) {
    const { data, abiFn } = prepareFunctionData({
      abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });

    const returnData = await this.provider
      .request({
        method: "eth_call",
        params: [
          {
            to: address,
            data,
          },
          prepareBlockParam(block),
        ],
      })
      .catch(handleError);

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
    args,
    address,
    ...options
  }: SimulateWriteParams<TAbi, TFunctionName>) {
    const { abiFn, data } = prepareFunctionData({
      abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });

    const result = await this.provider
      .request({
        method: "eth_call",
        params: [
          {
            to: address,
            data,
            ...prepareCallParams(options),
          },
        ],
      })
      .catch(handleError);

    return _decodeFunctionReturn<TAbi, TFunctionName>({
      abi,
      data: result,
      fn: abiFn,
    });
  }

  async getSignerAddress() {
    const [address] = await this.provider
      .request({ method: "eth_accounts" })
      .catch(handleError);
    if (!address) throw new DriftError("No signer address found");
    return Address.checksum(address);
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    abi,
    fn,
    args,
    address,
    from,
    onMined,
    ...options
  }: WriteParams<TAbi, TFunctionName>) {
    const { data } = prepareFunctionData({
      abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });

    const hash = await this.provider
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            to: address,
            data,
            from: from ?? (await this.getSignerAddress()),
            ...prepareCallParams(options),
          },
        ],
      })
      .catch(handleError);

    if (onMined) {
      this.waitForTransaction({ hash }).then(onMined);
    }

    return hash;
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

function prepareCallParams({
  block, // omitted
  chainId,
  gas,
  gasPrice,
  maxFeePerBlobGas,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  value,
  ...rest
}: ContractCallOptions) {
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
  } as const;
}

declare global {
  interface Window {
    ethereum: any;
  }
}
