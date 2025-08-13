[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ClientOptions

# Type Alias: ClientOptions\<TAdapter, TStore\>

> **ClientOptions**\<`TAdapter`, `TStore`\> = [`Eval`](Eval.md)\<[`OneOf`](OneOf.md)\<\{ `adapter?`: `TAdapter`; \} \| [`DefaultAdapterOptions`](../interfaces/DefaultAdapterOptions.md)\> & `object`\>

Defined in: [packages/drift/src/client/Client.ts:104](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Client.ts#L104)

Configuration options for creating a [`Client`](Client.md).

## Type Parameters

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`Adapter`](../interfaces/Adapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)
