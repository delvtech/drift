import { Abi } from 'abitype';
import {
  CreateCachedReadContractOptions,
  createCachedReadContract,
} from 'src/contract/factories/createCachedReadContract';
import { CachedReadWriteContract } from 'src/contract/types/CachedContract';
import { ReadWriteContract } from 'src/contract/types/Contract';

export interface CreateCachedReadWriteContractOptions<TAbi extends Abi = Abi>
  extends CreateCachedReadContractOptions<TAbi> {
  contract: ReadWriteContract<TAbi>;
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
  // Avoid double-caching if given a contract that already has a cache.
  if (isCached(contract)) {
    return contract;
  }
  // Because this is part of the public API, we won't know if the original
  // contract is a plain object or a class instance, so we use Object.create to
  // preserve the original contract's prototype chain when extending, ensuring
  // the new contract includes all the original contract's methods and
  // instanceof checks will still work.
  const contractPrototype = Object.getPrototypeOf(contract);
  const newContract = Object.create(contractPrototype);
  return Object.assign(
    newContract,
    createCachedReadContract({ contract, cache, namespace }),
  );
}

function isCached<TAbi extends Abi>(
  contract: ReadWriteContract<TAbi>,
): contract is CachedReadWriteContract<TAbi> {
  return 'clearCache' in contract;
}
