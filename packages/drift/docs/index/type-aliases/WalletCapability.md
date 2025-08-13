[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WalletCapability

# Type Alias: WalletCapability

> **WalletCapability** = `object`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:480](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L480)

The capabilities of a wallet, as defined by EIP-5792.

## Indexable

\[`capability`: `string`\]: `unknown`

## Properties

### atomic?

> `optional` **atomic**: `object`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:482](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L482)

#### status

> **status**: `"supported"` \| `"ready"` \| `"unsupported"`

***

### atomicBatch?

> `optional` **atomicBatch**: `object`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:485](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L485)

#### supported

> **supported**: `boolean`

***

### paymasterService?

> `optional` **paymasterService**: `object`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:488](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L488)

#### status

> **status**: `"supported"` \| `"ready"` \| `"unsupported"`
