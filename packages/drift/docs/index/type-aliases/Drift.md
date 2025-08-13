[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Drift

# Type Alias: Drift\<TAdapter, TStore\>

> **Drift**\<`TAdapter`, `TStore`\> = [`Client`](Client.md)\<`TAdapter`, `TStore`, \{ `contract`: [`Contract`](Contract.md)\<`TAbi`, `TThis`\[`"adapter"`\], `TThis`\[`"cache"`\]\[`"store"`\], `TThis`\>; \}\>

Defined in: [packages/drift/src/client/Drift.ts:27](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Drift.ts#L27)

A client for interacting with an Ethereum network through an
[`Adapter`](../interfaces/Adapter.md) with [caching](../classes/ClientCache.md) and
[hooks](../interfaces/HookRegistry.md).

Streamlined clients for interacting with specific contracts can be created
using the `Drift.contract` method.

## Type Parameters

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`Adapter`](../interfaces/Adapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)
