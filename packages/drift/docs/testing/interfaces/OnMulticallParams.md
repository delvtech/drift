[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / OnMulticallParams

# Interface: OnMulticallParams\<TCalls, TAllowFailure\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:626](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L626)

Options for multicall operations.

## Extends

- [`MulticallOptions`](../../index/interfaces/MulticallOptions.md)\<`TAllowFailure`\>

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

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`accessList`](../../index/interfaces/MulticallOptions.md#accesslist)

***

### allowFailure?

> `optional` **allowFailure**: `TAllowFailure`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:432](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L432)

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`allowFailure`](../../index/interfaces/MulticallOptions.md#allowfailure)

***

### block?

> `optional` **block**: [`BlockIdentifier`](../../index/type-aliases/BlockIdentifier.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:365](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L365)

#### Inherited from

[`CallOptions`](../../index/interfaces/CallOptions.md).[`block`](../../index/interfaces/CallOptions.md#block)

***

### calls

> **calls**: \{ \[K in string \| number \| symbol\]: NarrowTo\<\{ abi: Abi \}, TCalls\[K\<K\>\]\>\["abi"\] extends TAbi ? OneOf\<Partial\<EncodedCallParams\> \| Replace\<Partial\<FunctionCallParams\<TAbi, NarrowTo\<\{ fn: ... \}, (...)\[(...)\]\>\["fn"\]\>\>, \{ args?: Partial\<AbiParametersToObject\<AbiParameters\<(...), (...), (...), (...)\>, AbiParameterKind\>\> \}\>\> extends TParams ? NarrowTo\<TParams, Replace\<TParams, TCalls\[K\<K\>\]\>\> : never : never \}

Defined in: [packages/drift/src/adapter/MockAdapter.ts:630](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L630)

***

### chainId?

> `optional` **chainId**: `number`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:122](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L122)

Chain ID that this transaction is valid on.

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`chainId`](../../index/interfaces/MulticallOptions.md#chainid)

***

### from?

> `optional` **from**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Transaction.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L93)

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`from`](../../index/interfaces/MulticallOptions.md#from)

***

### gas?

> `optional` **gas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:97](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L97)

Gas limit

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`gas`](../../index/interfaces/MulticallOptions.md#gas)

***

### gasPrice?

> `optional` **gasPrice**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:102](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L102)

The gas price willing to be paid by the sender in wei

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`gasPrice`](../../index/interfaces/MulticallOptions.md#gasprice)

***

### maxFeePerGas?

> `optional` **maxFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L111)

The maximum total fee per gas the sender is willing to pay (includes the
network / base fee and miner / priority fee) in wei

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`maxFeePerGas`](../../index/interfaces/MulticallOptions.md#maxfeepergas)

***

### maxPriorityFeePerGas?

> `optional` **maxPriorityFeePerGas**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:106](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L106)

Maximum fee per gas the sender is willing to pay to miners in wei

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`maxPriorityFeePerGas`](../../index/interfaces/MulticallOptions.md#maxpriorityfeepergas)

***

### multicallAddress?

> `optional` **multicallAddress**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:431](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L431)

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`multicallAddress`](../../index/interfaces/MulticallOptions.md#multicalladdress)

***

### nonce?

> `optional` **nonce**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:92](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L92)

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`nonce`](../../index/interfaces/MulticallOptions.md#nonce)

***

### type?

> `optional` **type**: `string`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:91](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L91)

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`type`](../../index/interfaces/MulticallOptions.md#type)

***

### value?

> `optional` **value**: `bigint`

Defined in: [packages/drift/src/adapter/types/Transaction.ts:98](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Transaction.ts#L98)

#### Inherited from

[`MulticallOptions`](../../index/interfaces/MulticallOptions.md).[`value`](../../index/interfaces/MulticallOptions.md#value)
