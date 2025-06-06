---
"@delvtech/drift": patch
---

Added a `multicall` method for explicitly batching calls via [Multicall3](https://www.multicall3.com/). Before sending the request, the cache is checked for each individual call to reduce the size of the request when possible. Each fetched result is then cached and the cached and fetched results are merged and returned in the same order they were requested.
