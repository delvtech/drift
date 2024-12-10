import type { Abi } from "abitype";
import {
  AbiConstructor,
  AbiEvent,
  AbiFunction,
  type AbiItem,
  AbiParameters,
  Address,
  Block,
  Hex,
  Provider,
  RpcTransport,
  Transaction,
  TransactionReceipt,
} from "ox";
import type { AbiArrayType, Bytes, HexString } from "src/adapter/types/Abi";
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
  DecodedFunctionData,
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
import { arrayToFriendly } from "src/adapter/utils/arrayToFriendly";
import { objectToArray } from "src/adapter/utils/objectToArray";
import { CodeCaller } from "src/artifacts/CodeCaller";
import { DriftError } from "src/error/DriftError";
import type { AnyObject } from "src/utils/types";

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
        : "window" in globalThis
          ? window.ethereum
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
            prepBlockParam(params?.blockNumber ?? params?.blockTag),
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
        params: [params.address, prepBlockParam(params.block)],
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
    let _data = data;

    // Use CodeCaller to call bytecode
    if (bytecode && data) {
      const CodeCallerConstructor = AbiConstructor.fromAbi(CodeCaller.abi);
      _data = AbiConstructor.encode(CodeCallerConstructor, {
        bytecode: CodeCaller.bytecode,
        args: [bytecode, data],
      });
    }

    return this.provider.request({
      method: "eth_call",
      params: [
        {
          to,
          data: _data,
          ...prepCallParams(options),
        },
        prepBlockParam(block),
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
            fromBlock: prepBlockParam(fromBlock),
            toBlock: prepBlockParam(toBlock),
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
    const { data, abiFn } = prepFunctionData({
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
          prepBlockParam(block),
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
    const { abiFn, data } = prepFunctionData({
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
            ...prepCallParams(options),
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
    const { data } = prepFunctionData({
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
            ...prepCallParams(options),
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
  >({ abi, fn, args }: EncodeFunctionDataParams<TAbi, TFunctionName>) {
    try {
      const { data } = prepFunctionData({
        abi,
        fn,
        args: args as FunctionArgs<TAbi, TFunctionName>,
      });
      return data;
    } catch (e) {
      handleError(e);
    }
  }

  encodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({
    abi,
    fn,
    value,
  }: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes {
    const abiFn = AbiFunction.fromAbi(abi, fn as any);
    return AbiFunction.encodeResult(abiFn, value as any, {
      as: "Object",
    });
  }

  decodeFunctionData<
    TAbi extends Abi = Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >({ abi, data }: DecodeFunctionDataParams<TAbi, TFunctionName>) {
    try {
      const sig = Hex.slice(data, 0, 4);
      const abiFn = AbiFunction.fromAbi(abi, sig);

      return {
        functionName: abiFn.name as TFunctionName,
        args: AbiParameters.decode(abiFn.inputs, Hex.slice(data, 4), {
          as: "Object",
        }),
      } as DecodedFunctionData<TAbi, TFunctionName>;
    } catch (e) {
      handleError(e);
    }
  }

  decodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >({
    abi,
    data,
    fn,
  }: DecodeFunctionReturnParams<TAbi, TFunctionName>): FunctionReturn<
    TAbi,
    TFunctionName
  > {
    try {
      const abiFn = AbiFunction.fromAbi(abi, fn as any);
      const arrayResult = AbiFunction.decodeResult(abiFn, data, {
        as: "Array",
      });

      return arrayToFriendly({
        abi,
        name: fn,
        kind: "outputs",
        values: arrayResult as AbiArrayType<
          TAbi,
          "function",
          TFunctionName,
          "outputs"
        >,
      });
    } catch (e) {
      handleError(e);
    }
  }
}

function prepBlockParam(block?: BlockTag | bigint): HexString | BlockTag {
  if (block === undefined) {
    return "latest";
  }
  if (typeof block === "bigint") {
    return `0x${block.toString(16)}`;
  }
  return block;
}

function prepFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
>({
  abi,
  args,
  fn,
}: { abi: TAbi; fn: TFunctionName; args: FunctionArgs<TAbi, TFunctionName> }) {
  try {
    const argsArray = objectToArray({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args as FunctionArgs<TAbi, TFunctionName>,
    });
    const abiFn = AbiFunction.fromAbi(
      abi,
      fn as any,
      {
        args: argsArray,
      } as AbiItem.fromAbi.Options,
    );
    return {
      abiFn,
      data: AbiFunction.encodeData(abiFn, argsArray),
    };
  } catch (e) {
    handleError(e);
  }
}

function prepCallParams({
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

function handleError(error: any): never {
  if (typeof error !== "object") {
    throw new DriftError(error);
  }

  const _error = { message: "" };
  let details: AnyObject | undefined;

  try {
    details = JSON.parse(error.details);
  } catch {}

  if (error.shortMessage) {
    _error.message += error.shortMessage;
  }
  if (details?.message) {
    _error.message += `\n${details.message}`;
  }
  _error.message += `\n${error.message.replace(error.shortMessage, "").trimStart()}`;
  _error.message = _error.message.trimStart();

  throw new DriftError(_error);
}

declare global {
  interface Window {
    ethereum: any;
  }
}
