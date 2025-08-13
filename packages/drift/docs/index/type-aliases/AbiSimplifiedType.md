[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AbiSimplifiedType

# Type Alias: AbiSimplifiedType\<TAbi, TItemType, TName, TParameterKind, TStateMutability\>

> **AbiSimplifiedType**\<`TAbi`, `TItemType`, `TName`, `TParameterKind`, `TStateMutability`\> = [`AbiEntry`](AbiEntry.md)\<`TAbi`, `TItemType`, `TName`, `TStateMutability`, `TParameterKind`\> *extends* infer TAbiEntry ? \[`TAbiEntry`\] *extends* \[`never`\] ? `undefined` : `TAbiEntry`\[`TParameterKind`\] *extends* readonly \[\] ? `undefined` : `TAbiEntry`\[`TParameterKind`\] *extends* readonly \[`AbiParameter`\] ? `AbiParameterToPrimitiveType`\<`TAbiEntry`\[`TParameterKind`\]\[`0`\], `TParameterKind`\> : `TAbiEntry`\[`TParameterKind`\] *extends* readonly \[`AbiParameter`, `...AbiParameter[]`\] ? [`AbiParametersToObject`](AbiParametersToObject.md)\<`TAbiEntry`\[`TParameterKind`\], `TParameterKind`\> : `unknown` : `undefined`

Defined in: [packages/drift/src/adapter/types/Abi.ts:267](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L267)

Get a simplified primitive type for any ABI parameters, which is determined
by the number of parameters:
- __Single parameter:__ the primitive type of the parameter.
- __Multiple parameters:__ an object with the parameter names as keys and the
  their primitive types as values. If a parameter has no name, it's index is
  used as the key.
- __No parameters:__ `undefined`.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md)

### TItemType

`TItemType` *extends* `AbiItemType` = `AbiItemType`

### TName

`TName` *extends* [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\> = [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\>

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind` = `AbiParameterKind`

### TStateMutability

`TStateMutability` *extends* `AbiStateMutability` = `AbiStateMutability`

## Example

```ts
type ApproveArgs = AbiSimplifiedType<Erc20Abi, "function", "approve", "inputs">;
// -> { spender: `0x${string}`, value: bigint }

type Balance = AbiSimplifiedType<Erc20Abi, "function", "balanceOf", "outputs">;
// -> bigint

type DecimalArgs = AbiSimplifiedType<Erc20Abi, "function", "decimals", "inputs">;
// -> undefined
```
