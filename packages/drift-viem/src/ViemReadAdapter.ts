import {
  type Abi,
  BaseReadAdapter,
  type Block,
  type BlockIdentifier,
  type Bytes,
  type CallParams,
  type EventArgs,
  type EventName,
  type FunctionArgs,
  type FunctionName,
  type GetBalanceParams,
  type GetBlockReturn,
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
  type PublicClient,
  createPublicClient,
  decodeEventLog,
  isHex,
  rpcTransactionType,
} from "viem";

export interface ViemReadAdapterParams<
  TClient extends PublicClient = PublicClient,
> {
  publicClient: TClient;
}

export class ViemReadAdapter<TClient extends PublicClient = PublicClient>
  extends BaseReadAdapter
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

  async getBlock<T extends BlockIdentifier | undefined = undefined>(
    blockId?: T,
  ) {
    const viemBlock = await this.publicClient.getBlock(
      isHex(blockId)
        ? {
            blockHash: blockId,
          }
        : typeof blockId === "string"
          ? {
              blockTag: blockId,
            }
          : {
              blockNumber: blockId,
            },
    );

    const block: Block<any> = {
      extraData: viemBlock.extraData,
      gasLimit: viemBlock.gasLimit,
      gasUsed: viemBlock.gasUsed,
      hash: viemBlock.hash ?? undefined,
      logsBloom: viemBlock.logsBloom ?? undefined,
      miner: viemBlock.miner,
      mixHash: viemBlock.mixHash,
      nonce: viemBlock.nonce === null ? undefined : BigInt(viemBlock.nonce),
      number: viemBlock.number ?? undefined,
      parentHash: viemBlock.parentHash,
      receiptsRoot: viemBlock.receiptsRoot,
      sha3Uncles: viemBlock.sha3Uncles,
      size: viemBlock.size,
      stateRoot: viemBlock.stateRoot,
      timestamp: viemBlock.timestamp,
      transactions: viemBlock.transactions,
      transactionsRoot: viemBlock.transactionsRoot,
    };

    return block as GetBlockReturn<T>;
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
      gasPrice: tx.gasPrice ?? 0n,
      input: tx.input,
      nonce: BigInt(tx.nonce),
      type: rpcTransactionType[tx.type],
      value: tx.value,
      blockHash: tx.blockHash ?? undefined,
      blockNumber: tx.blockNumber ?? undefined,
      from: tx.from,
      chainId: tx.chainId,
      transactionHash: tx.hash,
      to: tx.to ?? undefined,
      transactionIndex: BigInt(tx.transactionIndex),
    };
  }

  async waitForTransaction({
    hash,
    timeout,
  }: WaitForTransactionParams): Promise<TransactionReceipt> {
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash,
      timeout,
    });
    return {
      blockHash: receipt.blockHash,
      blockNumber: receipt.blockNumber,
      contractAddress: receipt.contractAddress ?? undefined,
      cumulativeGasUsed: receipt.cumulativeGasUsed,
      effectiveGasPrice: receipt.effectiveGasPrice,
      from: receipt.from,
      gasUsed: receipt.gasUsed,
      logsBloom: receipt.logsBloom,
      status: receipt.status,
      to: receipt.to ?? undefined,
      transactionHash: receipt.transactionHash,
      transactionIndex: BigInt(receipt.transactionIndex),
    };
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
        ) as EventArgs<TAbi, TEventName>;

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
      blockTag: typeof block === "string" ? block : undefined,
      code: bytecode,
      account: from,
      nonce: typeof nonce === "bigint" ? Number(nonce) : nonce,
      ...rest,
    } as CallParameters);
    return data || "0x";
  }

  sendRawTransaction(serializedTransaction: Bytes) {
    return this.publicClient.sendRawTransaction({ serializedTransaction });
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
