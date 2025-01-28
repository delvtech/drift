import {
  type Block,
  type Bytes,
  type CallParams,
  type DecodeFunctionDataParams,
  type DecodeFunctionReturnParams,
  type DecodedFunctionData,
  DriftError,
  type EncodeFunctionDataParams,
  type EncodeFunctionReturnParams,
  type EventLog,
  type EventName,
  type FunctionName,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type ReadAdapter,
  type ReadParams,
  type Transaction,
  type TransactionReceipt,
  type WaitForTransactionParams,
  type WriteParams,
  arrayToObject,
  convertType,
  decodeFunctionReturn,
  encodeFunctionReturn,
  objectToArray,
  prepareBytecodeCallData,
} from "@delvtech/drift";
import type { Abi } from "abitype";
import {
  BigNumber,
  Contract,
  type EventFilter,
  getDefaultProvider,
  providers,
} from "ethers";
import { type AccessList, Interface } from "ethers/lib/utils";
import type { EthersAbi, Provider } from "src/types";

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
      ? (new providers.Web3Provider(window.ethereum) as Provider as TProvider)
      : (getDefaultProvider() as Provider as TProvider),
  }: EthersReadAdapterParams<TProvider> = {}) {
    this.provider =
      typeof provider === "string"
        ? (new providers.JsonRpcProvider(provider) as Provider as TProvider)
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
      blockParam(blockHash ?? blockNumber ?? blockTag ?? "latest"),
    );
    const block: Block | undefined = ethersBlock
      ? {
          extraData: ethersBlock.extraData,
          gasLimit: ethersBlock.gasLimit.toBigInt(),
          gasUsed: ethersBlock.gasUsed.toBigInt(),
          hash: ethersBlock.hash,
          logsBloom: undefined,
          miner: ethersBlock.miner,
          mixHash: undefined,
          nonce: BigInt(ethersBlock.nonce),
          number: BigInt(ethersBlock.number),
          parentHash: ethersBlock.parentHash,
          receiptsRoot: undefined,
          sha3Uncles: undefined,
          size: undefined,
          stateRoot: undefined,
          timestamp: BigInt(ethersBlock.timestamp),
          transactions: ethersBlock.transactions,
          transactionsRoot: undefined,
        }
      : undefined;
    return block;
  }

  async getBalance({ address, block }: GetBalanceParams) {
    const balance = await this.provider.getBalance(address, blockParam(block));
    return balance.toBigInt();
  }

  async getTransaction({ hash }: GetTransactionParams) {
    const ethersTx = await this.provider.getTransaction(hash);
    const tx: Transaction | undefined = ethersTx
      ? {
          blockHash: ethersTx.blockHash,
          blockNumber:
            typeof ethersTx.blockNumber !== "undefined"
              ? BigInt(ethersTx.blockNumber)
              : undefined,
          chainId: Number(ethersTx.chainId),
          from: ethersTx.from,
          gas: ethersTx.gasLimit.toBigInt(),
          gasPrice: ethersTx.gasPrice?.toBigInt(),
          transactionHash: ethersTx.hash,
          input: ethersTx.data,
          nonce: BigInt(ethersTx.nonce),
          to: ethersTx.to ?? undefined,
          transactionIndex: undefined,
          type: ethersTx.type ? ethersTx.type.toString(16) : undefined,
          value: ethersTx.value.toBigInt(),
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
          blockHash: ethersReceipt.blockHash,
          blockNumber: BigInt(ethersReceipt.blockNumber),
          cumulativeGasUsed: ethersReceipt.cumulativeGasUsed.toBigInt(),
          effectiveGasPrice: ethersReceipt.effectiveGasPrice.toBigInt(),
          from: ethersReceipt.from,
          gasUsed: ethersReceipt.gasUsed.toBigInt(),
          logsBloom: ethersReceipt.logsBloom,
          status: ethersReceipt.status ? "success" : "reverted",
          to: ethersReceipt.to,
          transactionHash: ethersReceipt.transactionHash,
          transactionIndex: BigInt(ethersReceipt.transactionIndex),
        }
      : undefined;
    return receipt;
  }

  async call({
    accessList,
    block,
    bytecode,
    chainId,
    data,
    from,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    type,
    value,
  }: CallParams) {
    if (bytecode && data) {
      data = prepareBytecodeCallData(bytecode, data);
    }
    if (typeof block === "bigint") {
      block = await this.getBlockNumber();
    }
    return this.provider.call(
      {
        accessList: accessList as AccessList,
        chainId: chainId === undefined ? undefined : Number(chainId),
        data,
        from,
        gasLimit: gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce: nonce === undefined ? undefined : Number(nonce),
        to,
        type: type === undefined ? undefined : Number(type),
        value,
      },
      block === undefined ? undefined : blockParam(block),
    ) as Promise<Bytes>;
  }

  async getEvents<TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event: eventName,
    filter,
    fromBlock,
    toBlock,
  }: GetEventsParams<TAbi, TEventName>) {
    const contract = new Contract(address, abi as EthersAbi, this.provider);

    let eventFilter: string | EventFilter = eventName;
    if (filter) {
      const arrayArgs = objectToArray({
        abi: abi as Abi,
        type: "event",
        name: eventName,
        kind: "inputs",
        value: filter,
      });
      eventFilter = contract.filters[eventName]!(...arrayArgs);
    }

    const events = await contract.queryFilter(
      eventFilter,
      blockParam(fromBlock),
      blockParam(toBlock),
    );

    return events.map((ethersEvent) => {
      const event: EventLog<TAbi, TEventName> = {
        args: arrayToObject({
          abi: abi as Abi,
          kind: "inputs",
          name: eventName,
          values: ethersEvent.args?.map((arg) =>
            arg instanceof BigNumber ? arg.toBigInt() : arg,
          ),
        }),
        eventName: ethersEvent.event as TEventName,
        blockNumber: BigInt(ethersEvent.blockNumber),
        data: ethersEvent.data,
        transactionHash: ethersEvent.transactionHash,
      };
      return event;
    });
  }

  async read<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "pure" | "view">,
  >({ abi, address, fn, args, block }: ReadParams<TAbi, TFunctionName>) {
    const contract = new Contract(address, abi as EthersAbi, this.provider);

    const argsArray = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    return convertType(
      await contract[fn](...argsArray, { blockTag: block }),
      (value) => value instanceof BigNumber,
      (value) => value.toBigInt(),
    );
  }

  async simulateWrite<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(params: WriteParams<TAbi, TFunctionName>) {
    const { abi, address, args, fn, onMined, ...options } = params;
    const contract = new Contract(address, abi as EthersAbi, this.provider);

    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    return contract.callStatic[fn]!(...arrayArgs, {
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
    const iface = new Interface(abi as EthersAbi);

    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    return iface.encodeFunctionData(fn, arrayArgs);
  }

  encodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: EncodeFunctionReturnParams<TAbi, TFunctionName>) {
    return encodeFunctionReturn(params);
  }

  decodeFunctionData<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({ abi, data, fn }: DecodeFunctionDataParams<TAbi, TFunctionName>) {
    const iface = new Interface(abi as EthersAbi);
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
        values: args.map((arg) =>
          arg instanceof BigNumber ? arg.toBigInt() : arg,
        ),
      }),
    } as DecodedFunctionData<TAbi, TFunctionName>;
  }

  decodeFunctionReturn<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >(params: DecodeFunctionReturnParams<TAbi, TFunctionName>) {
    return decodeFunctionReturn(params);
  }
}

function blockParam(block?: bigint | string): string {
  if (block === undefined) {
    return "latest";
  }
  if (typeof block === "bigint") {
    return `0x${block.toString(16)}`;
  }
  return block;
}
