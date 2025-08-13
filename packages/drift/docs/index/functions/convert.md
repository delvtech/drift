[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / convert

# Function: convert()

> **convert**\<`T`, `TOriginal`, `TNew`\>(`value`, `predicateFn`, `converterFn`): [`Converted`](../type-aliases/Converted.md)\<`T`, `TOriginal`, `TNew`\>

Defined in: [packages/drift/src/utils/convert.ts:24](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/convert.ts#L24)

Recursively converts values. The `predicateFn` is
used to determine if the `converterFn` should be run on the value.

The function first checks the value itself, if the `predicateFn` returns
false and the value is an array or object, the function will recursively
check each item in the array or object.

## Type Parameters

### T

`T`

### TOriginal

`TOriginal`

### TNew

`TNew`

## Parameters

### value

`T`

The value to recursively convert.

### predicateFn

(`value`) => `value is TOriginal`

A function that returns true if the `converterFn` should
be run on the value.

### converterFn

(`value`) => `TNew`

A function that converts the value.

## Returns

[`Converted`](../type-aliases/Converted.md)\<`T`, `TOriginal`, `TNew`\>

The recursively converted value.

## Example

```ts
// Convert all bigints to string.
convert(
  { a: 100n, b: { c: 200n }, d: [300n] },
  (value) => typeof value === "bigint",
  (value) => value.toString(),
);
// => { a: "100", b: { c: "200" }, d: ["300"] }
```
