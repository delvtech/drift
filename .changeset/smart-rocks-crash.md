---
"@delvtech/drift-viem": patch
"@delvtech/drift-ethers": patch
---

Patched `deploy` and `write` methods in the viem & ethers adapters to use the `onMinedTimout` option which was ignored previously.
