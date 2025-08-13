[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / arrayToObject

# Function: arrayToObject()

> **arrayToObject**\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>(`__namedParameters`): [`AbiObjectType`](../type-aliases/AbiObjectType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>

Defined in: [packages/drift/src/adapter/utils/arrayToObject.ts:53](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/arrayToObject.ts#L53)

Converts an array of input or output values into an object typ, ensuring the
values are properly identified based on their index.

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

[`AbiObjectType`](../type-aliases/AbiObjectType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>

## Example

```ts
const abi = [
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Approval",
    inputs: [
      { indexed: true, name: "owner", type: "address" },
      { indexed: true, name: "spender", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
  },
] as const;

const parsedArgs = arrayToObject({
  abi,
  type: "function",
  name: "transfer",
  kind: "inputs",
  values: ["0x123", 123n],
}); // -> { to: "0x123", value: 123n }

const parsedFilter = arrayToObject({
  abi,
  type: "event",
  name: "Approval",
  kind: "inputs",
  values: [undefined, "0x123", undefined],
}); // -> { owner: undefined, spender: "0x123", value: undefined }
```
