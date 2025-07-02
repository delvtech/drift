---
"@delvtech/drift": patch
---

Added an `onMinedTimeout` option to `WriteOptions` to modify the default timeout for the awaited transaction receipt. If the timeout is reached, the receipt with be `undefined`.
