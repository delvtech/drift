[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AbiEntry

# Type Alias: AbiEntry\<TAbi, TItemType, TName, TStateMutability, TParameterKind\>

> **AbiEntry**\<`TAbi`, `TItemType`, `TName`, `TStateMutability`, `TParameterKind`\> = `ExtractFiltered`\<`TAbi`\[`number`\], `AbiFilter`\<`TItemType`, `TName`, `TStateMutability`, `TParameterKind`\>\>

Defined in: [packages/drift/src/adapter/types/Abi.ts:135](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L135)

Get the ABI entry for a specific type, name, state mutability, and that
includes a specific parameter kind.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TItemType

`TItemType` *extends* `AbiItemType` = `AbiItemType`

### TName

`TName` *extends* [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\> = [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\>

### TStateMutability

`TStateMutability` *extends* `AbiStateMutability` \| `undefined` = `AbiStateMutability` \| `undefined`

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind` \| `undefined` = `AbiParameterKind` \| `undefined`

## Example

```ts
type ApproveEntry = AbiEntry<Erc20Abi, "function", "approve">;
// ->
// {
//   type: "function";
//   name: "approve";
//   inputs: [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }];
//   outputs: [{ name: "", type: "bool" }];
//   stateMutability: "nonpayable";
// }
```
