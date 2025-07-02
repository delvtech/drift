declare module "vault-sdk" {
  import type { Address, Drift, ReadContract, erc4626 } from "@delvtech/drift";
  /** A read-only Vault client */
  export class ReadVault {
    contract: ReadContract<typeof erc4626.abi>;
    constructor(address: Address, drift?: Drift);
    getBalance(account: Address): Promise<bigint>;
    getAssetValue(account: Address): Promise<bigint>;
  }
}
