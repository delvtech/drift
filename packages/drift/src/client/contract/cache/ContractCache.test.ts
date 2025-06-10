import { createStubEvents } from "src/adapter/utils/testing/createStubEvent";
import { IERC20 } from "src/artifacts/IERC20";
import type { ContractReadArgs } from "src/client/contract/Contract";
import { ContractCache } from "src/client/contract/cache/ContractCache";
import { ZERO_ADDRESS } from "src/constants";
import { LruStore } from "src/store/LruStore";
import { ALICE, BOB, NANCY } from "src/utils/testing/accounts";
import { describe, expect, it } from "vitest";

const address = ZERO_ADDRESS;
const abi = IERC20.abi;
type Erc20Abi = typeof IERC20.abi;

describe("ContractCache", () => {
  describe("events", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ContractCache({
        abi,
        address,
        store,
        namespace: "ns1",
      });
      const cache2 = new ContractCache({
        abi,
        address,
        store,
        namespace: "ns2",
      });

      const key1 = await cache1.eventsKey("Approval");
      const key2 = await cache2.eventsKey("Approval");

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ContractCache({ abi, address, namespace: "test" });
      const events = createStubEvents({
        abi: IERC20.abi,
        eventName: "Approval",
        events: [
          { args: { owner: ALICE, spender: BOB, value: 100n } },
          { args: { owner: ALICE, spender: NANCY, value: 120n } },
        ],
      });

      await cache.preloadEvents({
        event: "Approval",
        value: events,
      });
      const value = await cache.getEvents("Approval");

      expect(value).toStrictEqual(events);
    });
  });

  describe("Reads", () => {
    it("Namespaces keys", async () => {
      const store = new LruStore();
      const cache1 = new ContractCache({
        abi,
        address,
        store,
        namespace: "ns1",
      });
      const cache2 = new ContractCache({
        abi,
        address,
        store,
        namespace: "ns2",
      });
      const readArgs: ContractReadArgs<Erc20Abi, "allowance"> = [
        "allowance",
        { owner: ALICE, spender: BOB },
      ];

      const key1 = await cache1.readKey(...readArgs);
      const key2 = await cache2.readKey(...readArgs);

      expect(key1).not.toBe(key2);
      expect(JSON.stringify(key1)).toContain("ns1");
      expect(JSON.stringify(key2)).toContain("ns2");
    });

    it("Preloads values", async () => {
      const cache = new ContractCache({ abi, address, namespace: "test" });
      const readArgs: ContractReadArgs<Erc20Abi, "allowance"> = [
        "allowance",
        { owner: ALICE, spender: BOB },
      ];

      await cache.preloadRead({
        fn: readArgs[0],
        args: readArgs[1],
        value: 123n,
      });
      const value = await cache.getRead(...readArgs);

      expect(value).toStrictEqual(123n);
    });

    it("Invalidates values", async () => {
      const cache = new ContractCache({ abi, address, namespace: "test" });
      const readArgs: ContractReadArgs<Erc20Abi, "allowance"> = [
        "allowance",
        { owner: ALICE, spender: BOB },
      ];

      await cache.preloadRead({
        fn: readArgs[0],
        args: readArgs[1],
        value: 123n,
      });
      let value = await cache.getRead(...readArgs);

      expect(value).toBe(123n);

      await cache.invalidateRead(...readArgs);
      value = await cache.getRead(...readArgs);

      expect(value).toBeUndefined();
    });

    it("Invalidates values matching partial params", async () => {
      const cache = new ContractCache({ abi, address, namespace: "test" });
      const readArgs1: ContractReadArgs<Erc20Abi, "allowance"> = [
        "allowance",
        { owner: ALICE, spender: BOB },
      ];
      const readArgs2: ContractReadArgs<Erc20Abi, "allowance"> = [
        "allowance",
        { owner: ALICE, spender: NANCY },
      ];

      await cache.preloadRead({
        fn: readArgs1[0],
        args: readArgs1[1],
        value: 123n,
      });
      await cache.preloadRead({
        fn: readArgs2[0],
        args: readArgs2[1],
        value: 456n,
      });

      let value1 = await cache.getRead(...readArgs1);
      let value2 = await cache.getRead(...readArgs2);

      expect(value1).toBe(123n);
      expect(value2).toBe(456n);

      await cache.invalidateReadsMatching(readArgs1[0]);

      value1 = await cache.getRead(...readArgs1);
      value2 = await cache.getRead(...readArgs2);
      expect(value1).toBeUndefined();
      expect(value2).toBeUndefined();
    });

    describe("clearReads", () => {
      it("Clears all values", async () => {
        const cache = new ContractCache({ abi, address, namespace: "test" });

        await cache.preloadRead({ fn: "symbol", value: "IBN" });
        await cache.preloadRead({ fn: "name", value: "BATTUTA" });
        await cache.preloadRead({ fn: "decimals", value: 24 });

        let values = await Promise.all([
          cache.getRead("symbol"),
          cache.getRead("name"),
          cache.getRead("decimals"),
        ]);
        expect(values).toStrictEqual(["IBN", "BATTUTA", 24]);

        await cache.clearReads();

        values = await Promise.all([
          cache.getRead("symbol"),
          cache.getRead("name"),
          cache.getRead("decimals"),
        ]);
        expect(values).toStrictEqual([undefined, undefined, undefined]);
      });

      it("Doesn't clear unrelated values", async () => {
        const cache = new ContractCache({ abi, address, namespace: "test" });

        await cache.preloadRead({ fn: "symbol", value: "TEST" });
        await cache.preloadEvents({ event: "Approval", value: [] });

        let values = await Promise.all([
          cache.getRead("symbol"),
          cache.getEvents("Approval"),
        ]);
        expect(values).toStrictEqual(["TEST", []]);

        await cache.clearReads();

        values = await Promise.all([
          cache.getRead("symbol"),
          cache.getEvents("Approval"),
        ]);
        expect(values).toStrictEqual([undefined, []]);
      });
    });
  });
});
