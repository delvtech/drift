# @delvtech/drift-viem

[Viem](https://viem.sh) adapter for [Drift](https://github.com/delvtech/drift).

```ts
import { createDrift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { createPublicClient, http } from "viem";

const publicClient = createPublicClient(/* ... */);
const walletClient = createWalletClient(/* ... */); // optional
const drift = createDrift({
  adapter: viemAdapter({ publicClient, walletClient }),
});
```
