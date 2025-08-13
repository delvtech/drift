[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / RequiredValueKey

# Type Alias: RequiredValueKey\<T\>

> **RequiredValueKey**\<`T`\> = keyof `{ [K in keyof T as [T[K]] extends [never] ? never : undefined extends T[K] ? never : K]: any }`

Defined in: [packages/drift/src/utils/types.ts:128](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/types.ts#L128)

Get a union of all keys in `T` that are required, not `never`, and
not assignable to undefined.

## Type Parameters

### T

`T`
