[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / GetBlockReturn

# Type Alias: GetBlockReturn\<T\>

> **GetBlockReturn**\<`T`\> = `T` *extends* [`BlockTag`](BlockTag.md) \| `undefined` ? [`Block`](Block.md)\<`T`\> : [`Block`](Block.md)\<`T`\> \| `undefined`

Defined in: [packages/drift/src/adapter/types/Network.ts:66](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L66)

The awaited return type of a [`Network.getBlock`](../interfaces/Network.md#getblock) call considering
the provided [`BlockIdentifier`](BlockIdentifier.md).

## Type Parameters

### T

`T` *extends* [`BlockIdentifier`](BlockIdentifier.md) \| `undefined` = `undefined`
