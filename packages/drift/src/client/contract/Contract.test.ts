import { MockAdapter } from "src/adapter/MockAdapter";
import { createStubEvents } from "src/adapter/utils/testing/createStubEvent";
import { TestToken } from "src/artifacts/TestToken";
import { createContract } from "src/client/contract/Contract";
import { ALICE, BOB } from "src/utils/testing/accounts";
import { describe, expect, it, vi } from "vitest";

const abi = TestToken.abi;
const address = "0xAddress";
const adapter = new MockAdapter();
adapter.onGetChainId().resolves(0);

describe("Contract", () => {
  describe("getEvents", () => {
    it("can be preloaded", async () => {
      const contract = createContract({ abi, address, adapter });
      const events = createStubEvents({
        abi,
        eventName: "Transfer",
        events: [
          { args: { from: BOB, to: ALICE, value: 123n } },
          { args: { from: ALICE, to: BOB, value: 456n } },
        ],
      });

      contract.cache.preloadEvents({ event: "Transfer", value: events });

      expect(await contract.getEvents("Transfer")).toBe(events);
    });

    describe("epochBlock", () => {
      const event = "Transfer";
      const epochBlock = 123n;
      const eventsAtEpoch = createStubEvents({
        abi,
        eventName: event,
        events: [{ args: { from: ALICE, to: BOB, value: 123n } }],
      });

      it("is used by default if defined", async () => {
        adapter.onGetEvents({ abi, address, event }).resolves([]);
        adapter
          .onGetEvents({ abi, address, event, fromBlock: epochBlock })
          .resolves(eventsAtEpoch);

        const contract = createContract({ abi, address, adapter, epochBlock });
        const returnedEvents = await contract.getEvents(event);

        expect(returnedEvents).toBe(eventsAtEpoch);
      });

      it("is used in place of 'earliest' if defined", async () => {
        adapter
          .onGetEvents({ abi, address, event, fromBlock: "earliest" })
          .resolves([]);
        adapter
          .onGetEvents({ abi, address, event, fromBlock: epochBlock })
          .resolves(eventsAtEpoch);

        const contract = createContract({ abi, address, adapter, epochBlock });
        const returnedEvents = await contract.getEvents(event, {
          fromBlock: "earliest",
        });

        expect(returnedEvents).toBe(eventsAtEpoch);
      });

      it("is used in place of lower block numbers if defined", async () => {
        adapter
          .onGetEvents({ abi, address, event, fromBlock: 0n })
          .resolves([]);
        adapter
          .onGetEvents({ abi, address, event, fromBlock: epochBlock })
          .resolves(eventsAtEpoch);

        const contract = createContract({ abi, address, adapter, epochBlock });
        const returnedEvents = await contract.getEvents(event, {
          fromBlock: 0n,
        });

        expect(returnedEvents).toBe(eventsAtEpoch);
      });
    });
  });

  describe("read", () => {
    it("can be preloaded & invalidated", async () => {
      const contract = createContract({ abi, address, adapter });

      contract.cache.preloadRead({ fn: "symbol", value: "DAI" });
      expect(await contract.read("symbol")).toBe("DAI");

      contract.cache.invalidateRead("symbol");
      await expect(contract.read("symbol")).rejects.toThrow();
    });

    describe("epochBlock", () => {
      const fn = "name";
      const epochBlock = 123n;
      const nameAtEpoch = "Name at Epoch";

      it("is used in place of 'earliest' if defined", async () => {
        adapter
          .onRead({ abi, address, fn, block: "earliest" })
          .resolves("Name at Earliest");
        adapter
          .onRead({ abi, address, fn, block: epochBlock })
          .resolves(nameAtEpoch);

        const contract = createContract({ abi, address, adapter, epochBlock });
        const returnedName = await contract.read(fn, {}, { block: 0n });

        expect(returnedName).toBe(nameAtEpoch);
      });

      it("is used in place of lower block numbers if defined", async () => {
        adapter.onRead({ abi, address, fn, block: 0n }).resolves("Name at 0");
        adapter
          .onRead({ abi, address, fn, block: epochBlock })
          .resolves(nameAtEpoch);

        const contract = createContract({ abi, address, adapter, epochBlock });
        const returnedName = await contract.read(fn, {}, { block: 0n });

        expect(returnedName).toBe(nameAtEpoch);
      });
    });
  });

  it("maintains hooks proxy when extending", async () => {
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
