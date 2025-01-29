import { createDrift } from "src/client/Drift";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it, vi } from "vitest";

describe("Drift", () => {
  describe("contract", () => {
    it("Creates contracts that share cache values", async () => {
      const drift = createDrift({
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

    it("Maintains hook proxy on contract client", async () => {
      const drift = createDrift({
        chainId: 0,
        rpcUrl: "__test__",
      });
      const contract = drift.contract({
        abi: erc20.abi,
        address: "0xVaultAddress",
      });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      drift.hooks.on("before:read", beforeHandler);
      drift.hooks.on("after:read", afterHandler);

      await contract.read("symbol").catch(() => {});

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });
  });
});
