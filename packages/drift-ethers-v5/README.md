# @gud/drift-ethers-v5

[Ethers v5](https://docs.ethers.org/v5) adapter for [Drift](https://github.com/ryangoree/drift).

```ts
import { createDrift } from "@gud/drift";
import { ethersAdapter } from "@gud/drift-ethers-v5";
import { providers, Wallet } from "ethers";

const provider = new providers.JsonRpcProvider("https://localhost:8545");
const signer = new Wallet(/* ... */); // optional
const drift = createDrift({
  adapter: ethersAdapter({ provider, signer }),
});
```
