# Drift

**Effortless Ethereum Development Across Web3 Libraries**

Write cached Ethereum smart contract interactions once with Drift and run them
anywhere. Seamlessly support multiple web3 libraries like
[viem](https://viem.sh), [web3.js](https://web3js.org), and
[ethers](https://ethers.org)—without getting locked into a single provider or
rewriting code.

With built-in caching, type-safe contract APIs, and easy-to-use testing mocks,
Drift lets you build efficient and reliable applications without worrying about
call optimizations or juggling countless hooks. Focus on what matters: creating
great features and user experiences.

## Why Drift? <!-- omit from toc -->

Building on Ethereum often means dealing with:

- **Optimizing Network Calls:** Manually caching calls and optimizing queries to
  minimize RPC requests slows down development.
- **Managing Multiple Hooks:** Each contract call often needs its own hook and
  query key to prevent redundant network requests.
- **Complex Testing:** Setting up mocks for contract interactions can be
  cumbersome and error-prone.
- **Hard Dependency on a Specific Web3 Library:** There are several competing
  options, like viem, web3.js, ethers.js. Tying your business logic to a
  specific one creates vendor lock-in and makes it harder to switch down the
  road.

## Drift Solves These Problems <!-- omit from toc -->

- ⚡ **Optimized Performance:** Automatically reduces redundant RPC calls with
  built-in caching. No need to manage hooks or query keys for each call.
- 🔒 **Type Safety:** Drift's type-checked APIs help catch errors at compile
  time.
- 🧪 **Testing Made Easy:** Built-in mocks simplify testing your contract
  interactions. Drift's testing mocks are also type-safe, ensuring your tests
  are always in sync with your contracts.
- 🌐 **Multi-Library Support:** Drift provides a unified interface compatible
  with multiple web3 libraries. Write your contract logic once and use it across
  different providers.
- 🔄 **Extensibility:** Designed to grow with your project's needs, Drift allows
  you to easily extend support to new web3 libraries by creating small adapter
  packages.

## Table of Contents <!-- omit from toc -->

- [Installation](#installation)
- [Start Drifting](#start-drifting)
  - [1. Create a Drift client](#1-create-a-drift-client)
  - [2. Interact with your Contracts](#2-interact-with-your-contracts)
    - [Read Operations with Caching](#read-operations-with-caching)
    - [Write Operations](#write-operations)
    - [Contract Instances](#contract-instances)
- [Example: Building Vault Clients](#example-building-vault-clients)
  - [1. Define vault clients](#1-define-vault-clients)
  - [2. Use the clients in your application](#2-use-the-clients-in-your-application)
    - [Benefits of This Architecture](#benefits-of-this-architecture)
  - [3. Test Your Clients with Drift's Built-in Mocks](#3-test-your-clients-with-drifts-built-in-mocks)
    - [Example: Testing Client Methods with Multiple RPC Calls](#example-testing-client-methods-with-multiple-rpc-calls)
    - [Benefits](#benefits)
- [Simplifying React Hook Management](#simplifying-react-hook-management)
  - [The Problem Without Drift](#the-problem-without-drift)
  - [How Drift Helps](#how-drift-helps)
    - [Example Using React Query](#example-using-react-query)
- [Caching in Action](#caching-in-action)
  - [Cache Invalidation](#cache-invalidation)
  - [Preloading Cache Data](#preloading-cache-data)
  - [Direct Access to Cached Data](#direct-access-to-cached-data)
- [Extending Drift for Your Needs](#extending-drift-for-your-needs)
  - [Extension Points](#extension-points)
    - [Adapters](#adapters)
    - [Stores](#stores)
  - [Hooks](#hooks)
- [Contributing](#contributing)
- [License](#license)

## Installation

Install Drift:

```sh
npm install @delvtech/drift
```

**Optional:** To use Drift with a specific web3 library, install the corresponding
adapter:

```sh
# Install one (optional)
npm install @delvtech/drift-viem
npm install @delvtech/drift-web3
npm install @delvtech/drift-ethers
npm install @delvtech/drift-ethers-v5
```

> [!TIP]
>
> Drift can be used without an adapter, however adapters reuse clients from
> their corresponding web3 library, which can improve performance depending on
> their configuration. For example, the `publicClient` from Viem can
> automatically batch requests via MultiCall.

## Start Drifting

### 1. Create a Drift client

```typescript
import { createDrift } from "@delvtech/drift";

const drift = createDrift({
  rpcUrl: "[YOUR_RPC_URL]",
});
```

**Viem adapter example:**

```typescript
import { createDrift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { createPublicClient, createWalletClient, http } from "viem";

const publicClient = createPublicClient({
  transport: http(),
});

// optionally create a wallet client
const walletClient = createWalletClient({
  transport: http(),
});

const drift = createDrift({
  adapter: viemAdapter({ publicClient, walletClient }),
});
```

### 2. Interact with your Contracts

#### Read Operations with Caching

```typescript
import { VaultAbi } from "./abis/VaultAbi";

// No need to wrap in separate hooks; Drift handles caching internally
const balance = await drift.read({
  abi: VaultAbi,
  address: "0xYourVaultAddress",
  fn: "balanceOf",
  args: {
    account: "0xUserAddress",
  },
});
```

#### Write Operations

If Drift was initialized with a signer, you can perform write operations:

```typescript
const txHash = await drift.write({
  abi: VaultAbi,
  address: "0xYourVaultAddress",
  fn: "deposit",
  args: {
    amount: BigInt(100e18),
    receiver: "0xReceiverAddress",
  },

  // Optionally wait for the transaction to be mined and invalidate cache
  onMined: () => {
    drift.cache.invalidateRead({
      abi: VaultAbi,
      address: "0xYourVaultAddress",
      fn: "balanceOf",
      args: {
        account: "0xReceiverAddress",
      },
    });
  },
});
```

#### Contract Instances

Create contract instances to write your options once and get a streamlined,
type-safe API to re-use across your application.

```typescript
const vault = drift.contract({
  abi: VaultAbi,
  address: "0xYourVaultAddress",
  // ...other options
});

const balance = await vault.read("balanceOf", { account });

const txHash = await vault.write(
  "deposit",
  {
    amount: BigInt(100e18),
    receiver: "0xReceiverAddress",
  },
  {
    onMined: () => {
      vault.cache.invalidateRead("balanceOf", { account: "0xReceiverAddress" });
    },
  },
);
```

## Example: Building Vault Clients

Let's build a simple library agnostic SDK with `ReadVault` and `ReadWriteVault`
clients using Drift.

### 1. Define vault clients

In your core SDK package, define the `ReadVault` and `ReadWriteVault` clients
using Drift's `ReadContract` and `ReadWriteContract` abstractions.

```typescript
// sdk-core/src/VaultClient.ts
import {
  type Address,
  type Drift,
  type EventLog,
  type Hash,
  type ReadContract,
  type ReadWriteAdapter,
  type ReadWriteContract,
  createDrift,
} from "@delvtech/drift";
import { erc4626Abi } from "./abis/Erc4626";

type VaultAbi = typeof erc4626Abi;

/** A Read-Only Vault client */
export class ReadVault {
  contract: ReadContract<VaultAbi>;
  
  constructor(address: Address, drift: Drift = createDrift()) {
    this.contract = drift.contract({
      abi: erc4626Abi,
      address,
    });
  }

  // Make read calls with internal caching
  getBalance(account: Address): Promise<bigint> {
    return this.contract.read("balanceOf", { account });
  }
  getDecimals(): Promise<number> {
    return this.contract.read("decimals");
  }

  // Fetch events with internal caching
  getDeposits(account?: Address): Promise<EventLog<VaultAbi, "Deposit">[]> {
    return this.contract.getEvents("Deposit", {
      filter: {
        sender: account,
      },
    });
  }
}

export class ReadWriteVault extends ReadVault {
  declare contract: ReadWriteContract<VaultAbi>;

  constructor(
    address: Address,
    drift: Drift<ReadWriteAdapter> = createDrift(),
  ) {
    super(address, drift);
  }

  // Make a deposit
  deposit(amount: bigint, account: Address): Promise<Hash> {
    return this.contract.write(
      "deposit",
      {
        assets: amount,
        receiver: account,
      },
      {
        // Optionally wait for the transaction to be mined and invalidate cache
        onMined: (receipt) => {
          if (receipt?.status === "success") {
            this.contract.cache.invalidateRead("balanceOf", { account });
          }
        },
      },
    );
  }
}
```

### 2. Use the clients in your application

Using an adapter, you can integrate Drift with your chosen web3 library. Here's
an example using `viem`:

```typescript
import { createDrift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { createPublicClient, http } from "viem";
import { ReadVault } from "sdk-core";

const publicClient = createPublicClient({
  transport: http(),
  // ...other options
});

const drift = createDrift({
  adapter: viemAdapter({ publicClient }),
});

// Instantiate the ReadVault client
const readVault = new ReadVault("0xYourVaultAddress", drift);

// Fetch user balance
const userBalance = await readVault.getBalance("0xUserAddress");

// Get deposit history
const deposits = await readVault.getDeposits("0xUserAddress");
```

#### Benefits of This Architecture

- **Reusability:** Write your business logic once and reuse it across different
  environments. Easily extend support to new web3 libraries by creating small
  adapter packages.
- **Simplicity:** Your application code stays clean and focused on business
  logic rather than on optimizing network calls or managing cache keys.

### 3. Test Your Clients with Drift's Built-in Mocks

Testing smart contract interactions can be complex and time-consuming. Drift
simplifies this process by providing built-in mocks that allow you to stub
responses and focus on testing your application logic.

> [!IMPORTANT]
>
> Drift's testing mocks have a peer dependency on [Sinon.JS](https://sinonjs.org). Make sure to install
> it before using the mocks.
>
> ```sh
> npm install --save-dev sinon
> ```

#### Example: Testing Client Methods with Multiple RPC Calls

Suppose you have a method, `getAccountValue`, in your `ReadVault` client that
gets the total asset value for an account by fetching their vault balance and
converting it to assets. Under the hood, this method makes multiple RPC
requests.

Here's how you can use Drift's mocks to stub contract calls and test your
method:

```typescript
// sdk-core/src/ReadVault.test.ts
import { createMockDrift } from "@delvtech/drift/testing";
import { vaultAbi } from "./abis/VaultAbi";
import { ReadVault } from "./VaultClient";

test("getUserAssetValue should return the total asset value for a user", async () => {
  // Set up mocks
  const mockDrift = createMockDrift();
  const mockContract = mockDrift.contract({
    abi: vaultAbi,
    address: "0xVaultAddress",
  });

  // Stub the vault's return values
  mockContract.onRead("balanceOf", { account: "0xUserAddress" }).resolves(
    BigInt(100e18), // User has 100 vault shares
  );
  mockContract.onRead("convertToAssets", { shares: BigInt(100e18) }).resolves(
    BigInt(150e18), // 100 vault shares are worth 150 in assets
  );

  // Instantiate your client with the mocked Drift instance
  const readVault = new ReadVault("0xVaultAddress", mockDrift);

  // Call the method you want to test
  const accountAssetValue = await readVault.getAccountValue("0xUserAddress");

  // Assert the expected result
  expect(accountAssetValue).toEqual(BigInt(150e18));
});
```

#### Benefits

- **No Network Calls:** Tests run faster and more reliably without actual
  network interactions.
- **Focus on Logic:** Concentrate on testing your application's business logic.
- **Easy Setup:** Minimal configuration required to get started with testing.

## Simplifying React Hook Management

### The Problem Without Drift

In traditional setups, you might rely on data-fetching libraries like React
Query. However, to prevent redundant network requests, each contract call would
need:

- Its own hook (e.g., `useBalanceOf`, `useTokenSymbol`).
- Unique query keys for caching.

Composing multiple calls becomes cumbersome, as you have to manage each hook's
result separately.

### How Drift Helps

Drift's internal caching means you don't need to wrap every contract call in a
separate hook. You can perform multiple contract interactions within a single
function or hook without worrying about redundant requests.

#### Example Using React Query

```typescript
import { useQuery } from "@tanstack/react-query";
import { ReadVault } from "sdk-core";

function useVaultData(readVault: ReadVault, userAddress: string) {
  return useQuery(["vaultData", userAddress], async () => {
    // Perform multiple reads without separate hooks or query keys
    const [balance, symbol, deposits] = await Promise.all([
      readVault.getBalance(userAddress),
      readVault.contract.read("symbol"),
      readVault.getDeposits(userAddress),
    ]);

    return { balance, symbol, deposits };
  });
}
```

No need to manage multiple hooks or query keys — Drift handles caching
internally, simplifying your code and development process.

## Caching in Action

Drift's caching mechanism ensures that repeated calls with the same parameters
don't result in unnecessary network requests, even when composed within the same
function.

```typescript
// Both calls use the cache; only one network request is made
const balance1 = await contract.read("balanceOf", { account });
const balance2 = await contract.read("balanceOf", { account });
```

### Cache Invalidation

Delete cached data to ensure it's re-fetched using `invalidate*` methods.

```typescript
// Invalidate the cache for a specific read
contract.cache.invalidateRead("balanceOf", { account });

// Invalidate all reads matching partial arguments
contract.cache.invalidateReadsMatching("balanceOf");

// Let it all go...
contract.cache.clear();
```

### Preloading Cache Data

Add static data such as immutables from token lists using `preload*` methods to
avoid network requests without changing how the data is accessed.

```ts
const drift = createDrift(/* ... */);
const contract = drift.contract({
  abi: erc20Abi,
  // ...
});

// Preloading read data
contract.cache.preloadRead({ fn: "symbol", value: "DAI" });

// Preloading event data
contract.cache.preloadEvents({
  event: "Transfer",
  value: [],
  // ...
});
```

### Direct Access to Cached Data

Drift clients will automatically check the cache before fetching new data, but
direct access to the cached data is available via `get*` methods.

```typescript
// Get a cached read return
const cachedBalance = await contract.cache.getRead("balanceOf", { account });

// Get a cached transaction receipt
const cachedReceipt = await drift.cache.getTransactionReceipt({ hash })
```

The `invalidate*`, `preload*`, and `get*` methods are available on both the
`Drift.cache` and `Contract.cache` instances.

> [!IMPORTANT]
>
> Manipulating cache data affects all clients that share the same cache. Since
> Drift passes its own cache to the contracts it creates via `Drift.contract()`,
> they'll already be preloaded with the `Drift` instance's cache and any cache
> operations performed on the contract cache will also affect the `Drift` cache.

## Extending Drift for Your Needs

Drift is designed to be extensible. You can build additional abstractions or
utilities on top of it to suit your project's requirements.

### Extension Points

#### Adapters

Extend support to new web3 libraries or custom providers by implementing the
[`Adapter`](./packages/drift/src/adapter/types/Adapter.ts#L19) interface. See
the [`DefaultAdapter`](./packages/drift/src/adapter/DefaultAdapter.ts#L53) for
an example.

#### Stores

Implement a custom [`Store`](./packages/drift/src/store/types.ts#L7) to manage
caching in a way that suits your application. The default store is an in-memory
LRU cache, but you can create a custom store that uses TTL, localStorage,
IndexedDB,
[QueryCache](https://tanstack.com/query/latest/docs/reference/QueryCache), or
any other storage mechanism, sync or async.

```typescript
import { createDrift } from "@delvtech/drift";

const customStore = new Map<string, unknown>();
const drift = createDrift({
  store: customStore,
});
```

### Hooks

Add custom logic by intercepting and modifying client methods with `hooks`. Each
method has a `before:<method>` and `after:<method>` hook that allows you to
inspect and modify the arguments and results.

```typescript
// Simulate writes before sending the transaction
drift.hooks.on("before:write", async ({ args: [params] }) => {
  await drift.simulateWrite(params);
});

drift.hooks.on("before:getEvents", async ({ args: [params], resolve }) => {
  const cachedValue = await drift.cache.getRead(params);
  resolve(readMiddleware({ drift, params, cachedValue }));
});


drift.hooks.on("after:read", ({ args: [params], result, setResult }) => {
  setResult(transformResultMiddleware({ drift, params, result }));
});
```

## Contributing

Got ideas or found a bug? Check the [Contributing
Guide](./.github/CONTRIBUTING.md) to get started.

## License

Drift is open-source software licensed under the [Apache 2.0](./LICENSE).
