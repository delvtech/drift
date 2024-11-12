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
  arrayToObject,
  objectToArray,
} from "@delvtech/drift";
import { createSimulateContractParameters } from "src/utils/createSimulateContractParameters";
import { outputToFriendly } from "src/utils/outputToFriendly";
import {
  type Abi, type GetBalanceParameters,
  type GetBlockParameters,
  type PublicClient,
  decodeEventLog,
  decodeFunctionData, encodeFunctionData, rpcTransactionType
} from "viem";

export interface ViemReadAdapterParams {
  publicClient: PublicClient;
}

export class ViemReadAdapter implements ReadAdapter {
  publicClient: PublicClient;

  constructor({ publicClient }: ViemReadAdapterParams) {
    this.publicClient = publicClient;
  }

  getChainId = () => this.publicClient.getChainId();

  getBlockNumber = () => this.publicClient.getBlockNumber();

  getBlock = (params: NetworkGetBlockParams = {}) => {
    return this.publicClient.getBlock(params as GetBlockParameters).then(
      (block) =>
        ({
          ...block,
          hash: block.hash ?? undefined,
          logsBloom: block.logsBloom ?? undefined,
          nonce: block.nonce ?? undefined,
          number: block.number ?? undefined,
        }) as Block,
    );
  };

  getBalance = ({ address, block }: NetworkGetBalanceParams) => {
    return this.publicClient.getBalance({
      address,
      blockNumber: typeof block === "bigint" ? block : undefined,
      blockTag: typeof block === "string" ? block : undefined,
    } as GetBalanceParameters);
  };

  getTransaction = ({ hash }: NetworkGetTransactionParams) => {
    return this.publicClient
      .getTransaction({ hash })
      .then(
        ({
          gas,
          gasPrice,
          input,
          nonce,
          type,
          value,
          blockHash,
          blockNumber,
          from,
          chainId,
          hash,
          to,
          transactionIndex,
        }) => {
          return {
            gas,
            gasPrice: gasPrice as bigint,
            input,
            nonce: BigInt(nonce),
            type: rpcTransactionType[type],
            value,
            blockHash: blockHash ?? undefined,
            blockNumber: blockNumber ?? undefined,
            from,
            chainId,
            hash,
            to,
            transactionIndex: transactionIndex ?? undefined,
          };
        },
      );
  };

  waitForTransaction = ({ hash, timeout }: NetworkWaitForTransactionParams) => {
    return this.publicClient.waitForTransactionReceipt({ hash, timeout });
  };

  getEvents = <TAbi extends Abi, TEventName extends EventName<TAbi>>({
    abi,
    address,
    event,
    filter,
    fromBlock,
    toBlock,
  }: AdapterGetEventsParams<TAbi, TEventName>) => {
    return this.publicClient
      .getContractEvents({
        address,
        abi: abi as Abi,
        eventName: event as string,
        fromBlock,
        toBlock,
        args: filter,
      })
      .then((events) => {
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

    return this.publicClient
      .readContract({
        abi: abi as Abi,
        address,
        functionName: fn,
        args: argsArray,
        blockNumber: typeof block === "bigint" ? block : undefined,
        blockTag: typeof block === "string" ? block : undefined,
      })
      .then((output) => {
        return outputToFriendly({
          abi,
          functionName: fn,
          output,
        }) as FunctionReturn<TAbi, typeof fn>;
      });
  };

  simulateWrite = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
  >(
    params: AdapterWriteParams<TAbi, TFunctionName>,
  ) => {
    return this.publicClient
      .simulateContract(createSimulateContractParameters(params))
      .then(({ result }) => {
        return outputToFriendly({
          abi: params.abi,
          functionName: params.fn,
          output: result,
        }) as FunctionReturn<TAbi, TFunctionName>;
      });
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

    return encodeFunctionData({
      abi: abi as Abi,
      functionName: fn as string,
      args: arrayArgs,
    });
  };

  decodeFunctionData = <
    TAbi extends Abi,
    TFunctionName extends FunctionName<TAbi>,
  >({
    abi,
    data,
    fn,
  }: AdapterDecodeFunctionDataParams<TAbi, TFunctionName>) => {
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
  };
}
