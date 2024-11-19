import {
  type AdapterDecodeFunctionDataParams,
  type AdapterEncodeFunctionDataParams,
  type AdapterGetEventsParams,
  type AdapterReadParams,
  type AdapterWriteParams,
  type Address,
  type AnyObject,
  type Block,
  type ContractEvent,
  type DecodedFunctionData,
  DriftError,
  type EventName,
  type FunctionName,
  type FunctionReturn,
  type Hash,
  type HexString,
  type NetworkGetBalanceParams,
  type NetworkGetBlockParams,
  type NetworkGetTransactionParams,
  type NetworkWaitForTransactionParams,
  type ReadWriteAdapter,
  type Transaction,
  type TransactionReceipt,
  objectToArray,
} from "@delvtech/drift";
import type { Abi } from "abitype";
import { type AbiFragment, default as Web3 } from "web3";

export class Web3Adapter implements ReadWriteAdapter {
  web3;

  constructor(
    web3OrProvider: Web3 | ConstructorParameters<typeof Web3>[0] = new Web3(),
  ) {
    this.web3 =
      web3OrProvider instanceof Web3
        ? web3OrProvider
        : new Web3(web3OrProvider);
  }

  getChainId = () => this.web3.eth.getChainId().then(Number);

  getBlockNumber = () => this.web3.eth.getBlockNumber();

  getBlock = async ({
    blockHash,
    blockNumber,
    blockTag,
  }: NetworkGetBlockParams = {}) => {
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
        } as Block)
      : undefined;
  };

  getBalance = ({ address, block }: NetworkGetBalanceParams) =>
    this.web3.eth.getBalance(address, block);

  getTransaction = async ({ hash }: NetworkGetTransactionParams) => {
    const tx = await this.web3.eth.getTransaction(hash);
    return tx
      ? ({
          blockHash: tx.blockHash as Hash | undefined,
          blockNumber: tx.blockNumber,
          chainId: tx.chainId,
          from: tx.from as Address,
          gas: BigInt(tx.gas),
          gasPrice: BigInt(tx.gasPrice),
          hash: tx.hash as Hash,
          input: tx.input,
          nonce: BigInt(tx.nonce),
          to: tx.to ?? (undefined as Address | undefined),
          transactionIndex: tx.transactionIndex,
          type:
            typeof tx.type === "string"
              ? tx.type
              : (tx.type as unknown as bigint).toString(16),
          value: BigInt(tx.value),
        } as Transaction)
      : undefined;
  };

  waitForTransaction = async ({
    hash,
    timeout = this.web3.transactionPollingTimeout,
  }: NetworkWaitForTransactionParams) => {
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
  };

  getEvents = async <TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event: eventName,
    filter,
    fromBlock,
    toBlock,
  }: AdapterGetEventsParams<TAbi, TEventName>) => {
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
      } as ContractEvent<TAbi, TEventName>;
    });
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
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });
    const { method } = this._getMethod({ abi, fn, address });

    return method(...argsArray).call(undefined, block) as Promise<
      FunctionReturn<TAbi, TFunctionName>
    >;
  };

  simulateWrite = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    const { abi, address, args, fn } = params;
    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const toHex = this.web3.utils.toHex;
    const { method } = this._getMethod({ abi, fn, address });
    const methodObj = method(...arrayArgs);
    const outputObj = await methodObj.call({
      data: methodObj.encodeABI(),
      from: params.from,
      gas: params.gas ? toHex(params.gas) : undefined,
      gasPrice: params.gasPrice ? toHex(params.gasPrice) : undefined,
      maxFeePerGas: params.maxFeePerGas
        ? toHex(params.maxFeePerGas)
        : undefined,
      maxPriorityFeePerGas: params.maxPriorityFeePerGas
        ? toHex(params.maxPriorityFeePerGas)
        : undefined,
      nonce: params.nonce ? toHex(params.nonce) : undefined,
      type: params.type ? toHex(params.type) : undefined,
      value: params.value ? toHex(16) : undefined,
    });

    return outputObj as FunctionReturn<TAbi, TFunctionName>;
  };

  encodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({
    abi,
    fn,
    args,
  }: AdapterEncodeFunctionDataParams<TAbi, TFunctionName>) => {
    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });
    const { method } = this._getMethod({ abi, fn });

    return method(...arrayArgs).encodeABI() as HexString;
  };

  decodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({
    abi,
    data,
  }: AdapterDecodeFunctionDataParams<TAbi, TFunctionName>) => {
    const { __method__, ...args } = new this.web3.eth.Contract(
      abi as readonly AbiFragment[],
    ).decodeMethodData(data);

    return {
      args: args as AnyObject,
      functionName: __method__.split("(")[0],
    } as DecodedFunctionData<TAbi, TFunctionName>;
  };

  getSignerAddress = async () => {
    const [address] = await this.web3.eth.getAccounts();
    if (!address) throw new DriftError("No signer address found");
    return address as Address;
  };

  write = async <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    const {
      abi,
      address,
      args,
      fn,
      from = await this.getSignerAddress(),
      onMined,
      ...rest
    } = params;

    const arrayArgs = objectToArray({
      abi: abi as Abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args,
    });

    const { method } = this._getMethod({ abi, fn, address });

    return new Promise<Hash>((resolve, reject) => {
      const req = this.web3.eth
        .sendTransaction({
          ...rest,
          data: method(...arrayArgs).encodeABI(),
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
  };

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
