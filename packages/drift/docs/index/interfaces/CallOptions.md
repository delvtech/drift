[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / CallOptions

# Interface: CallOptions

Defined in: [packages/drift/src/adapter/types/Adapter.ts:364](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L364)

Options for constructing a transaction.

## Extends

- [`TransactionOptions`](TransactionOptions.md).[`Eip4844Options`](Eip4844Options.md)

## Properties

### accessList?

> `optional` **accessList**: readonly `object`[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:115](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L115)

EIP-2930 access list

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`accessList`](TransactionOptions.md#accesslist)

***

### blobs?

> `optional` **blobs**: readonly `` `0x${string}` ``[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:136](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L136)

#### Inherited from

[`Eip4844Options`](Eip4844Options.md).[`blobs`](Eip4844Options.md#blobs)

***

### blobVersionedHashes?

> `optional` **blobVersionedHashes**: readonly `` `0x${string}` ``[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:135](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L135)

List of versioned blob hashes associated with the transaction's EIP-4844 data blobs.

#### Inherited from

[`Eip4844Options`](Eip4844Options.md).[`blobVersionedHashes`](Eip4844Options.md#blobversionedhashes)

***

### block?

> `optional` **block**: [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:365](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L365)

***

### chainId?

> `optional` **chainId**: `number`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:122](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L122)

Chain ID that this transaction is valid on.

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`chainId`](TransactionOptions.md#chainid)

***

### from?

> `optional` **from**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L93)

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`from`](TransactionOptions.md#from)

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:97](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L97)

Gas limit

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`gas`](TransactionOptions.md#gas)

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:102](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L102)

The gas price willing to be paid by the sender in wei

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`gasPrice`](TransactionOptions.md#gasprice)

***

### maxFeePerBlobGas?

> `optional` **maxFeePerBlobGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:131](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L131)

The maximum total fee per gas the sender is willing to pay for blob gas in
wei

#### Inherited from

[`Eip4844Options`](Eip4844Options.md).[`maxFeePerBlobGas`](Eip4844Options.md#maxfeeperblobgas)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L111)

The maximum total fee per gas the sender is willing to pay (includes the
network / base fee and miner / priority fee) in wei

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`maxFeePerGas`](TransactionOptions.md#maxfeepergas)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:106](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L106)

Maximum fee per gas the sender is willing to pay to miners in wei

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`maxPriorityFeePerGas`](TransactionOptions.md#maxpriorityfeepergas)

***

### nonce?

> `optional` **nonce**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:92](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L92)

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`nonce`](TransactionOptions.md#nonce)

***

### type?

> `optional` **type**: `string`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:91](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L91)

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`type`](TransactionOptions.md#type)

***

### value?

> `optional` **value**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:98](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L98)

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`value`](TransactionOptions.md#value)
