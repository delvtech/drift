[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / arrayToSimplified

# Function: arrayToSimplified()

> **arrayToSimplified**\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>(`__namedParameters`): [`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>

Defined in: [packages/drift/src/adapter/utils/arrayToSimplified.ts:45](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/arrayToSimplified.ts#L45)

Converts an array of input or output values into an
[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md) type, ensuring the values are properly
identified based on their index.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TItemType

`TItemType` *extends* `AbiItemType`

### TName

`TName` *extends* `undefined` \| `string`

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind`

## Parameters

### \_\_namedParameters

#### abi

`TAbi`

#### kind

`TParameterKind`

#### name

`TName`

#### values?

`Partial`\<[`AbiArrayType`](../type-aliases/AbiArrayType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>\>

## Returns

[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>

## Example

```ts
const abi = [
  {
    name: "names",
    type: "function",
    inputs: [],
    outputs: [
      { name: "actorA", type: "string" },
      { name: "actorB", type: "string" },
    ],
    stateMutability: "view",
  },
]] as const;

const output1 = arrayToSimplified({
  abi,
  type: "function",
  name: "names",
  kind: "outputs",
  values: ["alice", "bob"],
}); // -> { actorA: "alice", actorB: "bob" }

const output2 = arrayToSimplified({
  abi: erc20.abi,
  type: "function",
  name: "balanceOf",
  kind: "outputs",
  values: [123n],
}); // -> 123n
```
