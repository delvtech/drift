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
  private lru: LRUCache<string, V, unknown>;

  constructor(config: LruSimpleCacheConfig<V>) {
    this.lru = new LRUCache(config);
  }

  *entries() {
    for (const [key, value] of this.lru.entries()) {
      yield [JSON.parse(key), value] as [K, V];
    }
  }

  find(predicate: (value: V, key: K) => boolean) {
    return this.lru.find((value, key) => predicate(value, JSON.parse(key)));
  }

  has(key: K) {
    return this.lru.has(stringify(key));
  }

  get(key: K) {
    return this.lru.get(stringify(key));
  }

  set(key: K, value: V) {
    this.lru.set(stringify(key), value);
  }

  delete(key: K) {
    this.lru.delete(stringify(key));
  }

  clear() {
    this.lru.clear();
  }
}