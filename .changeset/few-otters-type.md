---
"@delvtech/drift": patch
---

Added a `BaseClient` class which contains most of the functionality that used to live in the `Drift` class and centralized logic for cache operations and namespace resolution, using the chain id as a default. This also removes a circular dependency between `Drift` and `Contract`.
