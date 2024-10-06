import {
  type CachedReadWriteContract,
  type SimpleCache,
  createCachedReadWriteContract as baseFactory,
} from "@delvtech/evm-client";
import {
  type ReadWriteContractOptions,
  createReadWriteContract,
} from "src/contract/createReadWriteContract";
import type { Abi } from "viem";

export interface CreateCachedReadWriteContractOptions<TAbi extends Abi = Abi>
  extends ReadWriteContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createCachedReadWriteContract<TAbi extends Abi = Abi>({
  abi,
  address,
  publicClient,
  walletClient,
  readContract,
  cache,
  namespace,
}: CreateCachedReadWriteContractOptions<TAbi>): CachedReadWriteContract<TAbi> {
  return baseFactory({
    contract: createReadWriteContract({
      abi,
      address,
      publicClient,
      walletClient,
      readContract,
    }),
    cache,
    namespace,
  });
}
