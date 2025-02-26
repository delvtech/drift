import {
  type Abi,
  AbiEncoder,
  type Address,
  type AnyObject,
  type Block,
  type BlockIdentifier,
  type MinedBlockIdentifier,
  type Bytes,
  type CallParams,
  DriftError,
  type EventLog,
  type EventName,
  type FunctionArgs,
  type FunctionName,
  type GetBalanceParams,
  type GetBlockParams,
  type GetEventsParams,
  type GetTransactionParams,
  type Hash,
  type ReadParams,
  type ReadWriteAdapter,
  type Transaction,
  type TransactionReceipt,
  type WaitForTransactionParams,
  type WriteParams,
  encodeBytecodeCallData,
  prepareParamsArray,
} from "@delvtech/drift";
import { type AbiFragment, type AccessList, default as Web3 } from "web3";

export class Web3Adapter<TWeb3 extends Web3 = Web3>
  extends AbiEncoder
  implements ReadWriteAdapter
{
  web3: TWeb3;

  constructor(
    web3OrProvider:
      | TWeb3
      | ConstructorParameters<typeof Web3>[0] = new Web3() as TWeb3,
  ) {
    super();
    this.web3 =
      web3OrProvider instanceof Web3
        ? web3OrProvider
        : (new Web3(web3OrProvider as any) as TWeb3);
  }

  getChainId() {
    return this.web3.eth.getChainId().then(Number);
  }

  getBlockNumber() {
    return this.web3.eth.getBlockNumber();
  }

  async getBlock<T extends BlockIdentifier = MinedBlockIdentifier>({ blockHash, blockNumber, blockTag }: GetBlockParams<T> = {} as GetBlockParams<T>) {
    const block = await this.web3.eth.getBlock(
      blockHash ?? blockNumber ?? blockTag,
    );
    return block
      ? ({
          extraData: block.extraData,
          gasLimit: block.gasLimit,
          gasUsed: block.gasUsed,
          hash: block.hash as Hash | undefined,
          logsBloom: block.logsBloom as Hash | undefined,
          miner: block.miner as Address,
          mixHash: block.mixHash as Hash,
          nonce: block.nonce,
          number: block.number,
          parentHash: block.parentHash as Hash,
          receiptsRoot: block.receiptsRoot as Hash,
          sha3Uncles: block.sha3Uncles as Hash,
          size: block.size,
          stateRoot: block.stateRoot as Hash,
          timestamp: block.timestamp,
          transactions: block.transactions.map((tx) =>
            typeof tx === "string" ? tx : tx.hash,
          ) as Hash[],
          transactionsRoot: block.transactionsRoot as Hash,
        } as Block<T>)
      : undefined;
  }

  getBalance({ address, block }: GetBalanceParams) {
    return this.web3.eth.getBalance(address, block);
  }

  async getTransaction({ hash }: GetTransactionParams) {
    const tx = await this.web3.eth.getTransaction(hash);
    return tx
      ? ({
          blockHash: tx.blockHash as Hash | undefined,
          blockNumber:
            typeof tx.blockNumber !== "undefined"
              ? BigInt(tx.blockNumber)
              : undefined,
          chainId: Number(tx.chainId),
          from: tx.from as Address,
          gas: BigInt(tx.gas),
          gasPrice: BigInt(tx.gasPrice),
          hash: tx.hash as Hash,
          input: tx.input,
          nonce: BigInt(tx.nonce),
          to: tx.to ?? (undefined as Address | undefined),
          transactionIndex:
            typeof tx.transactionIndex !== "undefined"
              ? BigInt(tx.transactionIndex)
              : undefined,
          type:
            typeof tx.type === "string"
              ? tx.type
              : (tx.type as unknown as bigint).toString(16),
          value: BigInt(tx.value),
        } as Transaction)
      : undefined;
  }

  async waitForTransaction({
    hash,
    timeout = this.web3.transactionPollingTimeout,
  }: WaitForTransactionParams) {
    return new Promise<TransactionReceipt | undefined>((resolve, reject) => {
      const getReceipt = () => {
        this.web3.eth
          .getTransactionReceipt(hash)
          .then((receipt) =>
            receipt
              ? resolve({
                  blockHash: receipt.blockHash as Hash,
                  cumulativeGasUsed: BigInt(receipt.cumulativeGasUsed),
                  gasUsed: BigInt(receipt.gasUsed),
                  blockNumber: receipt.blockNumber ?? undefined,
                  effectiveGasPrice: receipt.effectiveGasPrice || 0n,
                  from: receipt.from as Address,
                  logsBloom: receipt.logsBloom as Hash,
                  status: receipt.status ? "success" : "reverted",
                  to: receipt.to as Address,
                  transactionHash: receipt.transactionHash as Hash,
                  transactionIndex: receipt.transactionIndex,
                })
              : setTimeout(
                  getReceipt,
                  this.web3.transactionReceiptPollingInterval,
                ),
          )
          .catch(reject);
      };
      getReceipt();
      setTimeout(() => resolve(undefined), timeout);
    });
  }

  call({
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

    return this.web3.eth.call(
      {
        accessList: accessList as AccessList,
        chainId,
        data,
        from,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to: to as any,
        type,
        value,
      },
      block,
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
    const contract = new this.web3.eth.Contract(
      abi as readonly AbiFragment[],
      address,
    );

    const events = await contract.getPastEvents(eventName as any, {
      fromBlock,
      toBlock,
      filter: filter as AnyObject | undefined,
    });

    return events.map((event) => {
      // strings represent filter ids which shouldn't be returned given the
      // current implementation.
      if (typeof event === "string") {
        throw new DriftError(
          `Invalid event object returned from web3.js when getting past ${eventName} events:\n  ${event}\n`,
        );
      }

      return {
        args: event.returnValues,
        blockNumber: event.blockNumber ? BigInt(event.blockNumber) : undefined,
        data: event.data,
        eventName,
        transactionHash: event.transactionHash,
      } as EventLog<TAbi, TEventName>;
    });
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
  >({ abi, address, fn, args, ...params }: WriteParams<TAbi, TFunctionName>) {
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

  async getSignerAddress() {
    const [address] = await this.web3.eth.getAccounts();
    if (!address) throw new DriftError("No signer address found");
    return address as Address;
  }

  async write<
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >({
    abi,
    accessList,
    address,
    args,
    fn,
    from,
    onMined,
    ...rest
  }: WriteParams<TAbi, TFunctionName>) {
    const { params } = prepareParamsArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });
    const { method } = this._getMethod({ abi, fn, address });
    from ??= await this.getSignerAddress();

    return new Promise<Hash>((resolve, reject) => {
      const req = this.web3.eth
        .sendTransaction({
          ...rest,
          accessList: accessList as AccessList,
          to: address,
          data: method(...params).encodeABI(),
          from,
        })
        .on("error", reject)
        .on("transactionHash", (hash) => resolve(hash as Hash));

      if (onMined) {
        req.on("receipt", (receipt) => {
          onMined({
            blockHash: receipt.blockHash as Hash,
            cumulativeGasUsed: receipt.cumulativeGasUsed,
            effectiveGasPrice: receipt.effectiveGasPrice ?? 0n,
            blockNumber: receipt.blockNumber,
            from: receipt.from as Address,
            logsBloom: receipt.logsBloom as Hash,
            status: receipt.status ? "success" : "reverted",
            gasUsed: receipt.gasUsed,
            to: receipt.to as Address,
            transactionHash: receipt.transactionHash as Hash,
            transactionIndex: receipt.transactionIndex,
          });
        });
      }
    });
  }

  private _getMethod({
    abi,
    fn,
    address,
  }: {
    abi: Abi;
    fn: string;
    address?: Address;
  }) {
    const contract = new this.web3.eth.Contract(
      abi as readonly AbiFragment[],
      address,
    );
    const method = contract.methods[fn];

    if (!method) {
      throw new DriftError(
        `Function ${fn} not found in ABI for contract at address ${address}`,
      );
    }

    return { contract, method };
  }
}
