import stringify from "fast-json-stable-stringify";
import { LRUCache } from "lru-cache";
import type { SimpleCache } from "src/cache/SimpleCache/types";
import type { SerializableKey } from "src/utils/createSerializableKey";

/**
 * An LRU (Least Recently Used) implementation of the `SimpleCache` interface.
 * This class wraps around the
 * [lru-cache](https://www.npmjs.com/package/lru-cache) library to provide LRU
 * caching capabilities conforming to the `SimpleCache` interface.
 *
 * @template V - The type of value to be stored in the cache.
 * @template K - The type of key used to access values in the cache.
 * @hidden
 */
export function createLruSimpleCache<
  V extends NonNullable<unknown> = NonNullable<unknown>,
  K extends SerializableKey = SerializableKey,
>(options: LRUCache.Options<string, V, unknown>): SimpleCache<V, K> {
  const cache = new LRUCache<string, V, unknown>(options);

  function* entriesGenerator(
    originalGenerator: Generator<[K, V]>,
  ): Generator<[K, V]> {
    for (const [key, value] of originalGenerator) {
      // Modify the entry here before yielding it
      const modifiedEntry = [JSON.parse(key as string), value];
      yield modifiedEntry as [K, V];
    }
  }

  return {
    has(key) {
      return cache.has(stringify(key));
    },

    entries() {
      // Keys need to be returned in the same format as they were given to the cache
      return entriesGenerator(cache.entries() as Generator<[K, V]>);
    },

    get(key) {
      return cache.get(stringify(key));
    },

    set(key, value) {
      cache.set(stringify(key), value);
    },

    delete(key) {
      return cache.delete(stringify(key));
    },

    clear() {
      cache.clear();
    },

    find(predicate) {
      return cache.find((value, key) => predicate(value, JSON.parse(key)));
    },
  };
}
