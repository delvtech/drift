# @gud/drift-viem

[Viem](https://viem.sh) adapter for [Drift](https://github.com/ryangoree/drift).

```ts
import { createDrift } from "@gud/drift";
import { viemAdapter } from "@gud/drift-viem";
import { createPublicClient, http } from "viem";

const publicClient = createPublicClient(/* ... */);
const walletClient = createWalletClient(/* ... */); // optional
const drift = createDrift({
  adapter: viemAdapter({ publicClient, walletClient }),
});
```
