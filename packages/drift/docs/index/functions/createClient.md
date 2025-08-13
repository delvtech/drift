[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / createClient

# Function: createClient()

> **createClient**\<`TAdapter`, `TStore`\>(`options`): [`Client`](../type-aliases/Client.md)\<`TAdapter`, `TStore`\>

Defined in: [packages/drift/src/client/Client.ts:146](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Client.ts#L146)

Creates a new [`Client`](../type-aliases/Client.md) instance that extends the provided adapter
or the default [`DefaultAdapter`](../classes/DefaultAdapter.md).

## Type Parameters

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`DefaultAdapter`](../classes/DefaultAdapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`LruStore`](../classes/LruStore.md)

## Parameters

### options

[`ClientOptions`](../type-aliases/ClientOptions.md)\<`TAdapter`, `TStore`\> = `{}`

## Returns

[`Client`](../type-aliases/Client.md)\<`TAdapter`, `TStore`\>
