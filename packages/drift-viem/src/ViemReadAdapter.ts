import {
  type Abi,
  AbiEncoder,
  type AbiObjectType,
  type Block,
  type Bytes,
  type CallParams,
  type EventName,
  type FunctionArgs,
  type FunctionName,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type ReadAdapter,
  type ReadParams,
  type SimulateWriteParams,
  type TransactionReceipt,
  type WaitForTransactionParams,
} from "@delvtech/drift";
import {
  http,
  type CallParameters,
  type GetBalanceParameters,
  type GetBlockParameters,
  type PublicClient,
  createPublicClient,
  decodeEventLog,
  rpcTransactionType,
} from "viem";

export interface ViemReadAdapterParams<
  TClient extends PublicClient = PublicClient,
> {
  publicClient: TClient;
}

export class ViemReadAdapter<TClient extends PublicClient = PublicClient>
  extends AbiEncoder
  implements ReadAdapter
{
  publicClient: TClient;

  constructor({
    publicClient = createPublicClient({
      transport: http(),
    }) as TClient,
  }: ViemReadAdapterParams<TClient>) {
    super();
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

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ abi, address, fn, args, block }: ReadParams<TAbi, TFunctionName>) {
    const callData = this.encodeFunctionData({
      abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });

    // Using call instead of readContract to ensure consistent return decoding
    const returnData = await this.call({
      to: address,
      data: callData,
      block,
    });

    return this.decodeFunctionReturn({
      abi,
      data: returnData,
      fn,
    });
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    abi,
    address,
    fn,
    args,
    ...params
  }: SimulateWriteParams<TAbi, TFunctionName>) {
    const callData = this.encodeFunctionData({
      abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });

    // Using call instead of simulateWrite to ensure consistent return decoding
    const returnData = await this.call({
      to: address,
      data: callData,
      ...params,
    });

    return this.decodeFunctionReturn({
      abi,
      data: returnData,
      fn,
    });
  }
}
