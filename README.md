# Drift

**Effortless Ethereum Development Across Web3 Libraries**

Write Ethereum smart contract interactions once with Drift and run them
anywhere. Seamlessly support multiple web3 libraries like ethers.js, viem, and
more—without getting locked into a single provider or rewriting code.

With built-in caching, type-safe contract APIs, and easy-to-use testing mocks,
Drift lets you build efficient and reliable applications without worrying about
call optimizations or juggling countless hooks. Focus on what matters: creating
great features and user experiences.

## Why Drift?

Building on Ethereum often means dealing with:

- **Hard Dependency on a Specific Web3 Library:** There are several competing
  options, like ethers.js, viem, or web3.js. Tying your business logic to a
  specific one creates vendor lock-in and makes it harder to switch down the
  road.
- **Managing Multiple Hooks:** Each contract call often needs its own hook and
  query key to prevent redundant network requests.
- **Optimizing Network Calls:** Manually caching calls and optimizing queries to
  minimize RPC requests slows down development.
- **Complex Testing:** Setting up mocks for contract interactions can be
  cumbersome and error-prone.

## Drift Solves These Problems

- 🌐 **Multi-Library Support:** Drift provides a unified interface compatible
  with multiple web3 libraries. Write your contract logic once and use it across
  different providers.
- ⚡ **Optimized Performance:** Automatically reduces redundant RPC calls with
  built-in caching. No need to manage hooks or query keys for each call.
- 🔒 **Type Safety:** Drift's type-checked APIs help catch errors at compile
  time.
- 🧪 **Testing Made Easy:** Built-in mocks simplify testing your contract
  interactions. Drift's testing mocks are also type-safe, ensuring your tests
  are always in sync with your contracts.
- 🔄 **Extensibility:** Designed to grow with your project's needs, Drift allows
  you to easily extend support to new web3 libraries by creating small adapter
  packages.

## Installation

Install Drift and the adapter for your preferred web3 library:

```bash
npm install @delvtech/drift
# For ethers.js
npm install @delvtech/drift-ethers
# For viem
npm install @delvtech/drift-viem
```

## Start Drifting

### 1. Initialize Drift with your chosen adapter

```typescript
import { Drift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { createPublicClient, createWalletClient, http } from "viem";

const publicClient = createPublicClient({
  transport: http(),
});

// optionally, create a wallet client
const walletClient = createWalletClient({
  transport: http(),
});

const drift = new Drift(viemAdapter({ publicClient, walletClient }));
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

If Drift was initialized with a wallet client, you can perform write operations:

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
      vault.invalidateRead("balanceOf", { account: "0xReceiverAddress" });
    },
  },
);
```

## Example: Building Vault Clients

Let's build a simple library agnostic SDK with `ReadVault` and `ReadWriteVault`
clients using Drift.

### 1. Define core vault clients

In your core SDK package, define the `ReadVault` and `ReadWriteVault` clients
using Drift's `ReadContract` and `ReadWriteContract` abstractions.

```typescript
// sdk-core/src/VaultClient.ts
import {
  ContractEvent,
  Drift,
  ReadContract,
  ReadWriteAdapter,
  ReadWriteContract,
} from "@delvtech/drift";
import { vaultAbi } from "./abis/VaultAbi";

type VaultAbi = typeof vaultAbi;

export class ReadVault {
  contract: ReadContract<VaultAbi>;

  constructor(address: string, drift: Drift) {
    this.contract = drift.contract({
      abi: vaultAbi,
      address,
    });
  }

  // Read balance with internal caching
  async getBalance(account: string): Promise<bigint> {
    return this.contract.read("balanceOf", { account });
  }

  // Get all deposit events for an account with internal caching
  async getDeposits(
    account?: string,
  ): Promise<ContractEvent<VaultAbi, "Deposit">[]> {
    return this.contract.getEvents("Deposit", {
      filter: {
        depositor: account,
      },
    });
  }
}

export class ReadWriteVault extends ReadVault {
  declare contract: ReadWriteContract<VaultAbi>;

  constructor(address: string, drift: Drift<ReadWriteAdapter>) {
    super(address, drift);
  }

  // Make a deposit
  async deposit(amount: bigint, recipient: string): Promise<string> {
    const txHash = await this.contract.write(
      "deposit",
      { amount, recipient },
      {
        // Optionally wait for the transaction to be mined and invalidate cache
        onMined: () => {
          this.contract.invalidateRead("balanceOf", { recipient });
        },
      },
    );

    return txHash;
  }
}
```

