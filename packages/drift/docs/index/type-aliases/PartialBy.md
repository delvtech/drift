[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / PartialBy

# Type Alias: PartialBy\<T, K\>

> **PartialBy**\<`T`, `K`\> = `Omit`\<`T`, `K`\> & `Partial`\<`Pick`\<`T`, `K` & keyof `T`\>\>

Defined in: [packages/drift/src/utils/types.ts:77](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/types.ts#L77)

Make all properties in `T` whose keys are in the union `K` optional. Similar
to `Partial` but only applies to a subset of keys.

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T` \| `string` & `object`
