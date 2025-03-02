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

  it("Preloads events", async () => {
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

    contract.preloadEvents({ event: "Transfer", value: events });
    expect(await contract.getEvents("Transfer")).toBe(events);
  });

  it("Preloads reads", async () => {
    const contract = createContract({ abi, address, adapter });
    contract.preloadRead({ fn: "symbol", value: "DAI" });
    expect(await contract.read("symbol")).toBe("DAI");
  });

  it("Invalidates reads", async () => {
    const contract = createContract({ abi, address, adapter });

    contract.preloadRead({ fn: "symbol", value: "DAI" });
    expect(await contract.read("symbol")).toBe("DAI");

    contract.invalidateRead("symbol");
    await expect(contract.read("symbol")).rejects.toThrow();
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
