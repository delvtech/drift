# @delvtech/evm-client-viem

Viem implementations of [@delvtech/evm-client](https://github.com/delvtech/evm-client/tree/main/packages/evm-client).

```ts
import { createCachedReadContract } from '@delvtech/evm-client-viem';
import { PublicClient } from 'viem';
import erc20Abi from './abis/erc20Abi.json';

type CachedErc20Contract = CachedReadWriteContract<typeof erc20Abi>;

export function createTokenContract(
  address: `0x${string}`,
  publicClient: PublicClient,
): CachedErc20Contract {
  return createCachedReadContract({
    abi: erc20Abi,
    address,
    publicClient,
  });
}
```
