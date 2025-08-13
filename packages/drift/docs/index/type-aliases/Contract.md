[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Contract

# Type Alias: Contract\<TAbi, TAdapter, TStore, TClient\>

> **Contract**\<`TAbi`, `TAdapter`, `TStore`, `TClient`\> = `TAdapter` *extends* [`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md) ? [`ReadWriteContract`](../classes/ReadWriteContract.md)\<`TAbi`, `TAdapter`, `TStore`, `TClient`\> : [`ReadContract`](../classes/ReadContract.md)\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:43](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L43)

An interface for interacting with a smart contract through a drift
[`Client`](Client.md).

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`Adapter`](../interfaces/Adapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

### TClient

`TClient` *extends* [`Client`](Client.md)\<`TAdapter`, `TStore`\> = [`Client`](Client.md)\<`TAdapter`, `TStore`\>
