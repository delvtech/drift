[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AbiEntryName

# Type Alias: AbiEntryName\<TAbi, TItemType, TStateMutability, TParameterKind\>

> **AbiEntryName**\<`TAbi`, `TItemType`, `TStateMutability`, `TParameterKind`\> = `TItemType` *extends* `NamelessAbiItemTypes` ? `undefined` : `TAbi`\[`number`\] *extends* infer TEntry ? `ExtractFiltered`\<`TEntry`, `AbiFilter`\<`TItemType`, `string`, `TStateMutability`, `TParameterKind`\>\> : `never` *extends* infer TEntry ? `TEntry`\[`"name"`\] : `never`

Defined in: [packages/drift/src/adapter/types/Abi.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L93)

Get a union of possible names for an ABI entry. If the entry does not have a
name, `undefined` will be returned.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md)

### TItemType

`TItemType` *extends* `AbiItemType` = `AbiItemType`

### TStateMutability

`TStateMutability` *extends* `AbiStateMutability` \| `undefined` = `AbiStateMutability` \| `undefined`

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind` \| `undefined` = `AbiParameterKind` \| `undefined`

## Example

```ts
type Erc20EventNames = AbiEntryName<Erc20Abi, "event">;
// -> "Approval" | "Transfer"

type Erc20ConstructorName = AbiEntryName<Erc20Abi, "constructor">;
// -> undefined
```
