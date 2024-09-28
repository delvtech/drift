# Drift

**Write once, run anywhere:** Simplify Ethereum contract interactions with
built-in caching, type-safe APIs, and support for multiple web3 libraries —
without the headache of managing multiple hooks or redundant network requests.

Drift is a TypeScript library that lets you write a single implementation for
interacting with Ethereum smart contracts, while seamlessly supporting multiple
web3 libraries like `ethers.js`, `viem`, and more. With built-in caching,
type-safe contract APIs, and easy test mocks, Drift helps you build efficient
and reliable applications without overthinking call optimizations or juggling
countless hooks.

## Why Drift?

Building on Ethereum often means:

- **Juggling Different Web3 Libraries:** Choosing between `ethers.js`, `viem`,
  or others can feel like vendor lock-in, and rewrites are time-consuming.
- **Managing Multiple Hooks:** Each contract call often needs its own hook and
  query key to prevent redundant network requests.
- **Optimizing Network Calls:** Manually caching calls and optimizing queries to
  minimize RPC requests slows down development.
- **Complex Testing:** Setting up mocks for contract interactions can be
  cumbersome and error-prone.

Drift abstracts away these complexities:

- **Unified Interface:** Write your contract logic once and use it across
  different web3 providers.
- **Built-in Caching:** Automatically reduce redundant RPC calls — no need to
  manage hooks for each call.
- **Type-Safe APIs:** Benefit from TypeScript with type-checked contract
  interactions.
- **Easy Testing:** Built-in mocks simplify testing your contract interactions.

## Features

- 🌐 **Multi-Library Support:** Compatible with `ethers.js`, `viem`, and soon
  `web3.js`.
- ⚡ **Optimized Performance:** Built-in caching for fewer network calls
  without manual management.
- 🔒 **Type Safety:** Catch errors at compile time with type-checked APIs.
- 🧪 **Testing Made Easy:** Use built-in mocks for reliable and straightforward
  testing.
- 🔄 **Extensible:** Designed to grow with your project's needs.

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

Drift optimizes your contract interactions behind the scenes, so you don't have
to sacrifice code readability for performance or manage hooks and query keys
manually.

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
import { vaultAbi } from "../abis/VaultAbi";

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
        recipient: account,
      },
    });
  }
}

export class ReadWriteVault extends ReadVault {
  declare contract: ReadWriteContract<VaultAbi>;

  constructor(address: string, drift: Drift<ReadWriteAdapter>) {
    super(wallet, drift);
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

### 4. Test Your Clients with Drift's Built-in Mocks

Testing smart contract interactions can be complex and time-consuming. Drift
simplifies this process by providing built-in mocks that allow you to stub
responses and focus on testing your application logic.

#### Example: Testing Contract Interactions with Mocks

Suppose you have a method `getShortAccruedYield` in your `ReadVault` client that
calculates the accrued yield for a mature position. You want to test this method
without making actual RPC calls.

Here's how you can use Drift's mocks to stub contract calls and test your
method:

```typescript
// test/ReadVault.test.ts
import { MockDrift } from "@delvtech/drift/testing";
import { parseBigInt } from "parse-bigint";
import { ReadVault } from "sdk-core";
import { vaultAbi } from "../abis/VaultAbi";

test("getShortAccruedYield should return the amount of yield a mature position has earned", async () => {
  // Set up mocks
  const mockDrift = new MockDrift();
  const mockContract = drift.contract({
    abi: vaultAbi,
    address: "0xVaultAddress",
  });

  // Stub the getBlock method
  mockDrift.onGetBlock().returns({ number: 1n, timestamp: 1699503565n });

  // Stub contract reads for getPoolConfig
  mockContract.onRead("getPoolConfig").returns({
    positionDuration: 86400n, // one day in seconds
    checkpointDuration: 86400n, // one day in seconds
    // ...other config values
  });

  // Stub the checkpoint when the short was opened
  mockContract.onRead("getCheckpoint", { _checkpointTime: 1n }).returns({
    vaultSharePrice: parseBigInt("1.008e18"),
    weightedSpotPrice: 0n,
    lastWeightedSpotPriceUpdateTime: 0n,
  });

  // Stub the checkpoint when the short matured
  mockContract.onRead("getCheckpoint", { _checkpointTime: 86401n }).returns({
    vaultSharePrice: parseBigInt("1.01e18"),
    weightedSpotPrice: 0n,
    lastWeightedSpotPriceUpdateTime: 0n,
  });

  // Instantiate your client with the mocked Drift instance
  const readVault = new ReadVault("0xYourVaultAddress", mockDrift);

  // Call the method you want to test
  const accruedYield = await readVault.getShortAccruedYield({
    checkpointTime: 1n,
    bondAmount: parseBigInt("100e18"),
  });

  // Assert the expected result
  // If you opened a short position on 100 bonds at a previous checkpoint price
  // of 1.008 and the price was 1.01 at maturity, your accrued profit would be 0.20.
  expect(accruedYield).toEqual(parseBigInt("0.20e18"));
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
const drift = new Drift(viemAdapter(publicClient, { cache: customCache }));
```

### Extending Drift for Your Needs

Drift is designed to be extensible. You can build additional abstractions or
utilities on top of it to suit your project's requirements.

## Contributing

Got ideas or found a bug? Check the [Contributing
Guide](./.github/CONTRIBUTING.md) to get started.

## License

Drift is open-source software licensed under the [TODO License](LICENSE).

---

Build smarter, not harder — let Drift handle caching and call optimization so
you can focus on what matters, without the hassle of managing multiple hooks or
redundant network requests.
