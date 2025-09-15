import {
  type Address,
  type Contract,
  createDrift,
  type Drift,
  erc4626,
} from "@gud/drift";
import { fixed } from "@gud/math";

type Erc4626Abi = typeof erc4626.abi;

/** A read-only Vault client */
export class ReadVault {
  contract: Contract<Erc4626Abi>;

  constructor(address: Address, drift: Drift = createDrift()) {
    this.contract = drift.contract({
      abi: erc4626.abi,
      address,
    });
  }

  // Make read calls with internal caching
  getDecimals() {
    return this.contract.read("decimals");
  }
  getBalance(account: Address) {
    return this.contract.read("balanceOf", { account });
  }
  convertToAssets(shares: bigint) {
    return this.contract.read("convertToAssets", { shares });
  }
  async getAssetValue(account: Address) {
    const shares = await this.getBalance(account);
    return this.convertToAssets(shares);
  }

  // Fetch events with internal caching
  getDeposits(account?: Address) {
    return this.contract.getEvents("Deposit", {
      filter: {
        sender: account,
      },
    });
  }
}

const vault = new ReadVault(
  "0x4cE9c93513DfF543Bc392870d57dF8C04e89Ba0a", // mainnet yearn vault
  createDrift({
    rpcUrl: process.env.RPC_URL,
  }),
);

const [decimals, totalAssets, deposits] = await Promise.all([
  vault.getDecimals(),
  vault.contract.read("totalAssets"),
  vault.getDeposits(),
]);

console.log(
  "totalAssets:",
  fixed(totalAssets, decimals).format({ decimals: 2 }),
);
console.log("Deposit count:", deposits.length);
console.group("Last 3 deposits (in arbitrary order):");
await Promise.all(
  deposits.slice(0, 3).map(async ({ args, transactionHash }) => {
    if (!transactionHash) return;

    const transaction = await vault.contract.client.getTransaction({
      hash: transactionHash,
    });
    if (!transaction) return;

    console.table({
      assets: fixed(args.assets, decimals).format({ decimals: 2 }),
      shares: fixed(args.shares, decimals).format({ decimals: 2 }),
      sender: args.sender,
      owner: args.owner,
      transactionHash,
      blockNumber: transaction.blockNumber,
      gas: transaction.gas,
    });
  }),
);
console.groupEnd();
