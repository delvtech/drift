import type { GetEventsParams, ReadParams } from "src/adapter/types/Adapter";
import type { EventLog } from "src/adapter/types/Event";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
import { LruSimpleCache } from "src/cache/LruSimpleCache";
import { ClientCache } from "src/client/cache/ClientCache";
import { ZERO_ADDRESS } from "src/constants";
import { ALICE, BOB, NANCY } from "src/utils/testing/accounts";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

type Erc20Abi = typeof erc20.abi;

describe("ClientCache", () => {
  // Balance //

  it("Namespaces balance keys", async () => {
    const store = new LruSimpleCache({ max: 100 });
    const cache1 = new ClientCache({ store, namespace: "ns1" });
    const cache2 = new ClientCache({ store, namespace: "ns2" });

    const key1 = await cache1.balanceKey({ address: ALICE });
    const key2 = await cache2.balanceKey({ address: ALICE });

    expect(key1).not.toBe(key2);
    expect(JSON.stringify(key1)).toContain("ns1");
    expect(JSON.stringify(key2)).toContain("ns2");
  });

  it("Preloads balances", async () => {
    const cache = new ClientCache({ namespace: "test" });
    await cache.preloadBalance({ address: ALICE, value: 123n });
    const key = await cache.balanceKey({ address: ALICE });
    const value = await cache.get(key);
    expect(value).toBe(123n);
  });

  it("Invalidates balances", async () => {
    const cache = new ClientCache({ namespace: "test" });
    const key = await cache.balanceKey({ address: ALICE });

    await cache.preloadBalance({ address: ALICE, value: 123n });
    let value = await cache.get(key);
    expect(value).toBe(123n);

    await cache.invalidateBalance({ address: ALICE });
    value = await cache.get(key);
    expect(value).toBeUndefined();
  });

  // Transaction //

  it("Namespaces transaction keys", async () => {
    const store = new LruSimpleCache({ max: 100 });
    const cache1 = new ClientCache({ store, namespace: "ns1" });
    const cache2 = new ClientCache({ store, namespace: "ns2" });

    const key1 = await cache1.transactionKey({ hash: "0x123" });
    const key2 = await cache2.transactionKey({ hash: "0x123" });

    expect(key1).not.toBe(key2);
    expect(JSON.stringify(key1)).toContain("ns1");
    expect(JSON.stringify(key2)).toContain("ns2");
  });

  it("Preloads transactions", async () => {
    const cache = new ClientCache({ namespace: "test" });
    const tx = createStubTransaction();
    await cache.preloadTransaction({ hash: "0x123", value: tx });
    const key = await cache.transactionKey({ hash: "0x123" });
    const value = await cache.get(key);
    expect(value).toStrictEqual(tx);
  });

  // Transaction Receipt //

  it("Namespaces transaction receipt keys", async () => {
    const store = new LruSimpleCache({ max: 100 });
    const cache1 = new ClientCache({ store, namespace: "ns1" });
    const cache2 = new ClientCache({ store, namespace: "ns2" });

    const key1 = await cache1.transactionReceiptKey({ hash: "0x123" });
    const key2 = await cache2.transactionReceiptKey({ hash: "0x123" });

    expect(key1).not.toBe(key2);
    expect(JSON.stringify(key1)).toContain("ns1");
    expect(JSON.stringify(key2)).toContain("ns2");
  });

  it("Preloads transaction receipts", async () => {
    const cache = new ClientCache({ namespace: "test" });
    const receipt = createStubTransactionReceipt();
    await cache.preloadTransactionReceipt({ hash: "0x123", value: receipt });
    const key = await cache.transactionReceiptKey({ hash: "0x123" });
    const value = await cache.get(key);
    expect(value).toStrictEqual(receipt);
  });

  // Events //

  it("Namespaces event keys", async () => {
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

  it("Preloads events", async () => {
    const cache = new ClientCache({ namespace: "test" });

    const params: GetEventsParams<Erc20Abi, "Approval"> = {
      abi: erc20.abi,
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
    const key = await cache.eventsKey(params);
    const value = await cache.get(key);
    expect(value).toStrictEqual(events);
  });

  // Reads //

  it("Namespaces read keys", async () => {
    const store = new LruSimpleCache({ max: 100 });
    const cache1 = new ClientCache({ store, namespace: "ns1" });
    const cache2 = new ClientCache({ store, namespace: "ns2" });

    const params: ReadParams<Erc20Abi, "allowance"> = {
      abi: erc20.abi,
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

  it("Preloads reads", async () => {
    const cache = new ClientCache({ namespace: "test" });

    const params: ReadParams<Erc20Abi, "allowance"> = {
      abi: erc20.abi,
      address: ZERO_ADDRESS,
      fn: "allowance",
      args: {
        owner: ALICE,
        spender: BOB,
      },
    };

    await cache.preloadRead({ ...params, value: 123n });
    const key = await cache.readKey(params);
    const value = await cache.get(key);
    expect(value).toStrictEqual(123n);
  });

  it("Invalidates reads", async () => {
    const cache = new ClientCache({ namespace: "test" });

    const params: ReadParams<Erc20Abi, "allowance"> = {
      abi: erc20.abi,
      address: ZERO_ADDRESS,
      fn: "allowance",
      args: {
        owner: ALICE,
        spender: BOB,
      },
    };
    const key = await cache.readKey(params);

    await cache.preloadRead({ ...params, value: 123n });
    let value = await cache.get(key);
    expect(value).toBe(123n);

    await cache.invalidateRead(params);
    value = await cache.get(key);
    expect(value).toBeUndefined();
  });

  it("Invalidates reads matching partial params", async () => {
    const cache = new ClientCache({ namespace: "test" });

    const params1: ReadParams<Erc20Abi, "allowance"> = {
      abi: erc20.abi,
      address: ZERO_ADDRESS,
      fn: "allowance",
      args: {
        owner: ALICE,
        spender: BOB,
      },
    };
    const params2: ReadParams<Erc20Abi, "allowance"> = {
      abi: erc20.abi,
      address: ZERO_ADDRESS,
      fn: "allowance",
      args: {
        owner: ALICE,
        spender: NANCY,
      },
    };

    await cache.preloadRead({ ...params1, value: 123n });
    await cache.preloadRead({ ...params2, value: 456n });

    const key1 = await cache.readKey(params1);
    const key2 = await cache.readKey(params2);
    let value1 = await cache.get(key1);
    let value2 = await cache.get(key2);

    expect(value1).toBe(123n);
    expect(value2).toBe(456n);

    await cache.invalidateReadsMatching({
      abi: erc20.abi,
      address: ZERO_ADDRESS,
      fn: "allowance",
    });

    value1 = await cache.get(key1);
    value2 = await cache.get(key2);
    expect(value1).toBeUndefined();
    expect(value2).toBeUndefined();
  });
});
