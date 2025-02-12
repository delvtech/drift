---
"@delvtech/drift-ethers-5": patch
"@delvtech/drift-ethers": patch
"@delvtech/drift-viem": patch
---

Patched the return type of `viemAdapter` and `ethersAdapter` to return `ReadAdapter | ReadWriteAdapter` when `walletClient`/`signer` is possibly undefined instead of just returning a `ReadWriteAdapter` any time a `walletClient`/`signer` prop is present.
