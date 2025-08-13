[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / createContract

# Function: createContract()

> **createContract**\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>(`config`): [`Contract`](../type-aliases/Contract.md)\<`TAbi`, `TClient`\[`"adapter"`\], `TClient`\[`"cache"`\]\[`"store"`\], `TClient`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:331](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L331)

Creates a new [`Contract`](../type-aliases/Contract.md) instance for interacting with a smart
contract through a drift [`Client`](../type-aliases/Client.md).

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md)

### TClient

`TClient` *extends* `object` & [`Adapter`](../interfaces/Adapter.md)

## Parameters

### config

[`ContractOptions`](../type-aliases/ContractOptions.md)\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

The configuration to use for the contract.

## Returns

[`Contract`](../type-aliases/Contract.md)\<`TAbi`, `TClient`\[`"adapter"`\], `TClient`\[`"cache"`\]\[`"store"`\], `TClient`\>
