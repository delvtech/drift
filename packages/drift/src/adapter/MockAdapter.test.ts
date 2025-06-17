import { MockAdapter } from "src/adapter/MockAdapter";
import type {
  CallParams,
  DeployParams,
  FunctionCallParams,
  GetEventsParams,
  GetWalletCapabilitiesParams,
  MulticallParams,
  ReadParams,
  SendCallsParams,
  SimulateWriteParams,
  WalletCapabilities,
  WriteParams,
} from "src/adapter/types/Adapter";
import { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
import { createStubEvents } from "src/adapter/utils/testing/createStubEvent";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
import { createStubWalletCallsStatus } from "src/adapter/utils/testing/createStubWalletCallsStatus";
import { TestToken } from "src/artifacts/TestToken";
import { MissingStubError } from "src/utils/testing/StubStore";
import { describe, expect, it, vi } from "vitest";

type TestTokenAbi = typeof TestToken.abi;

describe("MockAdapter", () => {
  describe("getChainId", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getChainId();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetChainId().resolves(123);
      expect(await adapter.getChainId()).toBe(123);
    });
  });

  describe("getBlockNumber", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getBlockNumber();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBlockNumber().resolves(123n);
      expect(await adapter.getBlockNumber()).toBe(123n);
    });
  });

  describe("getBlock", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getBlock();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const block = createStubBlock({ number: 1n });
      adapter.onGetBlock().resolves(block);
      expect(await adapter.getBlock()).toBe(block);
      expect(await adapter.getBlock(1n)).toBe(block);
    });

    it("can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const block1 = createStubBlock({ number: 1n });
      const block2 = createStubBlock({ number: 2n });
      adapter.onGetBlock(1n).resolves(block1);
      adapter.onGetBlock(2n).resolves(block2);
      expect(await adapter.getBlock(1n)).toBe(block1);
      expect(await adapter.getBlock(2n)).toBe(block2);
    });
  });

  describe("getBalance", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getBalance({ address: "0x" });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBalance({ address: "0xAlice" }).resolves(1n);
      adapter.onGetBalance({ address: "0xBob" }).resolves(2n);
      expect(await adapter.getBalance({ address: "0xAlice" })).toBe(1n);
      expect(await adapter.getBalance({ address: "0xBob" })).toBe(2n);
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBalance({ address: "0xAlice" }).resolves(1n);
      expect(
        await adapter.getBalance({ address: "0xAlice", block: "latest" }),
      ).toBe(1n);
      expect(
        await adapter.getBalance({ address: "0xAlice", block: 123n }),
      ).toBe(1n);
    });

    it("can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onGetBalance().resolves(123n);
      expect(await adapter.getBalance({ address: "0x" })).toBe(123n);
    });
  });

  describe("getTransaction", () => {
    it("resolves to undefined by default", async () => {
      const adapter = new MockAdapter();
      expect(await adapter.getTransaction({ hash: "0x" })).toBeUndefined();
    });

    it("can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const transaction1 = createStubTransaction({
        transactionHash: "0x1",
      });
      const transaction2 = createStubTransaction({
        transactionHash: "0x2",
      });
      adapter.onGetTransaction({ hash: "0x1" }).resolves(transaction1);
      adapter.onGetTransaction({ hash: "0x2" }).resolves(transaction2);
      expect(await adapter.getTransaction({ hash: "0x1" })).toBe(transaction1);
      expect(await adapter.getTransaction({ hash: "0x2" })).toBe(transaction2);
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const transaction = createStubTransaction();
      adapter.onGetTransaction({}).resolves(transaction);
      expect(await adapter.getTransaction({ hash: "0x" })).toBe(transaction);
    });

    it("can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const transaction = createStubTransaction();
      adapter.onGetTransaction().resolves(transaction);
      expect(await adapter.getTransaction({ hash: "0x" })).toBe(transaction);
    });
  });

  describe("waitForTransaction", () => {
    it("resolves to undefined by default", async () => {
      const adapter = new MockAdapter();
      const result = await adapter
        .waitForTransaction({ hash: "0x" })
        .catch(() => "error");
      expect(result).toBeUndefined();
    });

    it("can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const receipt1 = createStubTransactionReceipt({
        transactionHash: "0x1",
      });
      const receipt2 = createStubTransactionReceipt({
        transactionHash: "0x2",
      });
      adapter.onWaitForTransaction({ hash: "0x1" }).resolves(receipt1);
      adapter.onWaitForTransaction({ hash: "0x2" }).resolves(receipt2);
      expect(await adapter.waitForTransaction({ hash: "0x1" })).toBe(receipt1);
      expect(await adapter.waitForTransaction({ hash: "0x2" })).toBe(receipt2);
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const receipt = createStubTransactionReceipt();
      adapter.onWaitForTransaction({ hash: "0x" }).resolves(receipt);
      expect(
        await adapter.waitForTransaction({ hash: "0x", timeout: 10_000 }),
      ).toBe(receipt);
    });

    it("can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const receipt = createStubTransactionReceipt();
      adapter.onWaitForTransaction().resolves(receipt);
      expect(await adapter.waitForTransaction({ hash: "0x" })).toBe(receipt);
    });
  });

  describe("sendRawTransaction", () => {
    it("rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.sendRawTransaction("0x01");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      adapter.onSendRawTransaction("0x1").resolves("0xa");
      adapter.onSendRawTransaction("0x2").resolves("0xb");
      expect(await adapter.sendRawTransaction("0x1")).toBe("0xa");
      expect(await adapter.sendRawTransaction("0x2")).toBe("0xb");
    });

    it("can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onSendRawTransaction().resolves("0xa");
      expect(await adapter.sendRawTransaction("0x1")).toBe("0xa");
    });
  });

  describe("getEvents", () => {
    it("rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getEvents({
          abi: TestToken.abi,
          address: "0x",
          event: "Transfer",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with args", async () => {
      const adapter = new MockAdapter();
      const events = createStubEvents({
        abi: TestToken.abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x1", to: "0x1", value: 123n } }],
      });
      adapter
        .onGetEvents({
          abi: TestToken.abi,
          address: "0x1",
          event: "Transfer",
          filter: { from: "0x1" },
        })
        .resolves(events);
      expect(
        await adapter.getEvents({
          abi: TestToken.abi,
          address: "0x1",
          event: "Transfer",
          filter: { from: "0x1" },
        }),
      ).toBe(events);
    });

    it("can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: GetEventsParams<TestTokenAbi, "Transfer"> = {
        abi: TestToken.abi,
        address: "0x1",
        event: "Transfer",
        filter: { from: "0x1" },
      };
      const events1 = createStubEvents({
        abi: TestToken.abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x1", to: "0x1", value: 123n } }],
      });
      const params2: GetEventsParams<TestTokenAbi, "Transfer"> = {
        ...params1,
        filter: { from: "0x2" },
      };
      const events2 = createStubEvents({
        abi: TestToken.abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x2", to: "0x2", value: 123n } }],
      });
      adapter.onGetEvents(params1).resolves(events1);
      adapter.onGetEvents(params2).resolves(events2);
      expect(await adapter.getEvents(params1)).toBe(events1);
      expect(await adapter.getEvents(params2)).toBe(events2);
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const events = createStubEvents({
        abi: TestToken.abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x1", to: "0x1", value: 123n } }],
      });
      adapter
        .onGetEvents({
          abi: TestToken.abi,
          event: "Transfer",
        })
        .resolves(events);
      expect(
        await adapter.getEvents({
          abi: TestToken.abi,
          address: "0x1",
          event: "Transfer",
          filter: { from: "0x1" },
        }),
      ).toBe(events);
    });
  });

  describe("call", () => {
    it("rejects with an error by default", async () => {
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

    it("can be stubbed with specific params", async () => {
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

    it("can be stubbed with partial params", async () => {
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

  describe("read", () => {
    it("rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.read({
          abi: TestToken.abi,
          address: "0x",
          fn: "symbol",
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onRead({
          abi: TestToken.abi,
          address: "0x1",
          fn: "balanceOf",
          args: { owner: "0x1" },
        })
        .resolves(123n);
      expect(
        await adapter.read({
          abi: TestToken.abi,
          address: "0x1",
          fn: "balanceOf",
          args: { owner: "0x1" },
        }),
      ).toBe(123n);
    });

    it("can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: ReadParams<TestTokenAbi, "allowance"> = {
        abi: TestToken.abi,
        address: "0x1",
        fn: "allowance",
        args: { owner: "0x1", spender: "0x1" },
      };
      const params2: ReadParams<TestTokenAbi, "allowance"> = {
        ...params1,
        args: { owner: "0x2", spender: "0x2" },
      };
      adapter.onRead(params1).resolves(1n);
      adapter.onRead(params2).resolves(2n);
      expect(await adapter.read(params1)).toBe(1n);
      expect(await adapter.read(params2)).toBe(2n);
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onRead({
          abi: TestToken.abi,
          fn: "balanceOf",
        })
        .resolves(123n);
      expect(
        await adapter.read({
          abi: TestToken.abi,
          address: "0x",
          fn: "balanceOf",
          args: { owner: "0x" },
        }),
      ).toBe(123n);
    });

    it("can be stubbed with partial args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onRead({
          abi: TestToken.abi,
          fn: "allowance",
          args: { owner: "0x" },
        })
        .resolves(123n);
      expect(
        await adapter.read({
          abi: TestToken.abi,
          address: "0x",
          fn: "allowance",
          args: { owner: "0x", spender: "0x" },
        }),
      ).toBe(123n);
    });
  });

  describe("simulateWrite", () => {
    it("rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.simulateWrite({
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSimulateWrite({
          abi: TestToken.abi,
          address: "0x1",
          fn: "transfer",
          args: { to: "0x1", amount: 123n },
        })
        .resolves(true);
      expect(
        await adapter.simulateWrite({
          abi: TestToken.abi,
          address: "0x1",
          fn: "transfer",
          args: { to: "0x1", amount: 123n },
        }),
      ).toBe(true);
    });

    it("can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: WriteParams<TestTokenAbi, "transfer"> = {
        abi: TestToken.abi,
        address: "0x1",
        fn: "transfer",
        args: { to: "0x1", amount: 123n },
      };
      const params2: WriteParams<TestTokenAbi, "transfer"> = {
        ...params1,
        args: { to: "0x2", amount: 123n },
      };
      adapter.onSimulateWrite(params1).resolves(true);
      adapter.onSimulateWrite(params2).resolves(false);
      expect(await adapter.simulateWrite(params1)).toBe(true);
      expect(await adapter.simulateWrite(params2)).toBe(false);
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSimulateWrite({
          abi: TestToken.abi,
          fn: "transfer",
        })
        .resolves(true);
      expect(
        await adapter.simulateWrite({
          abi: TestToken.abi,
          address: "0x1",
          fn: "transfer",
          args: { to: "0x1", amount: 123n },
        }),
      ).toBe(true);
    });

    it("can be stubbed with partial args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSimulateWrite({
          abi: TestToken.abi,
          fn: "transfer",
          args: { to: "0x1" },
        })
        .resolves(true);
      expect(
        await adapter.simulateWrite({
          abi: TestToken.abi,
          address: "0x1",
          fn: "transfer",
          args: { to: "0x1", amount: 123n },
        }),
      ).toBe(true);
    });
  });

  describe("multicall", () => {
    it("returns an error result by default", async () => {
      const adapter = new MockAdapter();
      const [result] = await adapter.multicall({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "symbol",
          },
        ],
      });
      expect(result).toStrictEqual({
        success: false,
        error: expect.any(MissingStubError),
      });
    });

    it("can be stubbed with args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onMulticall({
          calls: [
            {
              abi: TestToken.abi,
              address: "0x1",
              fn: "balanceOf",
              args: { owner: "0x1" },
            },
          ],
        })
        .resolves([{ success: true, value: 123n }]);
      expect(
        await adapter.multicall({
          calls: [
            {
              abi: TestToken.abi,
              address: "0x1",
              fn: "balanceOf",
              args: { owner: "0x1" },
            },
          ],
        }),
      ).toStrictEqual([{ success: true, value: 123n }]);
    });

    it("can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: MulticallParams<
        [FunctionCallParams<TestTokenAbi, "allowance">]
      > = {
        calls: [
          {
            abi: TestToken.abi,
            address: "0x1",
            fn: "allowance",
            args: { owner: "0x1", spender: "0x1" },
          },
        ],
      };
      const params2: MulticallParams<
        [FunctionCallParams<TestTokenAbi, "allowance">]
      > = {
        calls: [
          {
            ...params1.calls[0],
            args: { owner: "0x2", spender: "0x2" },
          },
        ],
        allowFailure: false,
      };
      adapter.onMulticall(params1).resolves([{ success: true, value: 1n }]);
      adapter.onMulticall(params2).resolves([2n]);
      expect(await adapter.multicall(params1)).toStrictEqual([
        { success: true, value: 1n },
      ]);
      expect(await adapter.multicall(params2)).toStrictEqual([2n]);
    });

    it("can be stubbed with partial calls", async () => {
      const adapter = new MockAdapter();
      adapter
        .onMulticall({
          calls: [
            {
              abi: TestToken.abi,
              fn: "balanceOf",
            },
          ],
        })
        .resolves([{ success: true, value: 123n }]);
      expect(
        await adapter.multicall({
          calls: [
            {
              abi: TestToken.abi,
              address: "0x",
              fn: "balanceOf",
              args: { owner: "0x1" },
            },
          ],
        }),
      ).toStrictEqual([{ success: true, value: 123n }]);
    });

    it("can be stubbed with partial call args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onMulticall({
          calls: [
            {
              abi: TestToken.abi,
              fn: "allowance",
              args: { owner: "0x1" },
            },
          ],
        })
        .resolves([{ success: true, value: 123n }]);
      expect(
        await adapter.multicall({
          calls: [
            {
              abi: TestToken.abi,
              address: "0x",
              fn: "allowance",
              args: { owner: "0x1", spender: "0x" },
            },
          ],
        }),
      ).toStrictEqual([{ success: true, value: 123n }]);
    });

    it("returns stubbed read and simulateWrite values", async () => {
      const adapter = new MockAdapter();
      const readParams: ReadParams<TestTokenAbi> = {
        abi: TestToken.abi,
        address: "0x1",
        fn: "symbol",
      };
      const simulateWriteParams: SimulateWriteParams<TestTokenAbi> = {
        abi: TestToken.abi,
        address: "0x1",
        fn: "approve",
        args: { spender: "0x1", amount: 123n },
      };

      adapter.onRead(readParams).resolves("TEST");
      adapter.onSimulateWrite(simulateWriteParams).resolves(true);

      expect(
        await adapter.multicall({
          calls: [
            readParams,
            simulateWriteParams,
            { abi: TestToken.abi, address: "0x1", fn: "name" },
          ],
        }),
      ).toStrictEqual([
        { success: true, value: "TEST" },
        { success: true, value: true },
        { success: false, error: expect.any(MissingStubError) },
      ]);
    });
  });

  describe("getSignerAddress", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getSignerAddress();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed", async () => {
      const adapter = new MockAdapter();
      adapter.onGetSignerAddress().resolves("0x123");
      expect(await adapter.getSignerAddress()).toBe("0x123");
    });
  });

  describe("getWalletCapabilities", () => {
    it("rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getWalletCapabilities();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      const params1: GetWalletCapabilitiesParams = { chainIds: [1] };
      const return1: WalletCapabilities = {
        1: { atomic: { status: "supported" } },
      };
      const params2: GetWalletCapabilitiesParams = { chainIds: [2] };
      const return2: WalletCapabilities = {
        2: { atomic: { status: "supported" } },
      };
      adapter.onGetWalletCapabilities(params1).resolves(return1);
      adapter.onGetWalletCapabilities(params2).resolves(return2);
      expect(await adapter.getWalletCapabilities(params1)).toBe(return1);
      expect(await adapter.getWalletCapabilities(params2)).toBe(return2);
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onGetWalletCapabilities({ address: "0x1" })
        .resolves({ 1: { atomic: { status: "supported" } } });
      expect(
        await adapter.getWalletCapabilities({ address: "0x1", chainIds: [1] }),
      ).toStrictEqual({ 1: { atomic: { status: "supported" } } });
    });
  });

  describe("getCallsStatus", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.getCallsStatus("0x1");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const status = createStubWalletCallsStatus({ id: "0x1" });
      adapter.onGetCallsStatus().resolves(status);
      expect(await adapter.getCallsStatus("0x1")).toBe(status);
    });

    it("can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const status1 = createStubWalletCallsStatus({ id: "0x1" });
      const status2 = createStubWalletCallsStatus({ id: "0x2" });
      adapter.onGetCallsStatus("0x1").resolves(status1);
      adapter.onGetCallsStatus("0x2").resolves(status2);
      expect(await adapter.getCallsStatus("0x1")).toBe(status1);
      expect(await adapter.getCallsStatus("0x2")).toBe(status2);
    });
  });

  describe("showCallsStatus", () => {
    it("can be called without being stubbed", async () => {
      const adapter = new MockAdapter();
      const result = await adapter.showCallsStatus("0x1");
      expect(result).toBeUndefined();
    });

    it("can be stubbed with no args", async () => {
      const adapter = new MockAdapter();
      let shownId: string | undefined;
      adapter.onShowCallsStatus().callsFake(async (id) => {
        shownId = id;
      });
      await adapter.showCallsStatus("0x1");
      expect(shownId).toBe("0x1");
    });

    it("can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      let id1: string | undefined;
      let id2: string | undefined;
      adapter.onShowCallsStatus("0x1").callsFake(async (id) => {
        id1 = id;
      });
      adapter.onShowCallsStatus("0x2").callsFake(async (id) => {
        id2 = id;
      });
      await adapter.showCallsStatus("0x1");
      await adapter.showCallsStatus("0x2");
      expect(id1).toBe("0x1");
      expect(id2).toBe("0x2");
    });
  });

  describe("sendTransaction", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.sendTransaction({ data: "0x" });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      adapter.onSendTransaction({ data: "0x1" }).resolves("0xa");
      adapter.onSendTransaction({ data: "0x2" }).resolves("0xb");
      expect(await adapter.sendTransaction({ data: "0x1" })).toBe("0xa");
      expect(await adapter.sendTransaction({ data: "0x2" })).toBe("0xb");
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter.onSendTransaction({}).resolves("0x123");
      expect(await adapter.sendTransaction({ data: "0x" })).toBe("0x123");
    });

    it("can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onSendTransaction().resolves("0x123");
      expect(await adapter.sendTransaction({ data: "0x" })).toBe("0x123");
    });

    it("calls onMined callbacks with the receipt", async () => {
      const adapter = new MockAdapter();
      const receipt = createStubTransactionReceipt();
      const onMined = vi.fn();

      adapter.onDeploy().resolves("0x123");
      adapter.onWaitForTransaction().resolves(receipt);

      const hash = await adapter.deploy({
        abi: TestToken.abi,
        bytecode: "0x",
        args: {
          decimals_: 18,
          initialSupply: 0n,
        },
        onMined,
      });
      await adapter.waitForTransaction({ hash });

      expect(onMined).toHaveBeenCalledWith(receipt);
    });
  });

  describe("deploy", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.deploy({
          abi: TestToken.abi,
          bytecode: "0x",
          args: {
            decimals_: 18,
            initialSupply: 0n,
          },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      const params1: DeployParams<TestTokenAbi> = {
        abi: TestToken.abi,
        bytecode: "0x",
        args: {
          decimals_: 18,
          initialSupply: 0n,
        },
      };
      const params2: DeployParams<TestTokenAbi> = {
        ...params1,
        args: {
          decimals_: 18,
          initialSupply: 1n,
        },
      };
      adapter.onDeploy(params1).resolves("0x1");
      adapter.onDeploy(params2).resolves("0x2");
      expect(await adapter.deploy(params1)).toBe("0x1");
      expect(await adapter.deploy(params2)).toBe("0x2");
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter.onDeploy({ abi: TestToken.abi }).resolves("0x123");
      expect(
        await adapter.deploy({
          abi: TestToken.abi,
          bytecode: "0x",
          args: {
            decimals_: 18,
            initialSupply: 0n,
          },
        }),
      ).toBe("0x123");
    });

    it("can be stubbed with partial args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onDeploy({ abi: TestToken.abi, args: { decimals_: 18 } })
        .resolves("0x123");
      expect(
        await adapter.deploy({
          abi: TestToken.abi,
          bytecode: "0x",
          args: {
            decimals_: 18,
            initialSupply: 0n,
          },
        }),
      ).toBe("0x123");
    });

    it("can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onDeploy().resolves("0x123");
      expect(
        await adapter.deploy({
          abi: TestToken.abi,
          bytecode: "0x",
          args: {
            decimals_: 18,
            initialSupply: 0n,
          },
        }),
      ).toBe("0x123");
    });

    it("calls onMined callbacks with the receipt", async () => {
      const adapter = new MockAdapter();
      const receipt = createStubTransactionReceipt();
      const onMined = vi.fn();

      adapter.onDeploy().resolves("0x123");
      adapter.onWaitForTransaction().resolves(receipt);

      const hash = await adapter.deploy({
        abi: TestToken.abi,
        bytecode: "0x",
        args: {
          decimals_: 18,
          initialSupply: 0n,
        },
        onMined,
      });
      await adapter.waitForTransaction({ hash });

      expect(onMined).toHaveBeenCalledWith(receipt);
    });
  });

  describe("write", () => {
    it("throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.write({
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onWrite({
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        })
        .resolves("0x123");
      expect(
        await adapter.write({
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });

    it("can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: WriteParams<TestTokenAbi, "transfer"> = {
        abi: TestToken.abi,
        address: "0x",
        fn: "transfer",
        args: { to: "0x1", amount: 123n },
      };
      const params2: WriteParams<TestTokenAbi, "transfer"> = {
        ...params1,
        args: { to: "0x2", amount: 123n },
      };
      adapter.onWrite(params1).resolves("0x1");
      adapter.onWrite(params2).resolves("0x2");
      expect(await adapter.write(params1)).toBe("0x1");
      expect(await adapter.write(params2)).toBe("0x2");
    });

    it("can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter
        .onWrite({
          abi: TestToken.abi,
          fn: "transfer",
        })
        .resolves("0x123");
      expect(
        await adapter.write({
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });

    it("can be stubbed with partial args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onWrite({
          abi: TestToken.abi,
          fn: "transfer",
          args: { to: "0x" },
        })
        .resolves("0x123");
      expect(
        await adapter.write({
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });

    it("can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onWrite().resolves("0x123");
      expect(
        await adapter.write({
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });

    it("calls onMined callbacks with the receipt", async () => {
      const adapter = new MockAdapter();
      const receipt = createStubTransactionReceipt();
      const onMined = vi.fn();

      adapter.onWrite().resolves("0x123");
      adapter.onWaitForTransaction().resolves(receipt);

      const hash = await adapter.write({
        abi: TestToken.abi,
        address: "0x",
        fn: "transfer",
        args: { to: "0x", amount: 123n },
        onMined,
      });
      await adapter.waitForTransaction({ hash });

      expect(onMined).toHaveBeenCalledWith(receipt);
    });
  });

  describe("sendCalls", () => {
    it("rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.sendCalls({ calls: [] });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onSendCalls().resolves({ id: "0x1" });
      expect(await adapter.sendCalls({ calls: [] })).toStrictEqual({
        id: "0x1",
      });
    });

    it("can be stubbed with args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSendCalls({ calls: [{ to: "0x1", data: "0x123" }] })
        .resolves({ id: "0x1" });
      expect(
        await adapter.sendCalls({ calls: [{ to: "0x1", data: "0x123" }] }),
      ).toStrictEqual({ id: "0x1" });
    });

    it("can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: SendCallsParams = {
        calls: [{ to: "0x1", data: "0x123" }],
      };
      const params2: SendCallsParams = {
        calls: [{ to: "0x2", data: "0x123" }],
      };
      adapter.onSendCalls(params1).resolves({ id: "0x1" });
      adapter.onSendCalls(params2).resolves({ id: "0x2" });
      expect(await adapter.sendCalls(params1)).toStrictEqual({ id: "0x1" });
      expect(await adapter.sendCalls(params2)).toStrictEqual({ id: "0x2" });
    });

    it("can be stubbed with partial calls", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSendCalls({
          calls: [
            {
              abi: TestToken.abi,
              fn: "approve",
            },
          ],
        })
        .resolves({ id: "0x1" });
      expect(
        await adapter.sendCalls({
          calls: [
            {
              abi: TestToken.abi,
              address: "0x",
              fn: "approve",
              args: { spender: "0x1", amount: 123n },
            },
          ],
        }),
      ).toStrictEqual({ id: "0x1" });
    });

    it("can be stubbed with partial call args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onSendCalls({
          calls: [
            {
              abi: TestToken.abi,
              fn: "approve",
              args: { spender: "0x1" },
            },
          ],
        })
        .resolves({ id: "0x1" });
      expect(
        await adapter.sendCalls({
          calls: [
            {
              abi: TestToken.abi,
              address: "0x",
              fn: "approve",
              args: { spender: "0x1", amount: 123n },
            },
          ],
        }),
      ).toStrictEqual({ id: "0x1" });
    });
  });
});
