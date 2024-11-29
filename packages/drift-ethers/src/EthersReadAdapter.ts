import {
  type Address,
  type Block,
  type DecodeFunctionDataParams,
  type DecodedFunctionData,
  DriftError,
  type EncodeFunctionDataParams,
  type EventLog,
  type EventName,
  type FunctionName,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type Hash,
  type HexString,
  type ReadAdapter,
  type ReadParams,
  type Transaction,
  type TransactionReceipt,
  type WaitForTransactionParams,
  type WriteParams,
  arrayToObject,
  objectToArray,
} from "@delvtech/drift";
import type { Abi } from "abitype";
import { Interface } from "ethers";
import {
  BrowserProvider,
  Contract,
  type DeferredTopicFilter,
  type EventLog as EthersEventLog,
  type InterfaceAbi,
  JsonRpcProvider,
  type Provider,
  getDefaultProvider,
} from "ethers";

export interface EthersReadAdapterParams<
  TProvider extends Provider = Provider,
> {
  /**
   * Ethers Provider instance or RPC URL.
   */
  provider?: TProvider | string;
}

export class EthersReadAdapter<TProvider extends Provider = Provider>
  implements ReadAdapter
{
  provider: TProvider;

  constructor({
    provider = "window" in globalThis && "ethereum" in window
      ? (new BrowserProvider(window.ethereum) as Provider as TProvider)
      : (getDefaultProvider() as Provider as TProvider),
  }: EthersReadAdapterParams<TProvider> = {}) {
    this.provider =
      typeof provider === "string"
        ? (new JsonRpcProvider(provider) as Provider as TProvider)
        : provider;
  }

  async getChainId() {
    const { chainId } = await this.provider.getNetwork();
    return Number(chainId);
  }

  async getBlockNumber() {
    const num = await this.provider.getBlockNumber();
    return BigInt(num);
  }

  async getBlock({ blockHash, blockNumber, blockTag }: GetBlockParams = {}) {
    const ethersBlock = await this.provider.getBlock(
      blockHash ?? blockNumber ?? blockTag ?? "latest",
    );
    const block: Block | undefined = ethersBlock
      ? {
          extraData: ethersBlock.extraData as HexString,
          gasLimit: ethersBlock.gasLimit,
          gasUsed: ethersBlock.gasUsed,
          hash: ethersBlock.hash as Hash | undefined,
          logsBloom: undefined,
          miner: ethersBlock.miner as Address,
          mixHash: undefined,
          nonce: BigInt(ethersBlock.nonce),
          number: BigInt(ethersBlock.number),
          parentHash: ethersBlock.parentHash as Hash,
          receiptsRoot: (ethersBlock.receiptsRoot as Hash) ?? undefined,
          sha3Uncles: undefined,
          size: undefined,
          stateRoot: ethersBlock.stateRoot as Hash,
          timestamp: BigInt(ethersBlock.timestamp),
          transactions: ethersBlock.transactions as Hash[],
          transactionsRoot: undefined,
        }
      : undefined;
    return block;
  }

  getBalance({ address, block }: GetBalanceParams) {
    return this.provider.getBalance(address, block);
  }

  async getTransaction({ hash }: GetTransactionParams) {
    const ethersTx = await this.provider.getTransaction(hash);
    const tx: Transaction | undefined = ethersTx
      ? {
          blockHash: ethersTx.blockHash as Hash | undefined,
          blockNumber:
            ethersTx.blockNumber === null
              ? undefined
              : BigInt(ethersTx.blockNumber),
          chainId: Number(ethersTx.chainId),
          from: ethersTx.from as Address,
          gas: ethersTx.gasLimit,
          gasPrice: ethersTx.gasPrice,
          transactionHash: ethersTx.hash as Hash,
          input: ethersTx.data as HexString,
          nonce: BigInt(ethersTx.nonce),
          to: (ethersTx.to ?? undefined) as Address | undefined,
          transactionIndex: BigInt(ethersTx.index),
          type: ethersTx.type.toString(16),
          value: ethersTx.value,
        }
      : undefined;
    return tx;
  }

  async waitForTransaction({ hash, timeout }: WaitForTransactionParams) {
    const ethersReceipt = await this.provider.waitForTransaction(
      hash,
      undefined,
      timeout,
    );
    const receipt: TransactionReceipt | undefined = ethersReceipt
      ? {
          blockHash: ethersReceipt.blockHash as Hash,
          blockNumber: BigInt(ethersReceipt.blockNumber),
          cumulativeGasUsed: ethersReceipt.cumulativeGasUsed,
          effectiveGasPrice: ethersReceipt.gasPrice,
          from: ethersReceipt.from as Address,
          gasUsed: ethersReceipt.gasUsed,
          logsBloom: ethersReceipt.logsBloom as Hash,
          status: ethersReceipt.status ? "success" : "reverted",
          to: ethersReceipt.to as Address | null,
          transactionHash: ethersReceipt.hash as Hash,
          transactionIndex: BigInt(ethersReceipt.index),
        }
      : undefined;
    return receipt;
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event: eventName,
    filter,
    fromBlock,
    toBlock,
  }: GetEventsParams<TAbi, TEventName>) {
    const contract = new Contract(address, abi as InterfaceAbi, this.provider);

    let eventFilter: string | DeferredTopicFilter = eventName;
    if (filter) {
      const arrayArgs = objectToArray({
        abi: abi as Abi,
        type: "event",
        name: eventName,
        kind: "inputs",
        value: filter,
      });
      eventFilter = contract.getEvent(eventName)(...arrayArgs);
    }

    const events = (await contract.queryFilter(
      eventFilter,
      fromBlock,
      toBlock,
    )) as EthersEventLog[];

    return events.map((ethersEvent) => {
      const event: EventLog<TAbi, TEventName> = {
        args: arrayToObject({
          abi: abi as Abi,
          kind: "inputs",
          name: eventName,
          values: ethersEvent.args,
        }),
        eventName: ethersEvent.eventName as TEventName,
        blockNumber: BigInt(ethersEvent.blockNumber),
        data: ethersEvent.data as HexString,
        transactionHash: ethersEvent.transactionHash as Hash,
      };
      return event;
    });
  }

  read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ abi, address, fn, args, block }: ReadParams<TAbi, TFunctionName>) {
    const contract = new Contract(address, abi as InterfaceAbi, this.provider);
    const argsArray = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });
    return contract.getFunction(fn)(...argsArray, { blockTag: block });
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const { abi, address, args, fn, onMined, ...options } = params;
    const contract = new Contract(address, abi as InterfaceAbi, this.provider);

    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    return contract.getFunction(fn).staticCall(...arrayArgs, {
      accessList: options.accessList,
      chainId: options.chainId,
      from: options.from,
      gasLimit: options.gas,
      gasPrice: options.gasPrice,
      maxFeePerGas: options.maxFeePerGas,
      maxPriorityFeePerGas: options.maxPriorityFeePerGas,
      nonce: options.nonce ? Number(options.nonce) : undefined,
      type: options.type ? Number(options.type) : undefined,
      value: options.value,
    });
  }

  encodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, fn, args }: EncodeFunctionDataParams<TAbi, TFunctionName>) {
    const iface = new Interface(abi as InterfaceAbi);

    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    return iface.encodeFunctionData(fn, arrayArgs) as HexString;
  }

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, data, fn }: DecodeFunctionDataParams<TAbi, TFunctionName>) {
    const iface = new Interface(abi as InterfaceAbi);
    const { args, name } = iface.parseTransaction({ data }) || {};

    if (!args || !name) {
      throw new DriftError(
        `Failed to decode function data${fn ? ` for ${fn}` : ""}: ${data}`,
      );
    }

    return {
      functionName: name,
      args: arrayToObject({
        abi: abi as Abi,
        kind: "inputs",
        name,
        values: args,
      }),
    } as DecodedFunctionData<TAbi, TFunctionName>;
  }
}

declare module "@delvtech/drift" {
  interface Block {
    /**
     * Unavailable in ethers.js.
     */
    mixHash: undefined;
    /**
     * Possibly undefined in ethers.js.
     */
    receiptsRoot: Hash | undefined;
    /**
     * Unavailable in ethers.js.
     */
    sha3Uncles: undefined;
    /**
     * Unavailable in ethers.js.
     */
    size: undefined;
    /**
     * Unavailable in ethers.js.
     */
    transactionsRoot: undefined;
  }

  interface TransactionReceipt {
    /**
     *
     * __Note:__ The ethers.js implementation of this field maps to the
     * `gasPrice` field of a {@linkcode TransactionResponse} object.
     *
     * @see [Ethers.js - TransactionResponse - gasPrice](https://docs.ethers.org/v6/api/providers/#TransactionResponse-gasPrice)
     */
    effectiveGasPrice: bigint;
  }
}
