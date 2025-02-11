# @delvtech/drift-web3

[Web3.js](https://web3js.org) adapter for [Drift](https://github.com/delvtech/drift).

```ts
import { createDrift } from "@delvtech/drift";
import { Web3Adapter } from "@delvtech/drift-web3";
import Web3 from "web3";

const web3 = new Web3(/* ... */);
const drift = createDrift({
  adapter: new Web3Adapter(web3),
});
```
