# @delvtech/drift-ethers

[Ethers](https://ethers.org) adapter for [Drift](https://github.com/delvtech/drift).

```ts
import { Drift } from "@delvtech/drift";
import { ethersAdapter } from "@delvtech/drift-ethers";
import { JsonRpcProvider, Wallet } from "ethers";

const provider = new JsonRpcProvider("https://localhost:8545");
const signer = new Wallet(/* ... */); // optional
const drift = new Drift({
  adapter: ethersAdapter({ provider, signer }),
});
```
