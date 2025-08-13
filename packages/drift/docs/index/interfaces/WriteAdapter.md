[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WriteAdapter

# Interface: WriteAdapter

Defined in: [packages/drift/src/adapter/types/Adapter.ts:176](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L176)

A write-only interface for signing and submitting transactions.

## Extended by

- [`ReadWriteAdapter`](ReadWriteAdapter.md)

## Methods

### deploy()

> **deploy**\<`TAbi`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:214](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L214)

Creates, signs, and submits a contract creation transaction using the
specified bytecode and constructor arguments.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

#### Parameters

##### params

[`DeployParams`](../type-aliases/DeployParams.md)\<`TAbi`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

***

### getCallsStatus()

> **getCallsStatus**\<`TId`\>(`batchId`): `Promise`\<[`WalletCallsStatus`](WalletCallsStatus.md)\<`TId`\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:193](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L193)

Get the status of a call batch that was sent via [`sendCalls`](#sendcalls).

#### Type Parameters

##### TId

`TId` *extends* `` `0x${string}` ``

#### Parameters

##### batchId

`TId`

#### Returns

`Promise`\<[`WalletCallsStatus`](WalletCallsStatus.md)\<`TId`\>\>

***

### getSignerAddress()

> **getSignerAddress**(): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:181](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L181)

Gets the address of the account that will be used to sign transactions.

#### Returns

`Promise`\<`` `0x${string}` ``\>

The address of the signer.

***

### getWalletCapabilities()

> **getWalletCapabilities**\<`TChainIds`\>(`params?`): `Promise`\<[`WalletCapabilities`](../type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:186](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L186)

Queries what capabilities a wallet supports.

#### Type Parameters

##### TChainIds

`TChainIds` *extends* readonly `number`[] = \[\]

#### Parameters

##### params?

[`GetWalletCapabilitiesParams`](GetWalletCapabilitiesParams.md)\<`TChainIds`\>

#### Returns

`Promise`\<[`WalletCapabilities`](../type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

***

### sendCalls()

> **sendCalls**\<`TCalls`\>(`params`): `Promise`\<[`SendCallsReturn`](SendCallsReturn.md)\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:229](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L229)

Requests that a wallet submits a batch of calls.

#### Type Parameters

##### TCalls

`TCalls` *extends* readonly `unknown`[] = `any`[]

#### Parameters

##### params

[`SendCallsParams`](SendCallsParams.md)\<`TCalls`\>

#### Returns

`Promise`\<[`SendCallsReturn`](SendCallsReturn.md)\>

***

### sendTransaction()

> **sendTransaction**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:207](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L207)

Signs and submits a transaction.

#### Parameters

##### params

[`SendTransactionParams`](../type-aliases/SendTransactionParams.md)

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

***

### showCallsStatus()

> **showCallsStatus**(`batchId`): `Promise`\<`void`\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:201](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L201)

Requests that a wallet shows information about a given call batch that was
sent via [`sendCalls`](#sendcalls).

#### Parameters

##### batchId

`` `0x${string}` ``

#### Returns

`Promise`\<`void`\>

***

### write()

> **write**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:221](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L221)

Creates, signs, and submits a transaction for a state-mutating contract
function.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`WriteParams`](../type-aliases/WriteParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.
