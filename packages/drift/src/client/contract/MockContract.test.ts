import type { ContractEvent } from "src/adapter/types/Event";
import type { DecodedFunctionData } from "src/adapter/types/Function";
import { MockContract } from "src/client/contract/MockContract";
import { erc20 } from "src/utils/testing/erc20";
import { describe, expect, it } from "vitest";

const abi = erc20.abi;
type Erc20Abi = typeof abi;

describe("MockContract", () => {
  describe("getEvents", async () => {
    it("Throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.getEvents("Transfer");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const contract = new MockContract({ abi });
      const events: ContractEvent<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x",
            to: "0x",
            value: 123n,
          },
        },
      ];
      contract.onGetEvents("Transfer").resolves(events);
      expect(await contract.getEvents("Transfer")).toBe(events);
    });

    it("Can be stubbed with specific args", async () => {
      const contract = new MockContract({ abi });
      const events1: ContractEvent<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x1",
            to: "0x1",
            value: 123n,
          },
        },
      ];
      const events2: ContractEvent<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x2",
            to: "0x2",
            value: 123n,
          },
        },
      ];
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

    it("Inherits stubbed values from the adapter", async () => {
      const contract = new MockContract({ abi });
      const events: ContractEvent<Erc20Abi, "Transfer">[] = [
        {
          eventName: "Transfer",
          args: {
            from: "0x",
            to: "0x",
            value: 123n,
          },
        },
      ];
      contract.adapter
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
    it("Throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.read("symbol");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const contract = new MockContract({ abi });
      contract.onRead("symbol").resolves("ABC");
      expect(await contract.read("symbol")).toBe("ABC");
    });

    it("Can be stubbed with specific args", async () => {
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

    it.todo("Can be stubbed with partial args", async () => {
      const contract = new MockContract({ abi });
      contract.onRead("balanceOf").resolves(123n);
      expect(await contract.read("balanceOf", { account: "0x" })).toBe(123n);
    });

    it("Inherits stubbed values from the adapter", async () => {
      const contract = new MockContract({ abi });
      contract.adapter
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
    it("Throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.simulateWrite("transfer", { to: "0x", amount: 123n });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const contract = new MockContract({ abi });
      contract
        .onSimulateWrite("transfer", { to: "0x", amount: 123n })
        .resolves(true);
      expect(
        await contract.simulateWrite("transfer", { to: "0x", amount: 123n }),
      ).toBe(true);
    });

    it("Can be stubbed with specific args", async () => {
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

    it("Inherits stubbed values from the adapter", async () => {
      const contract = new MockContract({ abi });
      contract.adapter
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

  describe("encodeFunctionData", () => {
    it("Throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        contract.encodeFunctionData("balanceOf", { account: "0x" });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const contract = new MockContract({ abi });
      contract
        .onEncodeFunctionData("balanceOf", { account: "0x" })
        .returns("0x123");
      expect(contract.encodeFunctionData("balanceOf", { account: "0x" })).toBe(
        "0x123",
      );
    });

    it("Can be stubbed with specific args", async () => {
      const contract = new MockContract({ abi });
      contract
        .onEncodeFunctionData("balanceOf", { account: "0x1" })
        .returns("0x1");
      contract
        .onEncodeFunctionData("balanceOf", { account: "0x2" })
        .returns("0x2");
      expect(contract.encodeFunctionData("balanceOf", { account: "0x1" })).toBe(
        "0x1",
      );
      expect(contract.encodeFunctionData("balanceOf", { account: "0x2" })).toBe(
        "0x2",
      );
    });
  });

  describe("decodeFunctionData", () => {
    it("Throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        contract.decodeFunctionData("0x");
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const contract = new MockContract({ abi });
      const decoded: DecodedFunctionData<Erc20Abi, "balanceOf"> = {
        functionName: "balanceOf",
        args: { account: "0x" },
      };
      contract.onDecodeFunctionData("0x").returns(decoded);
      expect(contract.decodeFunctionData("0x")).toBe(decoded);
    });

    it("Can be stubbed with specific args", async () => {
      const contract = new MockContract({ abi });
      const decoded1: DecodedFunctionData<Erc20Abi, "balanceOf"> = {
        functionName: "balanceOf",
        args: { account: "0x1" },
      };
      const decoded2: DecodedFunctionData<Erc20Abi, "balanceOf"> = {
        functionName: "balanceOf",
        args: { account: "0x2" },
      };
      contract.onDecodeFunctionData("0x1").returns(decoded1);
      contract.onDecodeFunctionData("0x2").returns(decoded2);
      expect(contract.decodeFunctionData("0x1")).toBe(decoded1);
      expect(contract.decodeFunctionData("0x2")).toBe(decoded2);
    });
  });

  describe("getSignerAddress", () => {
    it("Throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.getSignerAddress();
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const contract = new MockContract({ abi });
      contract.onGetSignerAddress().resolves("0x123");
      expect(await contract.getSignerAddress()).toBe("0x123");
    });
  });

  describe("write", () => {
    it("Throws an error by default", async () => {
      const contract = new MockContract({ abi });
      let error: unknown;
      try {
        await contract.write("transfer", { to: "0x", amount: 123n });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(Error);
    });

    it("Can be stubbed", async () => {
      const contract = new MockContract({ abi });
      contract
        .onWrite("transfer", { to: "0x", amount: 123n })
        .resolves("0x123");
      expect(await contract.write("transfer", { to: "0x", amount: 123n })).toBe(
        "0x123",
      );
    });

    it("Can be stubbed with specific args", async () => {
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
  });
});
