---
"@delvtech/drift": patch
---

Added automatic call batching via `Multicall3`. This can be controlled with new `batch` and `maxBatchSize` options when creating new clients, e.g., `createDrift({ batch: false })`, or `createBatch({ maxBatchSize: 10 })`.
