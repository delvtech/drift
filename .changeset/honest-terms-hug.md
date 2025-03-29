---
"@delvtech/drift": patch
---

Added first-class getter methods to `ClientCache` and `ContractCache` which return values from the `store` using their corresponding `*Key` methods. For example: `contract.cache.getRead('name')` gets the value associated with `contract.cache.readKey('name')` from `contract.cache.store`.
