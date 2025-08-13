[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / FunctionKey

# Type Alias: FunctionKey\<T\>

> **FunctionKey**\<`T`\> = keyof `{ [K in keyof T as Required<T>[K] extends Function ? K : never]: never }`

Defined in: [packages/drift/src/utils/types.ts:152](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/types.ts#L152)

Get a union of all keys on `T` that are functions

## Type Parameters

### T

`T`
