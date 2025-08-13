[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / GetBlockWithOptionsReturn

# Type Alias: GetBlockWithOptionsReturn\<T, TOptions\>

> **GetBlockWithOptionsReturn**\<`T`, `TOptions`\> = `TOptions` *extends* `object` ? [`Block`](Block.md)\<`T`\> : [`GetBlockReturn`](GetBlockReturn.md)\<`T`\>

Defined in: [packages/drift/src/client/Client.ts:96](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Client.ts#L96)

The awaited return type of a `Client.getBlock` call considering the
provided [`BlockIdentifier`](BlockIdentifier.md) and [`GetBlockOptions`](../interfaces/GetBlockOptions.md).

## Type Parameters

### T

`T` *extends* [`BlockIdentifier`](BlockIdentifier.md) \| `undefined` = `undefined`

### TOptions

`TOptions` *extends* [`GetBlockOptions`](../interfaces/GetBlockOptions.md) = \{ \}
