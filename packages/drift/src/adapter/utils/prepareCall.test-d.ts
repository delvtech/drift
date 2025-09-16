import type { AbiEntry, Bytes } from "src/adapter/types/Abi";
import { prepareCall } from "src/adapter/utils/prepareCall";
import { TestToken } from "src/artifacts/TestToken";
import { describe, expectTypeOf, it } from "vitest";

describe("prepareCall", () => {
  it("accepts target calls", async () => {
    const preparedCall = prepareCall({ to: "0x123" });
    expectTypeOf(preparedCall).toEqualTypeOf<{
      to: "0x123";
      data: undefined;
      abiEntry: undefined;
    }>();
  });

  it("accepts abi function calls", async () => {
    const preparedCall = prepareCall({
      abi: TestToken.abi,
      address: "0x123",
      fn: "approve",
      args: {
        spender: "0x",
        amount: 100n,
      },
    });
    expectTypeOf(preparedCall).toEqualTypeOf<{
      to: "0x123";
      data: Bytes;
      abiEntry: AbiEntry<typeof TestToken.abi, "function", "approve">;
    }>();
  });

  it("accepts abi deploy calls", async () => {
    const preparedCall = prepareCall({
      abi: TestToken.abi,
      bytecode: "0x",
      args: {
        decimals_: 18,
        initialSupply: 1000n,
      },
    });
    expectTypeOf(preparedCall).toEqualTypeOf<{
      to: undefined;
      data: Bytes;
      abiEntry: AbiEntry<typeof TestToken.abi, "constructor">;
    }>();
  });

  it("accepts encoded deploy calls", async () => {
    const preparedCall = prepareCall({ data: "0x" });
    expectTypeOf(preparedCall).toEqualTypeOf<{
      to: undefined;
      data: Bytes;
      abiEntry: undefined;
    }>();
  });

  it("Throws on mixed call type props", async () => {
    prepareCall({
      to: "0x",
      data: "0x",
      // @ts-expect-error: Can't have both `to` and `bytecode`.
      bytecode: "0x",
    });

    prepareCall({
      to: "0x",
      data: "0x",
      // @ts-expect-error: Can't have both `to` and `address`.
      address: "0x",
    });

    prepareCall({
      abi: TestToken.abi,
      address: "0x",
      fn: "approve",
      // @ts-expect-error: the presence of `abi` and `fn` implies a function
      // call. Therefore, `to` is not allowed.
      to: "0x",
    });

    prepareCall({
      abi: TestToken.abi,
      address: "0x",
      fn: "approve",
      // @ts-expect-error: the presence of `abi` and `fn` implies a function
      // call. Therefore, `bytecode` is not allowed.
      bytecode: "0x",
    });

    prepareCall({
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
    prepareCall({
      abi: TestToken.abi,
      address: "0x",
      // @ts-expect-error
      fn: "",
    });
  });

  it("throws on invalid arg value", async () => {
    prepareCall({
      abi: TestToken.abi,
      address: "0x",
      fn: "approve",
      args: {
        // @ts-expect-error
        amount: "invalid",
      },
    });

    prepareCall({
      abi: TestToken.abi,
      bytecode: "0x",
      args: {
        // @ts-expect-error
        decimals_: "invalid",
      },
    });
  });

  it("throws on missing args", async () => {
    prepareCall({
      abi: TestToken.abi,
      address: "0x",
      fn: "approve",
      // @ts-expect-error
      args: {},
    });

    // @ts-expect-error
    prepareCall({
      abi: TestToken.abi,
      bytecode: "0x",
      args: {},
    });
  });
});
