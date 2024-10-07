# @delvtech/drift-viem

Viem adapter for [@delvtech/drift](https://github.com/delvtech/evm-client/).

```ts
import { Drift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { createPublicClient, http } from "viem";

const publicClient = createPublicClient({
  transport: http(),
  // ...other options
});

// optionally, create a wallet client
const walletClient = createWalletClient({
  transport: http(),
  // ...other options
});

const drift = new Drift(viemAdapter({ publicClient, walletClient }));
```
