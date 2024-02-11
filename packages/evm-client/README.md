# @delvtech/evm-client

Useful EVM client abstractions for TypeScript projects that want to remain web3
library agnostic.

```ts
import {
  CachedReadWriteContract,
  ContractReadOptions,
} from '@delvtech/evm-client';
import erc20Abi from './abis/erc20Abi.json';

type CachedErc20Contract = CachedReadWriteContract<typeof erc20Abi>;

async function approve(
  contract: CachedErc20Contract,
  spender: `0x${string}`,
  amount: bigint
) {
  const hash = await contract.write('approve', { spender, amount });

  this.contract.deleteRead('allowance', {
    owner: await contract.getSignerAddress(),
    spender,
  });

  return hash;
}
```

This project contains types that can be used in TypeScript projects that need to
interact with contracts in a type-safe way based on ABIs. It allows your project
to focus on core contract logic and remain flexible in it's implementation. To
aid in implementation, this project provides:

- Utility types
- Utility functions for transforming arguments
- Factories for wrapping contract instances with caching logic
- Stubs to facilitate testing

## Primary Abstractions

### Contracts

The contract abstraction let you write type-safe contract interactions that can
be implemented in multiple web3 libraries and even multiple persistence layers.
The API is meant to be easy to both read and write.

#### Types

- **[`ReadContract`](./src/contract/types/Contract.ts):** A basic contract that
  can be used to fetch data, but can't submit transactions.
- **[`ReadWriteContract`](./src/contract/types/Contract.ts):** An extended
  `ReadContract` that has a signer attached to it and can be used to submit
  transactions.
- **[`CachedReadContract`](./src/contract/types/CachedContract.ts):** An
  extended `ReadContract` that will cache reads and even queries based on
  arguments with a few additional methods for interacting with the cache.
- **[`CachedReadWriteContract`](./src/contract/types/CachedContract.ts):** An
  extended `CachedReadContract` that has a signer attached to it and can be used
  to submit transactions.

#### Utils

- **[`arrayToFriendly`](./src/contract/utils/arrayToFriendly.ts):** A function
  to transform contract input and output arrays into "Friendly" types. The
  friendly type of an input/output array depends on the number of input/output
  parameters:

  - Multiple parameters: An object with the argument names as keys (or their
    index if no name is found in the ABI) and the primitive type of the
    parameters as values.
  - Single parameters: The primitive type of the single parameter.
  - No parameters: `undefined`

- **[`friendlyToArray`](./src/contract/utils/friendlyToArray.ts):** The opposite
  of `arrayToFriendly`. A function that takes a "Friendly" type and converts it
  into an array, ensuring parameters are properly ordered and the correct number
  of parameters are present.

#### Factories

- **[`createCachedReadContract`](./src/contract/factories/createCachedReadContract.ts):**
  A factory that turns a `ReadContract` into a `CachedReadContract`.
- **[`createCachedReadWriteContract`](./src/contract/factories/createCachedReadWriteContract.ts):**
  A factory that turns a `ReadWriteContract` into a `CachedReadWriteContract`.

#### Stubs

- **[`ReadContractStub`](./src/contract/stubs/ReadContractStub.ts):** A stub of
  a `ReadContract` for use in tests.
- **[`ReadWriteContractStub`](./src/contract/stubs/ReadWriteContractStub.ts):**
  A stub of a `ReadWriteContract` for use in tests.

### Network

The `Network` abstraction provides a small interface for fetching vital network
information like blocks and transactions.

#### Types

- **[`Network`](./src/network/types/Network.ts)**

#### Stubs

- **[`NetworkStub`](./src/network/stubs/NetworkStub.ts):** A stub of a
  `Network` for use in tests.

### SimpleCache

A simple cache abstraction providing a minimal interface for facilitating contract
caching.

#### Types

- **[`SimpleCache`](./src/cache/types/SimpleCache.ts)**

#### Utils

- **[`createSimpleCacheKey`](./src/cache/utils/createSimpleCacheKey.ts):**
  Creates a consistent serializable cache key from basic types.

#### Factories

- **[`createLruSimpleCache`](./src/cache/factories/createLruSimpleCache.ts):**
  Creates a `SimpleCache` instance using an LRU cache.
