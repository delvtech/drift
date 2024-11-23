import {
  type AbiObjectType,
  type AdapterDecodeFunctionDataParams,
  type AdapterEncodeFunctionDataParams,
  type AdapterGetEventsParams,
  type AdapterReadParams,
  type AdapterWriteParams,
  type Block,
  type DecodedFunctionData,
  type EventName,
  type FunctionName,
  type FunctionReturn,
  type NetworkGetBalanceParams,
  type NetworkGetBlockParams,
  type NetworkGetTransactionParams,
  type NetworkWaitForTransactionParams,
  type ReadAdapter,
  type TransactionReceipt,
  arrayToObject,
  objectToArray,
} from "@delvtech/drift";
import { createSimulateContractParameters } from "src/utils/createSimulateContractParameters";
import { outputToFriendly } from "src/utils/outputToFriendly";
import {
  http,
  type Abi,
  type GetBalanceParameters,
  type GetBlockParameters,
  type PublicClient,
  createPublicClient,
  decodeEventLog,
  decodeFunctionData,
  encodeFunctionData,
  rpcTransactionType,
} from "viem";

export interface ViemReadAdapterParams<
  TClient extends PublicClient = PublicClient,
> {
  publicClient: TClient;
}

export class ViemReadAdapter<TClient extends PublicClient>
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

  async getBlock(params: NetworkGetBlockParams = {}) {
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

  getBalance({ address, block }: NetworkGetBalanceParams) {
    return this.publicClient.getBalance({
      address,
      blockNumber: typeof block === "bigint" ? block : undefined,
      blockTag: typeof block === "string" ? block : undefined,
    } as GetBalanceParameters);
  }

  async getTransaction({ hash }: NetworkGetTransactionParams) {
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

  async waitForTransaction({ hash, timeout }: NetworkWaitForTransactionParams) {
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
  }: AdapterGetEventsParams<TAbi, TEventName>) {
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
  >({ abi, address, fn, args, block }: AdapterReadParams<TAbi, TFunctionName>) {
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

    return outputToFriendly({
      abi,
      functionName: fn,
      output,
    }) as FunctionReturn<TAbi, typeof fn>;
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: AdapterWriteParams<TAbi, TFunctionName>) {
    const { result } = await this.publicClient.simulateContract(
      createSimulateContractParameters(params),
    );

    return outputToFriendly({
      abi: params.abi,
      functionName: params.fn,
      output: result,
    }) as FunctionReturn<TAbi, TFunctionName>;
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, fn, args }: AdapterEncodeFunctionDataParams<TAbi, TFunctionName>) {
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

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, data }: AdapterDecodeFunctionDataParams<TAbi, TFunctionName>) {
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
}
