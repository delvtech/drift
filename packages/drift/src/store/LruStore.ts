import { LRUCache } from "lru-cache";
import stringify from "safe-stable-stringify";
import type { CacheStore } from "src/store/types";

export type LruStoreConfig<
  V extends NonNullable<unknown> = NonNullable<unknown>,
> = LRUCache.Options<string, V, unknown>;

/**
 * An LRU (Least Recently Used) implementation of {@linkcode CacheStore}.
 *
 * @param options - The options to pass to the underlying [LRU
 * cache](https://www.npmjs.com/package/lru-cache). Default: `{ max: 500 }`.
 *
 * @see [NPM - lru-cache](https://www.npmjs.com/package/lru-cache).
 */
export class LruStore implements CacheStore {
  private _lru: LRUCache<string, any, unknown>;

  constructor(config: LruStoreConfig<any> = { max: 500 }) {
    this._lru = new LRUCache(config);
  }

  *entries() {
    for (const [key, value] of this._lru.entries()) {
      yield [JSON.parse(key), value] as [string, any];
    }
  }

  find(predicate: (value: any, key: string) => boolean) {
    return this._lru.find((value, key) => predicate(value, JSON.parse(key)));
  }

  has(key: string) {
    return this._lru.has(stringify(key));
  }

  get(key: string) {
    return this._lru.get(stringify(key));
  }

  set(key: string, value: any) {
    this._lru.set(stringify(key), value);
  }

  delete(key: string) {
    this._lru.delete(stringify(key));
  }

  clear() {
    this._lru.clear();
  }
}
