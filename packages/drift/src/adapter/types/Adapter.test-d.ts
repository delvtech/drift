import type { Abi, Bytes } from "src/adapter/types/Abi";
import type {
  FunctionCallParams,
  MulticallCallResult,
  ReadWriteAdapter,
  TargetCallParams,
} from "src/adapter/types/Adapter";
import { MockERC20 } from "src/artifacts/MockERC20";
import { TestToken } from "src/artifacts/TestToken";
import { describe, expectTypeOf, it } from "vitest";

declare const adapter: ReadWriteAdapter;

describe("Adapter", () => {
  describe("estimateGas", () => {
    it("accepts target calls", async () => {
      adapter.estimateGas({ to: "0x" });
    });

    it("accepts abi function calls", async () => {
      adapter.estimateGas({
        abi: TestToken.abi,
        address: "0x",
        fn: "approve",
        args: {
          spender: "0x",
          amount: 100n,
        },
      });
    });

    it("accepts abi deploy calls", async () => {
      adapter.estimateGas({
        abi: TestToken.abi,
        bytecode: "0x",
        args: {
          decimals_: 18,
          initialSupply: 1000n,
        },
      });
    });

    it("accepts encoded deploy calls", async () => {
      adapter.estimateGas({ data: "0x" });
    });

    it("Throws on mixed call type props", async () => {
      adapter.estimateGas({
        to: "0x",
        data: "0x",
        // @ts-expect-error: Can't have both `to` and `bytecode`.
        bytecode: "0x",
      });

      adapter.estimateGas({
        to: "0x",
        data: "0x",
        // @ts-expect-error: Can't have both `to` and `address`.
        address: "0x",
      });

      adapter.estimateGas({
        abi: TestToken.abi,
        address: "0x",
        fn: "approve",
        // @ts-expect-error: the presence of `abi` and `fn` implies a function
        // call. Therefore, `to` is not allowed.
        to: "0x",
      });

      adapter.estimateGas({
        abi: TestToken.abi,
        address: "0x",
        fn: "approve",
        // @ts-expect-error: the presence of `abi` and `fn` implies a function
        // call. Therefore, `bytecode` is not allowed.
        bytecode: "0x",
      });

      adapter.estimateGas({
        abi: TestToken.abi,
        bytecode: "0x",
        args: {
          decimals_: 18,
          initialSupply: 1000n,
        },
        // @ts-expect-error: the presence of `abi` and `bytecode` implies a deploy
        // call. Therefore, `fn` is not allowed.
        fn: "approve",
      });
    });

    it("throws on invalid fn", async () => {
      adapter.estimateGas({
        abi: TestToken.abi,
        address: "0x",
        // @ts-expect-error
        fn: "",
      });
    });

    it("throws on invalid arg value", async () => {
      adapter.estimateGas({
        abi: TestToken.abi,
        address: "0x",
        fn: "approve",
        args: {
          // @ts-expect-error
          amount: "invalid",
        },
      });

      adapter.estimateGas({
        abi: TestToken.abi,
        bytecode: "0x",
        args: {
          // @ts-expect-error
          decimals_: "invalid",
        },
      });
    });

    it("throws on missing args", async () => {
      adapter.estimateGas({
        abi: TestToken.abi,
        address: "0x",
        fn: "approve",
        // @ts-expect-error
        args: {},
      });

      adapter.estimateGas({
        abi: TestToken.abi,
        bytecode: "0x",
        // @ts-expect-error
        args: {},
      });
    });
  });

  describe("multicall", () => {
    it("returns the correct type for each read", async () => {
      const [targetCallResult, symbolResult, balanceResult] =
        await adapter.multicall({
          calls: [
            // Target call
            {
              to: "0x",
            },
            // Function calls
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
      expectTypeOf(targetCallResult).toExtend<
        MulticallCallResult<TargetCallParams>
      >();
      expectTypeOf(symbolResult).toExtend<
        MulticallCallResult<FunctionCallParams<typeof TestToken.abi, "symbol">>
      >();
      expectTypeOf(balanceResult).toExtend<
        MulticallCallResult<
          FunctionCallParams<typeof MockERC20.abi, "balanceOf">
        >
      >();
    });

    it("returns the values directly when allowFailure is false", async () => {
      const [genericCallReturnData, symbol, balance] = await adapter.multicall({
        allowFailure: false,
        calls: [
          // Target call
          {
            to: "0x",
          },
          // Function calls
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
      expectTypeOf(genericCallReturnData).toEqualTypeOf<Bytes>();
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

    it("Throws on mixed call type props", async () => {
      adapter.multicall({
        calls: [
          {
            to: "0x",
            // @ts-expect-error: Can't have both `to` and `address`.
            address: "0x",
          },
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "decimals",
            // @ts-expect-error: the presence of `abi` implies a function call.
            // Therefore, `to` is not allowed.
            to: "0x",
          },
        ],
      });
    });

    it("throws on missing to", async () => {
      adapter.multicall({
        calls: [
          // @ts-expect-error
          {
            data: "0x",
          },
        ],
      });
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
    it("allows a mix of abi function calls, abi deploy calls, and target calls", async () => {
      adapter.sendCalls({
        calls: [
          // Target call
          {
            to: "0x",
          },
          // Function call
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "approve",
            args: {
              spender: "0x",
              amount: 100n,
            },
          },
          // Deploy call
          {
            abi: TestToken.abi,
            bytecode: "0x",
            args: {
              decimals_: 18,
              initialSupply: 1000n,
            },
          },
          // Encoded deploy call
          {
            data: "0x",
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
            // @ts-expect-error: Can't have both `to` and `bytecode`.
            bytecode: "0x",
          },
          {
            to: "0x",
            data: "0x",
            // @ts-expect-error: Can't have both `to` and `address`.
            address: "0x",
          },
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "decimals",
            // @ts-expect-error: the presence of `abi` and `fn` implies a function
            // call. Therefore, `to` is not allowed.
            to: "0x",
          },
          {
            abi: TestToken.abi,
            address: "0x",
            fn: "decimals",
            // @ts-expect-error: the presence of `abi` and `fn` implies a function
            // call. Therefore, `bytecode` is not allowed.
            bytecode: "0x",
          },
          {
            abi: TestToken.abi,
            bytecode: "0x",
            args: {
              decimals_: 18,
              initialSupply: 1000n,
            },
            // @ts-expect-error: the presence of `abi` and `bytecode` implies a deploy
            // call. Therefore, `fn` is not allowed.
            fn: "approve",
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
            fn: "",
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
          // @ts-expect-error
          {
            abi: TestToken.abi,
            bytecode: "0x",
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
