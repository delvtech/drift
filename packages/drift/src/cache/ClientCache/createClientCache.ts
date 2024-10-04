import isMatch from "lodash.ismatch";
import type {
  ClientCache,
  DriftReadKeyParams,
} from "src/cache/ClientCache/types";
import { createLruSimpleCache } from "src/cache/SimpleCache/createLruSimpleCache";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import {
  type SerializableKey,
  createSerializableKey,
} from "src/utils/createSerializableKey";
import { extendInstance } from "src/utils/extendInstance";

/**
 * Extends a {@linkcode SimpleCache} with additional API methods for use with
 * Drift clients.
 */
export function createClientCache<T extends SimpleCache>(
  cache: T = createLruSimpleCache({ max: 500 }) as T,
): ClientCache<T> {
  const clientCache: ClientCache<T> = extendInstance<
    T,
    Omit<ClientCache, keyof SimpleCache>
  >(cache, {
    partialReadKey: ({ abi, namespace, ...params }) =>
      createSerializableKey([namespace, "read", params]),

    readKey: (params) => clientCache.partialReadKey(params),

    eventsKey: ({ abi, namespace, ...params }) =>
      createSerializableKey([namespace, "events", params]),

    preloadRead: ({ value, ...params }) =>
      cache.set(clientCache.readKey(params as DriftReadKeyParams), value),

    preloadEvents: ({ value, ...params }) =>
      cache.set(clientCache.eventsKey(params), value),

    invalidateRead: (params) => cache.delete(clientCache.readKey(params)),

    invalidateReadsMatching(params) {
      const sourceKey = clientCache.partialReadKey(params);

      for (const [key] of cache.entries) {
        if (
          typeof key === "object" &&
          isMatch(key, sourceKey as SerializableKey[])
        ) {
          cache.delete(key);
        }
      }
    },
  });

  return clientCache;
}
