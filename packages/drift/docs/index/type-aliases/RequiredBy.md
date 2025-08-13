[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / RequiredBy

# Type Alias: RequiredBy\<T, K\>

> **RequiredBy**\<`T`, `K`\> = `Omit`\<`T`, `K`\> & `Required`\<`Pick`\<`T`, `K` & keyof `T`\>\>

Defined in: [packages/drift/src/utils/types.ts:70](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/types.ts#L70)

Make all properties in `T` whose keys are in the union `K` required. Similar
to `Required` but only applies to a subset of keys.

## Type Parameters

### T

`T`

### K

`K` *extends* keyof `T` \| `string` & `object`
