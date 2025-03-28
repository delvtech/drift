import { MockAdapter } from "src/adapter/MockAdapter";
import type { EventLog } from "src/adapter/types/Event";
import { IERC20 } from "src/artifacts/IERC20";
import { createContract } from "src/client/contract/Contract";
import { describe, expect, it, vi } from "vitest";

describe("Contract", () => {
  const abi = IERC20.abi;
  type Erc20Abi = typeof abi;
  const address = "0xAddress";
  const adapter = new MockAdapter();
  adapter.onGetChainId().resolves(0);

  describe("getEvents", () => {
    it("Can be preloaded", async () => {
      const contract = createContract({ abi, address, adapter });

      const events: EventLog<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0xBob",
            to: "0xAlice",
            value: 100n,
          },
        },
        {
          eventName: "Transfer",
          args: {
            from: "0xAlice",
            to: "0xBob",
            value: 120n,
          },
        },
      ];

      contract.cache.preloadEvents({ event: "Transfer", value: events });
      expect(await contract.getEvents("Transfer")).toBe(events);
    });

    describe("epochBlock", () => {
      const epochBlock = 123n;
      const eventsAtEpoch: EventLog<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0xBob",
            to: "0xAlice",
            value: 100n,
          },
        },
      ];

      it("Is used by default if defined", async () => {
        adapter
          .onGetEvents({
            abi,
            address,
            event: "Transfer",
          })
          .resolves([]);
        adapter
          .onGetEvents({
            abi,
            address,
            event: "Transfer",
            fromBlock: epochBlock,
          })
          .resolves(eventsAtEpoch);
        const contract = createContract({
          abi,
          address,
          adapter,
          epochBlock,
        });

        const returnedEvents = await contract.getEvents("Transfer");
        expect(returnedEvents).toBe(eventsAtEpoch);
      });

      it("Is used in place of 'earliest' if defined", async () => {
        adapter
          .onGetEvents({
            abi,
            address,
            event: "Transfer",
            fromBlock: "earliest",
          })
          .resolves([]);
        adapter
          .onGetEvents({
            abi,
            address,
            event: "Transfer",
            fromBlock: epochBlock,
          })
          .resolves(eventsAtEpoch);
        const contract = createContract({
          abi,
          address,
          adapter,
          epochBlock,
        });

        const returnedEvents = await contract.getEvents("Transfer", {
          fromBlock: "earliest",
        });
        expect(returnedEvents).toBe(eventsAtEpoch);
      });

      it("Is used in place of lower block numbers if defined", async () => {
        adapter
          .onGetEvents({
            abi,
            address,
            event: "Transfer",
            fromBlock: 0n,
          })
          .resolves([]);
        adapter
          .onGetEvents({
            abi,
            address,
            event: "Transfer",
            fromBlock: epochBlock,
          })
          .resolves(eventsAtEpoch);
        const contract = createContract({
          abi,
          address,
          adapter,
          epochBlock,
        });

        const returnedEvents = await contract.getEvents("Transfer", {
          fromBlock: 0n,
        });
        expect(returnedEvents).toBe(eventsAtEpoch);
      });
    });
  });

  describe("read", () => {
    it("Can be preloaded & invalidated", async () => {
      const contract = createContract({ abi, address, adapter });

      contract.cache.preloadRead({ fn: "symbol", value: "DAI" });
      expect(await contract.read("symbol")).toBe("DAI");

      contract.cache.invalidateRead("symbol");
      await expect(contract.read("symbol")).rejects.toThrow();
    });

    describe("epochBlock", () => {
      const epochBlock = 123n;
      const nameAtEpoch = "Name at Epoch";

      it("Is used in place of 'earliest' if defined", async () => {
        adapter
          .onRead({
            abi,
            address,
            fn: "name",
            block: "earliest",
          })
          .resolves("Name at Earliest");
        adapter
          .onRead({
            abi,
            address,
            fn: "name",
            block: epochBlock,
          })
          .resolves(nameAtEpoch);
        const contract = createContract({
          abi,
          address,
          adapter,
          epochBlock,
        });

        const returnedName = await contract.read("name", {}, { block: 0n });
        expect(returnedName).toBe(nameAtEpoch);
      });

      it("Is used in place of lower block numbers if defined", async () => {
        adapter
          .onRead({
            abi,
            address,
            fn: "name",
            block: 0n,
          })
          .resolves("Name at 0");
        adapter
          .onRead({
            abi,
            address,
            fn: "name",
            block: epochBlock,
          })
          .resolves(nameAtEpoch);
        const contract = createContract({
          abi,
          address,
          adapter,
          epochBlock,
        });

        const returnedName = await contract.read("name", {}, { block: 0n });
        expect(returnedName).toBe(nameAtEpoch);
      });
    });
  });

  it("Maintains hooks proxy when extending", async () => {
    const contract = createContract({ abi, address, adapter }).extend({
      foo() {},
    });
    const beforeHandler = vi.fn(async ({ resolve }) => resolve());
    const afterHandler = vi.fn();

    contract.client.hooks.on("before:read", beforeHandler);
    contract.client.hooks.on("after:read", afterHandler);
    await contract.read("symbol");

    expect(beforeHandler).toHaveBeenCalledTimes(1);
    expect(afterHandler).toHaveBeenCalledTimes(1);
  });
});
