import type {
  CallParams,
  GetEventsParams,
  ReadParams,
} from "src/adapter/types/Adapter";
import type { EventLog } from "src/adapter/types/Event";
import { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
import { IERC20 } from "src/artifacts/IERC20";
import { ClientCache } from "src/client/cache/ClientCache";
import { ZERO_ADDRESS } from "src/constants";
import { LruStore } from "src/store/LruStore";
import { ALICE, BOB, NANCY } from "src/utils/testing/accounts";
import { describe, expect, it } from "vitest";

type Erc20Abi = typeof IERC20.abi;

describe("ClientCache", () => {
  describe("balances", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.balanceKey({ address: ALICE });
      const key2 = await cache2.balanceKey({ address: ALICE });

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      await cache.preloadBalance({ address: ALICE, value: 123n });
      const value = await cache.getBalance({ address: ALICE });
      expect(value).toBe(123n);
    });

    it("Invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      await cache.preloadBalance({ address: ALICE, value: 123n });
      let value = await cache.getBalance({ address: ALICE });
      expect(value).toBe(123n);

      await cache.invalidateBalance({ address: ALICE });
      value = await cache.getBalance({ address: ALICE });
      expect(value).toBeUndefined();
    });
  });

  describe("blocks", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.blockKey(123n);
      const key2 = await cache2.blockKey(123n);

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const block = createStubBlock({ number: 123n });
      await cache.preloadBlock({ block: 123n, value: block });
      const value = await cache.getBlock(123n);
      expect(value).toBe(block);
    });

    it("Invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const block = createStubBlock({ number: 123n });

      await cache.preloadBlock({ block: 123n, value: block });
      let value = await cache.getBlock(123n);
      expect(value).toBe(block);

      await cache.invalidateBlock(123n);
      value = await cache.getBlock(123n);
      expect(value).toBeUndefined();
    });
  });

  describe("transactions", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.transactionKey({ hash: "0x123" });
      const key2 = await cache2.transactionKey({ hash: "0x123" });

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const tx = createStubTransaction();
      await cache.preloadTransaction({ hash: "0x123", value: tx });
      const value = await cache.getTransaction({ hash: "0x123" });
      expect(value).toStrictEqual(tx);
    });

    it("Invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const tx = createStubTransaction();

      await cache.preloadTransaction({ hash: "0x123", value: tx });
      let value = await cache.getTransaction({ hash: "0x123" });
      expect(value).toBe(tx);

      await cache.invalidateTransaction({ hash: "0x123" });
      value = await cache.getTransaction({ hash: "0x123" });
      expect(value).toBeUndefined();
    });
  });

  describe("transaction receipts", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.transactionReceiptKey({ hash: "0x123" });
      const key2 = await cache2.transactionReceiptKey({ hash: "0x123" });

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const receipt = createStubTransactionReceipt();
      await cache.preloadTransactionReceipt({ hash: "0x123", value: receipt });
      const value = await cache.getTransactionReceipt({ hash: "0x123" });
      expect(value).toStrictEqual(receipt);
    });
  });

  describe("calls", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const params: CallParams = {
        to: ZERO_ADDRESS,
      };
      const key1 = await cache1.callKey(params);
      const key2 = await cache2.callKey(params);

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: CallParams = {
        to: ZERO_ADDRESS,
      };

      await cache.preloadCall({ ...params, preloadValue: "0xA" });
      const value = await cache.getCall(params);
      expect(value).toStrictEqual("0xA");
    });

    it("Invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: CallParams = {
        to: ZERO_ADDRESS,
      };

      await cache.preloadCall({ ...params, preloadValue: "0xA" });
      let value = await cache.getCall(params);
      expect(value).toStrictEqual("0xA");

      await cache.invalidateCall(params);
      value = await cache.getCall(params);
      expect(value).toBeUndefined();
    });

    it("Invalidates values matching partial params", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params1: CallParams = {
        to: ZERO_ADDRESS,
        data: "0xA",
      };
      const params2: CallParams = {
        to: ZERO_ADDRESS,
        data: "0xB",
      };

      await cache.preloadCall({ ...params1, preloadValue: "0xAA" });
      await cache.preloadCall({ ...params2, preloadValue: "0xBB" });

      let value1 = await cache.getCall(params1);
      let value2 = await cache.getCall(params2);

      expect(value1).toBe("0xAA");
      expect(value2).toBe("0xBB");

      await cache.invalidateCallsMatching({
        to: ZERO_ADDRESS,
      });

      value1 = await cache.getCall(params1);
      value2 = await cache.getCall(params2);
      expect(value1).toBeUndefined();
      expect(value2).toBeUndefined();
    });
  });

  describe("events", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const params: GetEventsParams<Erc20Abi, "Approval"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        event: "Approval",
      };
      const key1 = await cache1.eventsKey(params);
      const key2 = await cache2.eventsKey(params);

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: GetEventsParams<Erc20Abi, "Approval"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        event: "Approval",
        filter: {
          owner: ALICE,
        },
      };
      const events: EventLog<Erc20Abi, "Approval">[] = [
        {
          eventName: "Approval",
          args: {
            owner: ALICE,
            spender: BOB,
            value: 100n,
          },
        },
        {
          eventName: "Approval",
          args: {
            owner: ALICE,
            spender: NANCY,
            value: 120n,
          },
        },
      ];

      await cache.preloadEvents({ ...params, value: events });
      const value = await cache.getEvents(params);
      expect(value).toStrictEqual(events);
    });
  });

  describe("Reads", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const params: ReadParams<Erc20Abi, "allowance"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        fn: "allowance",
        args: {
          owner: ALICE,
          spender: BOB,
        },
      };
      const key1 = await cache1.readKey(params);
      const key2 = await cache2.readKey(params);

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: ReadParams<Erc20Abi, "allowance"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        fn: "allowance",
        args: {
          owner: ALICE,
          spender: BOB,
        },
      };

      await cache.preloadRead({ ...params, value: 123n });
      const value = await cache.getRead(params);
      expect(value).toStrictEqual(123n);
    });

    it("Invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: ReadParams<Erc20Abi, "allowance"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        fn: "allowance",
        args: {
          owner: ALICE,
          spender: BOB,
        },
      };

      await cache.preloadRead({ ...params, value: 123n });
      let value = await cache.getRead(params);
      expect(value).toBe(123n);

      await cache.invalidateRead(params);
      value = await cache.getRead(params);
      expect(value).toBeUndefined();
    });

    it("Invalidates values matching partial params", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params1: ReadParams<Erc20Abi, "allowance"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        fn: "allowance",
        args: {
          owner: ALICE,
          spender: BOB,
        },
      };
      const params2: ReadParams<Erc20Abi, "allowance"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        fn: "allowance",
        args: {
          owner: ALICE,
          spender: NANCY,
        },
      };

      await cache.preloadRead({ ...params1, value: 123n });
      await cache.preloadRead({ ...params2, value: 456n });

      let value1 = await cache.getRead(params1);
      let value2 = await cache.getRead(params2);

      expect(value1).toBe(123n);
      expect(value2).toBe(456n);

      await cache.invalidateReadsMatching({
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        fn: "allowance",
      });

      value1 = await cache.getRead(params1);
      value2 = await cache.getRead(params2);
      expect(value1).toBeUndefined();
      expect(value2).toBeUndefined();
    });
  });
});
