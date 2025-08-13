[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Network

# Interface: Network

Defined in: [packages/drift/src/adapter/types/Network.ts:13](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L13)

An interface representing data the SDK needs to get from the network.

## Extended by

- [`ReadAdapter`](ReadAdapter.md)

## Methods

### getBalance()

> **getBalance**(`params`): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/types/Network.ts:35](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L35)

Get the balance of native currency for an account.

#### Parameters

##### params

[`GetBalanceParams`](GetBalanceParams.md)

#### Returns

`Promise`\<`bigint`\>

***

### getBlock()

> **getBlock**\<`T`\>(`block?`): `Promise`\<[`GetBlockReturn`](../type-aliases/GetBlockReturn.md)\<`T`\>\>

Defined in: [packages/drift/src/adapter/types/Network.ts:28](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L28)

Get a block from a block tag, number, or hash. If no argument is provided,
the latest block is returned.

#### Type Parameters

##### T

`T` *extends* `undefined` \| [`BlockIdentifier`](../type-aliases/BlockIdentifier.md) = `undefined`

#### Parameters

##### block?

`T`

#### Returns

`Promise`\<[`GetBlockReturn`](../type-aliases/GetBlockReturn.md)\<`T`\>\>

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/types/Network.ts:22](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L22)

Get the current block number.

#### Returns

`Promise`\<`bigint`\>

***

### getChainId()

> **getChainId**(): `Promise`\<`number`\>

Defined in: [packages/drift/src/adapter/types/Network.ts:17](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L17)

Get the chain ID of the network.

#### Returns

`Promise`\<`number`\>

***

### getTransaction()

> **getTransaction**(`params`): `Promise`\<`undefined` \| [`Transaction`](Transaction.md)\>

Defined in: [packages/drift/src/adapter/types/Network.ts:40](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L40)

Get a transaction from a transaction hash.

#### Parameters

##### params

[`GetTransactionParams`](GetTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`Transaction`](Transaction.md)\>

***

### waitForTransaction()

> **waitForTransaction**(`params`): `Promise`\<`undefined` \| [`TransactionReceipt`](TransactionReceipt.md)\>

Defined in: [packages/drift/src/adapter/types/Network.ts:48](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L48)

Wait for a transaction to be mined.

#### Parameters

##### params

[`WaitForTransactionParams`](WaitForTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`TransactionReceipt`](TransactionReceipt.md)\>

The transaction receipt.
