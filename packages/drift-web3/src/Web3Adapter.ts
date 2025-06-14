import {
  type Abi,
  type Address,
  type AnyObject,
  BaseReadWriteAdapter,
  type BlockIdentifier,
  type Bytes,
  type CallParams,
  type DeployParams,
  DriftError,
  type EventArgs,
  type EventName,
  type FunctionName,
  type GetBalanceParams,
  type GetBlockReturn,
  type GetEventsParams,
  type GetTransactionParams,
  type Hash,
  type ReadWriteAdapter,
  type SendTransactionParams,
  type Transaction,
  type TransactionReceipt,
  type WaitForTransactionParams,
  type WriteParams,
  encodeBytecodeCallData,
  prepareParams,
} from "@delvtech/drift";
import { type AbiFragment, type AccessList, default as Web3 } from "web3";

export class Web3Adapter<TWeb3 extends Web3 = Web3>
  extends BaseReadWriteAdapter
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

  async getBlock<T extends BlockIdentifier | undefined = undefined>(
    blockId?: T,
  ) {
    const web3Block = await this.web3.eth.getBlock(blockId);

    const block = web3Block
      ? {
          ...web3Block,
          transactions: web3Block.transactions.map((tx) =>
            typeof tx === "string" ? tx : tx.hash,
          ),
        }
      : undefined;

    return block as GetBlockReturn<T>;
  }

  getBalance({ address, block }: GetBalanceParams) {
    return this.web3.eth.getBalance(address, block);
  }

  async getTransaction({ hash }: GetTransactionParams) {
    const tx = await this.web3.eth.getTransaction(hash);
    return tx
      ? ({
          blockHash: tx.blockHash,
          blockNumber:
            typeof tx.blockNumber !== "undefined"
              ? BigInt(tx.blockNumber)
              : undefined,
          chainId: Number(tx.chainId),
          from: tx.from,
          gas: BigInt(tx.gas),
          gasPrice: BigInt(tx.gasPrice),
          transactionHash: tx.hash,
          input: tx.input,
          nonce: BigInt(tx.nonce),
          to: tx.to ?? undefined,
          transactionIndex:
            typeof tx.transactionIndex !== "undefined"
              ? BigInt(tx.transactionIndex)
              : undefined,
          type:
            typeof tx.type === "string"
              ? tx.type
              : // The types lie, it will sometimes be a bigint
                (tx.type as unknown as bigint).toString(16),
          value: BigInt(tx.value),
        } satisfies Transaction)
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
                  ...receipt,
                  to: receipt.to ?? undefined,
                  effectiveGasPrice: receipt.effectiveGasPrice || 0n,
                  status: receipt.status ? "success" : "reverted",
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
    );
  }

  async sendRawTransaction(transaction: Bytes) {
    const tx = await this.web3.eth.sendSignedTransaction(transaction);
    return normalizePossibleByteArray(tx.transactionHash);
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
        args: event.returnValues as EventArgs<TAbi, TEventName>,
        blockNumber: event.blockNumber ? BigInt(event.blockNumber) : undefined,
        data: event.data,
        eventName,
        transactionHash: event.transactionHash,
      };
    });
  }

  async getSignerAddress() {
    const [address] = await this.web3.eth.getAccounts();
    if (!address) throw new DriftError("No signer address found");
    return address;
  }

  async sendTransaction({
    data,
    to,
    from,
    onMined,
    accessList,
    ...rest
  }: SendTransactionParams) {
    from ??= await this.getSignerAddress();

    return new Promise<Hash>((resolve, reject) => {
      const req = this.web3.eth
        .sendTransaction({
          ...rest,
          accessList: accessList as AccessList,
          to,
          data,
          from,
        })
        .on("error", reject)
        .on("transactionHash", (hash) => resolve(hash));

      if (onMined) {
        req.on("receipt", (receipt) => {
          onMined({
            ...receipt,
            effectiveGasPrice: receipt.effectiveGasPrice ?? 0n,
            status: receipt.status ? "success" : "reverted",
          });
        });
      }
    });
  }

  async deploy<TAbi extends Abi>({
    abi,
    args,
    bytecode,
    from,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    type,
    value,
    onMined,
  }: DeployParams<TAbi>) {
    const contract = new this.web3.eth.Contract(abi as readonly AbiFragment[]);
    const { params } = prepareParams({
      abi,
      type: "constructor",
      name: undefined,
      kind: "inputs",
      value: args,
    });
    from ??= await this.getSignerAddress();

    return new Promise<Hash>((resolve, reject) => {
      const req = contract
        .deploy({ arguments: params, data: bytecode })
        .send({
          from,
          gas: gas?.toString(),
          gasPrice: gasPrice?.toString(),
          maxFeePerGas: maxFeePerGas?.toString(),
          maxPriorityFeePerGas: maxPriorityFeePerGas?.toString(),
          nonce: nonce?.toString(),
          type,
          value: value?.toString(),
        })
        .on("error", reject)
        .on("transactionHash", (hash) =>
          resolve(normalizePossibleByteArray(hash)),
        );

      if (onMined) {
        req.on("receipt", (receipt) => {
          onMined({
            blockHash: normalizePossibleByteArray(receipt.blockHash),
            contractAddress: receipt.contractAddress,
            cumulativeGasUsed: BigInt(receipt.cumulativeGasUsed),
            effectiveGasPrice: BigInt(receipt.effectiveGasPrice ?? 0n),
            blockNumber: BigInt(receipt.blockNumber),
            from: receipt.from,
            logsBloom: normalizePossibleByteArray(receipt.logsBloom),
            status: receipt.status ? "success" : "reverted",
            gasUsed: BigInt(receipt.gasUsed),
            to: receipt.to,
            transactionHash: normalizePossibleByteArray(
              receipt.transactionHash,
            ),
            transactionIndex: BigInt(receipt.transactionIndex),
          });
        });
      }
    });
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
    const { params } = prepareParams({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });
    const { method } = this.#getMethod({ abi, fn, address });
    from ??= await this.getSignerAddress();

    return new Promise<Hash>((resolve, reject) => {
      const req = this.web3.eth
        .sendTransaction({
          ...rest,
          data: method(...params).encodeABI(),
          to: address,
          from,
          accessList: accessList as AccessList,
        })
        .on("error", reject)
        .on("transactionHash", (hash) => resolve(hash));

      if (onMined) {
        req.on("receipt", (receipt) => {
          onMined({
            ...receipt,
            effectiveGasPrice: receipt.effectiveGasPrice ?? 0n,
            status: receipt.status ? "success" : "reverted",
          });
        });
      }
    });
  }

  #getMethod({
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

function normalizePossibleByteArray(value: string | Uint8Array) {
  return typeof value === "string"
    ? value
    : `0x${Buffer.from(value).toString("hex")}`;
}

declare module "@delvtech/drift" {
  interface BaseTypeOverrides {
    HexString: string;
  }

  interface ContractCallOptions {
    /**
     * Unavailable in web3.js.
     */
    blobs?: undefined;
    /**
     * Unavailable in web3.js.
     */
    blobVersionedHashes?: undefined;
    /**
     * Unavailable in web3.js.
     */
    maxFeePerBlobGas?: undefined;
  }
}
