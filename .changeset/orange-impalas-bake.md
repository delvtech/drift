---
"@delvtech/drift": patch
---

Cleaned up cache APIs and added more methods:
   - On the `ClientCache` (i.e. `drift.cache`):
      - `clearBlocks()`
      - `clearBalances()`
      - `clearTransactions()`
      - `clearReads()`
   - On the `ContractCache` (i.e. `contract.cache`):
      - `clearReads()`
