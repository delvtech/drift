import { Wallet, providers } from "ethers";
import { EthersReadAdapter } from "src/EthersReadAdapter";
import { EthersReadWriteAdapter } from "src/EthersReadWriteAdapter";
import { ethersAdapter } from "src/ethersAdapter";
import { describe, expect, it } from "vitest";

const provider = new providers.JsonRpcProvider("https://localhost:8545");
const signer = new Wallet(`0x${"1".repeat(64)}`, provider);

describe("viemAdapter", () => {
  it("Creates a read adapter if no wallet client is provided", async () => {
    const adapter = ethersAdapter({ provider });
    expect(adapter).toBeInstanceOf(EthersReadAdapter);
  });

  it("Creates a read adapter if a wallet client is provided", async () => {
    const adapter = ethersAdapter({ provider, signer });
    expect(adapter).toBeInstanceOf(EthersReadWriteAdapter);
  });
});
