import type { Abi } from "abitype";
import {
  AbiEvent,
  AbiFunction,
  type AbiItem,
  Address,
  Block,
  Provider,
  RpcTransport,
  Transaction,
  TransactionReceipt,
} from "ox";
import type { Bytes, HexString } from "src/adapter/types/Abi";
import type {
  CallParams,
  DecodeFunctionDataParams,
  DecodeFunctionReturnParams,
  EncodeFunctionDataParams,
  EncodeFunctionReturnParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { BlockTag } from "src/adapter/types/Block";
import type { ContractCallOptions } from "src/adapter/types/Contract";
import type { EventArgs, EventName } from "src/adapter/types/Event";
import type {
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  GetBalanceParams,
  GetBlockParams,
  GetTransactionParams,
  WaitForTransactionParams,
} from "src/adapter/types/Network";
import type { TransactionReceipt as TransactionReceiptType } from "src/adapter/types/Transaction";
import { decodeFunctionData } from "src/adapter/utils/decodeFunctionData";
import { decodeFunctionReturn } from "src/adapter/utils/decodeFunctionReturn";
import { encodeFunctionData } from "src/adapter/utils/encodeFunctionData";
import { encodeFunctionReturn } from "src/adapter/utils/encodeFunctionReturn";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareFunctionData } from "src/adapter/utils/internal/prepareFunctionData";
import { objectToArray } from "src/adapter/utils/objectToArray";
import { prepareBytecodeCallData } from "src/adapter/utils/prepareBytecodeCallData";
import { DriftError } from "src/error/DriftError";

export interface OxAdapterConfig {
  rpcUrl?: string;
  /**
   * Polling frequency in milliseconds
   * @default 4_000
   */
  pollingInterval?: number;
}

export class OxAdapter implements ReadWriteAdapter {
  provider: Provider.Provider;
  pollingInterval: number;

  static DEFAULT_POLLING_INTERVAL = 4_000;
  static DEFAULT_TIMEOUT = 60_000; // 1 minute

  constructor({
    rpcUrl,
    pollingInterval = OxAdapter.DEFAULT_POLLING_INTERVAL,
  }: OxAdapterConfig = {}) {
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

  getBlock(params?: GetBlockParams) {
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
      .catch(handleError);
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
      data = prepareBytecodeCallData(bytecode, data);
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
    const abiEvent = AbiEvent.fromAbi(
      abi,
      event as any,
      {
        args: objectToArray({
          abi,
          type: "event",
          name: event,
          kind: "inputs",
          value: filter as EventArgs<TAbi, TEventName>,
        }),
      } as AbiItem.fromAbi.Options,
    );

    const logs = await this.provider
      .request({
        method: "eth_getLogs",
        params: [
          {
            address,
            fromBlock: prepareBlockParam(fromBlock),
            toBlock: prepareBlockParam(toBlock),
            topics: AbiEvent.encode(abiEvent, filter || {}).topics,
          },
        ],
      })
      .catch(handleError);

    return logs.map((log) => {
      return {
        args: AbiEvent.decode(abiEvent, log) as EventArgs<TAbi, TEventName>,
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

    const result = await this.provider
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

    return AbiFunction.decodeResult(abiFn, result) as Promise<
      FunctionReturn<TAbi, TFunctionName>
    >;
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

    return AbiFunction.decodeResult(abiFn, result) as Promise<
      FunctionReturn<TAbi, TFunctionName>
    >;
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

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionDataParams<TAbi, TFunctionName>) {
    return encodeFunctionData(params);
  }

  encodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes {
    return encodeFunctionReturn(params);
  }

  decodeFunctionData<
    TAbi extends Abi = Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(params: DecodeFunctionDataParams<TAbi, TFunctionName>) {
    return decodeFunctionData(params);
  }

  decodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >(
    params: DecodeFunctionReturnParams<TAbi, TFunctionName>,
  ): FunctionReturn<TAbi, TFunctionName> {
    return decodeFunctionReturn(params);
  }
}

function prepareBlockParam(block?: BlockTag | bigint): HexString | BlockTag {
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
  return [
    {
      ...rest,
      chainId:
        chainId === undefined
          ? undefined
          : (`0x${chainId.toString(16)}` as HexString),
      gas:
        gas === undefined ? undefined : (`0x${gas.toString(16)}` as HexString),
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
    },
  ] as const;
}

declare global {
  interface Window {
    ethereum: any;
  }
}