### 2. Use the clients in your application

Using an adapter, you can integrate Drift with your chosen web3 library. Here's
an example using `viem`:

```typescript
import { Drift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { createPublicClient, http } from "viem";
import { ReadVault } from "sdk-core";

const publicClient = createPublicClient({
  transport: http(),
  // ...other options
});

const drift = new Drift(viemAdapter({ publicClient }));

// Instantiate the ReadVault client
const readVault = new ReadVault("0xYourVaultAddress", drift);

// Fetch user balance
const userBalance = await readVault.getBalance("0xUserAddress");

// Get deposit history
const deposits = await readVault.getDeposits("0xUserAddress");
```

#### Benefits of This Architecture

- **Modularity:** Your core logic remains untouched when switching web3
  libraries.
- **Reusability:** Write your business logic once and reuse it across different
  environments.
- **Flexibility:** Easily extend support to new web3 libraries by creating small
  adapter packages.
- **Simplicity:** Your application code stays clean and focused on business
  logic rather than on handling different web3 providers.

### 3. Extend core clients for library-specific clients

To provide library specific client packages, e.g., `sdk-viem`, extend the core
clients and overwrite their constructors to accept `viem` clients.

```typescript
// sdk-viem/src/VaultClient.ts
import {
  ReadVault as CoreReadVault,
  ReadWriteVault as CoreReadWriteVault,
} from "sdk-core";
import { Drift } from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { PublicClient, WalletClient } from "viem";

export class ReadVault extends CoreReadVault {
  constructor(address: string, publicClient: PublicClient) {
    const drift = new Drift(viemAdapter({ publicClient }));
    super(address, drift);
  }
}

export class ReadWriteVault extends CoreReadWriteVault {
  constructor(
    address: string,
    publicClient: PublicClient,
    walletClient: WalletClient,
  ) {
    const drift = new Drift(viemAdapter({ publicClient, walletClient }));
    super(address, drift);
  }
}
```

Then, in your app:

```typescript
import { ReadVault } from "sdk-viem";
import { createPublicClient, http } from "viem";

const publicClient = createPublicClient({
  transport: http(),
  // ...other options
});

// Instantiate the ReadVault client with viem directly
const readVault = new ReadVault("0xYourVaultAddress", publicClient);
```

### 4. Test Your Clients with Drift's Built-in Mocks

Testing smart contract interactions can be complex and time-consuming. Drift
simplifies this process by providing built-in mocks that allow you to stub
responses and focus on testing your application logic.

#### Example: Testing Client Methods with Multiple RPC Calls

Suppose you have a method `getAccountValue` in your `ReadVault` client that
get's the total asset value for an account by fetching their vault balance and
converting it to assets. Under the hood, this method makes multiple RPC
requests.

Here's how you can use Drift's mocks to stub contract calls and test your
method:

```typescript
// sdk-core/src/ReadVault.test.ts
import { MockDrift } from "@delvtech/drift/testing";
import { vaultAbi } from "./abis/VaultAbi";
import { ReadVault } from "./VaultClient";

test("getUserAssetValue should return the total asset value for a user", async () => {
  // Set up mocks
  const mockDrift = new MockDrift();
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

You can also manually invalidate the cache if needed:

```typescript
// Invalidate the cache for a specific read
contract.invalidateRead("balanceOf", { account });

// Invalidate all reads matching partial arguments
contract.invalidateReadsMatching("balanceOf");
```

## Advanced Usage

### Custom Cache Implementation

If you have specific caching needs, you can provide your own cache
implementation:

```typescript
import { LRUCache } from "lru-cache";

const customCache = new LRUCache({ max: 500 });
const drift = new Drift(viemAdapter({ publicClient }), { cache: customCache });
```

### Extending Drift for Your Needs

Drift is designed to be extensible. You can build additional abstractions or
utilities on top of it to suit your project's requirements.

## Contributing

Got ideas or found a bug? Check the [Contributing
Guide](./.github/CONTRIBUTING.md) to get started.

## License

Drift is open-source software licensed under the [Apache 2.0](./LICENSE).
