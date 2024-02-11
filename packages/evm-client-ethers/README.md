# @delvtech/evm-client-ethers

Ethers bindings for [@delvtech/evm-client](https://github.com/delvtech/evm-client/tree/main/packages/evm-client)

```ts
import { createCachedReadContract } from '@delvtech/evm-client-ethers';
import { Provider } from 'ethers';
import erc20Abi from './abis/erc20Abi.json';

type CachedErc20Contract = CachedReadWriteContract<typeof erc20Abi>;

export function createTokenContract(
  address: `0x${string}`,
  provider: Provider,
): CachedErc20Contract {
  return createCachedReadContract({
    abi: erc20Abi,
    address,
    provider,
  });
}
```
