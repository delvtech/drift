import type {
  CallParams,
  GetEventsParams,
  ReadParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import type { EventLog } from "src/adapter/types/Event";
import type {
  Transaction,
  TransactionReceipt,
} from "src/adapter/types/Transaction";
import { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
import { IERC20 } from "src/artifacts/IERC20";
import { createMockClient } from "src/client/MockClient";
import { describe, expect, it } from "vitest";

type Erc20Abi = typeof IERC20.abi;

describe("MockClient", () => {
  describe("getChainId", () => {
    it("Can be stubbed", async () => {
      const client = createMockClient();
      client.onGetChainId().resolves(123);
      expect(await client.getChainId()).toBe(123);
    });
  });

  describe("getBlockNumber", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.getBlockNumber();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const client = createMockClient();
      client.onGetBlockNumber().resolves(123n);
      expect(await client.getBlockNumber()).toBe(123n);
    });
  });

  describe("getBlock", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.getBlock();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
      const block0 = createStubBlock({
        number: 0n,
        timestamp: 0n,
      });
      const block1 = createStubBlock({
        number: 1n,
        timestamp: 1n,
      });
      const block2 = createStubBlock({
        number: 2n,
        timestamp: 2n,
      });
      client.onGetBlock().resolves(block0);
      client.onGetBlock(1n).resolves(block1);
      client.onGetBlock(2n).resolves(block2);
      expect(await client.getBlock()).toBe(block0);
      expect(await client.getBlock(1n)).toBe(block1);
      expect(await client.getBlock(2n)).toBe(block2);
    });

    it("Can be stubbed with no params", async () => {
      const client = createMockClient();
      const block = {
        number: 123n,
        timestamp: 123n,
      } as Block;
      client.onGetBlock().resolves(block);
      expect(await client.getBlock(123n)).toBe(block);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
      const block = {
        number: 123n,
        timestamp: 123n,
      } as Block;
      client.onGetBlock().resolves(block);
      expect(await client.getBlock(123n)).toBe(block);
    });
  });

  describe("getBalance", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.getBalance({ address: "0x" });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
      client.onGetBalance({ address: "0xAlice" }).resolves(1n);
      client.onGetBalance({ address: "0xBob" }).resolves(2n);
      expect(await client.getBalance({ address: "0xAlice" })).toBe(1n);
      expect(await client.getBalance({ address: "0xBob" })).toBe(2n);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client.onGetBalance({ address: "0xAlice" }).resolves(1n);
      expect(
        await client.getBalance({ address: "0xAlice", block: "latest" }),
      ).toBe(1n);
      expect(await client.getBalance({ address: "0xAlice", block: 123n })).toBe(
        1n,
      );
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
      client.onGetBalance().resolves(123n);
      expect(await client.getBalance({ address: "0x" })).toBe(123n);
    });
  });

  describe("getTransaction", () => {
    it("Resolves to undefined by default", async () => {
      const client = createMockClient();
      expect(await client.getTransaction({ hash: "0x" })).toBeUndefined();
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
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
      client.onGetTransaction({ hash: "0x1" }).resolves(transaction1);
      client.onGetTransaction({ hash: "0x2" }).resolves(transaction2);
      expect(await client.getTransaction({ hash: "0x1" })).toBe(transaction1);
      expect(await client.getTransaction({ hash: "0x2" })).toBe(transaction2);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      const transaction: Transaction = {
        blockNumber: 123n,
        gas: 123n,
        gasPrice: 123n,
        input: "0x",
        nonce: 123n,
        type: "0x123",
        value: 123n,
      };
      client.onGetTransaction({}).resolves(transaction);
      expect(await client.getTransaction({ hash: "0x" })).toBe(transaction);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
      const transaction: Transaction = {
        blockNumber: 123n,
        gas: 123n,
        gasPrice: 123n,
        input: "0x",
        nonce: 123n,
        type: "0x123",
        value: 123n,
      };
      client.onGetTransaction().resolves(transaction);
      expect(await client.getTransaction({ hash: "0x" })).toBe(transaction);
    });
  });

  describe("waitForTransaction", () => {
    it("Resolves to undefined by default", async () => {
      const client = createMockClient();
      await expect(
        client.waitForTransaction({ hash: "0x" }),
      ).resolves.toBeUndefined();
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
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
      client.onWaitForTransaction({ hash: "0x1" }).resolves(receipt1);
      client.onWaitForTransaction({ hash: "0x2" }).resolves(receipt2);
      expect(await client.waitForTransaction({ hash: "0x1" })).toBe(receipt1);
      expect(await client.waitForTransaction({ hash: "0x2" })).toBe(receipt2);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
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
      client.onWaitForTransaction({ hash: "0x" }).resolves(receipt);
      expect(
        await client.waitForTransaction({ hash: "0x", timeout: 10_000 }),
      ).toBe(receipt);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
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
      client.onWaitForTransaction().resolves(receipt);
      expect(await client.waitForTransaction({ hash: "0x" })).toBe(receipt);
    });
  });

  describe("call", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.call({
          to: "0x",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
      const params1: CallParams = {
        to: "0x1",
      };
      const params2: CallParams = {
        to: "0x2",
      };
      client.onCall(params1).resolves("0xA");
      client.onCall(params2).resolves("0xB");
      expect(await client.call(params1)).toBe("0xA");
      expect(await client.call(params2)).toBe("0xB");
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
        .onCall({
          to: "0x1",
        })
        .resolves("0xA");
      expect(
        await client.call({
          to: "0x1",
          data: "0x123",
        }),
      ).toBe("0xA");
    });
  });

  describe("getEvents", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.getEvents({
          abi: IERC20.abi,
          address: "0x",
          event: "Transfer",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
      const params1: GetEventsParams<Erc20Abi, "Transfer"> = {
        abi: IERC20.abi,
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
      client.onGetEvents(params1).resolves(events1);
      client.onGetEvents(params2).resolves(events2);
      expect(await client.getEvents(params1)).toBe(events1);
      expect(await client.getEvents(params2)).toBe(events2);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
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
      client
        .onGetEvents({
          abi: IERC20.abi,
          event: "Transfer",
        })
        .resolves(events);
      expect(
        await client.getEvents({
          abi: IERC20.abi,
          address: "0x1",
          event: "Transfer",
          filter: { from: "0x1" },
        }),
      ).toBe(events);
    });
  });

  describe("read", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.read({
          abi: IERC20.abi,
          address: "0x",
          fn: "symbol",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
      const params1: ReadParams<Erc20Abi, "allowance"> = {
        abi: IERC20.abi,
        address: "0x1",
        fn: "allowance",
        args: { owner: "0x1", spender: "0x1" },
      };
      const params2: ReadParams<Erc20Abi, "allowance"> = {
        ...params1,
        args: { owner: "0x2", spender: "0x2" },
      };
      client.onRead(params1).resolves(1n);
      client.onRead(params2).resolves(2n);
      expect(await client.read(params1)).toBe(1n);
      expect(await client.read(params2)).toBe(2n);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
        .onRead({
          abi: IERC20.abi,
          fn: "balanceOf",
        })
        .resolves(123n);
      expect(
        await client.read({
          abi: IERC20.abi,
          address: "0x",
          fn: "balanceOf",
          args: { account: "0x" },
        }),
      ).toBe(123n);
    });
  });

  describe("simulateWrite", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.simulateWrite({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
      const params1: WriteParams<Erc20Abi, "transfer"> = {
        abi: IERC20.abi,
        address: "0x1",
        fn: "transfer",
        args: { to: "0x1", amount: 123n },
      };
      const params2: WriteParams<Erc20Abi, "transfer"> = {
        ...params1,
        args: { to: "0x2", amount: 123n },
      };
      client.onSimulateWrite(params1).resolves(true);
      client.onSimulateWrite(params2).resolves(false);
      expect(await client.simulateWrite(params1)).toBe(true);
      expect(await client.simulateWrite(params2)).toBe(false);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
        .onSimulateWrite({
          abi: IERC20.abi,
          fn: "transfer",
        })
        .resolves(true);
      expect(
        await client.simulateWrite({
          abi: IERC20.abi,
          address: "0x1",
          fn: "transfer",
          args: { to: "0x1", amount: 123n },
        }),
      ).toBe(true);
    });
  });

  describe("write", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.write({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
      const params1: WriteParams<Erc20Abi, "transfer"> = {
        abi: IERC20.abi,
        address: "0x",
        fn: "transfer",
        args: { to: "0x1", amount: 123n },
      };
      const params2: WriteParams<Erc20Abi, "transfer"> = {
        ...params1,
        args: { to: "0x2", amount: 123n },
      };
      client.onWrite(params1).resolves("0x1");
      client.onWrite(params2).resolves("0x2");
      expect(await client.write(params1)).toBe("0x1");
      expect(await client.write(params2)).toBe("0x2");
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
        .onWrite({
          abi: IERC20.abi,
          fn: "transfer",
        })
        .resolves("0x123");
      expect(
        await client.write({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
      client.onWrite().resolves("0x123");
      expect(
        await client.write({
          abi: IERC20.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });
  });

  describe("getSignerAddress", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.getSignerAddress();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const client = createMockClient();
      client.onGetSignerAddress().resolves("0x123");
      expect(await client.getSignerAddress()).toBe("0x123");
    });
  });
});
