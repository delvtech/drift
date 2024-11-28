import { Drift } from "src/client/drift/Drift";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

describe("Drift", () => {
  describe("contract", () => {
    it("Creates contracts that share cache values", async () => {
      const drift = new Drift({
        chainId: 0,
        rpcUrl: "__test__",
      });
      const contract = drift.contract({
        abi: erc20.abi,
        address: "0xVaultAddress",
      });

      drift.cache.preloadRead({
        abi: erc20.abi,
        address: "0xVaultAddress",
        fn: "symbol",
        value: "VAULT",
      });

      expect(await contract.read("symbol")).toBe("VAULT");
    });
  });
});
