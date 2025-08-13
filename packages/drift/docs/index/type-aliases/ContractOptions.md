[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ContractOptions

# Type Alias: ContractOptions\<TAbi, TAdapter, TStore, TClient\>

> **ContractOptions**\<`TAbi`, `TAdapter`, `TStore`, `TClient`\> = [`Eval`](Eval.md)\<[`ContractBaseOptions`](ContractBaseOptions.md)\<`TAbi`\> & [`OneOf`](OneOf.md)\<\{ `client?`: `TClient`; \} \| [`ClientOptions`](ClientOptions.md)\<`TAdapter`, `TStore`\>\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:83](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L83)

Configuration options for creating a [`Contract`](Contract.md).

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`Adapter`](../interfaces/Adapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

### TClient

`TClient` *extends* [`Client`](Client.md)\<`TAdapter`, `TStore`\> = [`Client`](Client.md)\<`TAdapter`, `TStore`\>
