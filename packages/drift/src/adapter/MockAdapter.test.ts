import { MockAdapter } from "src/adapter/MockAdapter";
import type { Event } from "src/adapter/contract/types/event";
import type { Block } from "src/adapter/network/types/Block";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/network/types/Transaction";
import type {
  DecodeFunctionDataParams,
  EncodeFunctionDataParams,
  GetEventsParams,
  ReadParams,
  WriteParams,
} from "src/adapter/types";
import { IERC20 } from "src/utils/testing/IERC20";
import { describe, expect, it } from "vitest";

describe("MockAdapter", () => {
  describe("getBalance", () => {
    it("Resolves to a default value", async () => {
      const adapter = new MockAdapter();
      expect(await adapter.getBalance("0x0")).toBeTypeOf("bigint");
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBalance().resolves(123n);
      expect(await adapter.getBalance("0x")).toBe(123n);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const defaultValue = await adapter.getBalance("0x");
      adapter.onGetBalance("0xAlice").resolves(defaultValue + 1n);
      adapter.onGetBalance("0xBob").resolves(defaultValue + 2n);
      expect(await adapter.getBalance("0xAlice")).toBe(defaultValue + 1n);
      expect(await adapter.getBalance("0xBob")).toBe(defaultValue + 2n);
    });
  });

  describe("getBlock", () => {
    it("Resolves to a default value", async () => {
      const adapter = new MockAdapter();
      expect(adapter.getBlock()).resolves.toEqual({
        blockNumber: expect.any(BigInt),
        timestamp: expect.any(BigInt),
      });
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      const block: Block = {
        blockNumber: 123n,
        timestamp: 123n,
      };
      adapter.onGetBlock().resolves(block);
      expect(await adapter.getBlock()).toBe(block);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const { blockNumber, timestamp = 0n } = (await adapter.getBlock()) ?? {};
      const block1: Block = {
        blockNumber: blockNumber ?? 0n + 1n,
        timestamp: timestamp + 1n,
      };
      const block2: Block = {
        blockNumber: blockNumber ?? 0n + 2n,
        timestamp: timestamp + 2n,
      };
      adapter.onGetBlock({ blockNumber: 1n }).resolves(block1);
      adapter.onGetBlock({ blockNumber: 2n }).resolves(block2);
      expect(await adapter.getBlock({ blockNumber: 1n })).toBe(block1);
      expect(await adapter.getBlock({ blockNumber: 2n })).toBe(block2);
    });
  });

  describe("getChainId", () => {
    it("Resolves to a default value", async () => {
      const adapter = new MockAdapter();
      expect(await adapter.getChainId()).toBeTypeOf("number");
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetChainId().resolves(123);
      expect(await adapter.getChainId()).toBe(123);
    });
  });

  describe("getTransaction", () => {
    it("Resolves to undefined by default", async () => {
      const adapter = new MockAdapter();
      expect(await adapter.getTransaction("0x")).toBeUndefined();
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      const transaction: Transaction = {
        blockNumber: 123n,
        gas: 123n,
        gasPrice: 123n,
        input: "0x",
        nonce: 123,
        type: "0x123",
        value: 123n,
      };
      adapter.onGetTransaction().resolves(transaction);
      expect(await adapter.getTransaction("0x")).toBe(transaction);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const transaction1: Transaction = {
        input: "0x1",
        blockNumber: 123n,
        gas: 123n,
        gasPrice: 123n,
        nonce: 123,
        type: "0x123",
        value: 123n,
      };
      const transaction2: Transaction = {
        ...transaction1,
        input: "0x2",
      };
      adapter.onGetTransaction("0x1").resolves(transaction1);
      adapter.onGetTransaction("0x2").resolves(transaction2);
      expect(await adapter.getTransaction("0x1")).toBe(transaction1);
      expect(await adapter.getTransaction("0x2")).toBe(transaction2);
    });
  });

  describe("waitForTransaction", () => {
    it("Resolves to undefined by default", async () => {
      const adapter = new MockAdapter();
      expect(adapter.waitForTransaction("0x")).resolves.toBeUndefined();
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      const receipt: TransactionReceipt = {
        blockNumber: 123n,
        blockHash: "0x",
        cumulativeGasUsed: 123n,
        effectiveGasPrice: 123n,
        from: "0x",
        gasUsed: 123n,
        logsBloom: "0x",
        status: "success",
        to: "0x",
        transactionHash: "0x",
        transactionIndex: 123,
      };
      adapter.onWaitForTransaction().resolves(receipt);
      expect(await adapter.waitForTransaction("0x")).toBe(receipt);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const receipt1: TransactionReceipt = {
        transactionHash: "0x1",
        blockNumber: 123n,
        blockHash: "0x",
        cumulativeGasUsed: 123n,
        effectiveGasPrice: 123n,
        from: "0x",
        gasUsed: 123n,
        logsBloom: "0x",
        status: "success",
        to: "0x",
        transactionIndex: 123,
      };
      const receipt2: TransactionReceipt = {
        ...receipt1,
        transactionHash: "0x2",
      };
      adapter.onWaitForTransaction("0x1").resolves(receipt1);
      adapter.onWaitForTransaction("0x2").resolves(receipt2);
      expect(await adapter.waitForTransaction("0x1")).toBe(receipt1);
      expect(await adapter.waitForTransaction("0x2")).toBe(receipt2);
    });
  });

  describe("encodeFunctionData", () => {
    it("Returns a default value", async () => {
      const adapter = new MockAdapter();
      expect(
        adapter.encodeFunctionData({
          abi: IERC20.abi,
          fn: "balanceOf",
          args: { owner: "0x" },
        }),
      ).toBeTypeOf("string");
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter
        .onEncodeFunctionData({
          abi: IERC20.abi,
          fn: "balanceOf",
          args: { owner: "0x" },
        })
        .returns("0x123");
      expect(
        adapter.encodeFunctionData({
          abi: IERC20.abi,
          fn: "balanceOf",
          args: { owner: "0x" },
        }),
      ).toBe("0x123");
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: EncodeFunctionDataParams<typeof IERC20.abi, "balanceOf"> =
        {
          abi: IERC20.abi,
          fn: "balanceOf",
          args: { owner: "0x1" },
        };
      const params2: EncodeFunctionDataParams<typeof IERC20.abi, "balanceOf"> =
        {
          ...params1,
          args: { owner: "0x2" },
        };
      adapter.onEncodeFunctionData(params1).returns("0x1");
      adapter.onEncodeFunctionData(params2).returns("0x2");
      expect(adapter.encodeFunctionData(params1)).toBe("0x1");
      expect(adapter.encodeFunctionData(params2)).toBe("0x2");
    });
  });

  describe("decodeFunctionData", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        adapter.decodeFunctionData({
          abi: IERC20.abi,
          fn: "balanceOf",
          data: "0x",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter
        .onDecodeFunctionData({
          abi: IERC20.abi,
          fn: "balanceOf",
          data: "0x",
        })
        .returns(123n);
      expect(
        adapter.decodeFunctionData({
          abi: IERC20.abi,
          fn: "balanceOf",
          data: "0x",
        }),
      ).toBe(123n);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: DecodeFunctionDataParams<typeof IERC20.abi, "balanceOf"> =
        {
          abi: IERC20.abi,
          fn: "balanceOf",
          data: "0x1",
        };
      const params2: DecodeFunctionDataParams<typeof IERC20.abi, "balanceOf"> =
        {
          ...params1,
          data: "0x2",
        };
      adapter.onDecodeFunctionData(params1).returns(1n);
      adapter.onDecodeFunctionData(params2).returns(2n);
      expect(adapter.decodeFunctionData(params1)).toBe(1n);
      expect(adapter.decodeFunctionData(params2)).toBe(2n);
    });
  });

  describe("getEvents", () => {
    it("Rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getEvents({
          abi: IERC20.abi,
          address: "0x",
          event: "Transfer",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      const events: Event<typeof IERC20.abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x",
            to: "0x",
            value: 123n,
          },
        },
      ];
      adapter
        .onGetEvents({
          abi: IERC20.abi,
          address: "0x",
          event: "Transfer",
        })
        .resolves(events);
      expect(
        await adapter.getEvents({
          abi: IERC20.abi,
          address: "0x",
          event: "Transfer",
        }),
      ).toBe(events);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: GetEventsParams<typeof IERC20.abi, "Transfer"> = {
        abi: IERC20.abi,
        address: "0x1",
        event: "Transfer",
        filter: { from: "0x1" },
      };
      const params2: GetEventsParams<typeof IERC20.abi, "Transfer"> = {
        ...params1,
        filter: { from: "0x2" },
      };
      const events1: Event<typeof IERC20.abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x1",
            to: "0x1",
            value: 123n,
          },
        },
      ];
      const events2: Event<typeof IERC20.abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x2",
            to: "0x2",
            value: 123n,
          },
        },
      ];
      adapter.onGetEvents(params1).resolves(events1);
      adapter.onGetEvents(params2).resolves(events2);
      expect(await adapter.getEvents(params1)).toBe(events1);
      expect(await adapter.getEvents(params2)).toBe(events2);
    });
  });

  describe("read", () => {
    it("Rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.read({
          abi: IERC20.abi,
          address: "0x",
          fn: "symbol",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter
        .onRead({
          abi: IERC20.abi,
          address: "0x",
          fn: "symbol",
        })
        .resolves("ABC");
      expect(
        await adapter.read({
          abi: IERC20.abi,
          address: "0x",
          fn: "symbol",
        }),
      ).toBe("ABC");
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: ReadParams<typeof IERC20.abi, "allowance"> = {
        abi: IERC20.abi,
        address: "0x1",
        fn: "allowance",
        args: { owner: "0x1", spender: "0x1" },
      };
      const params2: ReadParams<typeof IERC20.abi, "allowance"> = {
        ...params1,
        args: { owner: "0x2", spender: "0x2" },
      };
      adapter.onRead(params1).resolves(1n);
      adapter.onRead(params2).resolves(2n);
      expect(await adapter.read(params1)).toBe(1n);
      expect(await adapter.read(params2)).toBe(2n);
    });

    it.todo("Can be stubbed with partial args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onRead({
          abi: IERC20.abi,
          address: "0x",
          fn: "balanceOf",
        })
        .resolves(123n);
      expect(
        await adapter.read({
          abi: IERC20.abi,
          address: "0x",
          fn: "balanceOf",
          args: { owner: "0x" },
        }),
      ).toBe(123n);
    });
  });

  describe("simulateWrite", () => {
    it("Rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.simulateWrite({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", value: 123n },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSimulateWrite({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", value: 123n },
        })
        .resolves(true);
      expect(
        await adapter.simulateWrite({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", value: 123n },
        }),
      ).toBe(true);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: WriteParams<typeof IERC20.abi, "transfer"> = {
        abi: IERC20.abi,
        address: "0x1",
        fn: "transfer",
        args: { to: "0x1", value: 123n },
      };
      const params2: WriteParams<typeof IERC20.abi, "transfer"> = {
        ...params1,
        args: { to: "0x2", value: 123n },
      };
      adapter.onSimulateWrite(params1).resolves(true);
      adapter.onSimulateWrite(params2).resolves(false);
      expect(await adapter.simulateWrite(params1)).toBe(true);
      expect(await adapter.simulateWrite(params2)).toBe(false);
    });
  });

  describe("write", () => {
    it("Returns a default value", async () => {
      const adapter = new MockAdapter();
      expect(
        await adapter.write({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", value: 123n },
        }),
      ).toBeTypeOf("string");
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter
        .onWrite({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", value: 123n },
        })
        .returns("0x123");
      expect(
        await adapter.write({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", value: 123n },
        }),
      ).toBe("0x123");
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: WriteParams<typeof IERC20.abi, "transfer"> = {
        abi: IERC20.abi,
        address: "0x",
        fn: "transfer",
        args: { to: "0x1", value: 123n },
      };
      const params2: WriteParams<typeof IERC20.abi, "transfer"> = {
        ...params1,
        args: { to: "0x2", value: 123n },
      };
      adapter.onWrite(params1).returns("0x1");
      adapter.onWrite(params2).returns("0x2");
      expect(await adapter.write(params1)).toBe("0x1");
      expect(await adapter.write(params2)).toBe("0x2");
    });
  });

  describe("getSignerAddress", () => {
    it("Returns a default value", async () => {
      const adapter = new MockAdapter();
      expect(await adapter.getSignerAddress()).toBeTypeOf("string");
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetSignerAddress().resolves("0x123");
      expect(await adapter.getSignerAddress()).toBe("0x123");
    });
  });
});
