import { IERC20 } from "src/artifacts/IERC20";
import { createMockDrift } from "src/client/MockDrift";
import { describe, expect, it } from "vitest";

describe("MockDrift", () => {
  describe("contract", () => {
    it("Creates mock read-write contracts", async () => {
      const mockDrift = createMockDrift();
      const mockContract = mockDrift.contract({
        abi: IERC20.abi,
        address: "0xVaultAddress",
      });

      mockContract
        .onWrite("approve", {
          spender: "0x1",
          amount: 100n,
        })
        .resolves("0xHash");

      expect(
        await mockContract.write("approve", {
          spender: "0x1",
          amount: 100n,
        }),
      ).toBe("0xHash");
    });

    it("Creates contracts that share mock values", async () => {
      const mockDrift = createMockDrift();
      const contract = mockDrift.contract({
        abi: IERC20.abi,
        address: "0xVaultAddress",
      });

      mockDrift
        .onRead({
          abi: IERC20.abi,
          address: "0xVaultAddress",
          fn: "symbol",
        })
        .resolves("VAULT");

      expect(await contract.read("symbol")).toBe("VAULT");

      contract.onRead("name").resolves("Vault Token");

      expect(
        await mockDrift.read({
          abi: IERC20.abi,
          address: "0xVaultAddress",
          fn: "name",
        }),
      ).toBe("Vault Token");
    });

    it("Creates contracts that share cache values", async () => {
      const mockDrift = createMockDrift();
      const contract = mockDrift.contract({
        abi: IERC20.abi,
        address: "0xVaultAddress",
      });

      mockDrift.cache.preloadRead({
        abi: IERC20.abi,
        address: "0xVaultAddress",
        fn: "symbol",
        value: "VAULT",
      });

      expect(await contract.read("symbol")).toBe("VAULT");
    });
  });
});
