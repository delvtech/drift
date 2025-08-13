[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / MockAdapter

# Class: MockAdapter

Defined in: [packages/drift/src/adapter/MockAdapter.ts:61](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L61)

A read-write interface for interacting with a blockchain network and
its contracts, required by all read-write Drift client APIs.

## Extends

- [`AbiEncoder`](../../index/classes/AbiEncoder.md)

## Implements

- [`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md)

## Constructors

### Constructor

> **new MockAdapter**(): `MockAdapter`

#### Returns

`MockAdapter`

#### Inherited from

[`AbiEncoder`](../../index/classes/AbiEncoder.md).[`constructor`](../../index/classes/AbiEncoder.md#constructor)

## Properties

### stubs

> **stubs**: `StubStore`\<[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md)\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:62](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L62)

## Methods

### call()

> **call**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:240](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L240)

Executes a new message call immediately without creating a transaction on
the block chain.

#### Parameters

##### params

[`CallParams`](../../index/type-aliases/CallParams.md)

#### Returns

`Promise`\<`` `0x${string}` ``\>

The return value of the executed function.

#### Example

```ts
const data = await drift.call({
  to: tokenAddress,
  data: drift.encodeFunctionData({
    abi: erc20.abi,
    fn: "transfer",
    args: { to, amount },
  }),
});

if (data) {
  const decoded = drift.decodeFunctionReturn({
    abi: erc20.abi,
    fn: "transfer",
    data,
  });
}
```

Calls can also be made using a bytecode instead of an address, sometimes
referred to as a "deployless" call. The contract is temporarily created
using the bytecode and the function is called on it.

```ts
const data = await drift.call({
  bytecode: MockErc20Example.bytecode,
  data: drift.encodeFunctionData({
    abi: MockErc20Example.abi,
    fn: "name",
  }),
});
```

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`call`](../../index/interfaces/ReadWriteAdapter.md#call)

***

### decodeFunctionData()

> **decodeFunctionData**\<`TAbi`, `TFunctionName`\>(`params`): [`DecodedFunctionData`](../../index/type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/adapter/AbiEncoder.ts:42](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/AbiEncoder.ts#L42)

Decodes the call data for a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi` = `Abi`

##### TFunctionName

`TFunctionName` *extends* `string` = `TAbi`\[`number`\] *extends* `TEntry` ? `ExtractFiltered`\<`TEntry`, `AbiFilter`\<`"function"`, `string`, `AbiStateMutability`, `undefined` \| `AbiParameterKind`\>\> : `never` *extends* `TEntry` ? `TEntry`\[`"name"`\] : `never`

#### Parameters

##### params

[`DecodeFunctionDataParams`](../../index/interfaces/DecodeFunctionDataParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

[`DecodedFunctionData`](../../index/type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`decodeFunctionData`](../../index/interfaces/ReadWriteAdapter.md#decodefunctiondata)

#### Inherited from

[`AbiEncoder`](../../index/classes/AbiEncoder.md).[`decodeFunctionData`](../../index/classes/AbiEncoder.md#decodefunctiondata)

***

### decodeFunctionReturn()

> **decodeFunctionReturn**\<`TAbi`, `TFunctionName`\>(`params`): [`FunctionReturn`](../../index/type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/adapter/AbiEncoder.ts:49](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/AbiEncoder.ts#L49)

Decodes the return value of a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string` = [`FunctionName`](../../index/type-aliases/FunctionName.md)\<`TAbi`\>

#### Parameters

##### params

[`DecodeFunctionReturnParams`](../../index/interfaces/DecodeFunctionReturnParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

[`FunctionReturn`](../../index/type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`decodeFunctionReturn`](../../index/interfaces/ReadWriteAdapter.md#decodefunctionreturn)

#### Inherited from

[`AbiEncoder`](../../index/classes/AbiEncoder.md).[`decodeFunctionReturn`](../../index/classes/AbiEncoder.md#decodefunctionreturn)

***

### deploy()

> **deploy**\<`TAbi`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:511](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L511)

Creates, signs, and submits a contract creation transaction using the
specified bytecode and constructor arguments.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

#### Parameters

##### params

[`DeployParams`](../../index/type-aliases/DeployParams.md)\<`TAbi`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`deploy`](../../index/interfaces/ReadWriteAdapter.md#deploy)

***

### encodeDeployData()

> **encodeDeployData**\<`TAbi`\>(`params`): `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/AbiEncoder.ts:22](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/AbiEncoder.ts#L22)

Encodes the constructor call data for a contract deployment.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

#### Parameters

##### params

[`EncodeDeployDataParams`](../../index/type-aliases/EncodeDeployDataParams.md)\<`TAbi`\>

#### Returns

`` `0x${string}` ``

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`encodeDeployData`](../../index/interfaces/ReadWriteAdapter.md#encodedeploydata)

#### Inherited from

[`AbiEncoder`](../../index/classes/AbiEncoder.md).[`encodeDeployData`](../../index/classes/AbiEncoder.md#encodedeploydata)

***

### encodeFunctionData()

> **encodeFunctionData**\<`TAbi`, `TFunctionName`\>(`params`): `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/AbiEncoder.ts:28](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/AbiEncoder.ts#L28)

Encodes the call data for a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`EncodeFunctionDataParams`](../../index/type-aliases/EncodeFunctionDataParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`` `0x${string}` ``

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`encodeFunctionData`](../../index/interfaces/ReadWriteAdapter.md#encodefunctiondata)

#### Inherited from

[`AbiEncoder`](../../index/classes/AbiEncoder.md).[`encodeFunctionData`](../../index/classes/AbiEncoder.md#encodefunctiondata)

***

### encodeFunctionReturn()

> **encodeFunctionReturn**\<`TAbi`, `TFunctionName`\>(`params`): `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/AbiEncoder.ts:35](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/AbiEncoder.ts#L35)

Encodes the return value of a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`EncodeFunctionReturnParams`](../../index/interfaces/EncodeFunctionReturnParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`` `0x${string}` ``

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`encodeFunctionReturn`](../../index/interfaces/ReadWriteAdapter.md#encodefunctionreturn)

#### Inherited from

[`AbiEncoder`](../../index/classes/AbiEncoder.md).[`encodeFunctionReturn`](../../index/classes/AbiEncoder.md#encodefunctionreturn)

***

### getBalance()

> **getBalance**(`params`): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:129](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L129)

Get the balance of native currency for an account.

#### Parameters

##### params

[`GetBalanceParams`](../../index/interfaces/GetBalanceParams.md)

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getBalance`](../../index/interfaces/ReadWriteAdapter.md#getbalance)

***

### getBlock()

> **getBlock**\<`T`\>(`block?`): `Promise`\<[`GetBlockReturn`](../../index/type-aliases/GetBlockReturn.md)\<`T`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:112](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L112)

Get a block from a block tag, number, or hash. If no argument is provided,
the latest block is returned.

#### Type Parameters

##### T

`T` *extends* `undefined` \| [`BlockIdentifier`](../../index/type-aliases/BlockIdentifier.md) = `undefined`

#### Parameters

##### block?

`T`

#### Returns

`Promise`\<[`GetBlockReturn`](../../index/type-aliases/GetBlockReturn.md)\<`T`\>\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getBlock`](../../index/interfaces/ReadWriteAdapter.md#getblock)

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:99](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L99)

Get the current block number.

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getBlockNumber`](../../index/interfaces/ReadWriteAdapter.md#getblocknumber)

***

### getCallsStatus()

> **getCallsStatus**\<`TId`\>(`batchId`): `Promise`\<[`WalletCallsStatus`](../../index/interfaces/WalletCallsStatus.md)\<`TId`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:453](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L453)

Get the status of a call batch that was sent via [`sendCalls`](../../index/interfaces/WriteAdapter.md#sendcalls).

#### Type Parameters

##### TId

`TId` *extends* `` `0x${string}` ``

#### Parameters

##### batchId

`TId`

#### Returns

`Promise`\<[`WalletCallsStatus`](../../index/interfaces/WalletCallsStatus.md)\<`TId`\>\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getCallsStatus`](../../index/interfaces/ReadWriteAdapter.md#getcallsstatus)

***

### getChainId()

> **getChainId**(): `Promise`\<`number`\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:87](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L87)

Get the chain ID of the network.

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getChainId`](../../index/interfaces/ReadWriteAdapter.md#getchainid)

***

### getEvents()

> **getEvents**\<`TAbi`, `TEventName`\>(`params`): `Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:218](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L218)

Get a list of logs for a contract event.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### params

[`GetEventsParams`](../../index/interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getEvents`](../../index/interfaces/ReadWriteAdapter.md#getevents)

***

### getSignerAddress()

> **getSignerAddress**(): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:411](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L411)

Gets the address of the account that will be used to sign transactions.

#### Returns

`Promise`\<`` `0x${string}` ``\>

The address of the signer.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getSignerAddress`](../../index/interfaces/ReadWriteAdapter.md#getsigneraddress)

***

### getTransaction()

> **getTransaction**(`params`): `Promise`\<`undefined` \| [`Transaction`](../../index/interfaces/Transaction.md)\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:150](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L150)

Get a transaction from a transaction hash.

#### Parameters

##### params

[`GetTransactionParams`](../../index/interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`Transaction`](../../index/interfaces/Transaction.md)\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getTransaction`](../../index/interfaces/ReadWriteAdapter.md#gettransaction)

***

### getWalletCapabilities()

> **getWalletCapabilities**\<`TChainIds`\>(`params?`): `Promise`\<[`WalletCapabilities`](../../index/type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:431](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L431)

Queries what capabilities a wallet supports.

#### Type Parameters

##### TChainIds

`TChainIds` *extends* readonly `number`[] = \[\]

#### Parameters

##### params?

[`GetWalletCapabilitiesParams`](../../index/interfaces/GetWalletCapabilitiesParams.md)\<`TChainIds`\>

#### Returns

`Promise`\<[`WalletCapabilities`](../../index/type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`getWalletCapabilities`](../../index/interfaces/ReadWriteAdapter.md#getwalletcapabilities)

***

### multicall()

> **multicall**\<`TCalls`, `TAllowFailure`\>(`params`): `Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:321](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L321)

#### Type Parameters

##### TCalls

`TCalls` *extends* readonly `unknown`[] = `any`[]

##### TAllowFailure

`TAllowFailure` *extends* `boolean` = `true`

#### Parameters

##### params

[`MulticallParams`](../../index/interfaces/MulticallParams.md)\<`TCalls`, `TAllowFailure`\>

#### Returns

`Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`multicall`](../../index/interfaces/ReadWriteAdapter.md#multicall)

***

### onCall()

> **onCall**(`params?`): `SinonStub`\<\[[`CallParams`](../../index/type-aliases/CallParams.md)\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:233](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L233)

#### Parameters

##### params?

`Partial`\<[`CallParams`](../../index/type-aliases/CallParams.md)\>

#### Returns

`SinonStub`\<\[[`CallParams`](../../index/type-aliases/CallParams.md)\], `Promise`\<`` `0x${string}` ``\>\>

***

### onDeploy()

> **onDeploy**\<`TAbi`\>(`params?`): `SinonStub`\<\[[`DeployParams`](../../index/type-aliases/DeployParams.md)\<`TAbi`\>\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:504](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L504)

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

#### Parameters

##### params?

[`OnDeployParams`](../type-aliases/OnDeployParams.md)\<`TAbi`\>

#### Returns

`SinonStub`\<\[[`DeployParams`](../../index/type-aliases/DeployParams.md)\<`TAbi`\>\], `Promise`\<`` `0x${string}` ``\>\>

***

### onGetBalance()

> **onGetBalance**(`params?`): `SinonStub`\<\[[`GetBalanceParams`](../../index/interfaces/GetBalanceParams.md)\], `Promise`\<`bigint`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:122](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L122)

#### Parameters

##### params?

`Partial`\<[`GetBalanceParams`](../../index/interfaces/GetBalanceParams.md)\>

#### Returns

`SinonStub`\<\[[`GetBalanceParams`](../../index/interfaces/GetBalanceParams.md)\], `Promise`\<`bigint`\>\>

***

### onGetBlock()

> **onGetBlock**\<`T`\>(`block?`): `SinonStub`\<\[`T`\], `Promise`\<[`GetBlockReturn`](../../index/type-aliases/GetBlockReturn.md)\<`T`\>\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:105](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L105)

#### Type Parameters

##### T

`T` *extends* `undefined` \| [`BlockIdentifier`](../../index/type-aliases/BlockIdentifier.md) = `undefined`

#### Parameters

##### block?

`T`

#### Returns

`SinonStub`\<\[`T`\], `Promise`\<[`GetBlockReturn`](../../index/type-aliases/GetBlockReturn.md)\<`T`\>\>\>

***

### onGetBlockNumber()

> **onGetBlockNumber**(): `SinonStub`\<\[\], `Promise`\<`bigint`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L93)

#### Returns

`SinonStub`\<\[\], `Promise`\<`bigint`\>\>

***

### onGetCallsStatus()

> **onGetCallsStatus**\<`TId`\>(`batchId?`): `SinonStub`\<\[`TId`\], `Promise`\<[`WalletCallsStatus`](../../index/interfaces/WalletCallsStatus.md)\<`TId`\>\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:446](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L446)

#### Type Parameters

##### TId

`TId` *extends* `` `0x${string}` ``

#### Parameters

##### batchId?

`TId`

#### Returns

`SinonStub`\<\[`TId`\], `Promise`\<[`WalletCallsStatus`](../../index/interfaces/WalletCallsStatus.md)\<`TId`\>\>\>

***

### onGetChainId()

> **onGetChainId**(): `SinonStub`\<\[\], `Promise`\<`number`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:81](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L81)

#### Returns

`SinonStub`\<\[\], `Promise`\<`number`\>\>

***

### onGetEvents()

> **onGetEvents**\<`TAbi`, `TEventName`\>(`params?`): `SinonStub`\<\[[`GetEventsParams`](../../index/interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>\], `Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:206](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L206)

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### params?

`Partial`\<[`GetEventsParams`](../../index/interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>\>

#### Returns

`SinonStub`\<\[[`GetEventsParams`](../../index/interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>\], `Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>\>

***

### onGetSignerAddress()

> **onGetSignerAddress**(): `SinonStub`\<\[\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:405](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L405)

#### Returns

`SinonStub`\<\[\], `Promise`\<`` `0x${string}` ``\>\>

***

### onGetTransaction()

> **onGetTransaction**(`params?`): `SinonStub`\<\[[`GetTransactionParams`](../../index/interfaces/GetTransactionParams.md)\], `Promise`\<`undefined` \| [`Transaction`](../../index/interfaces/Transaction.md)\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:139](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L139)

#### Parameters

##### params?

`Partial`\<[`GetTransactionParams`](../../index/interfaces/GetTransactionParams.md)\>

#### Returns

`SinonStub`\<\[[`GetTransactionParams`](../../index/interfaces/GetTransactionParams.md)\], `Promise`\<`undefined` \| [`Transaction`](../../index/interfaces/Transaction.md)\>\>

***

### onGetWalletCapabilities()

> **onGetWalletCapabilities**\<`TChainIds`\>(`params?`): `SinonStub`\<\[[`GetWalletCapabilitiesParams`](../../index/interfaces/GetWalletCapabilitiesParams.md)\<`TChainIds`\>?\], `Promise`\<[`WalletCapabilities`](../../index/type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:419](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L419)

#### Type Parameters

##### TChainIds

`TChainIds` *extends* readonly `number`[] = \[\]

#### Parameters

##### params?

[`GetWalletCapabilitiesParams`](../../index/interfaces/GetWalletCapabilitiesParams.md)\<`TChainIds`\>

#### Returns

`SinonStub`\<\[[`GetWalletCapabilitiesParams`](../../index/interfaces/GetWalletCapabilitiesParams.md)\<`TChainIds`\>?\], `Promise`\<[`WalletCapabilities`](../../index/type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>\>

***

### onMulticall()

> **onMulticall**\<`TAbis`, `TAllowFailure`\>(`params?`): `SinonStub`\<\[[`MulticallParams`](../../index/interfaces/MulticallParams.md)\<`TAbis`, `TAllowFailure`\>\], `Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<`TAbis`, `TAllowFailure`\>\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:308](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L308)

#### Type Parameters

##### TAbis

`TAbis` *extends* readonly `unknown`[] = `any`[]

##### TAllowFailure

`TAllowFailure` *extends* `boolean` = `true`

#### Parameters

##### params?

[`OnMulticallParams`](../interfaces/OnMulticallParams.md)\<`TAbis`, `TAllowFailure`\>

#### Returns

`SinonStub`\<\[[`MulticallParams`](../../index/interfaces/MulticallParams.md)\<`TAbis`, `TAllowFailure`\>\], `Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<`TAbis`, `TAllowFailure`\>\>\>

***

### onRead()

> **onRead**\<`TAbi`, `TFunctionName`\>(`params?`): `SinonStub`\<\[[`ReadParams`](../../index/type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:250](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L250)

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params?

[`OnReadParams`](../type-aliases/OnReadParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`SinonStub`\<\[[`ReadParams`](../../index/type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

***

### onSendCalls()

> **onSendCalls**\<`TCalls`\>(`params?`): `SinonStub`\<\[[`SendCallsParams`](../../index/interfaces/SendCallsParams.md)\<`TCalls`\>\], `Promise`\<[`SendCallsReturn`](../../index/interfaces/SendCallsReturn.md)\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:561](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L561)

#### Type Parameters

##### TCalls

`TCalls` *extends* readonly `unknown`[] = `any`[]

#### Parameters

##### params?

[`OnSendCallsParams`](../interfaces/OnSendCallsParams.md)\<`TCalls`\>

#### Returns

`SinonStub`\<\[[`SendCallsParams`](../../index/interfaces/SendCallsParams.md)\<`TCalls`\>\], `Promise`\<[`SendCallsReturn`](../../index/interfaces/SendCallsReturn.md)\>\>

***

### onSendRawTransaction()

> **onSendRawTransaction**(`transaction?`): `SinonStub`\<\[`` `0x${string}` ``\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:189](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L189)

#### Parameters

##### transaction?

`` `0x${string}` ``

#### Returns

`SinonStub`\<\[`` `0x${string}` ``\], `Promise`\<`` `0x${string}` ``\>\>

***

### onSendTransaction()

> **onSendTransaction**(`params?`): `SinonStub`\<\[[`SendTransactionParams`](../../index/type-aliases/SendTransactionParams.md)\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:481](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L481)

#### Parameters

##### params?

`Partial`\<[`SendTransactionParams`](../../index/type-aliases/SendTransactionParams.md)\>

#### Returns

`SinonStub`\<\[[`SendTransactionParams`](../../index/type-aliases/SendTransactionParams.md)\], `Promise`\<`` `0x${string}` ``\>\>

***

### onShowCallsStatus()

> **onShowCallsStatus**(`batchId?`): `SinonStub`\<\[`` `0x${string}` ``\], `Promise`\<`void`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:463](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L463)

#### Parameters

##### batchId?

`` `0x${string}` ``

#### Returns

`SinonStub`\<\[`` `0x${string}` ``\], `Promise`\<`void`\>\>

***

### onSimulateWrite()

> **onSimulateWrite**\<`TAbi`, `TFunctionName`\>(`params?`): `SinonStub`\<\[[`SimulateWriteParams`](../../index/type-aliases/SimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:279](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L279)

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params?

[`OnSimulateWriteParams`](../type-aliases/OnSimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`SinonStub`\<\[[`SimulateWriteParams`](../../index/type-aliases/SimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

***

### onWaitForTransaction()

> **onWaitForTransaction**(`params?`): `SinonStub`\<\[[`WaitForTransactionParams`](../../index/interfaces/WaitForTransactionParams.md)\], `Promise`\<`undefined` \| [`TransactionReceipt`](../../index/interfaces/TransactionReceipt.md)\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:164](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L164)

#### Parameters

##### params?

`Partial`\<[`WaitForTransactionParams`](../../index/interfaces/WaitForTransactionParams.md)\>

#### Returns

`SinonStub`\<\[[`WaitForTransactionParams`](../../index/interfaces/WaitForTransactionParams.md)\], `Promise`\<`undefined` \| [`TransactionReceipt`](../../index/interfaces/TransactionReceipt.md)\>\>

***

### onWrite()

> **onWrite**\<`TAbi`, `TFunctionName`\>(`params?`): `SinonStub`\<\[[`WriteParams`](../../index/type-aliases/WriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:529](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L529)

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params?

[`OnWriteParams`](../type-aliases/OnWriteParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`SinonStub`\<\[[`WriteParams`](../../index/type-aliases/WriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<`` `0x${string}` ``\>\>

***

### read()

> **read**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:263](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L263)

Calls a `pure` or `view` function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`ReadParams`](../../index/type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

The decoded return value of the function.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`read`](../../index/interfaces/ReadWriteAdapter.md#read)

***

### reset()

> **reset**(`method?`): `boolean` \| `void`

Defined in: [packages/drift/src/adapter/MockAdapter.ts:64](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L64)

#### Parameters

##### method?

keyof ReadWriteAdapter

#### Returns

`boolean` \| `void`

***

### sendCalls()

> **sendCalls**\<`TCalls`\>(`params`): `Promise`\<[`SendCallsReturn`](../../index/interfaces/SendCallsReturn.md)\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:570](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L570)

Requests that a wallet submits a batch of calls.

#### Type Parameters

##### TCalls

`TCalls` *extends* readonly `unknown`[] = `any`[]

#### Parameters

##### params

[`SendCallsParams`](../../index/interfaces/SendCallsParams.md)\<`TCalls`\>

#### Returns

`Promise`\<[`SendCallsReturn`](../../index/interfaces/SendCallsReturn.md)\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`sendCalls`](../../index/interfaces/ReadWriteAdapter.md#sendcalls)

***

### sendRawTransaction()

> **sendRawTransaction**(`transaction`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:196](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L196)

Submits a raw signed transaction. For
[EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) transactions, the raw
form must be the network form. This means it includes the blobs, KZG
commitments, and KZG proofs.

#### Parameters

##### transaction

`` `0x${string}` ``

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`sendRawTransaction`](../../index/interfaces/ReadWriteAdapter.md#sendrawtransaction)

***

### sendTransaction()

> **sendTransaction**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:488](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L488)

Signs and submits a transaction.

#### Parameters

##### params

[`SendTransactionParams`](../../index/type-aliases/SendTransactionParams.md)

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`sendTransaction`](../../index/interfaces/ReadWriteAdapter.md#sendtransaction)

***

### showCallsStatus()

> **showCallsStatus**(`batchId`): `Promise`\<`void`\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:470](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L470)

Requests that a wallet shows information about a given call batch that was
sent via [`sendCalls`](../../index/interfaces/WriteAdapter.md#sendcalls).

#### Parameters

##### batchId

`` `0x${string}` ``

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`showCallsStatus`](../../index/interfaces/ReadWriteAdapter.md#showcallsstatus)

***

### simulateWrite()

> **simulateWrite**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:292](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L292)

Call a state-mutating function on a contract without sending a transaction.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`SimulateWriteParams`](../../index/type-aliases/SimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

The decoded return value of the function.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`simulateWrite`](../../index/interfaces/ReadWriteAdapter.md#simulatewrite)

***

### waitForTransaction()

> **waitForTransaction**(`params`): `Promise`\<`undefined` \| [`TransactionReceipt`](../../index/interfaces/TransactionReceipt.md)\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:175](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L175)

Wait for a transaction to be mined.

#### Parameters

##### params

[`WaitForTransactionParams`](../../index/interfaces/WaitForTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`TransactionReceipt`](../../index/interfaces/TransactionReceipt.md)\>

The transaction receipt.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`waitForTransaction`](../../index/interfaces/ReadWriteAdapter.md#waitfortransaction)

***

### write()

> **write**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:539](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L539)

Creates, signs, and submits a transaction for a state-mutating contract
function.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`WriteParams`](../../index/type-aliases/WriteParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Implementation of

[`ReadWriteAdapter`](../../index/interfaces/ReadWriteAdapter.md).[`write`](../../index/interfaces/ReadWriteAdapter.md#write)
