[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / MockContractClientOptions

# Type Alias: MockContractClientOptions\<TAdapter, TStore, TClient\>

> **MockContractClientOptions**\<`TAdapter`, `TStore`, `TClient`\> = [`OneOf`](../../index/type-aliases/OneOf.md)\<\{ `client?`: `TClient`; \} \| [`MockClientOptions`](MockClientOptions.md)\<`TAdapter`, `TStore`\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:156](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L156)

## Type Parameters

### TAdapter

`TAdapter` *extends* [`MockAdapter`](../classes/MockAdapter.md) = [`MockAdapter`](../classes/MockAdapter.md)

### TStore

`TStore` *extends* [`Store`](../../index/interfaces/Store.md) = [`Store`](../../index/interfaces/Store.md)

### TClient

`TClient` *extends* [`MockClient`](MockClient.md)\<`TAdapter`, `TStore`\> = [`MockClient`](MockClient.md)\<`TAdapter`, `TStore`\>
