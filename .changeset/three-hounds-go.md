---
"@delvtech/drift": patch
---

Fixed a bug in the `StubStore` where the `create` function wasn't being called unless no key was provided or `matchPartial` was `true`.
