import {
  type Abi,
  arrayToObject,
  BaseReadAdapter,
  type Block,
  type BlockIdentifier,
  type Bytes,
  type CallParams,
  type EventArgs,
  type EventLog,
  type EventName,
  encodeBytecodeCallData,
  type GetBalanceParams,
  type GetBlockReturn,
  type GetEventsParams,
  type GetTransactionParams,
  prepareParams,
  type ReadAdapter,
  type Transaction,
  type TransactionReceipt,
  toHexString,
  type WaitForTransactionParams,
} from "@delvtech/drift";
import {
  BigNumber,
  Contract,
  type EventFilter,
  getDefaultProvider,
  providers,
} from "ethers";
import type { AccessList } from "ethers/lib/utils";
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
  extends BaseReadAdapter
  implements ReadAdapter
{
  provider: TProvider;

  constructor({
    provider = "ethereum" in globalThis
      ? (new providers.Web3Provider(
          (globalThis as any).ethereum,
        ) as Provider as TProvider)
      : (getDefaultProvider() as Provider as TProvider),
  }: EthersReadAdapterParams<TProvider> = {}) {
    super();
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

  async getBlock<T extends BlockIdentifier | undefined = undefined>(
    blockId?: T,
  ) {
    const ethersBlock = await this.provider.getBlock(blockParam(blockId));

    if (!ethersBlock) {
      return undefined as GetBlockReturn<T>;
    }

    const block: Block<any> = {
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
    };

    return block as GetBlockReturn<T>;
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
          type: ethersTx.type ? toHexString(ethersTx.type) : undefined,
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
          contractAddress: ethersReceipt.contractAddress ?? undefined,
          blockHash: ethersReceipt.blockHash,
          blockNumber: BigInt(ethersReceipt.blockNumber),
          cumulativeGasUsed: ethersReceipt.cumulativeGasUsed.toBigInt(),
          effectiveGasPrice: ethersReceipt.effectiveGasPrice.toBigInt(),
          from: ethersReceipt.from,
          gasUsed: ethersReceipt.gasUsed.toBigInt(),
          logsBloom: ethersReceipt.logsBloom,
          status: ethersReceipt.status ? "success" : "reverted",
          to: ethersReceipt.to ?? undefined,
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
      data = encodeBytecodeCallData(bytecode, data);
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
    );
  }

  async sendRawTransaction(transaction: Bytes) {
    const tx = await this.provider.sendTransaction(transaction);
    return tx.hash;
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
      const { params } = prepareParams({
        abi: abi,
        type: "event",
        name: eventName,
        kind: "inputs",
        value: filter as EventArgs<TAbi, TEventName>,
      });
      eventFilter = contract.filters[eventName]!(...params);
    }

    const events = await contract.queryFilter(
      eventFilter,
      blockParam(fromBlock),
      blockParam(toBlock),
    );

    return events.map((ethersEvent) => {
      const event: EventLog<TAbi, TEventName> = {
        args: arrayToObject({
          abi: abi,
          kind: "inputs",
          name: eventName,
          values: ethersEvent.args?.map((arg) =>
            arg instanceof BigNumber ? arg.toBigInt() : arg,
          ) as any,
        }),
        eventName: ethersEvent.event as TEventName,
        blockNumber: BigInt(ethersEvent.blockNumber),
        data: ethersEvent.data,
        transactionHash: ethersEvent.transactionHash,
      };
      return event;
    });
  }
}

function blockParam(block?: bigint | string): string {
  if (block === undefined) return "latest";
  if (typeof block === "bigint") return toHexString(block);
  return block;
}
