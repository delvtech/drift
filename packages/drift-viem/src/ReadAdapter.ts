import {
  type AbiObjectType,
  type AdapterDecodeFunctionDataParams,
  type AdapterEncodeFunctionDataParams,
  type AdapterGetEventsParams,
  type AdapterReadParams,
  type AdapterWriteParams,
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
  type Abi,
  type Address,
  type GetBalanceParameters,
  type GetBlockParameters,
  type Hash,
  type Hex,
  type PublicClient,
  decodeFunctionData,
  encodeFunctionData,
  rpcTransactionType,
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

  getBlock = (params: NetworkGetBlockParams = {}) => {
    return this.publicClient
      .getBlock(params as GetBlockParameters)
      .then((block) => {
        if (!block) {
          return undefined;
        }

        return {
          blockNumber: block.number,
          timestamp: block.timestamp,
        };
      });
  };

  getBalance = ({
    address,
    blockNumber,
    blockTag,
    blockHash,
  }: NetworkGetBalanceParams) => {
    const parameters: Partial<GetBalanceParameters> = {
      address: address as Address,
    };

    if (blockNumber) {
      parameters.blockNumber = blockNumber;
    } else if (blockTag) {
      parameters.blockTag = blockHash;
    } else if (blockHash) {
      return this.getBlock({ blockHash }).then((block) => {
        return this.publicClient.getBalance({
          address: address as Address,
          blockNumber: block?.blockNumber ?? undefined,
        });
      });
    }

    return this.publicClient.getBalance(parameters as GetBalanceParameters);
  };

  getTransaction = ({ hash }: NetworkGetTransactionParams) => {
    return this.publicClient
      .getTransaction({
        hash: hash as Hash,
      })
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
            nonce,
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
    return this.publicClient.waitForTransactionReceipt({
      hash: hash as Hash,
      timeout,
    });
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
        address: address as Address,
        abi: abi as Abi,
        eventName: event as string,
        fromBlock: fromBlock ?? "earliest",
        toBlock: toBlock ?? "latest",
        args: filter,
      })
      .then((events) => {
        return events.map(({ args, blockNumber, data, transactionHash }) => {
          const objectArgs = Array.isArray(args)
            ? arrayToObject({
                abi: abi as Abi,
                type: "event",
                name: event,
                kind: "inputs",
                values: args,
              })
            : (args as AbiObjectType<TAbi, "event", typeof event, "inputs">);

          return {
            args: objectArgs,
            blockNumber: blockNumber ?? undefined,
            data,
            eventName: event,
            transactionHash: transactionHash ?? undefined,
          };
        });
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
        address: address as Address,
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
    const { args, functionName } = decodeFunctionData({
      abi: abi,
      data: data as Hex,
    });

    const arrayArgs = Array.isArray(args) ? args : [args];

    return {
      args: arrayToObject({
        // Cast to allow any array type for values
        abi: abi as Abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        values: arrayArgs,
      }),
      functionName,
    } as DecodedFunctionData<TAbi, TFunctionName>;
  };
}
