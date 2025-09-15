# @gud/drift-ethers

[Ethers](https://ethers.org) adapter for [Drift](https://github.com/ryangoree/drift).

```ts
import { createDrift } from "@gud/drift";
import { ethersAdapter } from "@gud/drift-ethers";
import { JsonRpcProvider, Wallet } from "ethers";

const provider = new JsonRpcProvider("https://localhost:8545");
const signer = new Wallet(/* ... */); // optional
const drift = createDrift({
  adapter: ethersAdapter({ provider, signer }),
});
```
