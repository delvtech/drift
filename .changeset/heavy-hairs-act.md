---
"@delvtech/drift-ethers": patch
"@delvtech/drift-ethers-v5": patch
---

Refactored `read` and `simulateWrite` methods to use `call` to ensure consistent return types via unified decoding logic in `AbiEncoder`.
