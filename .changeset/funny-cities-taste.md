---
"@delvtech/drift": patch
---

Added `NoInfer` to the return type of `multicall` to avoid widening the inferred args type when the return value is destructured.
