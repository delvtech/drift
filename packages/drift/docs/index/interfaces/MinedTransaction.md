[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MinedTransaction

# Interface: MinedTransaction

Defined in: [packages/drift/src/adapter/types/Transaction.ts:28](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L28)

## Extends

- `BaseTransactionProps`.`Required`\<[`TransactionInfo`](TransactionInfo.md)\>

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

### chainId?

> `optional` **chainId**: `number`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:13](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L13)

#### Inherited from

`BaseTransactionProps.chainId`

***

### from

> **from**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:21](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L21)

#### Inherited from

[`Transaction`](Transaction.md).[`from`](Transaction.md#from)

***

### gas

> **gas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:9](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L9)

#### Inherited from

`BaseTransactionProps.gas`

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:12](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L12)

#### Inherited from

`BaseTransactionProps.gasPrice`

***

### input

> **input**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:11](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L11)

#### Inherited from

`BaseTransactionProps.input`

***

### nonce

> **nonce**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:8](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L8)

#### Inherited from

`BaseTransactionProps.nonce`

***

### to?

> `optional` **to**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:14](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L14)

#### Inherited from

`BaseTransactionProps.to`

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

***

### type

> **type**: `string`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:7](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L7)

#### Inherited from

`BaseTransactionProps.type`

***

### value

> **value**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:10](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L10)

#### Inherited from

`BaseTransactionProps.value`
