import type { Abi } from "abitype";
import type { AdapterReadContract } from "src/adapter/contract/types/contract";
import type { DriftCache } from "src/cache/DriftCache/types";
import type { ReadContract } from "src/contract/types";
import { extendInstance } from "src/utils/extendInstance";

interface CreateReadContractParams<
TAbi extends Abi,
TContract extends AdapterReadContract<TAbi>,
TCache extends DriftCache,
> {
  contract: TContract;
  cache: TCache;
  namespace: string;
}

/**
 * Extends an {@linkcode AdapterReadContract} with additional API methods for
 * use with Drift clients.
 */
export function createReadContract<
  TAbi extends Abi,
  TContract extends AdapterReadContract<TAbi>,
  TCache extends DriftCache,
>(contract: TContract, cache: TCache): ReadContract<TAbi, TContract, TCache> {
  const readContract: ReadContract<TAbi, TContract, TCache> = extendInstance<
    TContract,
    Omit<ReadContract, keyof AdapterReadContract>
  >(contract, {
    cache,

    partialReadKey: (fn, args, options) =>
      cache.partialReadKey({ abi: contract.abi, fn, args, address: contract.address, namespace, }),

    readKey: (params) => driftCache.partialReadKey(params),

    eventsKey: ({ abi, namespace, ...params }) =>
      createSimpleCacheKey([namespace, "events", params]),

    preloadRead: ({ value, ...params }) =>
      cache.set(driftCache.readKey(params as DriftReadKeyParams), value),

    preloadEvents: ({ value, ...params }) =>
      cache.set(driftCache.eventsKey(params), value),

    invalidateRead: (params) => cache.delete(driftCache.readKey(params)),

    invalidateReadsMatching(params) {
      const sourceKey = driftCache.partialReadKey(params);

      for (const [key] of cache.entries) {
        if (
          typeof key === "object" &&
          isMatch(key, sourceKey as SimpleCacheKey[])
        ) {
          cache.delete(key);
        }
      }
    },
  });

  return readContract;
}
