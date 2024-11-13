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
  AdapterDecodeFunctionDataParams,
  AdapterEncodeFunctionDataParams,
  AdapterGetEventsParams,
  AdapterReadParams,
  AdapterWriteParams,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import type { BlockTag, Block as BlockType } from "src/adapter/types/Block";
import type { EventArgs, EventName } from "src/adapter/types/Event";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
  FunctionReturn,
} from "src/adapter/types/Function";
import type {
  NetworkGetBalanceParams,
  NetworkGetBlockParams,
  NetworkGetTransactionParams,
  NetworkWaitForTransactionParams,
} from "src/adapter/types/Network";
import type { TransactionReceipt as TransactionReceiptType } from "src/adapter/types/Transaction";
import { objectToArray } from "src/adapter/utils/objectToArray";
import { DriftError } from "src/error/DriftError";

export interface OxAdapterParams {
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
  }: OxAdapterParams = {}) {
    this.provider = Provider.from(
      rpcUrl
        ? RpcTransport.fromHttp(rpcUrl)
        : "window" in globalThis
          ? window.ethereum
          : undefined,
    );
    this.pollingInterval = pollingInterval;
  }

  getChainId = () => {
    return this.provider
      .request({
        method: "eth_chainId",
      })
      .then(Number);
  };

  getBlockNumber = () => {
    return this.provider
      .request({
        method: "eth_blockNumber",
      })
      .then(BigInt);
  };

  getBlock = (
    params?: NetworkGetBlockParams,
  ): Promise<BlockType | undefined> => {
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
      );
  };

  getBalance = (params: NetworkGetBalanceParams) => {
    return this.provider
      .request({
        method: "eth_getBalance",
        params: [params.address, blockParam(params.block)],
      })
      .then(BigInt);
  };

  decodeFunctionData = <
    TAbi extends Abi = Abi,
    TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
  >({
    abi,
    data,
  }: AdapterDecodeFunctionDataParams<TAbi, TFunctionName>) => {
    try {
      const sig = Hex.slice(data, 0, 4);
      const abiFn = AbiFunction.fromAbi(abi, sig);

      return {
        functionName: abiFn.name as TFunctionName,
        args: AbiParameters.decode(abiFn.inputs, Hex.slice(data, 4), {
          as: "Object",
        }),
      } as DecodedFunctionData<TAbi, TFunctionName>;
    } catch (error) {
      throw new DriftError(error);
    }
  };

  encodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({
    abi,
    fn,
    args,
  }: AdapterEncodeFunctionDataParams<TAbi, TFunctionName>) => {
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
    } catch (error) {
      throw new DriftError(error);
    }
  };

  getTransaction = ({ hash }: NetworkGetTransactionParams) => {
    return this.provider
      .request({
        method: "eth_getTransactionByHash",
        params: [hash],
      })
      .then(Transaction.fromRpc)
      .then((tx) => tx ?? undefined);
  };

  waitForTransaction = ({
    hash,
    timeout = OxAdapter.DEFAULT_TIMEOUT,
  }: NetworkWaitForTransactionParams) => {
    return new Promise<TransactionReceiptType | undefined>(
      (resolve, reject) => {
        const interval = setInterval(() => {
          this.provider
            .request({
              method: "eth_getTransactionReceipt",
              params: [hash],
            })
            .then(TransactionReceipt.fromRpc)
            .then((receipt) => {
              if (receipt) {
                clearInterval(interval);
                resolve(receipt);
              }
            })
            .catch(reject);
        }, this.pollingInterval);

        setTimeout(() => {
          clearInterval(interval);
          resolve(undefined);
        }, timeout);
      },
    );
  };

  getEvents = <TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event,
    filter,
    fromBlock,
    toBlock,
  }: AdapterGetEventsParams<TAbi, TEventName>) => {
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
      );
  };

  read = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({
    abi,
    address,
    fn,
    args,
    block,
  }: AdapterReadParams<TAbi, TFunctionName>) => {
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
      .then((data) => AbiFunction.decodeResult(abiFn, data)) as Promise<
      FunctionReturn<TAbi, TFunctionName>
    >;
  };

  simulateWrite = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    adapterParams: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    const { abiFn, params } = writeParams(adapterParams);
    return this.provider
      .request({
        method: "eth_call",
        params: params as any,
      })
      .then((data) => AbiFunction.decodeResult(abiFn, data)) as Promise<
      FunctionReturn<TAbi, TFunctionName>
    >;
  };

  getSignerAddress = async () => {
    const [address] = await this.provider.request({ method: "eth_accounts" });
    if (!address) throw new DriftError("No signer address found");
    return Address.checksum(address);
  };

  write = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    adapterParams: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    const { params } = writeParams(adapterParams);
    const from = params[0].from || (await this.getSignerAddress());
    return this.provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          ...params[0],
          from,
        },
      ],
    });
  };
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

function writeParams<
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
  to,
  value,
  ...rest
}: AdapterWriteParams<TAbi, TFunctionName>) {
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
        to: to ?? address,
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