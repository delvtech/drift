import { LRUCache } from "lru-cache";
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
export class LruStore
  extends LRUCache<string, any, unknown>
  implements CacheStore
{
  constructor(options: LruStoreConfig = { max: 500 }) {
    super(options);
  }
}
