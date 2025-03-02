---
"@delvtech/drift": minor
---

Polished up caching APIs:
- Renamed `SimpleCache` to `Store` and `LruSimpleCache` to `LruStore` to better reflect their purposes. Updated associated parameters and imports to match the new naming convention.
- Removed unnecessary type parameters from the `Store` interface.
- Moved key stringifying to the `ClientCache` class and simplified the `LruStore` to extend `LRUCache` directly.
- Added a `getOrSet` utility function to the exports.