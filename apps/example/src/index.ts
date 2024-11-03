import { ReadVault } from "src/vault-client";
import { publicClient } from "./viem";

const vaultAddress = "0xAc37729B76db6438CE62042AE1270ee574CA7571";

const vault = new ReadVault(vaultAddress, publicClient);

const assetBalance = await vault.assetBalanceOf(vaultAddress);

console.log("Asset balance:", assetBalance);
