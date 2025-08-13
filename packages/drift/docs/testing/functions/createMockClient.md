[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / createMockClient

# Function: createMockClient()

> **createMockClient**\<`TAdapter`, `TStore`\>(`options`): [`MockClient`](../type-aliases/MockClient.md)\<`TAdapter`, `TStore`\>

Defined in: [packages/drift/src/client/MockClient.ts:20](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/MockClient.ts#L20)

## Type Parameters

### TAdapter

`TAdapter` *extends* [`MockAdapter`](../classes/MockAdapter.md) = [`MockAdapter`](../classes/MockAdapter.md)

### TStore

`TStore` *extends* [`Store`](../../index/interfaces/Store.md) = [`LruStore`](../../index/classes/LruStore.md)

## Parameters

### options

[`MockClientOptions`](../type-aliases/MockClientOptions.md)\<`TAdapter`, `TStore`\> = `{}`

## Returns

[`MockClient`](../type-aliases/MockClient.md)\<`TAdapter`, `TStore`\>
