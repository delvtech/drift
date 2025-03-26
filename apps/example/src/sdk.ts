import {
  type Address,
  type Contract,
  type Drift,
  type EventLog,
  createDrift,
} from "@delvtech/drift";
import { fixed } from "@delvtech/fixed-point-wasm";
import { ERC4626 } from "src/abis/Erc4626";

type VaultAbi = typeof ERC4626.abi;

/** A Read-Only Vault client */
export class ReadVault {
  contract: Contract<VaultAbi>;
  constructor(address: Address, drift: Drift = createDrift()) {
    this.contract = drift.contract({
      abi: ERC4626.abi,
      address,
    });
  }
  getBalance(account: Address): Promise<bigint> {
    return this.contract.read("balanceOf", { account });
  }
  getDecimals(): Promise<number> {
    return this.contract.read("decimals");
  }
  getDeposits(account?: Address): Promise<EventLog<VaultAbi, "Deposit">[]> {
    return this.contract.getEvents("Deposit", {
      filter: {
        sender: account,
      },
    });
  }
}

const yearnVaultAddress = "0x4cE9c93513DfF543Bc392870d57dF8C04e89Ba0a";

const vault = new ReadVault(
  yearnVaultAddress,
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
