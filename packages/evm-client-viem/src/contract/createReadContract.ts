import {
  DecodedFunctionData,
  Event,
  FunctionName,
  ReadContract,
  ReadWriteContract,
  arrayToFriendly,
  friendlyToArray,
} from "@delvtech/evm-client";
import { createSimulateContractParameters } from "src/contract/utils/createSimulateContractParameters";
import {
  Abi,
  Address,
  PublicClient,
  WalletClient,
  decodeFunctionData,
  encodeFunctionData,
} from "viem";
import { createReadWriteContract } from "./createReadWriteContract";

export interface CreateReadContractOptions<TAbi extends Abi = Abi> {
  abi: TAbi;
  address: Address;
  publicClient: PublicClient;
}

export interface ViemReadContract<TAbi extends Abi = Abi>
  extends ReadContract<TAbi> {
  connectWallet(walletClient: WalletClient): ReadWriteContract<TAbi>;
}

/**
 * Create a viem implementation of the ReadContract interface.
 * @see https://viem.sh/
 */
export function createReadContract<TAbi extends Abi = Abi>({
  abi,
  address,
  publicClient,
}: CreateReadContractOptions<TAbi>): ViemReadContract<TAbi> {
  return {
    abi,
    address,

    /**
     * Connect a signer to upgrade the contract to a read-write contract.
     */
    connectWallet(walletClient: WalletClient) {
      return createReadWriteContract({
        address,
        abi,
        publicClient,
        walletClient,
        readContract: this,
      });
    },

    async read(functionName, args, options) {
      const argsArray = friendlyToArray({
        abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        value: args,
      });

      const output = await publicClient.readContract({
        abi: abi as Abi,
        address,
        functionName,
        args: argsArray,
        ...options,
      });

      const arrayOutput = Array.isArray(output) ? output : [output];

      return arrayToFriendly({
        abi: abi as Abi,
        type: "function",
        name: functionName,
        kind: "outputs",
        values: arrayOutput,
      });
    },

    async simulateWrite(functionName, args, options) {
      const argsArray = friendlyToArray({
        abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        value: args,
      });

      const { result } = await publicClient.simulateContract({
        abi: abi as Abi,
        address,
        functionName,
        args: argsArray,
        ...createSimulateContractParameters(options),
      });

      const arrayOutput = Array.isArray(result) ? result : [result];

      return arrayToFriendly({
        abi: abi as Abi,
        type: "function",
        name: functionName,
        kind: "outputs",
        values: arrayOutput,
      });
    },

    async getEvents(eventName, options) {
      const filter = await publicClient.createContractEventFilter({
        address: address,
        abi: abi as Abi,
        eventName: eventName as string,
        args: options?.filter,
        fromBlock: options?.fromBlock ?? "earliest",
        toBlock: options?.toBlock ?? "latest",
      });

      const events = await publicClient.getFilterLogs({ filter });

      return events.map(({ args, blockNumber, data, transactionHash }) => {
        const friendlyArgs = Array.isArray(args)
          ? arrayToFriendly({
              abi: abi as Abi,
              type: "event",
              name: eventName,
              kind: "inputs",
              values: args as readonly unknown[],
            })
          : args;

        return {
          args: friendlyArgs,
          blockNumber: blockNumber ?? undefined,
          data,
          eventName,
          transactionHash: transactionHash ?? undefined,
        };
      }) as Event<TAbi, typeof eventName>[];
    },

    encodeFunctionData(functionName, args) {
      const arrayArgs = friendlyToArray({
        abi: abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        value: args,
      });

      return encodeFunctionData({
        abi: abi as Abi,
        functionName: functionName as string,
        args: arrayArgs,
      });
    },

    decodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
      data: `0x${string}`,
    ) {
      const { args, functionName } = decodeFunctionData({
        abi: abi,
        data,
      });

      const arrayArgs = Array.isArray(args) ? args : [args];

      return {
        args: arrayToFriendly({
          // Cast to allow any array type for values
          abi: abi as Abi,
          type: "function",
          name: functionName,
          kind: "inputs",
          values: arrayArgs,
        }),
        functionName,
      } as DecodedFunctionData<TAbi, TFunctionName>;
    },
  };
}
