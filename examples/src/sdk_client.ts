import {
  type Address,
  type Contract,
  type Drift,
  type EventLog,
  createDrift,
} from "@delvtech/drift";
import { fixed } from "@delvtech/fixed-point-wasm";
import { ERC4626 } from "src/abis/Erc4626";

type Erc4626Abi = typeof ERC4626.abi;

/**
 * A bare-bones Read-Only Vault client.
 */
export class ReadVault {
  contract: Contract<Erc4626Abi>;

  constructor(address: Address, drift: Drift = createDrift()) {
    this.contract = drift.contract({
      abi: ERC4626.abi,
      address,
    });
  }

  getDecimals(): Promise<number> {
    return this.contract.read("decimals");
  }

  getBalance(account: Address): Promise<bigint> {
    return this.contract.read("balanceOf", { account });
  }

  async getAssetValue(account: Address): Promise<bigint> {
    const shares = await this.getBalance(account);
    return this.contract.read("convertToAssets", { shares });
  }

  getDeposits(account?: Address): Promise<EventLog<Erc4626Abi, "Deposit">[]> {
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

console.log("totalAssets", fixed(totalAssets, decimals).format());
console.log("Deposit count:", deposits.length);
console.group("Last 3 deposits (in arbitrary order):");
await Promise.all(
  deposits.slice(0, 3).map(async ({ args, transactionHash }) => {
    if (!transactionHash) return;

    const transaction = await vault.contract.client.getTransaction({
      hash: transactionHash,
    });
    if (!transaction) return;

    console.log({
      assets: fixed(args.assets, decimals).format(),
      shares: fixed(args.shares, decimals).format(),
      sender: args.sender,
      owner: args.owner,
      transactionHash,
      blockNumber: transaction.blockNumber,
      gas: transaction.gas,
    });
  }),
);
console.groupEnd();
