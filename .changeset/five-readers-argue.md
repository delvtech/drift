---
"@delvtech/drift": patch
---

Replaced the `createClientCache` function with a `ClientCache` class which requires a namespace or namespace resolver. All methods are async to allow for dynamic namespace resolution and external cache implementations.
