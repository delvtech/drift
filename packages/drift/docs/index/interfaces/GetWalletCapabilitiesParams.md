[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / GetWalletCapabilitiesParams

# Interface: GetWalletCapabilitiesParams\<TChainIds\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:496](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L496)

Params for querying a wallet's capabilities.

## Type Parameters

### TChainIds

`TChainIds` *extends* readonly `number`[] = `number`[]

## Properties

### address?

> `optional` **address**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:503](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L503)

The wallet address to query capabilities for. Defaults to the connected
signer address.

***

### chainIds?

> `optional` **chainIds**: `TChainIds`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:508](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L508)

The chain IDs to query capabilities for. If not provided, the wallet
should return capabilities for all chains it supports.
