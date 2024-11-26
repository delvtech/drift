import { LRUCache } from "lru-cache";
import stringify from "safe-stable-stringify";
import type { SimpleCache } from "src/cache/types";
import type { SerializableKey } from "src/utils/createSerializableKey";

export type LruSimpleCacheConfig<
  V extends NonNullable<unknown> = NonNullable<unknown>,
> = LRUCache.Options<string, V, unknown>;

/**
 * An LRU (Least Recently Used) implementation of {@linkcode SimpleCache} which
 * handles serialization and deserialization of keys.
 *
 * @template K - The type of key used to access values in the cache.
 * @template V - The type of value to be stored in the cache.
 * @param options - The options to pass to the underlying LRU cache.
 * @see [lru-cache](https://www.npmjs.com/package/lru-cache)
 */
export class LruSimpleCache<
  K extends SerializableKey = SerializableKey,
  V extends NonNullable<unknown> = NonNullable<unknown>,
> implements SimpleCache<K, V>
{
  private cache: LRUCache<string, V, unknown>;

  constructor(config: LruSimpleCacheConfig<V>) {
    this.cache = new LRUCache(config);
  }

  private *entriesGenerator(
    originalGenerator: Generator<[K, V]>,
  ): Generator<[K, V]> {
    for (const [key, value] of originalGenerator) {
      // Modify the entry here before yielding it
      const modifiedEntry = [JSON.parse(key as string), value];
      yield modifiedEntry as [K, V];
    }
  }

  entries(): Iterable<[K, V]> {
    // Keys need to be returned in the same format as they were given to the cache
    return this.entriesGenerator(this.cache.entries() as Generator<[K, V]>);
  }

  find(predicate: (value: V, key: K) => boolean): V | undefined {
    return this.cache.find((value, key) => predicate(value, JSON.parse(key)));
  }

  has(key: K): boolean {
    return this.cache.has(stringify(key));
  }

  get(key: K): V | undefined {
    return this.cache.get(stringify(key));
  }

  set(key: K, value: V): void {
    this.cache.set(stringify(key), value);
  }

  delete(key: K): void {
    this.cache.delete(stringify(key));
  }

  clear() {
    this.cache.clear();
  }
}
