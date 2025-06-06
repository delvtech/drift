import { MockAdapter } from "src/adapter/MockAdapter";
import type {
  CallParams,
  DeployParams,
  FunctionCall,
  GetEventsParams,
  MulticallParams,
  ReadParams,
  SimulateWriteParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { EventLog } from "src/adapter/types/Event";
import { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
import { TestToken } from "src/artifacts/TestToken";
import { NotImplementedError } from "src/utils/testing/StubStore";
import { describe, expect, it, vi } from "vitest";

type TestTokenAbi = typeof TestToken.abi;

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
      const block0 = createStubBlock({
        number: 0n,
      });
      const block1 = createStubBlock({
        number: 1n,
      });
      const block2 = createStubBlock({
        number: 2n,
      });
      adapter.onGetBlock().resolves(block0);
      adapter.onGetBlock(1n).resolves(block1);
      adapter.onGetBlock(2n).resolves(block2);
      expect(await adapter.getBlock()).toBe(block0);
      expect(await adapter.getBlock(1n)).toBe(block1);
      expect(await adapter.getBlock(2n)).toBe(block2);
    });

    it("Can be stubbed with no params", async () => {
      const adapter = new MockAdapter();
      const block = createStubBlock({
        number: 123n,
      });
      adapter.onGetBlock().resolves(block);
      expect(await adapter.getBlock(123n)).toBe(block);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const block = createStubBlock({
        number: 123n,
      });
      adapter.onGetBlock().resolves(block);
      expect(await adapter.getBlock(123n)).toBe(block);
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

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const transaction = createStubTransaction();
      adapter.onGetTransaction({}).resolves(transaction);
      expect(await adapter.getTransaction({ hash: "0x" })).toBe(transaction);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const transaction = createStubTransaction();
      adapter.onGetTransaction().resolves(transaction);
      expect(await adapter.getTransaction({ hash: "0x" })).toBe(transaction);
    });
  });

  describe("waitForTransaction", () => {
    it("Resolves to undefined by default", async () => {
      const adapter = new MockAdapter();
      const result = await adapter
        .waitForTransaction({ hash: "0x" })
        .catch(() => "error");
      expect(result).toBeUndefined();
    });

    it("Can be stubbed with specific params", async () => {
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

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      const receipt = createStubTransactionReceipt();
      adapter.onWaitForTransaction({ hash: "0x" }).resolves(receipt);
      expect(
        await adapter.waitForTransaction({ hash: "0x", timeout: 10_000 }),
      ).toBe(receipt);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      const receipt = createStubTransactionReceipt();
      adapter.onWaitForTransaction().resolves(receipt);
      expect(await adapter.waitForTransaction({ hash: "0x" })).toBe(receipt);
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

  describe("multicall", () => {
    it("Returns an error result by default", async () => {
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
        error: expect.any(NotImplementedError),
      });
    });

    it("Can be stubbed with args", async () => {
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

    it("Can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: MulticallParams<
        [FunctionCall<TestTokenAbi, "allowance">]
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
        [FunctionCall<TestTokenAbi, "allowance">]
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

    it("Can be stubbed with partial params", async () => {
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

    it("Can be stubbed with partial args", async () => {
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

    it("Returns stubbed read and simulateWrite values", async () => {
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
        { success: false, error: expect.any(NotImplementedError) },
      ]);
    });
  });

  describe("sendRawTransaction", () => {
    it("Rejects with an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.sendRawTransaction("0x01");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific params", async () => {
      const adapter = new MockAdapter();
      adapter.onSendRawTransaction("0x1").resolves("0xa");
      adapter.onSendRawTransaction("0x2").resolves("0xb");
      expect(await adapter.sendRawTransaction("0x1")).toBe("0xa");
      expect(await adapter.sendRawTransaction("0x2")).toBe("0xb");
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onSendRawTransaction().resolves("0xa");
      expect(await adapter.sendRawTransaction("0x1")).toBe("0xa");
    });
  });

  describe("getEvents", () => {
    it("Rejects with an error by default", async () => {
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

    it("Can be stubbed with args", async () => {
      const adapter = new MockAdapter();
      adapter
        .onGetEvents({
          abi: TestToken.abi,
          address: "0x1",
          event: "Transfer",
          filter: { from: "0x1" },
        })
        .resolves([
          {
            eventName: "Transfer",
            args: {
              from: "0x1",
              to: "0x1",
              value: 123n,
            },
          },
        ]);
      expect(
        await adapter.getEvents({
          abi: TestToken.abi,
          address: "0x1",
          event: "Transfer",
          filter: { from: "0x1" },
        }),
      ).toMatchObject([
        {
          eventName: "Transfer",
          args: {
            from: "0x1",
            to: "0x1",
            value: 123n,
          },
        },
      ]);
    });

    it("Can stub different values for different args", async () => {
      const adapter = new MockAdapter();
      const params1: GetEventsParams<TestTokenAbi, "Transfer"> = {
        abi: TestToken.abi,
        address: "0x1",
        event: "Transfer",
        filter: { from: "0x1" },
      };
      const params2: GetEventsParams<TestTokenAbi, "Transfer"> = {
        ...params1,
        filter: { from: "0x2" },
      };
      const events1: EventLog<TestTokenAbi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x1",
            to: "0x1",
            value: 123n,
          },
        },
      ];
      const events2: EventLog<TestTokenAbi, "Transfer">[] = [
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
      const events: EventLog<TestTokenAbi, "Transfer">[] = [
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

  describe("read", () => {
    it("Rejects with an error by default", async () => {
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

    it("Can be stubbed with args", async () => {
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

    it("Can stub different values for different args", async () => {
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

    it("Can be stubbed with partial params", async () => {
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

    it("Can be stubbed with partial args", async () => {
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
    it("Rejects with an error by default", async () => {
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

    it("Can be stubbed with args", async () => {
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

    it("Can stub different values for different args", async () => {
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

    it("Can be stubbed with partial params", async () => {
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

    it("Can be stubbed with partial args", async () => {
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

  describe("write", () => {
    it("Throws an error by default", async () => {
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

    it("Can be stubbed with args", async () => {
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

    it("Can stub different values for different args", async () => {
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

    it("Can be stubbed with partial params", async () => {
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

    it("Can be stubbed with partial args", async () => {
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

    it("Can be called with args after being stubbed with no args", async () => {
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

    it("Calls onMined callbacks with the receipt", async () => {
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

  describe("deploy", () => {
    it("Throws an error by default", async () => {
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

    it("Can be stubbed with specific args", async () => {
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

    it("Can be stubbed with partial params", async () => {
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

    it("Can be stubbed with partial args", async () => {
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

    it("Can be called with args after being stubbed with no args", async () => {
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

    it("Calls onMined callbacks with the receipt", async () => {
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

  describe("sendTransaction", () => {
    it("Throws an error by default", async () => {
      const adapter = new MockAdapter();
      let error: unknown;
      try {
        await adapter.sendTransaction({ data: "0x" });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific args", async () => {
      const adapter = new MockAdapter();
      adapter.onSendTransaction({ data: "0x1" }).resolves("0xa");
      adapter.onSendTransaction({ data: "0x2" }).resolves("0xb");
      expect(await adapter.sendTransaction({ data: "0x1" })).toBe("0xa");
      expect(await adapter.sendTransaction({ data: "0x2" })).toBe("0xb");
    });

    it("Can be stubbed with partial params", async () => {
      const adapter = new MockAdapter();
      adapter.onSendTransaction({}).resolves("0x123");
      expect(await adapter.sendTransaction({ data: "0x" })).toBe("0x123");
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const adapter = new MockAdapter();
      adapter.onSendTransaction().resolves("0x123");
      expect(await adapter.sendTransaction({ data: "0x" })).toBe("0x123");
    });

    it("Calls onMined callbacks with the receipt", async () => {
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
