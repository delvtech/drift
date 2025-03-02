---
"@delvtech/drift": minor
---

Polished up caching APIs:
- Renames `SimpleCache` to `Store` to better reflect its purpose.
- Renamed `LruSimpleCache` to `LruStore` and `cache` params to `store` to match the new naming convention.
- Removed unnecessary type parameters from the `Store` interface.
- Moved key stringifying to the `ClientCache` class so stores only have to operate on strings.
- Simplified the `LruStore` to simply extend `LRUCache` since it no longer needs to stringify and parse keys.
- Added `getOrSet` util function to the exports.
