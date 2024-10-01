import isMatch from "lodash.ismatch";
import type {
  DriftCache,
  DriftReadKeyParams,
} from "src/cache/DriftCache/types";
import { createLruSimpleCache } from "src/cache/SimpleCache/createLruSimpleCache";
import { createSimpleCacheKey } from "src/cache/SimpleCache/createSimpleCacheKey";
import type { SimpleCache, SimpleCacheKey } from "src/cache/SimpleCache/types";
import { extendInstance } from "src/utils/extendInstance";

/**
 * Extends a {@linkcode SimpleCache} with additional API methods for use with
 * Drift clients.
 */
export function createDriftCache<T extends SimpleCache>(
  cache: T = createLruSimpleCache({ max: 500 }) as T,
): DriftCache<T> {
  const driftCache: DriftCache<T> = extendInstance<
    T,
    Omit<DriftCache, keyof SimpleCache>
  >(cache, {
    partialReadKey: ({ abi, namespace, ...params }) =>
      createSimpleCacheKey([namespace, "read", params]),

    readKey: (params) => driftCache.partialReadKey(params),

    eventsKey: ({ abi, namespace, ...params }) =>
      createSimpleCacheKey([namespace, "events", params]),

    preloadRead: ({ value, ...params }) =>
      cache.set(driftCache.readKey(params as DriftReadKeyParams), value),

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

    preloadEvents: ({ value, ...params }) =>
      cache.set(driftCache.eventsKey(params), value),
  });

  return driftCache;
}
