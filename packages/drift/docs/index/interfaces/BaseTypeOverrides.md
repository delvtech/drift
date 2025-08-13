[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / BaseTypeOverrides

# Interface: BaseTypeOverrides

Defined in: [packages/drift/src/adapter/types/Abi.ts:45](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L45)

An interface of common types that might be typed differently in different
implementations. These types can be overridden via [`module
augmentation`](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

**Overridable Types**:

- [`Abi`](../type-aliases/Abi.md) - The type of an ABI array.
- [`Address`](../type-aliases/Address.md) - The type of an Ethereum address.
- [`Bytes`](../type-aliases/Bytes.md) - The type of byte data.
- [`Hash`](../type-aliases/Hash.md) - The type of a keccak256 hash.
- [`HexString`](../type-aliases/HexString.md) - The type of a hexadecimal string.

## Example

```ts
declare module "@delvtech/drift" {
  export interface BaseTypeOverrides {
    HexString: string;
  }
}
```
**Note**: The `Address`, `Bytes`, and `Hash` types are all aliases of the
`HexString` type by default. Overriding `HexString` will override all three
types. Each type can be further customized individually as needed.
