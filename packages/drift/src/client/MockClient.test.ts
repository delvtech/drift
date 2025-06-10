import type { Abi } from "src/adapter/types/Abi";
import type {
  CallParams,
  DeployParams,
  FunctionCallParams,
  GetEventsParams,
  MulticallParams,
  ReadParams,
  WriteParams,
} from "src/adapter/types/Adapter";
import type { Block } from "src/adapter/types/Block";
import { createStubBlock } from "src/adapter/utils/testing/createStubBlock";
import { createStubEvents } from "src/adapter/utils/testing/createStubEvent";
import { createStubTransaction } from "src/adapter/utils/testing/createStubTransaction";
import { createStubTransactionReceipt } from "src/adapter/utils/testing/createStubTransactionReceipt";
import { TestToken } from "src/artifacts/TestToken";
import { createMockClient } from "src/client/MockClient";
import { MissingStubError } from "src/utils/testing/StubStore";
import { describe, expect, it, vi } from "vitest";

type TestTokenAbi = typeof TestToken.abi;

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
      const transaction1 = createStubTransaction({
        transactionHash: "0x1",
      });
      const transaction2 = createStubTransaction({
        transactionHash: "0x2",
      });
      client.onGetTransaction({ hash: "0x1" }).resolves(transaction1);
      client.onGetTransaction({ hash: "0x2" }).resolves(transaction2);
      expect(await client.getTransaction({ hash: "0x1" })).toBe(transaction1);
      expect(await client.getTransaction({ hash: "0x2" })).toBe(transaction2);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      const transaction = createStubTransaction();
      client.onGetTransaction({}).resolves(transaction);
      expect(await client.getTransaction({ hash: "0x" })).toBe(transaction);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
      const transaction = createStubTransaction();
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
      const receipt1 = createStubTransactionReceipt({
        transactionHash: "0x1",
      });
      const receipt2 = createStubTransactionReceipt({
        transactionHash: "0x2",
      });
      client.onWaitForTransaction({ hash: "0x1" }).resolves(receipt1);
      client.onWaitForTransaction({ hash: "0x2" }).resolves(receipt2);
      expect(await client.waitForTransaction({ hash: "0x1" })).toBe(receipt1);
      expect(await client.waitForTransaction({ hash: "0x2" })).toBe(receipt2);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      const receipt = createStubTransactionReceipt();
      client.onWaitForTransaction({ hash: "0x" }).resolves(receipt);
      expect(
        await client.waitForTransaction({ hash: "0x", timeout: 10_000 }),
      ).toBe(receipt);
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
      const receipt = createStubTransactionReceipt();
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

  describe("multicall", () => {
    it("Rejects with an error by default", async () => {
      const client = createMockClient();
      const [result] = await client.multicall({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "symbol",
          },
        ],
      });
      expect(result).toMatchObject({
        success: false,
        error: expect.any(MissingStubError),
      });
    });

    it("Can be stubbed with args", async () => {
      const client = createMockClient();
      client
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
        await client.multicall({
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
      const client = createMockClient();
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
      client.onMulticall(params1).resolves([{ success: true, value: 1n }]);
      client.onMulticall(params2).resolves([2n]);
      expect(await client.multicall(params1)).toStrictEqual([
        { success: true, value: 1n },
      ]);
      expect(await client.multicall(params2)).toStrictEqual([2n]);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
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
        await client.multicall({
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
      const client = createMockClient();
      client
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
        await client.multicall({
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
  });

  describe("getEvents", () => {
    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.getEvents({
          abi: TestToken.abi,
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
      const abi = TestToken.abi;
      const params1: GetEventsParams<TestTokenAbi, "Transfer"> = {
        abi,
        address: "0x1",
        event: "Transfer",
        filter: { from: "0x1" },
      };
      const events1 = createStubEvents({
        abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x1", to: "0x1", value: 123n } }],
      });
      const params2: GetEventsParams<TestTokenAbi, "Transfer"> = {
        ...params1,
        filter: { from: "0x2" },
      };
      const events2 = createStubEvents({
        abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x2", to: "0x2", value: 123n } }],
      });
      client.onGetEvents(params1).resolves(events1);
      client.onGetEvents(params2).resolves(events2);
      expect(await client.getEvents(params1)).toBe(events1);
      expect(await client.getEvents(params2)).toBe(events2);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      const events = createStubEvents({
        abi: TestToken.abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x1", to: "0x1", value: 123n } }],
      });
      client
        .onGetEvents({
          abi: TestToken.abi,
          event: "Transfer",
        })
        .resolves(events);
      expect(
        await client.getEvents({
          abi: TestToken.abi,
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
          abi: TestToken.abi,
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
      client.onRead(params1).resolves(1n);
      client.onRead(params2).resolves(2n);
      expect(await client.read(params1)).toBe(1n);
      expect(await client.read(params2)).toBe(2n);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
        .onRead({
          abi: TestToken.abi,
          fn: "balanceOf",
        })
        .resolves(123n);
      expect(
        await client.read({
          abi: TestToken.abi,
          address: "0x",
          fn: "balanceOf",
          args: { owner: "0x" },
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

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
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
      client.onSimulateWrite(params1).resolves(true);
      client.onSimulateWrite(params2).resolves(false);
      expect(await client.simulateWrite(params1)).toBe(true);
      expect(await client.simulateWrite(params2)).toBe(false);
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
        .onSimulateWrite({
          abi: TestToken.abi,
          fn: "transfer",
        })
        .resolves(true);
      expect(
        await client.simulateWrite({
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
      const client = createMockClient();
      let error: unknown;
      try {
        await client.write({
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

    it("Can be stubbed with specific params", async () => {
      const client = createMockClient();
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
      client.onWrite(params1).resolves("0x1");
      client.onWrite(params2).resolves("0x2");
      expect(await client.write(params1)).toBe("0x1");
      expect(await client.write(params2)).toBe("0x2");
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client
        .onWrite({
          abi: TestToken.abi,
          fn: "transfer",
        })
        .resolves("0x123");
      expect(
        await client.write({
          abi: TestToken.abi,
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
          abi: TestToken.abi,
          address: "0x",
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        }),
      ).toBe("0x123");
    });
  });

  describe("deploy", () => {
    const testAbi = [
      {
        type: "constructor",
        inputs: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "decimals", type: "uint8" },
        ],
        stateMutability: "nonpayable",
      },
    ] as const satisfies Abi;
    type TestAbi = typeof testAbi;

    it("Throws an error by default", async () => {
      const client = createMockClient();
      let error: unknown;
      try {
        await client.deploy({
          abi: testAbi,
          bytecode: "0x",
          args: {
            decimals: 18,
            name: "Test",
            symbol: "TST",
          },
        });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed with specific args", async () => {
      const client = createMockClient();
      const params1: DeployParams<TestAbi> = {
        abi: testAbi,
        bytecode: "0x",
        args: {
          decimals: 18,
          name: "Test",
          symbol: "TST",
        },
      };
      const params2: DeployParams<TestAbi> = {
        ...params1,
        args: {
          decimals: 18,
          name: "Test2",
          symbol: "TST2",
        },
      };
      client.onDeploy(params1).resolves("0x1");
      client.onDeploy(params2).resolves("0x2");
      expect(await client.deploy(params1)).toBe("0x1");
      expect(await client.deploy(params2)).toBe("0x2");
    });

    it("Can be stubbed with partial params", async () => {
      const client = createMockClient();
      client.onDeploy({ abi: testAbi }).resolves("0x123");
      expect(
        await client.deploy({
          abi: testAbi,
          bytecode: "0x",
          args: {
            decimals: 18,
            name: "Test",
            symbol: "TST",
          },
        }),
      ).toBe("0x123");
    });

    it("Can be called with args after being stubbed with no args", async () => {
      const client = createMockClient();
      client.onDeploy().resolves("0x123");
      expect(
        await client.deploy({
          abi: testAbi,
          bytecode: "0x",
          args: {
            decimals: 18,
            name: "Test",
            symbol: "TST",
          },
        }),
      ).toBe("0x123");
    });

    it("Calls onMined callbacks with the receipt", async () => {
      const client = createMockClient();
      const receipt = createStubTransactionReceipt();
      const onMined = vi.fn();

      client.onDeploy().resolves("0x123");
      client.onWaitForTransaction().resolves(receipt);

      const hash = await client.deploy({
        abi: testAbi,
        bytecode: "0x",
        args: {
          decimals: 18,
          name: "Test",
          symbol: "TST",
        },
        onMined,
      });
      await client.waitForTransaction({ hash });

      expect(onMined).toHaveBeenCalledWith(receipt);
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
