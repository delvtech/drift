[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / MockClientOptions

# Type Alias: MockClientOptions\<TAdapter, TStore\>

> **MockClientOptions**\<`TAdapter`, `TStore`\> = `object`

Defined in: [packages/drift/src/client/MockClient.ts:11](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/MockClient.ts#L11)

## Type Parameters

### TAdapter

`TAdapter` *extends* [`MockAdapter`](../classes/MockAdapter.md) = [`MockAdapter`](../classes/MockAdapter.md)

### TStore

`TStore` *extends* [`Store`](../../index/interfaces/Store.md) = [`Store`](../../index/interfaces/Store.md)

## Properties

### adapter?

> `optional` **adapter**: `TAdapter`

Defined in: [packages/drift/src/client/MockClient.ts:15](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/MockClient.ts#L15)

***

### chainId?

> `optional` **chainId**: `number`

Defined in: [packages/drift/src/client/MockClient.ts:17](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/MockClient.ts#L17)

***

### store?

> `optional` **store**: [`LruStore`](../../index/classes/LruStore.md) *extends* `TStore` ? `TStore` \| [`LruStoreOptions`](../../index/type-aliases/LruStoreOptions.md) : `TStore`

Defined in: [packages/drift/src/client/MockClient.ts:16](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/MockClient.ts#L16)
