[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Converted

# Type Alias: Converted\<T, U, V\>

> **Converted**\<`T`, `U`, `V`\> = `T` *extends* `U` ? `V` : `T` *extends* infer Inner[] ? `Converted`\<`Inner`, `U`, `V`\>[] : `T` *extends* `object` ? `{ [K in keyof T]: Converted<T[K], U, V> }` : `T`

Defined in: [packages/drift/src/utils/convert.ts:67](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/convert.ts#L67)

Convert all properties in `T` whose values are of type `U` to type `V`. If
`T` is `U`, convert `T` itself to `V`.

## Type Parameters

### T

`T`

### U

`U`

### V

`V`

## Example

```ts
type Converted = Converted<{ a: string, b: number }, string, number>;
// { a: number, b: number }

type ConvertedSimple = Converted<100n, bigint, number>;
// number

type NotConverted = Converted<"foo", bigint, number>;
// "foo"
```
