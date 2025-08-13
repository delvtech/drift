[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / OneOf

# Type Alias: OneOf\<T\>

> **OneOf**\<`T`\> = [`UnionKey`](UnionKey.md)\<`T`\> *extends* infer K ? `T` *extends* `T` ? [`Eval`](Eval.md)\<`T` & `{ [_ in Exclude<K, keyof T>]?: never }`\> : `never` : `never`

Defined in: [packages/drift/src/utils/types.ts:176](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/types.ts#L176)

Construct a type in which only a single member of `T` is valid at a time.

## Type Parameters

### T

`T` *extends* [`AnyObject`](AnyObject.md)

## Example

```ts
type U = OneOf<{ a: string } | { b: number }>;
// {
//   a: string;
//   b?: undefined;
// } | {
//   a?: undefined;
//   b: number;
// }
```
