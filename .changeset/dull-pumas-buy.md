---
"@delvtech/drift": patch
---

Improved type inference for contracts created via `Drift.contract(...)`. A contract created in contexts where `Drift.isReadWrite()` returns `true` will now be properly inferred as a `ReadWriteContract`.
