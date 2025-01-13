import {
  type AbiObjectType,
  type Block,
  type Bytes,
  type CallParams,
  type DecodeFunctionDataParams,
  type DecodeFunctionReturnParams,
  type DecodedFunctionData,
  type EncodeFunctionDataParams,
  type EncodeFunctionReturnParams,
  type EventName,
  type FunctionName,
  type FunctionReturn,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type ReadAdapter,
  type ReadParams,
  type TransactionReceipt,
  type WaitForTransactionParams,
  type WriteParams,
  arrayToFriendly,
  arrayToObject,
  objectToArray,
} from "@delvtech/drift";
import {
  http,
  type Abi,
  type CallParameters,
  type GetBalanceParameters,
  type GetBlockParameters,
  type PublicClient,
  createPublicClient,
  decodeEventLog,
  decodeFunctionData,
  decodeFunctionResult,
  encodeFunctionData,
  encodeFunctionResult,
  rpcTransactionType,
} from "viem";

export interface ViemReadAdapterParams<
  TClient extends PublicClient = PublicClient,
> {
  publicClient: TClient;
}

export class ViemReadAdapter<TClient extends PublicClient = PublicClient>
  implements ReadAdapter
{
  publicClient: TClient;

  constructor({
    publicClient = createPublicClient({
      transport: http(),
    }) as TClient,
  }: ViemReadAdapterParams<TClient>) {
    this.publicClient = publicClient;
  }

  getChainId() {
    return this.publicClient.getChainId();
  }

  getBlockNumber() {
    return this.publicClient.getBlockNumber();
  }

  async getBlock(params: GetBlockParams = {}) {
    const block = await this.publicClient.getBlock(
      params as GetBlockParameters,
    );
    return {
      extraData: block.extraData,
      gasLimit: block.gasLimit,
      gasUsed: block.gasUsed,
      hash: block.hash ?? undefined,
      logsBloom: block.logsBloom ?? undefined,
      miner: block.miner,
      mixHash: block.mixHash,
      nonce: block.nonce ?? undefined,
      number: block.number ?? undefined,
      parentHash: block.parentHash,
      receiptsRoot: block.receiptsRoot,
      sha3Uncles: block.sha3Uncles,
      size: block.size,
      stateRoot: block.stateRoot,
      timestamp: block.timestamp,
      transactions: block.transactions,
      transactionsRoot: block.transactionsRoot,
    } as Block;
  }

  getBalance({ address, block }: GetBalanceParams) {
    return this.publicClient.getBalance({
      address,
      blockNumber: typeof block === "bigint" ? block : undefined,
      blockTag: typeof block === "string" ? block : undefined,
    } as GetBalanceParameters);
  }

  async getTransaction({ hash }: GetTransactionParams) {
    const tx = await this.publicClient.getTransaction({ hash });
    return {
      gas: tx.gas,
      gasPrice: tx.gasPrice as bigint,
      input: tx.input,
      nonce: BigInt(tx.nonce),
      type: rpcTransactionType[tx.type],
      value: tx.value,
      blockHash: tx.blockHash ?? undefined,
      blockNumber: tx.blockNumber ?? undefined,
      from: tx.from,
      chainId: tx.chainId,
      hash: tx.hash,
      to: tx.to,
      transactionIndex: BigInt(tx.transactionIndex),
    };
  }

  async waitForTransaction({ hash, timeout }: WaitForTransactionParams) {
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash,
      timeout,
    });
    return {
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
      cumulativeGasUsed: receipt.cumulativeGasUsed,
      effectiveGasPrice: receipt.effectiveGasPrice,
      from: receipt.from,
      gasUsed: receipt.gasUsed,
      logsBloom: receipt.logsBloom,
      status: receipt.status,
      to: receipt.to ?? undefined,
      transactionHash: receipt.transactionHash,
      transactionIndex: BigInt(receipt.transactionIndex),
    } as TransactionReceipt;
  }

  async call({ block, bytecode, from, nonce, ...rest }: CallParams) {
    const { data } = await this.publicClient.call({
      blockNumber: typeof block === "bigint" ? block : undefined,
      blockTag: typeof block === "string" ? block : (undefined as any),
      code: bytecode,
      account: from,
      nonce: typeof nonce === "bigint" ? Number(nonce) : nonce,
      ...rest,
    } as CallParameters);
    return data as Bytes;
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event,
    filter,
    fromBlock,
    toBlock,
  }: GetEventsParams<TAbi, TEventName>) {
    const events = await this.publicClient.getContractEvents({
      address,
      abi: abi as Abi,
      eventName: event as string,
      fromBlock,
      toBlock,
      args: filter,
    });
    return events.map(
      ({ args, blockNumber, data, transactionHash, topics }) => {
        const objectArgs = (
          Array.isArray(args)
            ? decodeEventLog({
                abi,
                eventName: event as any,
                data,
                topics,
              }).args
            : args
        ) as AbiObjectType<TAbi, "event", typeof event, "inputs">;

        return {
          args: objectArgs,
          blockNumber: blockNumber ?? undefined,
          data,
          eventName: event,
          transactionHash: transactionHash ?? undefined,
        };
      },
    );
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ abi, address, fn, args, block }: ReadParams<TAbi, TFunctionName>) {
    const argsArray = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const output = await this.publicClient.readContract({
      abi: abi as Abi,
      address,
      functionName: fn,
      args: argsArray,
      blockNumber: typeof block === "bigint" ? block : undefined,
      blockTag: typeof block === "string" ? block : undefined,
    });

    return arrayToFriendly({
      abi,
      values: (Array.isArray(output) ? output : [output]) as any,
      kind: "outputs",
      name: fn,
    }) as FunctionReturn<TAbi, TFunctionName>;
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const argsArray = objectToArray({
      abi: params.abi as Abi,
      type: "function",
      name: params.fn,
      kind: "inputs",
      value: params.args,
    });

    const gasPriceOptions =
      params.gasPrice !== undefined
        ? {
            gasPrice: params.gasPrice,
          }
        : {
            maxFeePerGas: params.maxFeePerGas,
            maxPriorityFeePerGas: params.maxPriorityFeePerGas,
          };

    const { result } = await this.publicClient.simulateContract({
      abi: params.abi as Abi,
      address: params.address,
      functionName: params.fn,
      args: argsArray,
      accessList: params.accessList,
      account: params.from,
      gas: params.gas,
      nonce: params.nonce !== undefined ? Number(params.nonce) : undefined,
      value: params.value,
      chain: this.publicClient.chain,
      type: params.type as any,
      ...gasPriceOptions,
    });

    return arrayToFriendly({
      abi: params.abi,
      values: (Array.isArray(result) ? result : [result]) as any,
      kind: "outputs",
      name: params.fn,
    }) as FunctionReturn<TAbi, TFunctionName>;
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, fn, args }: EncodeFunctionDataParams<TAbi, TFunctionName>) {
    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    return encodeFunctionData({
      abi: abi as Abi,
      functionName: fn as string,
      args: arrayArgs,
    });
  }

  encodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, fn, value }: EncodeFunctionReturnParams<TAbi, TFunctionName>) {
    return encodeFunctionResult({
      abi: abi as Abi,
      functionName: fn as string,
      result: [value] as any,
    });
  }

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, data }: DecodeFunctionDataParams<TAbi, TFunctionName>) {
    const { args, functionName } = decodeFunctionData({ abi, data });
    const arrayArgs = Array.isArray(args) ? args : [args];

    return {
      args: arrayToObject({
        // Cast to allow any array type for values
        abi: abi as Abi,
        kind: "inputs",
        name: functionName,
        values: arrayArgs,
      }),
      functionName,
    } as DecodedFunctionData<TAbi, TFunctionName>;
  }

  decodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, data, fn }: DecodeFunctionReturnParams<TAbi, TFunctionName>) {
    const result = decodeFunctionResult({
      abi: abi as Abi,
      data,
      functionName: fn as string,
    });

    return arrayToFriendly({
      abi: abi as Abi,
      values: (Array.isArray(result) ? result : [result]) as any,
      kind: "outputs",
      name: fn,
    }) as FunctionReturn<TAbi, TFunctionName>;
  }
}
