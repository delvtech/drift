---
"@delvtech/drift": patch
---

Added a `BlockIdentifier` type param to the `Block` type which makes the `hash`, `logsBloom`, `nonce`, and `number` properties required unless specified as `"pending"`.
