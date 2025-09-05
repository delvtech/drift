---
"@delvtech/drift": patch
---

Patched a bug in `decodeFunctionData` which caused it to throw and error when the data string contained only a function selector with no args data.
