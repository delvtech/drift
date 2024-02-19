import { Abi } from 'abitype';
import { createLruSimpleCache } from 'src/cache/factories/createLruSimpleCache';
import { SimpleCache, SimpleCacheKey } from 'src/cache/types/SimpleCache';
import { createSimpleCacheKey } from 'src/cache/utils/createSimpleCacheKey';
import { CachedReadContract } from 'src/contract/types/CachedContract';
import { ReadContract } from 'src/contract/types/Contract';

// TODO: Figure out a good default cache size
const DEFAULT_CACHE_SIZE = 100;

export interface CreateCachedReadContractOptions<TAbi extends Abi = Abi> {
  contract: ReadContract<TAbi>;
  cache?: SimpleCache;
  /**
   * A namespace to distinguish this instance from others in the cache by
   * prefixing all cache keys.
   */
  namespace?: string;
}

/**
 * A wrapped Ethereum contract reader that provides caching capabilities. Useful
 * for reducing the number of actual reads from a contract by caching and
 * reusing previous read results.
 *
 * @example
 * const cachedContract = new CachedReadContract({ contract: myContract });
 * const result1 = await cachedContract.read("functionName", args);
 * const result2 = await cachedContract.read("functionName", args); // Fetched from cache
 */
export function createCachedReadContract<TAbi extends Abi = Abi>({
  contract,
  cache = createLruSimpleCache({ max: DEFAULT_CACHE_SIZE }),
  namespace,
}: CreateCachedReadContractOptions<TAbi>): CachedReadContract<TAbi> {
  return {
    ...contract,
    cache,

    /**
     * Reads data from the contract. First checks the cache, and if not present,
     * fetches from the contract and then caches the result.
     */
    async read(functionName, args, options) {
      return getOrSet({
        cache,
        key: createSimpleCacheKey([
          namespace,
          'read',
          {
            address: contract.address,
            functionName,
            args,
            options,
          },
        ]),

        callback: () => contract.read(functionName, args, options),
      });
    },

    /**
     * Deletes a specific read from the cache.
     *
     * @example
     * const cachedContract = new CachedReadContract({ contract: myContract });
     * const result1 = await cachedContract.read("functionName", args);
     * const result2 = await cachedContract.read("functionName", args); // Fetched from cache
     *
     * cachedContract.deleteRead("functionName", args);
     * const result3 = await cachedContract.read("functionName", args); // Fetched from contract
     */
    deleteRead(functionName, args, options) {
      const key = createSimpleCacheKey([
        namespace,
        'read',
        {
          address: contract.address,
          functionName,
          args,
          options,
        },
      ]);

      cache.delete(key);
    },

    /**
     * Gets events from the contract. First checks the cache, and if not present,
     * fetches from the contract and then caches the result.
     */
    async getEvents(eventName, options) {
      return getOrSet({
        cache,
        key: createSimpleCacheKey([
          namespace,
          'getEvents',
          {
            address: contract.address,
            eventName,
            options,
          },
        ]),
        callback: () => contract.getEvents(eventName, options),
      });
    },

    /**
     * Clears the entire cache.
     */
    clearCache() {
      cache.clear();
    },
  };
}

async function getOrSet<TValue>({
  cache,
  key,
  callback,
}: {
  cache: SimpleCache;
  key: SimpleCacheKey;
  callback: () => Promise<TValue> | TValue;
}): Promise<TValue> {
  let value = cache.get(key);
  if (value) {
    return value;
  }

  value = await callback();
  cache.set(key, value);

  return value;
}
