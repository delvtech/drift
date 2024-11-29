import type { GetEventsParams } from "src/adapter/types/Adapter";
import type { EventLog } from "src/adapter/types/Event";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
import { ClientCache } from "src/cache/ClientCache";
import { LruSimpleCache } from "src/cache/LruSimpleCache";
import { ZERO_ADDRESS } from "src/constants";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

type Erc20Abi = typeof erc20.abi;

describe("ClientCache", () => {
  // Balance //

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

  // Transaction //

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
    it("Preloads transactions", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const tx = createStubTransaction();
      await cache.preloadTransaction({ hash: "0x123", value: tx });
      const key = await cache.transactionKey({ hash: "0x123" });
      const value = await cache.get(key);
      expect(value).toStrictEqual(tx);
    });
  });

  // Transaction Receipt //

  describe("transactionReceiptKey", () => {
    it("Namespaces keys", async () => {
      const store = new LruSimpleCache({ max: 100 });
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.transactionReceiptKey({ hash: "0x123" });
      const key2 = await cache2.transactionReceiptKey({ hash: "0x123" });

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });
  });

  describe("preloadTransactionReceipt", () => {
    it("Preloads transaction receipts", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const receipt = createStubTransactionReceipt();
      await cache.preloadTransactionReceipt({ hash: "0x123", value: receipt });
      const key = await cache.transactionReceiptKey({ hash: "0x123" });
      const value = await cache.get(key);
      expect(value).toStrictEqual(receipt);
    });
  });

  // Events //

  describe("eventsKey", () => {
    it("Namespaces keys", async () => {
      const store = new LruSimpleCache({ max: 100 });
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const params: GetEventsParams<Erc20Abi, "Approval"> = {
        abi: erc20.abi,
        address: ZERO_ADDRESS,
        event: "Approval",
      };
      const key1 = await cache1.eventsKey(params);
      const key2 = await cache2.eventsKey(params);

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });
  });

  describe("preloadEvents", () => {
    it("Preloads events", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: GetEventsParams<Erc20Abi, "Approval"> = {
        abi: erc20.abi,
        address: ZERO_ADDRESS,
        event: "Approval",
        filter: {
          owner: "0xAlice",
        },
      };
      const events: EventLog<Erc20Abi, "Approval">[] = [
        {
          eventName: "Approval",
          args: {
            owner: "0xAlice",
            spender: "0xBob",
            value: 100n,
          },
        },
        {
          eventName: "Approval",
          args: {
            owner: "0xAlice",
            spender: "0xCharlie",
            value: 120n,
          },
        },
      ];

      await cache.preloadEvents({ ...params, value: events });
      const key = await cache.eventsKey(params);
      const value = await cache.get(key);
      expect(value).toStrictEqual(events);
    });
  });
});
