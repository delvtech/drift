import {
  CachedReadContract,
  SimpleCache,
  createCachedReadContract as baseFactory,
} from "@delvtech/evm-client";
import {
  CreateReadContractOptions,
  createReadContract,
} from "src/contract/createReadContract";
import { Abi } from "viem";

export interface CreateCachedReadContractOptions<TAbi extends Abi = Abi>
  extends CreateReadContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createCachedReadContract<TAbi extends Abi = Abi>({
  abi,
  address,
  publicClient,
  cache,
  namespace,
}: CreateCachedReadContractOptions<TAbi>): CachedReadContract<TAbi> {
  return baseFactory({
    contract: createReadContract({
      abi,
      address,
      publicClient,
    }),
    cache,
    namespace,
  });
}
