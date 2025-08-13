[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / createDrift

# Function: createDrift()

> **createDrift**\<`TAdapter`, `TStore`\>(`options`): [`Drift`](../type-aliases/Drift.md)\<`TAdapter`, `TStore`\>

Defined in: [packages/drift/src/client/Drift.ts:46](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Drift.ts#L46)

## Type Parameters

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`DefaultAdapter`](../classes/DefaultAdapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`LruStore`](../classes/LruStore.md)

## Parameters

### options

[`DriftOptions`](../type-aliases/DriftOptions.md)\<`TAdapter`, `TStore`\> = `{}`

## Returns

[`Drift`](../type-aliases/Drift.md)\<`TAdapter`, `TStore`\>
