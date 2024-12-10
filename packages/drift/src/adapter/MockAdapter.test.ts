import { MockAdapter } from "src/adapter/MockAdapter";
import type {
  CallParams,
  DecodeFunctionDataParams,
  DecodeFunctionReturnParams,
  EncodeFunctionDataParams,
  EncodeFunctionReturnParams,
  GetEventsParams,
  ReadParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { EventLog } from "src/adapter/types/Event";
import type { DecodedFunctionData } from "src/adapter/types/Function";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

type Erc20Abi = typeof erc20.abi;

describe("MockAdapter", () => {
  describe("getChainId", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getChainId();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetChainId().resolves(123);
      expect(await adapter.getChainId()).toBe(123);
    });
  });

  describe("getBlock", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getBlock();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const block0 = {
        number: 0n,
        timestamp: 0n,
      } as Block;
      const block1 = {
        number: 1n,
        timestamp: 1n,
      } as Block;
      const block2 = {
        number: 2n,
        timestamp: 2n,
      } as Block;
      adapter.onGetBlock().resolves(block0);
      adapter.onGetBlock({ blockNumber: 1n }).resolves(block1);
      adapter.onGetBlock({ blockNumber: 2n }).resolves(block2);
      expect(await adapter.getBlock()).toBe(block0);
      expect(await adapter.getBlock({ blockNumber: 1n })).toBe(block1);
      expect(await adapter.getBlock({ blockNumber: 2n })).toBe(block2);
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const block = {
        number: 123n,
        timestamp: 123n,
      } as Block;
      adapter.onGetBlock({}).resolves(block);
      expect(await adapter.getBlock({ blockNumber: 123n })).toBe(block);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const block = {
        number: 123n,
        timestamp: 123n,
      } as Block;
      adapter.onGetBlock().resolves(block);
      expect(await adapter.getBlock({ blockNumber: 123n })).toBe(block);
    });
  });

  describe("getBalance", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getBalance({ address: "0x" });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBalance({ address: "0xAlice" }).resolves(1n);
      adapter.onGetBalance({ address: "0xBob" }).resolves(2n);
      expect(await adapter.getBalance({ address: "0xAlice" })).toBe(1n);
      expect(await adapter.getBalance({ address: "0xBob" })).toBe(2n);
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBalance({ address: "0xAlice" }).resolves(1n);
      expect(
        await adapter.getBalance({ address: "0xAlice", block: "latest" }),
      ).toBe(1n);
      expect(
        await adapter.getBalance({ address: "0xAlice", block: 123n }),
      ).toBe(1n);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBalance().resolves(123n);
      expect(await adapter.getBalance({ address: "0x" })).toBe(123n);
    });
  });

  describe("getTransaction", () => {
    it("Resolves to undefined by default", async () => {
      const adapter = new MockAdapter();
      expect(await adapter.getTransaction({ hash: "0x" })).toBeUndefined();
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const transaction1: Transaction = {
        input: "0x1",
        blockNumber: 123n,
        gas: 123n,
        gasPrice: 123n,
        nonce: 123n,
        type: "0x123",
        value: 123n,
      };
      const transaction2: Transaction = {
        ...transaction1,
        input: "0x2",
      };
      adapter.onGetTransaction({ hash: "0x1" }).resolves(transaction1);
      adapter.onGetTransaction({ hash: "0x2" }).resolves(transaction2);
      expect(await adapter.getTransaction({ hash: "0x1" })).toBe(transaction1);
      expect(await adapter.getTransaction({ hash: "0x2" })).toBe(transaction2);
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const transaction: Transaction = {
        blockNumber: 123n,
        gas: 123n,
        gasPrice: 123n,
        input: "0x",
        nonce: 123n,
        type: "0x123",
        value: 123n,
      };
      adapter.onGetTransaction({}).resolves(transaction);
      expect(await adapter.getTransaction({ hash: "0x" })).toBe(transaction);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const transaction: Transaction = {
        blockNumber: 123n,
        gas: 123n,
        gasPrice: 123n,
        input: "0x",
        nonce: 123n,
        type: "0x123",
        value: 123n,
      };
      adapter.onGetTransaction().resolves(transaction);
      expect(await adapter.getTransaction({ hash: "0x" })).toBe(transaction);
    });
  });

  describe("waitForTransaction", () => {
    it("Resolves to undefined by default", async () => {
      const adapter = new MockAdapter();
      expect(
        adapter.waitForTransaction({ hash: "0x" }),
      ).resolves.toBeUndefined();
    });

    it("Can be stubbed with specific params", async () => {
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
        transactionIndex: 123n,
      };
      const receipt2: TransactionReceipt = {
        ...receipt1,
        transactionHash: "0x2",
      };
      adapter.onWaitForTransaction({ hash: "0x1" }).resolves(receipt1);
      adapter.onWaitForTransaction({ hash: "0x2" }).resolves(receipt2);
      expect(await adapter.waitForTransaction({ hash: "0x1" })).toBe(receipt1);
      expect(await adapter.waitForTransaction({ hash: "0x2" })).toBe(receipt2);
    });

    it("Can be stubbed with partial params", async () => {
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
        transactionIndex: 123n,
      };
      adapter.onWaitForTransaction({ hash: "0x" }).resolves(receipt);
      expect(
        await adapter.waitForTransaction({ hash: "0x", timeout: 10_000 }),
      ).toBe(receipt);
    });

    it("Can be called with args after being stubbed with no args", async () => {
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
        transactionIndex: 123n,
      };
      adapter.onWaitForTransaction().resolves(receipt);
      expect(await adapter.waitForTransaction({ hash: "0x" })).toBe(receipt);
    });
  });

  describe("encodeFunctionData", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.encodeFunctionData({
          abi: erc20.abi,
          fn: "balanceOf",
          args: { account: "0x" },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: EncodeFunctionDataParams<Erc20Abi, "balanceOf"> = {
        abi: erc20.abi,
        fn: "balanceOf",
        args: { account: "0x1" },
      };
      const params2: EncodeFunctionDataParams<Erc20Abi, "balanceOf"> = {
        ...params1,
        args: { account: "0x2" },
      };
      adapter.onEncodeFunctionData(params1).returns("0x1");
      adapter.onEncodeFunctionData(params2).returns("0x2");
      expect(adapter.encodeFunctionData(params1)).toBe("0x1");
      expect(adapter.encodeFunctionData(params2)).toBe("0x2");
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onEncodeFunctionData({
          abi: erc20.abi,
          fn: "balanceOf",
        })
        .returns("0x123");
      expect(
        adapter.encodeFunctionData({
          abi: erc20.abi,
          fn: "balanceOf",
          args: { account: "0x" },
        }),
      ).toBe("0x123");
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onEncodeFunctionData().returns("0x123");
      expect(
        adapter.encodeFunctionData({
          abi: erc20.abi,
          fn: "balanceOf",
          args: { account: "0x" },
        }),
      ).toBe("0x123");
    });
  });

  describe("encodeFunctionReturn", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.encodeFunctionReturn({
          abi: erc20.abi,
          fn: "balanceOf",
          value: 123n,
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: EncodeFunctionReturnParams<Erc20Abi, "balanceOf"> = {
        abi: erc20.abi,
        fn: "balanceOf",
        value: 123n,
      };
      const params2: EncodeFunctionReturnParams<Erc20Abi, "balanceOf"> = {
        ...params1,
        value: 456n,
      };
      adapter.onEncodeFunctionReturn(params1).returns("0x1");
      adapter.onEncodeFunctionReturn(params2).returns("0x2");
      expect(adapter.encodeFunctionReturn(params1)).toBe("0x1");
      expect(adapter.encodeFunctionReturn(params2)).toBe("0x2");
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onEncodeFunctionReturn({
          abi: erc20.abi,
          fn: "balanceOf",
        })
        .returns("0x123");
      expect(
        adapter.encodeFunctionReturn({
          abi: erc20.abi,
          fn: "balanceOf",
          value: 123n,
        }),
      ).toBe("0x123");
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onEncodeFunctionReturn().returns("0x123");
      expect(
        adapter.encodeFunctionReturn({
          abi: erc20.abi,
          fn: "balanceOf",
          value: 123n,
        }),
      ).toBe("0x123");
    });
  });

  describe("decodeFunctionData", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        adapter.decodeFunctionData({
          abi: erc20.abi,
          fn: "balanceOf",
          data: "0x",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: DecodeFunctionDataParams<Erc20Abi, "balanceOf"> = {
        abi: erc20.abi,
        fn: "balanceOf",
        data: "0x1",
      };
      const return1: DecodedFunctionData<Erc20Abi, "balanceOf"> = {
        functionName: "balanceOf",
        args: { account: "0x1" },
      };
      const params2: DecodeFunctionDataParams<Erc20Abi, "balanceOf"> = {
        ...params1,
        data: "0x2",
      };
      const return2: DecodedFunctionData<Erc20Abi, "balanceOf"> = {
        functionName: "balanceOf",
        args: { account: "0x2" },
      };
      adapter.onDecodeFunctionData(params1).returns(return1);
      adapter.onDecodeFunctionData(params2).returns(return2);
      expect(adapter.decodeFunctionData(params1)).toBe(return1);
      expect(adapter.decodeFunctionData(params2)).toBe(return2);
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const decoded: DecodedFunctionData<Erc20Abi, "balanceOf"> = {
        functionName: "balanceOf",
        args: { account: "0x1" },
      };
      adapter
        .onDecodeFunctionData({
          abi: erc20.abi,
          fn: "balanceOf",
        })
        .returns(decoded);
      expect(
        adapter.decodeFunctionData({
          abi: erc20.abi,
          fn: "balanceOf",
          data: "0x1",
        }),
      ).toBe(decoded);
    });
  });

  describe("decodeFunctionReturn", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        adapter.decodeFunctionReturn({
          abi: erc20.abi,
          fn: "balanceOf",
          data: "0x",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: DecodeFunctionReturnParams<Erc20Abi, "balanceOf"> = {
        abi: erc20.abi,
        fn: "balanceOf",
        data: "0x1",
      };
      const params2: DecodeFunctionReturnParams<Erc20Abi, "balanceOf"> = {
        ...params1,
        data: "0x2",
      };
      adapter.onDecodeFunctionReturn(params1).returns(123n);
      adapter.onDecodeFunctionReturn(params2).returns(456n);
      expect(adapter.decodeFunctionReturn(params1)).toBe(123n);
      expect(adapter.decodeFunctionReturn(params2)).toBe(456n);
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onDecodeFunctionReturn({
          abi: erc20.abi,
          fn: "balanceOf",
        })
        .returns(123n);
      expect(
        adapter.decodeFunctionReturn({
          abi: erc20.abi,
          fn: "balanceOf",
          data: "0x1",
        }),
      ).toBe(123n);
    });
  });

  describe("call", () => {
    it("Rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.call({
          to: "0x",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: CallParams = {
        to: "0x1",
      };
      const params2: CallParams = {
        to: "0x2",
      };
      adapter.onCall(params1).resolves("0xA");
      adapter.onCall(params2).resolves("0xB");
      expect(await adapter.call(params1)).toBe("0xA");
      expect(await adapter.call(params2)).toBe("0xB");
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onCall({
          to: "0x1",
        })
        .resolves("0xA");
      expect(
        await adapter.call({
          to: "0x1",
          data: "0x2",
        }),
      ).toBe("0xA");
    });
  });

  describe("getEvents", () => {
    it("Rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getEvents({
          abi: erc20.abi,
          address: "0x",
          event: "Transfer",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: GetEventsParams<Erc20Abi, "Transfer"> = {
        abi: erc20.abi,
        address: "0x1",
        event: "Transfer",
        filter: { from: "0x1" },
      };
      const params2: GetEventsParams<Erc20Abi, "Transfer"> = {
        ...params1,
        filter: { from: "0x2" },
      };
      const events1: EventLog<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x1",
            to: "0x1",
            value: 123n,
          },
        },
      ];
      const events2: EventLog<Erc20Abi, "Transfer">[] = [
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

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const events: EventLog<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x1",
            to: "0x1",
            value: 123n,
          },
        },
      ];
      adapter
        .onGetEvents({
          abi: erc20.abi,
          event: "Transfer",
        })
        .resolves(events);
      expect(
        await adapter.getEvents({
          abi: erc20.abi,
          address: "0x1",
          event: "Transfer",
          filter: { from: "0x1" },
        }),
      ).toBe(events);
    });
  });

  describe("read", () => {
    it("Rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.read({
          abi: erc20.abi,
          address: "0x",
          fn: "symbol",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: ReadParams<Erc20Abi, "allowance"> = {
        abi: erc20.abi,
        address: "0x1",
        fn: "allowance",
        args: { owner: "0x1", spender: "0x1" },
      };
      const params2: ReadParams<Erc20Abi, "allowance"> = {
        ...params1,
        args: { owner: "0x2", spender: "0x2" },
      };
      adapter.onRead(params1).resolves(1n);
      adapter.onRead(params2).resolves(2n);
      expect(await adapter.read(params1)).toBe(1n);
      expect(await adapter.read(params2)).toBe(2n);
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onRead({
          abi: erc20.abi,
          fn: "balanceOf",
        })
        .resolves(123n);
      expect(
        await adapter.read({
          abi: erc20.abi,
          address: "0x",
          fn: "balanceOf",
          args: { account: "0x" },
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
          abi: erc20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: WriteParams<Erc20Abi, "transfer"> = {
        abi: erc20.abi,
        address: "0x1",
        fn: "transfer",
        args: { to: "0x1", amount: 123n },
      };
      const params2: WriteParams<Erc20Abi, "transfer"> = {
        ...params1,
        args: { to: "0x2", amount: 123n },
      };
      adapter.onSimulateWrite(params1).resolves(true);
      adapter.onSimulateWrite(params2).resolves(false);
      expect(await adapter.simulateWrite(params1)).toBe(true);
      expect(await adapter.simulateWrite(params2)).toBe(false);
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSimulateWrite({
          abi: erc20.abi,
          fn: "transfer",
        })
        .resolves(true);
      expect(
        await adapter.simulateWrite({
          abi: erc20.abi,
          address: "0x1",
          fn: "transfer",
          args: { to: "0x1", amount: 123n },
        }),
      ).toBe(true);
    });
  });

  describe("write", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.write({
          abi: erc20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: WriteParams<Erc20Abi, "transfer"> = {
        abi: erc20.abi,
        address: "0x",
        fn: "transfer",
        args: { to: "0x1", amount: 123n },
      };
      const params2: WriteParams<Erc20Abi, "transfer"> = {
        ...params1,
        args: { to: "0x2", amount: 123n },
      };
      adapter.onWrite(params1).resolves("0x1");
      adapter.onWrite(params2).resolves("0x2");
      expect(await adapter.write(params1)).toBe("0x1");
      expect(await adapter.write(params2)).toBe("0x2");
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onWrite({
          abi: erc20.abi,
          fn: "transfer",
        })
        .resolves("0x123");
      expect(
        await adapter.write({
          abi: erc20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onWrite().resolves("0x123");
      expect(
        await adapter.write({
          abi: erc20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });
  });

  describe("getSignerAddress", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getSignerAddress();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetSignerAddress().resolves("0x123");
      expect(await adapter.getSignerAddress()).toBe("0x123");
    });
  });
});
