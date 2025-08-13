[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AbiArrayType

# Type Alias: AbiArrayType\<TAbi, TItemType, TName, TParameterKind\>

> **AbiArrayType**\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\> = [`AbiParameters`](AbiParameters.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\> *extends* infer TParameters ? \[`TParameters`\] *extends* \[`never`\] ? \[\] : `TParameters` *extends* readonly `AbiParameter`[] ? `AbiParametersToPrimitiveTypes`\<`TParameters`\> : \[\] : \[\]

Defined in: [packages/drift/src/adapter/types/Abi.ts:207](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L207)

Get an array of primitive types for any ABI parameters.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md)

### TItemType

`TItemType` *extends* `AbiItemType` = `AbiItemType`

### TName

`TName` *extends* [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\> = [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\>

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind` = `AbiParameterKind`

## Example

```ts
type ApproveInput = AbiArrayType<Erc20Abi, "function", "approve", "inputs">;
// -> [`0x${string}`, bigint]

type BalanceOutput = AbiArrayType<Erc20Abi, "function", "balanceOf", "outputs">;
// -> [bigint]
```
