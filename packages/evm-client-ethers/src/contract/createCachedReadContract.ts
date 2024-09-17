import {
  type CachedReadContract,
  type SimpleCache,
  createCachedReadContract as baseFactory,
} from "@delvtech/evm-client";
import type { Abi } from "abitype";
import {
  type CreateReadContractOptions,
  createReadContract,
} from "src/contract/createReadContract";

export interface CreateCachedReadContractOptions<TAbi extends Abi = Abi>
  extends CreateReadContractOptions<TAbi> {
  cache?: SimpleCache;
  namespace?: string;
}

export function createCachedReadContract<TAbi extends Abi = Abi>({
  abi,
  address,
  provider,
  cache,
  namespace,
}: CreateCachedReadContractOptions<TAbi>): CachedReadContract<TAbi> {
  return baseFactory({
    contract: createReadContract({
      abi,
      address,
      provider,
    }),
    cache,
    namespace,
  });
}
