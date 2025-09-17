import { MockAdapter } from "src/adapter/MockAdapter";
import type { Abi, Address } from "src/adapter/types/Abi";
import type {
  GetEventsParams,
  MulticallCallResult,
} from "src/adapter/types/Adapter";
import type { EventLog } from "src/adapter/types/Event";
import { TestToken } from "src/artifacts/TestToken";
import { createClient } from "src/client/Client";
import { BlockNotFoundError } from "src/client/errors";
import { ALICE } from "src/utils/testing/accounts";
import { describe, expect, it, vi } from "vitest";

const abi = [] as Abi;
const adapter = new MockAdapter();
adapter.onGetChainId().resolves(0);

describe("Client", () => {
  it("maintains the adapter prototype chain", () => {
    class CustomAdapter extends MockAdapter {}
    const client = createClient({ adapter: new CustomAdapter() });
    expect(client).toBeInstanceOf(CustomAdapter);
    expect(client).toBeInstanceOf(MockAdapter);
  });

  describe("multicall", () => {
    it("returns results in the same order they're requested", async () => {
      const client = createClient({ rpcUrl: process.env.VITE_RPC_URL });
      const address = process.env.VITE_TOKEN_ADDRESS as Address;
      const [nameResult, symbolResult, supplyResult, decimalsResult] =
        await client.multicall({
          calls: [
            { abi: TestToken.abi, address, fn: "name" },
            { abi: TestToken.abi, address, fn: "symbol" },
            { abi: TestToken.abi, address, fn: "totalSupply" },
            { abi: TestToken.abi, address, fn: "decimals" },
          ],
        });
      expect(nameResult).toMatchObject({
        success: true,
        value: expect.any(String),
      } satisfies MulticallCallResult);
      expect(symbolResult).toMatchObject({
        success: true,
        value: expect.any(String),
      } satisfies MulticallCallResult);
      expect(supplyResult).toMatchObject({
        success: true,
        value: expect.any(BigInt),
      } satisfies MulticallCallResult);
      expect(decimalsResult).toMatchObject({
        success: true,
        value: expect.any(Number),
      } satisfies MulticallCallResult);
    });

    it("returns cached call and read calls", async () => {
      const client = createClient({ adapter });
      const abi = TestToken.abi;
      client.cache.preloadCall({
        to: "0x",
        data: "0x123",
        preloadValue: "0xabc",
      });
      client.cache.preloadRead({
        abi,
        address: "0x",
        fn: "name",
        value: "Test Token",
      });
      const [data, name] = await client.multicall({
        calls: [
          { to: "0x", data: "0x123" },
          { abi, address: "0x", fn: "name" },
        ],
        allowFailure: false,
      });
      expect(data).toBe("0xabc");
      expect(name).toBe("Test Token");
    });

    it("returns cached call and read calls in the correct format", async () => {
      const client = createClient({ adapter });
      const abi = TestToken.abi;
      client.cache.preloadCall({
        to: "0x",
        data: "0x123",
        preloadValue: "0xabc",
      });
      client.cache.preloadRead({
        abi,
        address: "0x",
        fn: "name",
        value: "Test Token",
      });
      const [data, name] = await client.multicall({
        calls: [
          { to: "0x", data: "0x123" },
          { abi, address: "0x", fn: "name" },
        ],
      });
      expect(data).toStrictEqual({ success: true, value: "0xabc" });
      expect(name).toStrictEqual({ success: true, value: "Test Token" });
    });
  });

  describe("getEvents", () => {
    it("uses the same default options as `ClientCache`", async () => {
      const client = createClient({ adapter });
      const params: GetEventsParams = {
        abi,
        address: "0x",
        event: "foo",
      };
      const events = [{}, {}] as EventLog[];
      await client.cache.preloadEvents({
        ...params,
        value: events,
      });
      const result = await client.getEvents(params);
      expect(result).toBe(events);
    });
  });

  describe("getBlock", () => {
    it("throws if no block is found and `throws` is true", async () => {
      const client = createClient({ adapter });
      client.onGetBlock().resolves(undefined);
      await expect(client.getBlock("latest", { throws: true })).rejects.toThrow(
        BlockNotFoundError,
      );
    });
  });

  describe("hooks", () => {
    it("calls getChainId hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getChainId", beforeHandler);
      client.hooks.on("after:getChainId", afterHandler);
      await client.getChainId();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls getBlockNumber hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getBlockNumber", beforeHandler);
      client.hooks.on("after:getBlockNumber", afterHandler);
      await client.getBlockNumber();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls getBlock hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getBlock", beforeHandler);
      client.hooks.on("after:getBlock", afterHandler);
      await client.getBlock();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls getBalance hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getBalance", beforeHandler);
      client.hooks.on("after:getBalance", afterHandler);
      await client.getBalance({ address: ALICE });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls getBytecode hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getBytecode", beforeHandler);
      client.hooks.on("after:getBytecode", afterHandler);
      await client.getBytecode({ address: ALICE });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls getGasPrice hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getGasPrice", beforeHandler);
      client.hooks.on("after:getGasPrice", afterHandler);
      await client.getGasPrice();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls estimateGas hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:estimateGas", beforeHandler);
      client.hooks.on("after:estimateGas", afterHandler);
      await client.estimateGas({ to: "0x", data: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls getTransaction hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getTransaction", beforeHandler);
      client.hooks.on("after:getTransaction", afterHandler);
      await client.getTransaction({ hash: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls waitForTransaction hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:waitForTransaction", beforeHandler);
      client.hooks.on("after:waitForTransaction", afterHandler);
      await client.waitForTransaction({ hash: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls encodeDeployData hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:encodeDeployData", beforeHandler);
      client.hooks.on("after:encodeDeployData", afterHandler);
      await client.encodeDeployData({ abi, bytecode: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls encodeFunctionData hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:encodeFunctionData", beforeHandler);
      client.hooks.on("after:encodeFunctionData", afterHandler);
      await client.encodeFunctionData({ abi, fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls encodeFunctionReturn hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:encodeFunctionReturn", beforeHandler);
      client.hooks.on("after:encodeFunctionReturn", afterHandler);
      await client.encodeFunctionReturn({ abi, fn: "", value: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls decodeFunctionData hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:decodeFunctionData", beforeHandler);
      client.hooks.on("after:decodeFunctionData", afterHandler);
      await client.decodeFunctionData({ abi, data: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls decodeFunctionReturn hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:decodeFunctionReturn", beforeHandler);
      client.hooks.on("after:decodeFunctionReturn", afterHandler);
      await client.decodeFunctionReturn({ abi, fn: "", data: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls call hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:call", beforeHandler);
      client.hooks.on("after:call", afterHandler);
      await client.call({ to: "0x" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls multicall hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:multicall", beforeHandler);
      client.hooks.on("after:multicall", afterHandler);
      await client.multicall({ calls: [] });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls getEvents hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getEvents", beforeHandler);
      client.hooks.on("after:getEvents", afterHandler);
      await client.getEvents({ abi, address: "0x", event: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls read hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:read", beforeHandler);
      client.hooks.on("after:read", afterHandler);
      await client.read({ abi, address: "0x", fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls simulateWrite hooks", async () => {
      const client = createClient({ adapter });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:simulateWrite", beforeHandler);
      client.hooks.on("after:simulateWrite", afterHandler);
      await client.simulateWrite({ abi, address: "0x", fn: "" });

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });

    it("calls write hooks", async () => {
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

    it("calls write hooks", async () => {
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

    it("calls getSignerAddress hooks", async () => {
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

  describe("extend", () => {
    it("extends client", async () => {
      const client = createClient({ adapter }).extend({
        foo() {},
      });
      expect(client.foo).toBeDefined();
    });

    it("maintains hook proxy", async () => {
      const client = createClient({ adapter }).extend({
        foo() {},
      });
      const beforeHandler = vi.fn(async ({ resolve }) => resolve());
      const afterHandler = vi.fn();

      client.hooks.on("before:getChainId", beforeHandler);
      client.hooks.on("after:getChainId", afterHandler);
      await client.getChainId();

      expect(beforeHandler).toHaveBeenCalledTimes(1);
      expect(afterHandler).toHaveBeenCalledTimes(1);
    });
  });
});
