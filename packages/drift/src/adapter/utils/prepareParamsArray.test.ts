import { prepareParamsArray } from "src/adapter/utils/prepareParamsArray";
import { erc20 } from "src/utils/testing/erc20";
import { expect, test } from "vitest";

test("prepareParamsArray", () => {
  const fromEmptyObject = prepareParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
    value: {},
  });
  expect(fromEmptyObject.params).toEqual([]);

  const fromUndefined = prepareParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
    value: undefined,
  });
  expect(fromUndefined.params).toEqual([]);

  const fromUnpackedValue = prepareParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: "ETH",
  });
  expect(fromUnpackedValue.params).toEqual(["ETH"]);

  const fromObject = prepareParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: { 0: "ETH" },
  });
  expect(fromObject.params).toEqual(["ETH"]);

  const fromArray = prepareParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: ["ETH"],
  });
  expect(fromArray.params).toEqual(["ETH"]);

  const fromObjectWithNamedKeys = prepareParamsArray({
    abi: erc20.abi,
    type: "function",
    name: "transfer",
    kind: "inputs",
    value: {
      amount: 123n,
      to: "0x123",
    },
  });
  expect(fromObjectWithNamedKeys.params).toEqual(["0x123", 123n]);

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
  const fromObjectWithNumberKeys = prepareParamsArray({
    abi: votesAbi,
    type: "function",
    name: "votes",
    kind: "inputs",
    value: {
      0: "0x123",
      1: 0n,
    },
  });
  expect(fromObjectWithNumberKeys.params).toEqual(["0x123", 0n]);
});
