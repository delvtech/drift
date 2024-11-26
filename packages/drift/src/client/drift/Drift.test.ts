import type { ClientConfig } from "src/client/BaseClient";
import { Drift } from "src/client/drift/Drift";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

// These config values will prevent the client from throwing an error about not
// being given a provider or from trying to fetch the chain id for the id.
const testDriftConfig: ClientConfig = {
  id: "test",
  rpcUrl: "test",
};

describe("Drift", () => {
  it("Should use the cache namespace if provided", async () => {
    const drift = new Drift(testDriftConfig);
    expect(drift.getId()).resolves.toEqual("test");
  });

  describe("contract", () => {
    it("Creates contracts that share cache values", async () => {
      const drift = new Drift(testDriftConfig);
      const contract = drift.contract({
        abi: erc20.abi,
        address: "0xVaultAddress",
      });

      drift.preloadRead({
        abi: erc20.abi,
        address: "0xVaultAddress",
        fn: "symbol",
        value: "VAULT",
      });

      expect(await contract.read("symbol")).toBe("VAULT");
    });
  });
});
