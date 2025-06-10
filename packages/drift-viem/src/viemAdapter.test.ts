import { ViemReadAdapter } from "src/ViemReadAdapter";
import { ViemReadWriteAdapter } from "src/ViemReadWriteAdapter";
import { viemAdapter } from "src/viemAdapter";
import { http, createPublicClient, createWalletClient } from "viem";
import { anvil } from "viem/chains";
import { describe, expect, it } from "vitest";

const rpcUrl = process.env.VITE_RPC_URL || anvil.rpcUrls.default.http[0];
const publicClient = createPublicClient({
  transport: http(rpcUrl),
});
const walletClient = createWalletClient({
  transport: http(rpcUrl),
});

describe("viemAdapter", () => {
  it("creates a read adapter if no wallet client is provided", async () => {
    const adapter = viemAdapter({ publicClient });
    expect(adapter).toBeInstanceOf(ViemReadAdapter);
  });

  it("creates a read adapter if a wallet client is provided", async () => {
    const adapter = viemAdapter({ publicClient, walletClient });
    expect(adapter).toBeInstanceOf(ViemReadWriteAdapter);
  });
});
