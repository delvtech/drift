[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WalletCallsReceipt

# Interface: WalletCallsReceipt

Defined in: [packages/drift/src/adapter/types/Transaction.ts:64](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L64)

## Properties

### blockHash

> **blockHash**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:71](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L71)

Hash of the block containing the calls.

***

### blockNumber

> **blockNumber**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:75](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L75)

Block number containing the calls

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:79](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L79)

The amount of gas used by the calls.

***

### status

> **status**: `"success"` \| `"reverted"`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:67](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L67)

***

### transactionHash

> **transactionHash**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:83](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L83)

Hash of the transaction containing the calls.
