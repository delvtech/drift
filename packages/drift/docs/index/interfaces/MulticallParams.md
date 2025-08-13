[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MulticallParams

# Interface: MulticallParams\<TCalls, TAllowFailure\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:438](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L438)

Params for multicall operations.

## Extends

- [`MulticallOptions`](MulticallOptions.md)\<`TAllowFailure`\>

## Type Parameters

### TCalls

`TCalls` *extends* readonly `unknown`[] = `unknown`[]

### TAllowFailure

`TAllowFailure` *extends* `boolean` = `boolean`

## Properties

### accessList?

> `optional` **accessList**: readonly `object`[]

Defined in: [packages/drift/src/adapter/types/Transaction.ts:115](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L115)

EIP-2930 access list

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`accessList`](MulticallOptions.md#accesslist)

***

### allowFailure?

> `optional` **allowFailure**: `TAllowFailure`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:432](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L432)

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`allowFailure`](MulticallOptions.md#allowfailure)

***

### block?

> `optional` **block**: [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:365](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L365)

#### Inherited from

[`CallOptions`](CallOptions.md).[`block`](CallOptions.md#block)

***

### calls

> **calls**: `MulticallCalls`\<`TCalls`\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:442](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L442)

***

### chainId?

> `optional` **chainId**: `number`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:122](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L122)

Chain ID that this transaction is valid on.

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`chainId`](MulticallOptions.md#chainid)

***

### from?

> `optional` **from**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L93)

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`from`](MulticallOptions.md#from)

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:97](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L97)

Gas limit

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`gas`](MulticallOptions.md#gas)

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:102](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L102)

The gas price willing to be paid by the sender in wei

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`gasPrice`](MulticallOptions.md#gasprice)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L111)

The maximum total fee per gas the sender is willing to pay (includes the
network / base fee and miner / priority fee) in wei

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`maxFeePerGas`](MulticallOptions.md#maxfeepergas)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:106](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L106)

Maximum fee per gas the sender is willing to pay to miners in wei

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`maxPriorityFeePerGas`](MulticallOptions.md#maxpriorityfeepergas)

***

### multicallAddress?

> `optional` **multicallAddress**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:431](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L431)

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`multicallAddress`](MulticallOptions.md#multicalladdress)

***

### nonce?

> `optional` **nonce**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:92](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L92)

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`nonce`](MulticallOptions.md#nonce)

***

### type?

> `optional` **type**: `string`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:91](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L91)

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`type`](MulticallOptions.md#type)

***

### value?

> `optional` **value**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:98](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L98)

#### Inherited from

[`MulticallOptions`](MulticallOptions.md).[`value`](MulticallOptions.md#value)
