import stringify from 'fast-json-stable-stringify';
import { LRUCache } from 'lru-cache';
import { SimpleCache, SimpleCacheKey } from 'src/cache/types/SimpleCache';

/**
 * An LRU (Least Recently Used) implementation of the `SimpleCache` interface.
 * This class wraps around the
 * [lru-cache](https://www.npmjs.com/package/lru-cache) library to provide LRU
 * caching capabilities conforming to the `SimpleCache` interface.
 *
 * @template TValue - The type of value to be stored in the cache.
 * @template TKey - The type of key used to access values in the cache.
 * @hidden
 */
export function createLruSimpleCache<
  TValue extends NonNullable<unknown> = NonNullable<unknown>,
  TKey extends SimpleCacheKey = SimpleCacheKey,
>(options: LRUCache.Options<string, TValue, void>): SimpleCache<TValue, TKey> {
  const cache = new LRUCache(options);

  function* entriesGenerator(
    originalGenerator: Generator<[TKey, TValue]>,
  ): Generator<[TKey, TValue]> {
    for (const [key, value] of originalGenerator) {
      // Modify the entry here before yielding it
      const modifiedEntry = [JSON.parse(key as string), value];
      yield modifiedEntry as [TKey, TValue];
    }
  }

  return {
    get entries() {
      // Keys need to be returned in the same format as they were given to the cache
      return entriesGenerator(cache.entries() as Generator<[TKey, TValue]>);
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
