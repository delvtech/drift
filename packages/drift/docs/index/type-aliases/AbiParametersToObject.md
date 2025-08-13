[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AbiParametersToObject

# Type Alias: AbiParametersToObject\<TParameters, TParameterKind\>

> **AbiParametersToObject**\<`TParameters`, `TParameterKind`\> = `TParameters` *extends* readonly \[\] ? [`EmptyObject`](EmptyObject.md) : `TParameters` *extends* readonly [`NamedAbiParameter`](NamedAbiParameter.md)[] ? `NamedParametersToObject`\<`TParameters`, `TParameterKind`\> : `NamedParametersToObject`\<`WithDefaultNames`\<`TParameters`\>, `TParameterKind`\>

Defined in: [packages/drift/src/adapter/types/Abi.ts:186](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L186)

Convert an array or tuple of abi parameters to an object type.

## Type Parameters

### TParameters

`TParameters` *extends* readonly `AbiParameter`[]

### TParameterKind

`TParameterKind` *extends* `AbiParameterKind` = `AbiParameterKind`

## Example

```ts
type ApproveArgs = AbiParametersToObject<[
  { name: "spender", type: "address" },
  { name: "value", type: "uint256" }
]>;
// -> { spender: `0x${string}`, value: bigint }
```
