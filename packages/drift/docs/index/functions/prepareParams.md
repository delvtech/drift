[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / prepareParams

# Function: prepareParams()

> **prepareParams**\<`TAbi`, `TItemType`, `TName`, `TParameterKind`, `TValue`\>(`__namedParameters`): `object`

Defined in: [packages/drift/src/adapter/utils/prepareParams.ts:56](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/prepareParams.ts#L56)

Converts input or output values into an array, ensuring the correct number
and order of values are present.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TItemType

`TItemType` *extends* `AbiItemType`

### TName

`TName` *extends* `undefined` \| `string`

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind`

### TValue

`TValue` *extends* `Partial`\<[`AbiObjectType`](../type-aliases/AbiObjectType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\> \| [`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>\>

## Parameters

### \_\_namedParameters

#### abi

`TAbi`

#### kind

`TParameterKind`

#### name

`TName`

#### type

`TItemType`

#### value

`undefined` \| `TValue`

## Returns

`object`

### abiEntry

> **abiEntry**: [`AbiEntry`](../type-aliases/AbiEntry.md)\<`TAbi`, `TItemType`, `TName`, `any`, `TParameterKind`\>

### params

> **params**: [`AbiArrayType`](../type-aliases/AbiArrayType.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>

## Example

```ts
const approveCall = prepareParams({
  abi: erc20.abi,
  type: "function",
  name: "approve",
  kind: "inputs",
  value: { amount: 123n, spender: "0x..." },
});
// -> {
//   abiEntry: { type: "function", name: "approve", ... },
//   params: ["0x...", 123n],
// }

const balanceOfReturn = prepareParams({
  abi: erc20.abi,
  type: "function",
  name: "balanceOf",
  kind: "outputs",
  value: 123n,
});
// -> {
//   abiEntry: { type: "function", name: "balanceOf", ... },
//   params: [123n],
// }
```
