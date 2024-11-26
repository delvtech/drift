import type { EventLog } from "src/adapter/types/Event";
import { MockContract } from "src/client/contract/MockContract";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

const abi = erc20.abi;
type Erc20Abi = typeof abi;

describe("Contract", () => {
  it("Preloads events", async () => {
    const contract = new MockContract({ abi });

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

    contract.preloadEvents({ event: "Transfer", value: events });
    expect(await contract.getEvents("Transfer")).toBe(events);
  });

  it("Preloads reads", async () => {
    const contract = new MockContract({ abi });
    contract.preloadRead({ fn: "symbol", value: "DAI" });
    expect(await contract.read("symbol")).toBe("DAI");
  });

  it("Invalidates reads", async () => {
    const contract = new MockContract({ abi });

    contract.preloadRead({ fn: "symbol", value: "DAI" });
    expect(await contract.read("symbol")).toBe("DAI");

    contract.invalidateRead("symbol");
    expect(contract.read("symbol")).rejects.toThrow();
  });
});
