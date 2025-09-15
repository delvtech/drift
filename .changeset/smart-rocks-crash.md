---
"@gud/drift-viem": patch
"@gud/drift-ethers": patch
"@gud/drift-ethers-v5": patch
"@gud/drift-web3": patch
---

Patched `deploy` and `write` methods in the viem & ethers adapters to use the `onMinedTimout` option which was ignored previously.
