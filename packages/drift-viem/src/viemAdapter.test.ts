import { ViemReadAdapter } from "src/ReadAdapter";
import { ViemReadWriteAdapter } from "src/ReadWriteAdapter";
import { viemAdapter } from "src/viemAdapter";
import { http, createPublicClient, createWalletClient } from "viem";
import { describe, expect, it } from "vitest";

const publicClient = createPublicClient({
  transport: http("https://localhost:8545"),
});
const walletClient = createWalletClient({
  transport: http("https://localhost:8545"),
});

describe("viemAdapter", () => {
  it("Creates a read adapter if no wallet client is provided", async () => {
    const adapter = viemAdapter({ publicClient });
    expect(adapter).toBeInstanceOf(ViemReadAdapter);
  });

  it("Creates a read adapter if a wallet client is provided", async () => {
    const adapter = viemAdapter({ publicClient, walletClient });
    expect(adapter).toBeInstanceOf(ViemReadWriteAdapter);
  });
});
