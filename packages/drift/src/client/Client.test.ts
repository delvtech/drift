import type { Abi } from "abitype";
import { MockAdapter } from "src/adapter/MockAdapter";
import { createClient } from "src/client/Client";
import { ALICE } from "src/utils/testing/accounts";
import { describe, expect, it, vi } from "vitest";

describe("Client", () => {
  describe("hooks", () => {
    const abi = [] as Abi;
    const adapter = new MockAdapter();
    adapter.onGetChainId().resolves(0);

    it("Calls getChainId hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getChainId", beforeHandler);
      client.hooks.on("after:getChainId", afterHandler);
      await client.getChainId();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls getBlockNumber hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getBlockNumber", beforeHandler);
      client.hooks.on("after:getBlockNumber", afterHandler);
      await client.getBlockNumber();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls getBlock hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getBlock", beforeHandler);
      client.hooks.on("after:getBlock", afterHandler);
      await client.getBlock();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls getBalance hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getBalance", beforeHandler);
      client.hooks.on("after:getBalance", afterHandler);
      await client.getBalance({ address: ALICE });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls getTransaction hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getTransaction", beforeHandler);
      client.hooks.on("after:getTransaction", afterHandler);
      await client.getTransaction({ hash: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls waitForTransaction hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:waitForTransaction", beforeHandler);
      client.hooks.on("after:waitForTransaction", afterHandler);
      await client.waitForTransaction({ hash: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls encodeFunctionData hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:encodeFunctionData", beforeHandler);
      client.hooks.on("after:encodeFunctionData", afterHandler);
      await client.encodeFunctionData({ abi, fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls encodeFunctionReturn hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:encodeFunctionReturn", beforeHandler);
      client.hooks.on("after:encodeFunctionReturn", afterHandler);
      await client.encodeFunctionReturn({ abi, fn: "", value: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls decodeFunctionData hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:decodeFunctionData", beforeHandler);
      client.hooks.on("after:decodeFunctionData", afterHandler);
      await client.decodeFunctionData({ abi, data: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls decodeFunctionReturn hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:decodeFunctionReturn", beforeHandler);
      client.hooks.on("after:decodeFunctionReturn", afterHandler);
      await client.decodeFunctionReturn({ abi, fn: "", data: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls call hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:call", beforeHandler);
      client.hooks.on("after:call", afterHandler);
      await client.call({ to: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls getEvents hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getEvents", beforeHandler);
      client.hooks.on("after:getEvents", afterHandler);
      await client.getEvents({ abi, address: "0x", event: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls read hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:read", beforeHandler);
      client.hooks.on("after:read", afterHandler);
      await client.read({ abi, address: "0x", fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls simulateWrite hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:simulateWrite", beforeHandler);
      client.hooks.on("after:simulateWrite", afterHandler);
      await client.simulateWrite({ abi, address: "0x", fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls write hooks", async () => {
      const client = createClient({
        adapter: new MockAdapter(),
      });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:write", beforeHandler);
      client.hooks.on("after:write", afterHandler);
      await client.write({ abi, address: "0x", fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls write hooks", async () => {
      const client = createClient({
        adapter: new MockAdapter(),
      });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:write", beforeHandler);
      client.hooks.on("after:write", afterHandler);
      await client.write({ abi, address: "0x", fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("Calls getSignerAddress hooks", async () => {
      const client = createClient({
        adapter: new MockAdapter(),
      });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getSignerAddress", beforeHandler);
      client.hooks.on("after:getSignerAddress", afterHandler);
      await client.getSignerAddress();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });
  });
});
