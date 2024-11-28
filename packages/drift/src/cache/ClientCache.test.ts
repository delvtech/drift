import type { ReadParams } from "src/adapter/types/Adapter";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { ClientCache } from "src/cache/ClientCache";
import { LruSimpleCache } from "src/cache/LruSimpleCache";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

type Erc20Abi = typeof erc20.abi;

describe("ClientCache", () => {
  describe("balanceKey", () => {
    it("Namespaces keys", async () => {
      const store = new LruSimpleCache({ max: 100 });
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.balanceKey({ address: "0xAlice" });
      const key2 = await cache2.balanceKey({ address: "0xAlice" });

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });
  });

  describe("preloadBalance", () => {
    it("Preloads the balance", async () => {
      const cache = new ClientCache({ namespace: "test" });
      await cache.preloadBalance({ address: "0xAlice", value: 123n });
      const key = await cache.balanceKey({ address: "0xAlice" });
      const value = await cache.get(key);
      expect(value).toBe(123n);
    });
  });

  describe("invalidateBalance", () => {
    it("Invalidates the balance", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const key = await cache.balanceKey({ address: "0xAlice" });

      await cache.preloadBalance({ address: "0xAlice", value: 123n });
      let value = await cache.get(key);
      expect(value).toBe(123n);

      await cache.invalidateBalance({ address: "0xAlice" });
      value = await cache.get(key);
      expect(value).toBeUndefined();
    });
  });

  describe("transactionKey", () => {
    it("Namespaces keys", async () => {
      const store = new LruSimpleCache({ max: 100 });
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.transactionKey({ hash: "0x123" });
      const key2 = await cache2.transactionKey({ hash: "0x123" });

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });
  });

  describe("preloadTransaction", () => {
    it("Preloads the balance", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const tx = createStubTransaction();
      await cache.preloadTransaction({ hash: "0x123", value: tx });
      const key = await cache.transactionKey({ hash: "0x123" });
      const value = await cache.get(key);
      expect(value).toStrictEqual(tx);
    });
  });

  const readParams: ReadParams<Erc20Abi, "balanceOf"> = {
    abi: erc20.abi,
    address: "0x123",
    fn: "balanceOf",
    args: {
      account: "0x456",
    },
  };
});
