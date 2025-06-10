import { createStubEvents } from "src/adapter/utils/testing/createStubEvent";
import { TestToken } from "src/artifacts/TestToken";
import type {
  ContractMulticallParams,
  ContractReadArgs,
  ContractSimulateWriteArgs,
} from "src/client/contract/Contract";
import { MockContract } from "src/client/contract/MockContract";
import { MissingStubError } from "src/utils/testing/StubStore";
import { describe, expect, it } from "vitest";

const abi = TestToken.abi;
type TestTokenAbi = typeof abi;

describe("MockContract", () => {
  describe("multicall", () => {
    it("returns an error result by default", async () => {
      const contract = new MockContract({ abi });
      const [result] = await contract.multicall({ calls: [{ fn: "symbol" }] });
      expect(result).toStrictEqual({
        success: false,
        error: expect.any(MissingStubError),
      });
    });

    it("can be stubbed with args", async () => {
      const contract = new MockContract({ abi });
      contract
        .onMulticall({ calls: [{ fn: "balanceOf", args: { owner: "0x1" } }] })
        .resolves([{ success: true, value: 123n }]);
      expect(
        await contract.multicall({
          calls: [{ fn: "balanceOf", args: { owner: "0x1" } }],
        }),
      ).toStrictEqual([{ success: true, value: 123n }]);
    });

    it("can stub different values for different args", async () => {
      const contract = new MockContract({ abi });
      const params1: ContractMulticallParams<
        TestTokenAbi,
        [{ fn: "allowance" }]
      > = {
        calls: [{ fn: "allowance", args: { owner: "0x1", spender: "0x1" } }],
      };
      const params2: ContractMulticallParams<
        TestTokenAbi,
        [{ fn: "allowance" }]
      > = {
        calls: [
          { ...params1.calls[0], args: { owner: "0x2", spender: "0x2" } },
        ],
        allowFailure: false,
      };
      contract.onMulticall(params1).resolves([{ success: true, value: 1n }]);
      contract.onMulticall(params2).resolves([2n]);
      expect(await contract.multicall(params1)).toStrictEqual([
        { success: true, value: 1n },
      ]);
      expect(await contract.multicall(params2)).toStrictEqual([2n]);
    });

    it("can be stubbed with partial params", async () => {
      const contract = new MockContract({ abi });
      contract
        .onMulticall({
          calls: [{ fn: "balanceOf" }],
        })
        .resolves([{ success: true, value: 123n }]);
      expect(
        await contract.multicall({
          calls: [{ fn: "balanceOf", args: { owner: "0x1" } }],
        }),
      ).toStrictEqual([{ success: true, value: 123n }]);
    });

    it("can be stubbed with partial args", async () => {
      const contract = new MockContract({ abi });
      contract
        .onMulticall({
          calls: [{ fn: "allowance", args: { owner: "0x1" } }],
        })
        .resolves([{ success: true, value: 123n }]);
      expect(
        await contract.multicall({
          calls: [{ fn: "allowance", args: { owner: "0x1", spender: "0x" } }],
        }),
      ).toStrictEqual([{ success: true, value: 123n }]);
    });

    it("returns stubbed read and simulateWrite values", async () => {
      const contract = new MockContract({ abi });
      const readArgs: ContractReadArgs<TestTokenAbi> = ["symbol"];
      const simulateWriteArgs: ContractSimulateWriteArgs<TestTokenAbi> = [
        "approve",
        { spender: "0x1", amount: 123n },
      ];

      contract.onRead(...readArgs).resolves("TEST");
      contract.onSimulateWrite(...simulateWriteArgs).resolves(true);

      expect(
        await contract.multicall({
          calls: [
            { fn: readArgs[0] },
            { fn: simulateWriteArgs[0], args: simulateWriteArgs[1] },
            { fn: "name" },
          ],
        }),
      ).toStrictEqual([
        { success: true, value: "TEST" },
        { success: true, value: true },
        { success: false, error: expect.any(MissingStubError) },
      ]);
    });
  });

  describe("getEvents", async () => {
    it("throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.getEvents("Transfer");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific args", async () => {
      const contract = new MockContract({ abi });
      const events1 = createStubEvents({
        abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x1", to: "0x1", value: 123n } }],
      });
      const events2 = createStubEvents({
        abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x2", to: "0x2", value: 123n } }],
      });
      contract
        .onGetEvents("Transfer", { filter: { from: "0x1" } })
        .resolves(events1);
      contract
        .onGetEvents("Transfer", { filter: { from: "0x2" } })
        .resolves(events2);
      expect(
        await contract.getEvents("Transfer", { filter: { from: "0x1" } }),
      ).toBe(events1);
      expect(
        await contract.getEvents("Transfer", { filter: { from: "0x2" } }),
      ).toBe(events2);
    });

    it("can be stubbed with partial args", async () => {
      const contract = new MockContract({ abi });
      const events = createStubEvents({
        abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x1", to: "0x1", value: 123n } }],
      });
      contract.onGetEvents("Transfer").resolves(events);
      expect(
        await contract.getEvents("Transfer", { filter: { from: "0x1" } }),
      ).toBe(events);
    });

    it("inherits stubbed values from the client", async () => {
      const contract = new MockContract({ abi });
      const events = createStubEvents({
        abi,
        eventName: "Transfer",
        events: [{ args: { from: "0x", to: "0x", value: 123n } }],
      });
      contract.client
        .onGetEvents({
          abi: contract.abi,
          address: contract.address,
          event: "Transfer",
        })
        .resolves(events);
      expect(await contract.getEvents("Transfer")).toBe(events);
    });
  });

  describe("read", () => {
    it("throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.read("symbol");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific args", async () => {
      const contract = new MockContract({ abi });
      contract
        .onRead("allowance", { owner: "0x1", spender: "0x1" })
        .resolves(1n);
      contract
        .onRead("allowance", { owner: "0x1", spender: "0x2" })
        .resolves(2n);
      expect(
        await contract.read("allowance", { owner: "0x1", spender: "0x1" }),
      ).toBe(1n);
      expect(
        await contract.read("allowance", { owner: "0x1", spender: "0x2" }),
      ).toBe(2n);
    });

    it("can be stubbed with partial args", async () => {
      const contract = new MockContract({ abi });
      contract.onRead("allowance", { owner: "0x" }).resolves(123n);
      expect(
        await contract.read("allowance", { owner: "0x", spender: "0x" }),
      ).toBe(123n);
    });

    it("can be stubbed with partial params", async () => {
      const contract = new MockContract({ abi });
      contract.onRead("balanceOf").resolves(123n);
      expect(await contract.read("balanceOf", { owner: "0x" })).toBe(123n);
    });

    it("inherits stubbed values from the client", async () => {
      const contract = new MockContract({ abi });
      contract.client
        .onRead({
          abi: contract.abi,
          address: contract.address,
          fn: "symbol",
        })
        .resolves("ABC");
      expect(await contract.read("symbol")).toBe("ABC");
    });
  });

  describe("simulateWrite", () => {
    it("throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.simulateWrite("transfer", { to: "0x", amount: 123n });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific args", async () => {
      const contract = new MockContract({ abi });
      contract
        .onSimulateWrite("transfer", { to: "0x1", amount: 123n })
        .resolves(true);
      contract
        .onSimulateWrite("transfer", { to: "0x2", amount: 123n })
        .resolves(false);
      expect(
        await contract.simulateWrite("transfer", { to: "0x1", amount: 123n }),
      ).toBe(true);
      expect(
        await contract.simulateWrite("transfer", { to: "0x2", amount: 123n }),
      ).toBe(false);
    });

    it("can be stubbed with partial args", async () => {
      const contract = new MockContract({ abi });
      contract.onSimulateWrite("transfer", { to: "0x1" }).resolves(true);
      expect(
        await contract.simulateWrite("transfer", { to: "0x1", amount: 123n }),
      ).toBe(true);
    });

    it("can be stubbed with partial params", async () => {
      const contract = new MockContract({ abi });
      contract.onSimulateWrite("transfer").resolves(true);
      expect(
        await contract.simulateWrite("transfer", { to: "0x1", amount: 123n }),
      ).toBe(true);
    });

    it("inherits stubbed values from the client", async () => {
      const contract = new MockContract({ abi });
      contract.client
        .onSimulateWrite({
          abi: contract.abi,
          address: contract.address,
          fn: "transfer",
          args: { to: "0x", amount: 123n },
        })
        .resolves(true);
      expect(
        await contract.simulateWrite("transfer", { to: "0x", amount: 123n }),
      ).toBe(true);
    });
  });

  describe("getSignerAddress", () => {
    it("throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.getSignerAddress();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed", async () => {
      const contract = new MockContract({ abi });
      contract.onGetSignerAddress().resolves("0x123");
      expect(await contract.getSignerAddress()).toBe("0x123");
    });
  });

  describe("write", () => {
    it("throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.write("transfer", { to: "0x", amount: 123n });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("can be stubbed with specific args", async () => {
      const contract = new MockContract({ abi });
      contract.onWrite("transfer", { to: "0x1", amount: 123n }).resolves("0x1");
      contract.onWrite("transfer", { to: "0x2", amount: 123n }).resolves("0x2");
      expect(
        await contract.write("transfer", { to: "0x1", amount: 123n }),
      ).toBe("0x1");
      expect(
        await contract.write("transfer", { to: "0x2", amount: 123n }),
      ).toBe("0x2");
    });

    it("can be stubbed with partial args", async () => {
      const contract = new MockContract({ abi });
      contract.onWrite("transfer", { to: "0x" }).resolves("0x123");
      expect(await contract.write("transfer", { to: "0x", amount: 123n })).toBe(
        "0x123",
      );
    });

    it("can be stubbed with partial params", async () => {
      const contract = new MockContract({ abi });
      contract.onWrite("transfer").resolves("0x123");
      expect(await contract.write("transfer", { to: "0x", amount: 123n })).toBe(
        "0x123",
      );
    });

    it("can be called with args after being stubbed with no arguments", async () => {
      const contract = new MockContract({ abi });
      contract.onWrite().resolves("0x123");
      expect(await contract.write("transfer", { to: "0x", amount: 123n })).toBe(
        "0x123",
      );
    });
  });
});
