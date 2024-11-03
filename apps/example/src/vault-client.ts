import {
  type Address,
  type ContractReadOptions, Drift,
  type ReadContract
} from "@delvtech/drift";
import { viemAdapter } from "@delvtech/drift-viem";
import { type PublicClient, erc4626Abi } from "viem";

export type Numberish = bigint | number | string;

export class ReadVault {
  drift: Drift;
  contract: ReadContract<typeof erc4626Abi>;

  constructor(address: Address, publicClient: PublicClient) {
    this.drift = new Drift(viemAdapter({ publicClient }));
    this.contract = this.drift.contract({
      abi: erc4626Abi,
      address,
    });
  }

  async assetBalanceOf(account: Address, options?: ContractReadOptions) {
    return this.contract
      .read("balanceOf", { account }, options)
      .then((shares) =>
        this.contract.read("convertToAssets", { shares }, options),
      );
  }
}
