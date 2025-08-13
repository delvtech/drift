[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Eip4844Options

# Interface: Eip4844Options

Defined in: [packages/drift/src/adapter/types/Transaction.ts:126](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L126)

## Extended by

- [`CallOptions`](CallOptions.md)

## Properties

### blobs?

> `optional` **blobs**: readonly `` `0x${string}` ``[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:136](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L136)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: readonly `` `0x${string}` ``[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:135](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L135)

List of versioned blob hashes associated with the transaction's EIP-4844 data blobs.

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:131](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L131)

The maximum total fee per gas the sender is willing to pay for blob gas in
wei
