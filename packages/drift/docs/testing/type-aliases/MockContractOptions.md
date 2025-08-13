[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / MockContractOptions

# Type Alias: MockContractOptions\<TAbi, TAdapter, TStore, TClient\>

> **MockContractOptions**\<`TAbi`, `TAdapter`, `TStore`, `TClient`\> = [`Eval`](../../index/type-aliases/Eval.md)\<`Partial`\<[`ContractBaseOptions`](../../index/type-aliases/ContractBaseOptions.md)\<`TAbi`\>\> & [`MockContractClientOptions`](MockContractClientOptions.md)\<`TAdapter`, `TStore`, `TClient`\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:31](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L31)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) = [`Abi`](../../index/type-aliases/Abi.md)

### TAdapter

`TAdapter` *extends* [`MockAdapter`](../classes/MockAdapter.md) = [`MockAdapter`](../classes/MockAdapter.md)

### TStore

`TStore` *extends* [`Store`](../../index/interfaces/Store.md) = [`Store`](../../index/interfaces/Store.md)

### TClient

`TClient` *extends* [`MockClient`](MockClient.md)\<`TAdapter`, `TStore`\> = [`MockClient`](MockClient.md)\<`TAdapter`, `TStore`\>
