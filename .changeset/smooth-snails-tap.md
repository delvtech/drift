---
"@delvtech/drift": patch
---

Added `Client` extension methods to inferred hook names. This means autocompletion for `Client.hooks` will be available for methods added via `extend(...)`, including the `contract(...)` method added by the main `Drift` client.
