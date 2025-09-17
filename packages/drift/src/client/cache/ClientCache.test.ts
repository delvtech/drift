import type {
  CallParams,
  GetEventsParams,
  ReadParams,
} from "src/adapter/types/Adapter";
import { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
import { createStubEvents } from "src/adapter/utils/testing/createStubEvent";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
import { IERC20 } from "src/artifacts/IERC20";
import { TestToken } from "src/artifacts/TestToken";
import { ClientCache } from "src/client/cache/ClientCache";
import { ZERO_ADDRESS } from "src/constants";
import { LruStore } from "src/store/LruStore";
import { ALICE, BOB, NANCY } from "src/utils/testing/accounts";
import { describe, expect, it } from "vitest";

type Erc20Abi = typeof IERC20.abi;

describe("ClientCache", () => {
  describe("balances", () => {
    it("namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.balanceKey({ address: ALICE });
      const key2 = await cache2.balanceKey({ address: ALICE });

      expect(key1).not.toBe(key2);
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      await cache.preloadBalance({ address: ALICE, value: 123n });
      const value = await cache.getBalance({ address: ALICE });
      expect(value).toBe(123n);
    });

    it("invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      await cache.preloadBalance({ address: ALICE, value: 123n });
      let value = await cache.getBalance({ address: ALICE });
      expect(value).toBe(123n);

      await cache.invalidateBalance({ address: ALICE });
      value = await cache.getBalance({ address: ALICE });
      expect(value).toBeUndefined();
    });

    describe("clearBalances", () => {
      it("clears all values", async () => {
        const cache = new ClientCache({ namespace: "test" });

        await cache.preloadBalance({ address: ALICE, value: 123n });
        await cache.preloadBalance({ address: BOB, value: 456n });
        await cache.preloadBalance({ address: NANCY, value: 789n });

        let values = await Promise.all([
          cache.getBalance({ address: ALICE }),
          cache.getBalance({ address: BOB }),
          cache.getBalance({ address: NANCY }),
        ]);
        expect(values).toStrictEqual([123n, 456n, 789n]);

        await cache.clearBalances();

        values = await Promise.all([
          cache.getBalance({ address: ALICE }),
          cache.getBalance({ address: BOB }),
          cache.getBalance({ address: NANCY }),
        ]);
        expect(values).toStrictEqual([undefined, undefined, undefined]);
      });

      it("doesn't clear unrelated values", async () => {
        const cache = new ClientCache({ namespace: "test" });
        const block = createStubBlock({ number: 123n });

        await cache.preloadBalance({ address: ALICE, value: 123n });
        await cache.preloadBlock({ block: 123n, value: block });

        let values = await Promise.all([
          cache.getBalance({ address: ALICE }),
          cache.getBlock(123n),
        ]);
        expect(values).toStrictEqual([123n, block]);

        await cache.clearBalances();

        values = await Promise.all([
          cache.getBalance({ address: ALICE }),
          cache.getBlock(123n),
        ]);
        expect(values).toStrictEqual([undefined, block]);
      });
    });
  });

  describe("bytecodes", () => {
    it("namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.bytecodeKey({ address: ALICE });
      const key2 = await cache2.bytecodeKey({ address: ALICE });

      expect(key1).not.toBe(key2);
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      await cache.preloadBytecode({ address: ALICE, value: "0x123" });
      const value = await cache.getBytecode({ address: ALICE });
      expect(value).toBe("0x123");
    });
  });

  describe("blocks", () => {
    it("namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.blockKey(123n);
      const key2 = await cache2.blockKey(123n);

      expect(key1).not.toBe(key2);
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const block = createStubBlock({ number: 123n });
      await cache.preloadBlock({ block: 123n, value: block });
      const value = await cache.getBlock(123n);
      expect(value).toBe(block);
    });

    it("invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const block = createStubBlock({ number: 123n });

      await cache.preloadBlock({ block: 123n, value: block });
      let value = await cache.getBlock(123n);
      expect(value).toBe(block);

      await cache.invalidateBlock(123n);
      value = await cache.getBlock(123n);
      expect(value).toBeUndefined();
    });

    describe("clearBlocks", () => {
      it("clears all values", async () => {
        const cache = new ClientCache({ namespace: "test" });
        const block1 = createStubBlock({ number: 1n });
        const block2 = createStubBlock({ number: 2n });
        const block3 = createStubBlock({ number: 3n });

        await cache.preloadBlock({ block: 1n, value: block1 });
        await cache.preloadBlock({ block: 2n, value: block2 });
        await cache.preloadBlock({ block: 3n, value: block3 });

        let values = await Promise.all([
          cache.getBlock(1n),
          cache.getBlock(2n),
          cache.getBlock(3n),
        ]);
        expect(values).toStrictEqual([block1, block2, block3]);

        await cache.clearBlocks();

        values = await Promise.all([
          cache.getBlock(1n),
          cache.getBlock(2n),
          cache.getBlock(3n),
        ]);
        expect(values).toStrictEqual([undefined, undefined, undefined]);
      });

      it("doesn't clear unrelated values", async () => {
        const cache = new ClientCache({ namespace: "test" });
        const block = createStubBlock({ number: 0n });

        await cache.preloadBlock({ block: 0n, value: block });
        await cache.preloadBalance({ address: ALICE, value: 123n });

        let values = await Promise.all([
          cache.getBlock(0n),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual([block, 123n]);

        await cache.clearBlocks();

        values = await Promise.all([
          cache.getBlock(0n),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual([undefined, 123n]);
      });
    });
  });

  describe("transactions", () => {
    it("namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.transactionKey({ hash: "0x123" });
      const key2 = await cache2.transactionKey({ hash: "0x123" });

      expect(key1).not.toBe(key2);
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const tx = createStubTransaction();
      await cache.preloadTransaction({ hash: "0x123", value: tx });
      const value = await cache.getTransaction({ hash: "0x123" });
      expect(value).toStrictEqual(tx);
    });

    it("invalidates values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const tx = createStubTransaction();

      await cache.preloadTransaction({ hash: "0x123", value: tx });
      let value = await cache.getTransaction({ hash: "0x123" });
      expect(value).toBe(tx);

      await cache.invalidateTransaction({ hash: "0x123" });
      value = await cache.getTransaction({ hash: "0x123" });
      expect(value).toBeUndefined();
    });

    describe("clearTransactions", () => {
      it("clears all values", async () => {
        const cache = new ClientCache({ namespace: "test" });
        const tx1 = createStubTransaction({ transactionHash: "0x1" });
        const tx2 = createStubTransaction({ transactionHash: "0x2" });
        const tx3 = createStubTransaction({ transactionHash: "0x3" });

        await cache.preloadTransaction({ hash: "0x1", value: tx1 });
        await cache.preloadTransaction({ hash: "0x2", value: tx2 });
        await cache.preloadTransaction({ hash: "0x3", value: tx3 });

        let values = await Promise.all([
          cache.getTransaction({ hash: "0x1" }),
          cache.getTransaction({ hash: "0x2" }),
          cache.getTransaction({ hash: "0x3" }),
        ]);
        expect(values).toStrictEqual([tx1, tx2, tx3]);

        await cache.clearTransactions();

        values = await Promise.all([
          cache.getTransaction({ hash: "0x1" }),
          cache.getTransaction({ hash: "0x2" }),
          cache.getTransaction({ hash: "0x3" }),
        ]);
        expect(values).toStrictEqual([undefined, undefined, undefined]);
      });

      it("doesn't clear unrelated values", async () => {
        const cache = new ClientCache({ namespace: "test" });
        const tx = createStubTransaction({ transactionHash: "0x1" });

        await cache.preloadTransaction({ hash: "0x1", value: tx });
        await cache.preloadBalance({ address: ALICE, value: 123n });

        let values = await Promise.all([
          cache.getTransaction({ hash: "0x1" }),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual([tx, 123n]);

        await cache.clearTransactions();

        values = await Promise.all([
          cache.getTransaction({ hash: "0x1" }),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual([undefined, 123n]);
      });
    });
  });

  describe("transaction receipts", () => {
    it("namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const key1 = await cache1.transactionReceiptKey({ hash: "0x123" });
      const key2 = await cache2.transactionReceiptKey({ hash: "0x123" });

      expect(key1).not.toBe(key2);
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });
      const receipt = createStubTransactionReceipt();
      await cache.preloadTransactionReceipt({ hash: "0x123", value: receipt });
      const value = await cache.getTransactionReceipt({ hash: "0x123" });
      expect(value).toStrictEqual(receipt);
    });
  });

  describe("calls", () => {
    it("namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ClientCache({ store, namespace: "ns1" });
      const cache2 = new ClientCache({ store, namespace: "ns2" });

      const params: CallParams = {
        to: ZERO_ADDRESS,
      };
      const key1 = await cache1.callKey(params);
      const key2 = await cache2.callKey(params);

      expect(key1).not.toBe(key2);
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: CallParams = {
        to: ZERO_ADDRESS,
      };

      await cache.preloadCall({ ...params, preloadValue: "0xA" });
      const value = await cache.getCall(params);
      expect(value).toStrictEqual("0xA");
    });

    it("invalidates values", async () => {
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

    it("invalidates values matching partial params", async () => {
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

    describe("clearCalls", () => {
      it("clears all values", async () => {
        const cache = new ClientCache({ namespace: "test" });

        await cache.preloadCall({ to: "0x", data: "0x1", preloadValue: "0x1" });
        await cache.preloadCall({ to: "0x", data: "0x2", preloadValue: "0x2" });
        await cache.preloadCall({ to: "0x", data: "0x3", preloadValue: "0x3" });

        let values = await Promise.all([
          cache.getCall({ to: "0x", data: "0x1" }),
          cache.getCall({ to: "0x", data: "0x2" }),
          cache.getCall({ to: "0x", data: "0x3" }),
        ]);
        expect(values).toStrictEqual(["0x1", "0x2", "0x3"]);

        await cache.clearCalls();

        values = await Promise.all([
          cache.getCall({ to: "0x", data: "0x1" }),
          cache.getCall({ to: "0x", data: "0x2" }),
          cache.getCall({ to: "0x", data: "0x3" }),
        ]);
        expect(values).toStrictEqual([undefined, undefined, undefined]);
      });

      it("doesn't clear unrelated values", async () => {
        const cache = new ClientCache({ namespace: "test" });

        await cache.preloadCall({ to: "0x", data: "0x1", preloadValue: "0x1" });
        await cache.preloadBalance({ address: ALICE, value: 123n });

        let values = await Promise.all([
          cache.getCall({ to: "0x", data: "0x1" }),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual(["0x1", 123n]);

        await cache.clearCalls();

        values = await Promise.all([
          cache.getCall({ to: "0x", data: "0x1" }),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual([undefined, 123n]);
      });
    });
  });

  describe("events", () => {
    it("namespaces keys", async () => {
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
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
      const cache = new ClientCache({ namespace: "test" });

      const params: GetEventsParams<Erc20Abi, "Approval"> = {
        abi: IERC20.abi,
        address: ZERO_ADDRESS,
        event: "Approval",
        filter: {
          owner: ALICE,
        },
      };
      const events = createStubEvents({
        abi: IERC20.abi,
        eventName: "Approval",
        events: [
          { args: { owner: ALICE, spender: BOB, value: 100n } },
          { args: { owner: ALICE, spender: NANCY, value: 120n } },
        ],
      });

      await cache.preloadEvents({ ...params, value: events });
      const value = await cache.getEvents(params);
      expect(value).toStrictEqual(events);
    });
  });

  describe("Reads", () => {
    it("namespaces keys", async () => {
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
      expect(key1).toContain("ns1");
      expect(key2).toContain("ns2");
    });

    it("preloads values", async () => {
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

    it("invalidates values", async () => {
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

    it("invalidates values matching partial params", async () => {
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

    describe("clearReads", () => {
      it("clears all values", async () => {
        const cache = new ClientCache({ namespace: "test" });
        const abi = TestToken.abi;

        await cache.preloadRead({
          abi,
          address: "0x1",
          fn: "symbol",
          value: "ONE",
        });
        await cache.preloadRead({
          abi,
          address: "0x2",
          fn: "symbol",
          value: "TWO",
        });
        await cache.preloadRead({
          abi,
          address: "0x3",
          fn: "symbol",
          value: "THREE",
        });

        let values = await Promise.all([
          cache.getRead({ abi, address: "0x1", fn: "symbol" }),
          cache.getRead({ abi, address: "0x2", fn: "symbol" }),
          cache.getRead({ abi, address: "0x3", fn: "symbol" }),
        ]);
        expect(values).toStrictEqual(["ONE", "TWO", "THREE"]);

        await cache.clearReads();

        values = await Promise.all([
          cache.getRead({ abi, address: "0x1", fn: "symbol" }),
          cache.getRead({ abi, address: "0x2", fn: "symbol" }),
          cache.getRead({ abi, address: "0x3", fn: "symbol" }),
        ]);
        expect(values).toStrictEqual([undefined, undefined, undefined]);
      });

      it("doesn't clear unrelated values", async () => {
        const cache = new ClientCache({ namespace: "test" });
        const abi = TestToken.abi;

        await cache.preloadRead({
          abi,
          address: "0x",
          fn: "symbol",
          value: "TEST",
        });
        await cache.preloadBalance({ address: ALICE, value: 123n });

        let values = await Promise.all([
          cache.getRead({ abi, address: "0x", fn: "symbol" }),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual(["TEST", 123n]);

        await cache.clearReads();

        values = await Promise.all([
          cache.getRead({ abi, address: "0x", fn: "symbol" }),
          cache.getBalance({ address: ALICE }),
        ]);
        expect(values).toStrictEqual([undefined, 123n]);
      });
    });
  });
});
