import isMatch from "lodash.ismatch";
import type { ClientCache, ReadKeyParams } from "src/cache/ClientCache/types";
import { createLruSimpleCache } from "src/cache/SimpleCache/createLruSimpleCache";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import {
  createSerializableKey
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
    // Chain ID //

    preloadChainId(value) {
      return cache.set(clientCache.chainIdKey(), value);
    },

    chainIdKey() {
      return "chainId";
    },

    // Block //

    preloadBlock({ value, ...params }) {
      return cache.set(clientCache.blockKey(params), value);
    },

    blockKey({ namespace, options } = {}) {
      return createSerializableKey([namespace, "block", options]);
    },

    // Balance //

    preloadBalance({ value, ...params }) {
      return cache.set(clientCache.balanceKey(params), value);
    },

    invalidateBalance(params) {
      return cache.delete(clientCache.balanceKey(params));
    },

    balanceKey({ address, cacheNamespace: namespace, options }) {
      return createSerializableKey([namespace, "balance", address, options]);
    },

    // Transaction //

    preloadTransaction({ value, ...params }) {
      return cache.set(clientCache.transactionKey(params), value);
    },

    transactionKey({ hash, cacheNamespace: namespace }) {
      return createSerializableKey([namespace, "transaction", hash]);
    },

    // Events //

    preloadEvents({ value, ...params }) {
      return cache.set(clientCache.eventsKey(params), value);
    },

    eventsKey({ abi, cacheNamespace: namespace, ...params }) {
      return createSerializableKey([namespace, "events", params]);
    },

    // Read //

    preloadRead({ value, ...params }) {
      return cache.set(clientCache.readKey(params as ReadKeyParams), value);
    },

    invalidateRead(params) {
      return cache.delete(clientCache.readKey(params));
    },

    invalidateReadsMatching(params) {
      const matchKey = clientCache.partialReadKey(params);

      for (const [key] of cache.entries) {
        if (key === matchKey) {
          clientCache.delete(key);
          continue;
        }
        if (
          typeof key === "object" &&
          typeof matchKey === "object" &&
          isMatch(key, matchKey)
        ) {
          clientCache.delete(key);
        }
      }
    },

    readKey(params) {
      return clientCache.partialReadKey(params);
    },

    partialReadKey({ abi, cacheNamespace: namespace, ...params }) {
      return createSerializableKey([namespace, "read", params]);
    },
  });

  return clientCache;
}
