[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AbiObjectType

# Type Alias: AbiObjectType\<TAbi, TItemType, TName, TParameterKind\>

> **AbiObjectType**\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\> = [`AbiParametersToObject`](AbiParametersToObject.md)\<[`AbiParameters`](AbiParameters.md)\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\>\>

Defined in: [packages/drift/src/adapter/types/Abi.ts:237](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L237)

Get an object of primitive types for any ABI parameters.

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
type ApproveArgs = AbiObjectType<Erc20Abi, "function", "approve", "inputs">;
// -> { spender: `0x${string}`, value: bigint }

type Balance = AbiObjectType<Erc20Abi, "function", "balanceOf", "outputs">;
// -> { balance: bigint }
```
