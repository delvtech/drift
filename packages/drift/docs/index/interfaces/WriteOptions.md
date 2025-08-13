[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WriteOptions

# Interface: WriteOptions

Defined in: [packages/drift/src/adapter/types/Adapter.ts:747](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L747)

Options for writing state by calling a contract function.

## Extends

- [`TransactionOptions`](TransactionOptions.md)

## Properties

### accessList?

> `optional` **accessList**: readonly `object`[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:115](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L115)

EIP-2930 access list

#### Inherited from

[`TransactionOptions`](TransactionOptions.md).[`accessList`](TransactionOptions.md#accesslist)

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

### onMined()?

> `optional` **onMined**: (`receipt`) => `void`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:752](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L752)

A callback that's called with the transaction receipt when the transaction
is mined.

#### Parameters

##### receipt

`undefined` | [`TransactionReceipt`](TransactionReceipt.md)

#### Returns

`void`

***

### onMinedTimeout?

> `optional` **onMinedTimeout**: `number`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:760](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L760)

The timeout for the onMined callback in milliseconds. If the transaction is
not mined within this time, the callback will not be called.

This is forwarded to the method that will wait for the transaction receipt
and inherits it's default.

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
