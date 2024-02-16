import { Abi } from 'abitype';
import {
  CreateCachedReadContractOptions,
  createCachedReadContract,
} from 'src/contract/factories/createCachedReadContract';
import { CachedReadWriteContract } from 'src/contract/types/CachedContract';
import { ReadWriteContract } from 'src/contract/types/Contract';

export interface CreateCachedReadWriteContractOptions<TAbi extends Abi = Abi>
  extends CreateCachedReadContractOptions<TAbi> {
  contract: ReadWriteContract<TAbi> | CachedReadWriteContract<TAbi>;
}

/**
 * Provides a cached wrapper around an Ethereum writable contract. This class is
 * useful for both reading (with caching) and writing to a contract. It extends
 * the functionality provided by CachedReadContract by adding write
 * capabilities.
 */
export function createCachedReadWriteContract<TAbi extends Abi = Abi>({
  contract,
  cache,
  namespace,
}: CreateCachedReadWriteContractOptions<TAbi>): CachedReadWriteContract<TAbi> {
  const cachedReadContract = isCached(contract)
    ? contract
    : createCachedReadContract({ contract, cache, namespace });

  return {
    ...contract,
    ...cachedReadContract,
  };
}

function isCached<TAbi extends Abi>(
  contract: ReadWriteContract<TAbi> | CachedReadWriteContract<TAbi>,
): contract is CachedReadWriteContract<TAbi> {
  return 'clearCache' in contract;
}
