---
"@delvtech/drift": minor
---

Removed cache operation methods from the `Contract` class, e.g., `preloadRead`. The methods have been moved to a new `ContractCache` class which is accessible on the contract via the `cache` property. This streamlines the API and mirrors the design of the underlying `Client` and `ClientCache`.
