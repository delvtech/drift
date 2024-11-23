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
// TODO: Consider using a similar pattern as the `StubStore` for the cache or
// implement a generalized plugins/hooks layer that can be used by the cache,
// store, and other plugins.
export function createClientCache<T extends SimpleCache>(
  cache: T = createLruSimpleCache({ max: 500 }) as T,
): ClientCache<T> {
  if (isClientCache(cache)) {
    return cache;
  }

  const clientCache = extendInstance<SimpleCache, ClientCache>(cache, {
    store: cache,

    // Chain ID //

    preloadChainId({ value, ...params }) {
      return cache.set(this.chainIdKey(params), value);
    },

    chainIdKey({ cacheNamespace } = {}) {
      return createSerializableKey([cacheNamespace, "chainId"]);
    },

    // Block //

    preloadBlock({ value, ...params }) {
      return cache.set(this.blockKey(params), value);
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
      return cache.set(this.balanceKey(params), value);
    },

    invalidateBalance(params) {
      return cache.delete(this.balanceKey(params));
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
      return cache.set(this.transactionKey(params), value);
    },

    transactionKey({ hash, cacheNamespace }) {
      return createSerializableKey([cacheNamespace, "transaction", { hash }]);
    },

    // Events //

    preloadEvents({ value, ...params }) {
      return cache.set(this.eventsKey(params), value);
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
      return cache.set(this.readKey(params as ReadKeyParams), value);
    },

    invalidateRead(params) {
      return cache.delete(this.readKey(params));
    },

    invalidateReadsMatching(params) {
      const matchKey = this.partialReadKey(params);

      for (const [key] of cache.entries()) {
        if (key === matchKey) {
          cache.delete(key);
          continue;
        }
        if (
          typeof key === "object" &&
          typeof matchKey === "object" &&
          isMatch(key, matchKey)
        ) {
          cache.delete(key);
        }
      }
    },

    readKey(params) {
      return this.partialReadKey(params);
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

  return clientCache as ClientCache<T>;
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
