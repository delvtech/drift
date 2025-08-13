[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WalletCapabilities

# Type Alias: WalletCapabilities\<TChainIds\>

> **WalletCapabilities**\<`TChainIds`\> = `TChainIds` *extends* readonly \[\] ? `object` : `{ [K in TChainIds[number]]: WalletCapability }`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:514](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L514)

The capabilities of a wallet by chain id, as defined by EIP-5792.

## Type Parameters

### TChainIds

`TChainIds` *extends* readonly `number`[] = `number`[]
