import type { EventLog } from "src/adapter/types/Event";
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
    it("Namespaces event keys", async () => {
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

    it("Preloads events", async () => {
      const cache = new ContractCache({ abi, address, namespace: "test" });
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

      await cache.preloadEvents({
        event: "Approval",
        value: events,
      });
      const key = await cache.eventsKey("Approval");
      const value = await cache.store.get(key);

      expect(value).toStrictEqual(events);
    });
  });

  describe("Reads", () => {
    it("Namespaces read keys", async () => {
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

    it("Preloads reads", async () => {
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
      const key = await cache.readKey(...readArgs);
      const value = await cache.store.get(key);

      expect(value).toStrictEqual(123n);
    });

    it("Invalidates reads", async () => {
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
      const key = await cache.readKey(...readArgs);
      let value = await cache.store.get(key);

      expect(value).toBe(123n);

      await cache.invalidateRead(...readArgs);
      value = await cache.store.get(key);

      expect(value).toBeUndefined();
    });

    it("Invalidates reads matching partial params", async () => {
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

      const key1 = await cache.readKey(...readArgs1);
      const key2 = await cache.readKey(...readArgs2);
      let value1 = await cache.store.get(key1);
      let value2 = await cache.store.get(key2);

      expect(value1).toBe(123n);
      expect(value2).toBe(456n);

      await cache.invalidateReadsMatching(readArgs1[0]);

      value1 = await cache.store.get(key1);
      value2 = await cache.store.get(key2);
      expect(value1).toBeUndefined();
      expect(value2).toBeUndefined();
    });
  });
});
