import {
  AbiEntryNotFoundError,
  arrayToFriendly,
  DecodedFunctionData,
  friendlyToArray,
  FunctionName,
  ReadContract,
  ReadWriteContract,
} from '@delvtech/evm-client';
import { Abi } from 'abitype';
import { Contract, EventLog, InterfaceAbi, Provider, Signer } from 'ethers';
import { createReadWriteContract } from 'src/contract/createReadWriteContract';

export interface CreateReadContractOptions<TAbi extends Abi = Abi> {
  address: `0x${string}`;
  abi: TAbi;
  provider: Provider;
  ethersContract?: Contract;
}

export interface EthersReadContract<TAbi extends Abi = Abi>
  extends ReadContract<TAbi> {
  connect(signer: Signer): ReadWriteContract<TAbi>;
}

/**
 * An ethers.js implementation of the {@linkcode ReadContract} interface.
 * @see https://ethers.org/
 */
export function createReadContract<TAbi extends Abi = Abi>({
  address,
  abi,
  provider,
  ethersContract = new Contract(address, abi as InterfaceAbi, provider),
}: CreateReadContractOptions<TAbi>): EthersReadContract<TAbi> {
  return {
    abi,
    address,

    /**
     * Connect a signer to upgrade the contract to a read-write contract.
     */
    connect(signer: Signer) {
      return createReadWriteContract({
        address,
        abi,
        provider,
        signer,
        ethersContract: ethersContract.connect(signer) as Contract,
        readContract: this,
      });
    },

    async read(functionName, args, options) {
      const argsArray = friendlyToArray({
        abi: abi as Abi,
        type: 'function',
        name: functionName,
        kind: 'inputs',
        value: args,
      });

      const output = await ethersContract[functionName]?.staticCallResult(
        ...argsArray,
        options,
      );

      return arrayToFriendly({
        abi: abi as Abi,
        type: 'function',
        name: functionName,
        kind: 'outputs',
        values: output,
      });
    },

    async simulateWrite(functionName, args, options) {
      const argsArray = friendlyToArray({
        abi: abi as Abi,
        type: 'function',
        name: functionName,
        kind: 'inputs',
        value: args,
      });

      const output = await ethersContract[functionName]?.staticCallResult(
        ...argsArray,
        options,
      );

      return arrayToFriendly({
        abi: abi as Abi,
        type: 'function',
        name: functionName,
        kind: 'outputs',
        values: output,
      });
    },

    async getEvents(eventName, options) {
      const filterValues = friendlyToArray({
        // Cast to allow any array type for values
        abi: abi as Abi,
        type: 'event',
        name: eventName,
        kind: 'inputs',
        value: options?.filter,
      });

      const filter = ethersContract.filters[eventName]!(...filterValues);
      const events = (await ethersContract.queryFilter(
        filter,
        options?.fromBlock,
        options?.toBlock,
      )) as EventLog[];

      return events.map(({ blockNumber, data, transactionHash, args }) => {
        const friendlyArgs = arrayToFriendly({
          // Cast to allow any array type for values
          abi: abi as Abi,
          type: 'event',
          name: eventName,
          kind: 'inputs',
          values: args,
        });

        return {
          args: friendlyArgs,
          blockNumber: BigInt(blockNumber),
          data: data as `0x${string}`,
          eventName,
          transactionHash: transactionHash as `0x${string}`,
        };
      });
    },

    encodeFunctionData(functionName, args) {
      const arrayArgs = friendlyToArray({
        // Cast to allow any array type for values
        abi: abi as Abi,
        type: 'function',
        name: functionName,
        kind: 'inputs',
        value: args,
      });

      const abiFragment = ethersContract.interface.getFunction(functionName);

      if (!abiFragment) {
        throw new AbiEntryNotFoundError({
          type: 'function',
          name: functionName,
        });
      }

      return ethersContract.interface.encodeFunctionData(
        functionName,
        arrayArgs,
      ) as `0x${string}`;
    },

    decodeFunctionData<TFunctionName extends FunctionName<TAbi>>(
      data: `0x${string}`,
    ) {
      const parsed = ethersContract.interface.parseTransaction({
        data,
      });

      if (!parsed) {
        throw new Error(`Unable to decode function data: ${data}`);
      }

      return {
        args: arrayToFriendly({
          abi: abi as Abi,
          type: 'function',
          name: parsed.name,
          kind: 'inputs',
          values: parsed.args,
        }),
        functionName: parsed.name,
      } as DecodedFunctionData<TAbi, TFunctionName>;
    },
  };
}
