[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AbiParameters

# Type Alias: AbiParameters\<TAbi, TItemType, TName, TParameterKind\>

> **AbiParameters**\<`TAbi`, `TItemType`, `TName`, `TParameterKind`\> = [`Abi`](Abi.md) *extends* `TAbi` ? `AbiParameter`[] : [`AbiEntry`](AbiEntry.md)\<`TAbi`, `TItemType`, `TName`\> *extends* infer TAbiEntry ? `TAbiEntry` *extends* `TAbiEntry` ? `TParameterKind` *extends* keyof `TAbiEntry` ? `TAbiEntry`\[`TParameterKind`\] : \[\] : \[\] : \[\]

Defined in: [packages/drift/src/adapter/types/Abi.ts:159](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L159)

Get the parameters for a specific ABI entry.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TItemType

`TItemType` *extends* `AbiItemType` = `AbiItemType`

### TName

`TName` *extends* [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\> = [`AbiEntryName`](AbiEntryName.md)\<`TAbi`, `TItemType`\>

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind` = `AbiParameterKind`

## Example

```ts
type ApproveParameters = AbiParameters<Erc20Abi, "function", "approve", "inputs">;
// -> [{ name: "spender", type: "address" }, { name: "value", type: "uint256" }]
```
