import isMatch from "lodash.ismatch";
import type { ClientCache, ReadKeyParams } from "src/cache/ClientCache/types";
import { createLruSimpleCache } from "src/cache/SimpleCache/createLruSimpleCache";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import { createSerializableKey } from "src/utils/createSerializableKey";
import { extendInstance } from "src/utils/extendInstance";

/**
 * Extends a {@linkcode SimpleCache} with additional API methods for use with
 * Drift clients.
 */
// TODO: Consider using a similar pattern as the `MockStore` for the cache or
// implement a generalized plugins/hooks layer that can be used by the cache,
// store, and other plugins.
export function createClientCache<T extends SimpleCache>(
  cache: T = createLruSimpleCache({ max: 500 }) as T,
): ClientCache<T> {
  if (isClientCache(cache)) {
    return cache;
  }
  const clientCache: ClientCache<T> = extendInstance<
    T,
    Omit<ClientCache, keyof SimpleCache>
  >(cache, {
    // Chain ID //

    preloadChainId({ value, ...params }) {
      return cache.set(clientCache.chainIdKey(params), value);
    },

    chainIdKey({ cacheNamespace } = {}) {
      return createSerializableKey([cacheNamespace, "chainId"]);
    },

    // Block //

    preloadBlock({ value, ...params }) {
      return cache.set(clientCache.blockKey(params), value);
    },

    blockKey({ cacheNamespace, blockHash, blockNumber, blockTag } = {}) {
      return createSerializableKey([
        cacheNamespace,
        "block",
        { blockHash, blockNumber, blockTag },
      ]);
    },

    // Balance //

    preloadBalance({ value, ...params }) {
      return cache.set(clientCache.balanceKey(params), value);
    },

    invalidateBalance(params) {
      return cache.delete(clientCache.balanceKey(params));
    },

    balanceKey({ cacheNamespace, address, blockHash, blockNumber, blockTag }) {
      return createSerializableKey([
        cacheNamespace,
        "balance",
        { address, blockHash, blockNumber, blockTag },
      ]);
    },

    // Transaction //

    preloadTransaction({ value, ...params }) {
      return cache.set(clientCache.transactionKey(params), value);
    },

    transactionKey({ hash, cacheNamespace }) {
      return createSerializableKey([cacheNamespace, "transaction", { hash }]);
    },

    // Events //

    preloadEvents({ value, ...params }) {
      return cache.set(clientCache.eventsKey(params), value);
    },

    eventsKey({ cacheNamespace, address, event, filter, fromBlock, toBlock }) {
      return createSerializableKey([
        cacheNamespace,
        "events",
        { address, event, filter, fromBlock, toBlock },
      ]);
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

    partialReadKey({ cacheNamespace, address, args, block, fn }) {
      return createSerializableKey([
        cacheNamespace,
        "read",
        {
          address,
          args,
          block,
          fn,
        },
      ]);
    },
  });

  return clientCache;
}

function isClientCache<T extends SimpleCache>(
  cache: T,
): cache is ClientCache<T> {
  return [
    "preloadChainId",
    "chainIdKey",
    "preloadBlock",
    "blockKey",
    "preloadBalance",
    "invalidateBalance",
    "balanceKey",
    "preloadTransaction",
    "transactionKey",
    "preloadEvents",
    "eventsKey",
    "preloadRead",
    "invalidateRead",
    "invalidateReadsMatching",
    "readKey",
    "partialReadKey",
  ].every((key) => key in cache);
}
