---
"@delvtech/evm-client-ethers": minor
"@delvtech/evm-client-viem": minor
"@delvtech/evm-client": minor
---

Changed the type of all inputs to objects. This means that functions with a single argument (e.g., `balanceOf` will now expect ```{ owner: `0x${string}` }```, not ``` `0x${string}` ```). Outputs remain the "Friendly" type which deconstructs to a single primitive type for single outputs values (e.g., `symbol` will return a `string`, not `{ "0": string }`) since many single output return values are unnamed
