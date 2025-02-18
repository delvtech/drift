import { toParamsArray } from "src/adapter/utils/toParamsArray";
import { erc20 } from "src/utils/testing/erc20";
import { expect, test } from "vitest";

test("toParamsArray", () => {
  const fromEmptyObject = toParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
    value: {},
  });
  expect(fromEmptyObject).toEqual([]);

  const fromUndefined = toParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
    value: undefined,
  });
  expect(fromUndefined).toEqual([]);

  const fromUnpackedValue = toParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: "ETH",
  });
  expect(fromUnpackedValue).toEqual(["ETH"]);

  const fromObject = toParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: { 0: "ETH" },
  });
  expect(fromObject).toEqual(["ETH"]);

  const fromArray = toParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: ["ETH"],
  });
  expect(fromArray).toEqual(["ETH"]);

  const fromObjectWithNamedKeys = toParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "transfer",
    kind: "inputs",
    value: {
      amount: 123n,
      to: "0x123",
    },
  });
  expect(fromObjectWithNamedKeys).toEqual(["0x123", 123n]);

  const votesAbi = [
    {
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "uint256" },
      ],
      name: "votes",
      outputs: [],
      stateMutability: "view",
      type: "function",
    },
  ] as const;
  const fromObjectWithNumberKeys = toParamsArray({
    abi: votesAbi,
    type: "function",
    name: "votes",
    kind: "inputs",
    value: {
      0: "0x123",
      1: 0n,
    },
  });
  expect(fromObjectWithNumberKeys).toEqual(["0x123", 0n]);
});
