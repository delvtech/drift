---
"@delvtech/drift": patch
---

Modified `DriftError` to use the constructor's name so subclasses don't need to explicitly pass a custom name if it's the same as the constructor.
