import type { Abi } from "abitype";
import {
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
import type { HexString } from "src/adapter/types/Abi";
import type {
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadParams,
  ReadWriteAdapter,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { BlockTag } from "src/adapter/types/Block";
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
import { objectToArray } from "src/adapter/utils/objectToArray";
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
            blockParam(params?.blockNumber ?? params?.blockTag),
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
        params: [params.address, blockParam(params.block)],
      })
      .then(BigInt)
      .catch(handleError);
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

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, fn, args }: EncodeFunctionDataParams<TAbi, TFunctionName>) {
    try {
      return AbiFunction.encodeData(
        AbiFunction.fromAbi(abi, fn as any),
        objectToArray({
          abi,
          type: "function",
          name: fn,
          kind: "inputs",
          value: args as FunctionArgs<TAbi, TFunctionName>,
        }),
      );
    } catch (e) {
      handleError(e);
    }
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

  getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event,
    filter,
    fromBlock,
    toBlock,
  }: GetEventsParams<TAbi, TEventName>) {
    const abiFn = AbiEvent.fromAbi(
      abi,
      event as any,
      {
        args: objectToArray({
          abi,
          type: "event",
          name: event,
          kind: "inputs",
          value: filter as any,
        }),
      } as AbiItem.fromAbi.Options,
    );
    return this.provider
      .request({
        method: "eth_getLogs",
        params: [
          {
            address,
            fromBlock: blockParam(fromBlock),
            toBlock: blockParam(toBlock),
            topics: AbiEvent.encode(abiFn, filter as any).topics,
          },
        ],
      })
      .then((logs) =>
        logs.map((log) => {
          return {
            args: AbiEvent.decode(abiFn, log) as EventArgs<TAbi, TEventName>,
            blockNumber: BigInt(log.blockNumber),
            data: log.data,
            eventName: event,
            transactionHash: log.transactionHash,
          };
        }),
      )
      .catch(handleError);
  }

  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ abi, address, fn, args, block }: ReadParams<TAbi, TFunctionName>) {
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
    return this.provider
      .request({
        method: "eth_call",
        params: [
          {
            to: address,
            data: AbiFunction.encodeData(abiFn, argsArray),
          },
          blockParam(block),
        ],
      })
      .then(
        (data) =>
          AbiFunction.decodeResult(abiFn, data) as Promise<
            FunctionReturn<TAbi, TFunctionName>
          >,
      )
      .catch(handleError);
  }

  simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(writeParams: SimulateWriteParams<TAbi, TFunctionName>) {
    const { abiFn, params } = prepWriteParams(writeParams);
    return this.provider
      .request({
        method: "eth_call",
        params: params as any,
      })
      .then(
        (data) =>
          AbiFunction.decodeResult(abiFn, data) as Promise<
            FunctionReturn<TAbi, TFunctionName>
          >,
      )
      .catch(handleError);
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
  >(writeParams: WriteParams<TAbi, TFunctionName>) {
    const { params } = prepWriteParams(writeParams);
    const from = params[0].from || (await this.getSignerAddress());
    const hash = await this.provider
      .request({
        method: "eth_sendTransaction",
        params: [
          {
            ...params[0],
            from,
          },
        ],
      })
      .catch(handleError);

    if (writeParams.onMined) {
      this.waitForTransaction({ hash }).then(writeParams.onMined);
    }

    return hash;
  }
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

function blockParam(block?: BlockTag | bigint): HexString | BlockTag {
  if (block === undefined) {
    return "latest";
  }
  if (typeof block === "bigint") {
    return `0x${block.toString(16)}`;
  }
  return block;
}

function prepWriteParams<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
>({
  abi,
  address,
  args,
  chainId,
  fn,
  gas,
  gasPrice,
  maxFeePerGas,
  maxPriorityFeePerGas,
  nonce,
  value,
  ...rest
}: SimulateWriteParams<TAbi, TFunctionName>) {
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
    params: [
      {
        ...rest,
        chainId: chainId
          ? (`0x${chainId.toString(16)}` as HexString)
          : undefined,
        data: AbiFunction.encodeData(abiFn, argsArray),
        gas: gas ? (`0x${gas.toString(16)}` as HexString) : undefined,
        gasPrice: gasPrice
          ? (`0x${gasPrice.toString(16)}` as HexString)
          : undefined,
        maxFeePerGas: maxFeePerGas
          ? (`0x${maxFeePerGas.toString(16)}` as HexString)
          : undefined,
        maxPriorityFeePerGas: maxPriorityFeePerGas
          ? (`0x${maxPriorityFeePerGas.toString(16)}` as HexString)
          : undefined,
        nonce: nonce ? (`0x${nonce.toString(16)}` as HexString) : undefined,
        to: address,
        value: value ? (`0x${value.toString(16)}` as HexString) : undefined,
      },
    ] as const,
  };
}

declare global {
  interface Window {
    ethereum: any;
  }
}
