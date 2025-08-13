[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / TransactionReceipt

# Interface: TransactionReceipt

Defined in: [packages/drift/src/adapter/types/Transaction.ts:33](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L33)

## Extends

- `Required`\<[`TransactionInfo`](TransactionInfo.md)\>

## Properties

### blockHash

> **blockHash**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:19](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L19)

#### Inherited from

[`Transaction`](Transaction.md).[`blockHash`](Transaction.md#blockhash)

***

### blockNumber

> **blockNumber**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:20](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L20)

#### Inherited from

[`Transaction`](Transaction.md).[`blockNumber`](Transaction.md#blocknumber)

***

### contractAddress?

> `optional` **contractAddress**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:61](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L61)

The contract address created, if the transaction was a contract creation,
otherwise undefined.

***

### cumulativeGasUsed

> **cumulativeGasUsed**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:38](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L38)

The sum of gas used by this transaction and all preceding transactions in
the same block.

***

### effectiveGasPrice

> **effectiveGasPrice**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:52](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L52)

The actual value per gas deducted from the sender's account. Before
EIP-1559, this is equal to the transaction's gas price. After, it is equal
to baseFeePerGas + min(maxFeePerGas - baseFeePerGas, maxPriorityFeePerGas).

***

### from

> **from**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:21](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L21)

#### Inherited from

[`Transaction`](Transaction.md).[`from`](Transaction.md#from)

***

### gasUsed

> **gasUsed**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:42](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L42)

The amount of gas used for this specific transaction alone.

***

### logsBloom

> **logsBloom**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:45](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L45)

***

### status

> **status**: `"success"` \| `"reverted"`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:46](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L46)

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:56](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L56)

Address of the receiver or `undefined` in a contract creation transaction.

***

### transactionHash

> **transactionHash**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:22](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L22)

#### Inherited from

[`Transaction`](Transaction.md).[`transactionHash`](Transaction.md#transactionhash)

***

### transactionIndex

> **transactionIndex**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:23](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L23)

#### Inherited from

[`Transaction`](Transaction.md).[`transactionIndex`](Transaction.md#transactionindex)
