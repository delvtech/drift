# @delvtech/drift-ethers-v5

[Ethers v5](https://docs.ethers.org/v5) adapter for [Drift](https://github.com/delvtech/drift).

```ts
import { createDrift } from "@delvtech/drift";
import { ethersAdapter } from "@delvtech/drift-ethers-v5";
import { providers, Wallet } from "ethers";

const provider = new providers.JsonRpcProvider("https://localhost:8545");
const signer = new Wallet(/* ... */); // optional
const drift = createDrift({
  adapter: ethersAdapter({ provider, signer }),
});
```
