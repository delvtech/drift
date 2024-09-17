import {
  objectToArray,
  type ReadContract,
  type ReadWriteContract,
} from "@delvtech/evm-client";
import type { Abi } from "abitype";
import { Contract, type InterfaceAbi, type Provider, type Signer } from "ethers";
import { createReadContract } from "src/contract/createReadContract";

export interface ReadWriteContractOptions<TAbi extends Abi = Abi> {
  address: `0x${string}`;
  abi: TAbi;
  provider: Provider;
  signer: Signer;
  ethersContract?: Contract;
  readContract?: ReadContract<TAbi>;
}

/**
 * An ethers.js implementation of the {@linkcode ReadWriteContract} interface.
 * @see https://ethers.org/
 */
export function createReadWriteContract<TAbi extends Abi = Abi>({
  address,
  abi,
  provider,
  signer,
  ethersContract = new Contract(address, abi as InterfaceAbi, signer),
  readContract = createReadContract({
    address,
    abi,
    provider,
    ethersContract,
  }),
}: ReadWriteContractOptions<TAbi>): ReadWriteContract<TAbi> {
  return {
    ...readContract,

    getSignerAddress() {
      return signer.getAddress() as Promise<`0x${string}`>;
    },

    async write(functionName, args, options) {
      const argsArray = objectToArray({
        abi: abi as Abi,
        type: "function",
        name: functionName,
        kind: "inputs",
        value: args,
      });

      const transaction = await ethersContract[functionName]?.send(
        ...argsArray,
        options,
      );
      return transaction?.hash as `0x${string}`;
    },
  };
}
