---
"@delvtech/drift": patch
---

Added `BlockIdentifier` type and added it to `ContractReadOptions` and `GetBalanceParams`. This means the `block` option in `read`, `call`, and `getBalance` methods now support block hashes.
