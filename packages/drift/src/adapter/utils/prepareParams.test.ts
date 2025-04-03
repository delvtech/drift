import { prepareParams } from "src/adapter/utils/prepareParams";
import { IERC20 } from "src/artifacts/IERC20";
import { expect, test } from "vitest";

test("prepareParams", () => {
  const fromEmptyObject = prepareParams({
    abi: IERC20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
    value: {},
  });
  expect(fromEmptyObject.params).toEqual([]);

  const fromUndefined = prepareParams({
    abi: IERC20.abi,
    type: "function",
    name: "symbol",
    kind: "inputs",
    value: undefined,
  });
  expect(fromUndefined.params).toEqual([]);

  const fromUnpackedValue = prepareParams({
    abi: IERC20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: "ETH",
  });
  expect(fromUnpackedValue.params).toEqual(["ETH"]);

  const fromObject = prepareParams({
    abi: IERC20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: { 0: "ETH" },
  });
  expect(fromObject.params).toEqual(["ETH"]);

  const fromArray = prepareParams({
    abi: IERC20.abi,
    type: "function",
    name: "symbol",
    kind: "outputs",
    value: ["ETH"],
  });
  expect(fromArray.params).toEqual(["ETH"]);

  const fromObjectWithNamedKeys = prepareParams({
    abi: IERC20.abi,
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
  const fromObjectWithNumberKeys = prepareParams({
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
