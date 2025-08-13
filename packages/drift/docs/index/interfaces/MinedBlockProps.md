[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MinedBlockProps

# Interface: MinedBlockProps\<T\>

Defined in: [packages/drift/src/adapter/types/Block.ts:48](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Block.ts#L48)

Block properties that are conditionally available (undefined if pending)

## Type Parameters

### T

`T` *extends* [`BlockIdentifier`](../type-aliases/BlockIdentifier.md) \| `undefined` = [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

## Properties

### hash?

> `optional` **hash**: `T` *extends* `` `0x${string}` `` ? `T`\<`T`\> : `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Block.ts:52](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Block.ts#L52)

`undefined` if pending

***

### logsBloom?

> `optional` **logsBloom**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Block.ts:54](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Block.ts#L54)

`undefined` if pending

***

### nonce?

> `optional` **nonce**: `bigint`

Defined in: [packages/drift/src/adapter/types/Block.ts:56](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Block.ts#L56)

`undefined` if pending

***

### number?

> `optional` **number**: `T` *extends* `bigint` ? `T`\<`T`\> : `bigint`

Defined in: [packages/drift/src/adapter/types/Block.ts:58](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Block.ts#L58)

`undefined` if pending
