---
"@delvtech/drift-web3": patch
---

Refactored `read` and `simulateWrite` methods to use `call` to ensure consistent return types via unified decoding logic in `AbiEncoder`.
