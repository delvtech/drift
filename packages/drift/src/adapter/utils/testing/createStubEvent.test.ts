import type { EventLog } from "src/adapter/types/Event";
import {
  createStubEvent,
  createStubEvents,
} from "src/adapter/utils/testing/createStubEvent";
import { IERC20 } from "src/artifacts/IERC20";
import { HEX_REGEX } from "src/utils/hex";
import { describe, expect, it } from "vitest";

describe("createStubEvent", () => {
  it("creates a stub event", () => {
    const event = createStubEvent({
      abi: IERC20.abi,
      eventName: "Transfer",
      args: {
        from: "0xBob",
        to: "0xAlice",
        value: 100n,
      },
    });
    expect(event).toStrictEqual({
      address: expect.stringMatching(HEX_REGEX),
      args: {
        from: "0xBob",
        to: "0xAlice",
        value: 100n,
      },
      blockHash: expect.stringMatching(HEX_REGEX),
      blockNumber: expect.any(BigInt),
      data: expect.stringMatching(HEX_REGEX),
      eventName: "Transfer",
      logIndex: expect.any(Number),
      removed: expect.any(Boolean),
      topics: expect.any(Array),
      transactionHash: expect.stringMatching(HEX_REGEX),
      transactionIndex: expect.any(Number),
    } satisfies EventLog<typeof IERC20.abi, "Transfer">);
  });
});

describe("createStubEvents", () => {
  it("creates multiple stub events", () => {
    const events = createStubEvents({
      abi: IERC20.abi,
      eventName: "Transfer",
      events: [
        {
          args: {
            from: "0xAlice",
            to: "0xBob",
            value: 123n,
          },
        },
        {
          args: {
            from: "0xBob",
            to: "0xAlice",
            value: 456n,
          },
        },
      ],
    });
    expect(events).toStrictEqual([
      {
        address: expect.stringMatching(HEX_REGEX),
        args: {
          from: "0xAlice",
          to: "0xBob",
          value: 123n,
        },
        blockHash: expect.stringMatching(HEX_REGEX),
        blockNumber: expect.any(BigInt),
        data: expect.stringMatching(HEX_REGEX),
        eventName: "Transfer",
        logIndex: expect.any(Number),
        removed: expect.any(Boolean),
        topics: expect.any(Array),
        transactionHash: expect.stringMatching(HEX_REGEX),
        transactionIndex: expect.any(Number),
      },
      {
        address: expect.stringMatching(HEX_REGEX),
        args: {
          from: "0xBob",
          to: "0xAlice",
          value: 456n,
        },
        blockHash: expect.stringMatching(HEX_REGEX),
        blockNumber: expect.any(BigInt),
        data: expect.stringMatching(HEX_REGEX),
        eventName: "Transfer",
        logIndex: expect.any(Number),
        removed: expect.any(Boolean),
        topics: expect.any(Array),
        transactionHash: expect.stringMatching(HEX_REGEX),
        transactionIndex: expect.any(Number),
      },
    ] satisfies EventLog<typeof IERC20.abi, "Transfer">[]);
  });
});
