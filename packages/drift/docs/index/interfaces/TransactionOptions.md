[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / TransactionOptions

# Interface: TransactionOptions

Defined in: [packages/drift/src/adapter/types/Transaction.ts:90](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L90)

Options for constructing a transaction.

## Extended by

- [`CallOptions`](CallOptions.md)
- [`MulticallOptions`](MulticallOptions.md)
- [`SimulateWriteOptions`](SimulateWriteOptions.md)
- [`WriteOptions`](WriteOptions.md)

## Properties

### accessList?

> `optional` **accessList**: readonly `object`[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:115](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L115)

EIP-2930 access list

***

### chainId?

> `optional` **chainId**: `number`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:122](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L122)

Chain ID that this transaction is valid on.

***

### from?

> `optional` **from**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L93)

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:97](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L97)

Gas limit

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:102](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L102)

The gas price willing to be paid by the sender in wei

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L111)

The maximum total fee per gas the sender is willing to pay (includes the
network / base fee and miner / priority fee) in wei

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:106](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L106)

Maximum fee per gas the sender is willing to pay to miners in wei

***

### nonce?

> `optional` **nonce**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:92](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L92)

***

### type?

> `optional` **type**: `string`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:91](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L91)

***

### value?

> `optional` **value**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:98](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L98)
