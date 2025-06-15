import type { Abi } from "src/adapter/types/Abi";
import type {
  MulticallCallResult,
  ReadWriteAdapter,
} from "src/adapter/types/Adapter";
import { IERC20 } from "src/artifacts/IERC20";
import { MockERC20 } from "src/artifacts/MockERC20";
import { TestToken } from "src/artifacts/TestToken";
import { describe, expectTypeOf, it } from "vitest";

declare const adapter: ReadWriteAdapter;

describe("Adapter", () => {
  describe("multicall", () => {
    it("returns the correct type for each read", async () => {
      const [symbolResult, decimalsResult] = await adapter.multicall({
        calls: [
          {
            abi: IERC20.abi,
            address: "0x",
            fn: "symbol",
          },
          {
            abi: MockERC20.abi,
            address: "0x",
            fn: "balanceOf",
            args: { owner: "0x" },
          },
        ],
      });
      expectTypeOf(symbolResult).toExtend<
        MulticallCallResult<typeof TestToken.abi, "symbol">
      >();
      expectTypeOf(decimalsResult).toExtend<
        MulticallCallResult<typeof MockERC20.abi, "balanceOf">
      >();
    });

    it("returns the values directly when allowFailure is false", async () => {
      const [symbol, balance] = await adapter.multicall({
        allowFailure: false,
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "symbol",
          },
          {
            abi: MockERC20.abi,
            address: "0x",
            fn: "balanceOf",
            args: { owner: "0x" },
          },
        ],
      });
      expectTypeOf(symbol).toEqualTypeOf<string>();
      expectTypeOf(balance).toEqualTypeOf<bigint>();
    });

    it("returns unknown for unknown fn", async () => {
      const [result] = await adapter.multicall({
        calls: [
          {
            abi: [] as Abi,
            address: "0x",
            fn: "foo",
          },
        ],
      });
      expectTypeOf(result).toExtend<MulticallCallResult>();
      expectTypeOf(result.value).toEqualTypeOf<unknown>();
    });

    it("throws on invalid fn", async () => {
      adapter.multicall({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            // @ts-expect-error
            fn: "nonExistentFn",
          },
        ],
      });
    });

    it("throws on invalid arg value", async () => {
      adapter.multicall({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "approve",
            args: {
              // @ts-expect-error
              amount: "invalid",
            },
          },
        ],
      });
    });

    it("throws on missing args", async () => {
      adapter.multicall({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "balanceOf",
            // @ts-expect-error
            args: {},
          },
        ],
      });
    });

    it("infers the function name with only the abi", async () => {
      adapter.multicall({
        calls: [
          {
            abi: TestToken.abi,
            // @ts-expect-error
            fn: "",
          },
        ],
      });
    });
  });

  describe("sendCalls", () => {
    it("allows a mix of encoded calls, abi function calls, and deploy calls", async () => {
      adapter.sendCalls({
        calls: [
          {
            to: "0x",
            data: "0x",
          },
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "approve",
            args: {
              spender: "0x",
              amount: 100n,
            },
          },
          {
            abi: TestToken.abi,
            bytecode: "0x",
            args: {
              decimals_: 18,
              initialSupply: 1000n,
            },
          },
        ],
      });
    });

    it("Throws on mixed call type props", async () => {
      adapter.sendCalls({
        calls: [
          {
            to: "0x",
            data: "0x",
            // @ts-expect-error: The absence of `abi` implies an encoded call.
            address: "0x",
          },
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "approve",
            args: {
              spender: "0x",
              amount: 100n,
            },
            // @ts-expect-error: The presence of `abi` implies a function call
            // or deploy call.
            to: "0x",
          },
          {
            abi: TestToken.abi,
            bytecode: "0x",
            args: {
              decimals_: 18,
              initialSupply: 1000n,
            },
            // @ts-expect-error: the presence of `bytecode` implies a deploy
            // call.
            fn: "constructor",
          },
        ],
      });
    });

    it("throws on invalid fn", async () => {
      adapter.sendCalls({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            // @ts-expect-error
            fn: "nonExistentFn",
          },
        ],
      });
    });

    it("throws on invalid arg value", async () => {
      adapter.sendCalls({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "approve",
            args: {
              // @ts-expect-error
              amount: "invalid",
            },
          },
          {
            abi: TestToken.abi,
            bytecode: "0x",
            args: {
              // @ts-expect-error
              decimals_: "invalid",
            },
          },
        ],
      });
    });

    it("throws on missing args", async () => {
      adapter.sendCalls({
        calls: [
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "balanceOf",
            // @ts-expect-error
            args: {},
          },
          {
            abi: TestToken.abi,
            bytecode: "0x",
            // @ts-expect-error
            args: {},
          },
        ],
      });
    });

    it("infers the function name with only the abi", async () => {
      adapter.sendCalls({
        calls: [
          {
            abi: TestToken.abi,
            // @ts-expect-error
            fn: "",
          },
        ],
      });
    });
  });
});
