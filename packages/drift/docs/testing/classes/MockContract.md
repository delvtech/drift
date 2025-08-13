[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / MockContract

# Class: MockContract\<TAbi, TAdapter, TStore, TClient\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:41](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L41)

A read-write [`Contract`](../../index/type-aliases/Contract.md) with access to a signer for fetching data
and submitting transactions through a drift [`Client`](../../index/type-aliases/Client.md).

## Extends

- [`ReadWriteContract`](../../index/classes/ReadWriteContract.md)\<`TAbi`, `TClient`\[`"adapter"`\], `TClient`\[`"cache"`\]\[`"store"`\], `TClient`\>

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) = [`Abi`](../../index/type-aliases/Abi.md)

### TAdapter

`TAdapter` *extends* [`MockAdapter`](MockAdapter.md) = [`MockAdapter`](MockAdapter.md)

### TStore

`TStore` *extends* [`Store`](../../index/interfaces/Store.md) = [`Store`](../../index/interfaces/Store.md)

### TClient

`TClient` *extends* [`MockClient`](../type-aliases/MockClient.md)\<`TAdapter`, `TStore`\> = [`MockClient`](../type-aliases/MockClient.md)\<`TAdapter`, `TStore`\>

## Constructors

### Constructor

> **new MockContract**\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>(`__namedParameters`): `MockContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:52](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L52)

#### Parameters

##### \_\_namedParameters

[`MockContractOptions`](../type-aliases/MockContractOptions.md)\<`TAbi`, `TAdapter`, `TStore`, `TClient`\> = `{}`

#### Returns

`MockContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

#### Overrides

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`constructor`](../../index/classes/ReadWriteContract.md#constructor)

## Properties

### abi

> **abi**: `TAbi`

Defined in: [packages/drift/src/client/contract/Contract.ts:108](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L108)

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`abi`](../../index/classes/ReadWriteContract.md#abi)

***

### address

> **address**: `` `0x${string}` ``

Defined in: [packages/drift/src/client/contract/Contract.ts:109](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L109)

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`address`](../../index/classes/ReadWriteContract.md#address)

***

### cache

> **cache**: [`ContractCache`](../../index/classes/ContractCache.md)\<`TAbi`, `TClient`\[`"cache"`\]\[`"store"`\]\>

Defined in: [packages/drift/src/client/contract/Contract.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L111)

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`cache`](../../index/classes/ReadWriteContract.md#cache)

***

### client

> **client**: `TClient`

Defined in: [packages/drift/src/client/contract/Contract.ts:110](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L110)

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`client`](../../index/classes/ReadWriteContract.md#client)

***

### epochBlock?

> `optional` **epochBlock**: `bigint`

Defined in: [packages/drift/src/client/contract/Contract.ts:112](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L112)

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`epochBlock`](../../index/classes/ReadWriteContract.md#epochblock)

## Accessors

### adapter

#### Get Signature

> **get** **adapter**(): `TAdapter`

Defined in: [packages/drift/src/client/contract/MockContract.ts:67](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L67)

##### Returns

`TAdapter`

## Methods

### decodeFunctionData()

> **decodeFunctionData**\<`TFunctionName`\>(`data`): [`DecodedFunctionData`](../../index/type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:186](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L186)

Decodes a string of function calldata into it's arguments and function
name.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string` = `TAbi`\[`number`\] *extends* `TEntry` ? `ExtractFiltered`\<`TEntry`, `AbiFilter`\<`"function"`, `string`, `AbiStateMutability`, `undefined` \| `AbiParameterKind`\>\> : `never` *extends* `TEntry` ? `TEntry`\[`"name"`\] : `never`

#### Parameters

##### data

`` `0x${string}` ``

#### Returns

[`DecodedFunctionData`](../../index/type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`decodeFunctionData`](../../index/classes/ReadWriteContract.md#decodefunctiondata)

***

### decodeFunctionReturn()

> **decodeFunctionReturn**\<`TFunctionName`\>(`fn`, `data`): [`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:198](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L198)

Decodes a string of function return data into it's return value.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string` = `TAbi`\[`number`\] *extends* `TEntry` ? `ExtractFiltered`\<`TEntry`, `AbiFilter`\<`"function"`, `string`, `AbiStateMutability`, `undefined` \| `AbiParameterKind`\>\> : `never` *extends* `TEntry` ? `TEntry`\[`"name"`\] : `never`

#### Parameters

##### fn

`TFunctionName`

##### data

`` `0x${string}` ``

#### Returns

[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`decodeFunctionReturn`](../../index/classes/ReadWriteContract.md#decodefunctionreturn)

***

### encodeDeployData()

> **encodeDeployData**(...`__namedParameters`): `` `0x${string}` ``

Defined in: [packages/drift/src/client/contract/Contract.ts:145](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L145)

Encodes a contract deploy call into calldata.

#### Parameters

##### \_\_namedParameters

...[`ContractEncodeDeployDataArgs`](../../index/type-aliases/ContractEncodeDeployDataArgs.md)\<`TAbi`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`encodeDeployData`](../../index/classes/ReadWriteContract.md#encodedeploydata)

***

### encodeFunctionData()

> **encodeFunctionData**\<`TFunctionName`\>(...`__namedParameters`): `` `0x${string}` ``

Defined in: [packages/drift/src/client/contract/Contract.ts:158](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L158)

Encodes a function call into calldata.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractEncodeFunctionDataArgs`](../../index/type-aliases/ContractEncodeFunctionDataArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`encodeFunctionData`](../../index/classes/ReadWriteContract.md#encodefunctiondata)

***

### encodeFunctionReturn()

> **encodeFunctionReturn**\<`TFunctionName`\>(`fn`, `value`): `` `0x${string}` ``

Defined in: [packages/drift/src/client/contract/Contract.ts:171](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L171)

Encodes a function return data for a contract method.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### fn

`TFunctionName`

##### value

[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`encodeFunctionReturn`](../../index/classes/ReadWriteContract.md#encodefunctionreturn)

***

### extend()

> **extend**\<`T`\>(`props`): `T` & `MockContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:136](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L136)

#### Type Parameters

##### T

`T` *extends* `Partial`\<[`Extended`](../../index/type-aliases/Extended.md)\<`MockContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\>\>

#### Parameters

##### props

`T` & `Partial`\<`MockContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\> & `ThisType`\<`T` & `MockContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\>

#### Returns

`T` & `MockContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`extend`](../../index/classes/ReadWriteContract.md#extend)

***

### getEvents()

> **getEvents**\<`TEventName`\>(`event`, `__namedParameters`): `Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/client/contract/Contract.ts:211](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L211)

Retrieves specified events from the contract.

#### Type Parameters

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### event

`TEventName`

##### \_\_namedParameters

[`GetEventsOptions`](../../index/interfaces/GetEventsOptions.md)\<`TAbi`, `TEventName`\> = `{}`

#### Returns

`Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`getEvents`](../../index/classes/ReadWriteContract.md#getevents)

***

### getSignerAddress()

> **getSignerAddress**(): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/client/contract/Contract.ts:304](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L304)

Get the address of the signer for this contract.

#### Returns

`Promise`\<`` `0x${string}` ``\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`getSignerAddress`](../../index/classes/ReadWriteContract.md#getsigneraddress)

***

### isReadWrite()

> **isReadWrite**(): `this is ReadWriteContract<TAbi, ReadWriteAdapter, Store, Client<ReadWriteAdapter, Store>>`

Defined in: [packages/drift/src/client/contract/Contract.ts:132](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L132)

#### Returns

`this is ReadWriteContract<TAbi, ReadWriteAdapter, Store, Client<ReadWriteAdapter, Store>>`

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`isReadWrite`](../../index/classes/ReadWriteContract.md#isreadwrite)

***

### multicall()

> **multicall**\<`TCalls`, `TAllowFailure`\>(`__namedParameters`): `Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<\{ \[K in string \| number \| symbol\]: ContractParams\<TAbi\> & TCalls\[K\<K\>\] \}, `TAllowFailure`\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:268](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L268)

Uses Multicall3 to read multiple functions from the contract in a
single request.

#### Type Parameters

##### TCalls

`TCalls` *extends* `object`[]

##### TAllowFailure

`TAllowFailure` *extends* `boolean` = `true`

#### Parameters

##### \_\_namedParameters

[`ContractMulticallParams`](../../index/type-aliases/ContractMulticallParams.md)\<`TAbi`, `TCalls`, `TAllowFailure`\>

#### Returns

`Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<\{ \[K in string \| number \| symbol\]: ContractParams\<TAbi\> & TCalls\[K\<K\>\] \}, `TAllowFailure`\>\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`multicall`](../../index/classes/ReadWriteContract.md#multicall)

***

### onGetEvents()

> **onGetEvents**\<`TEventName`\>(`event`, `options?`): `SinonStub`\<\[[`GetEventsParams`](../../index/interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>\], `Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:95](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L95)

#### Type Parameters

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### event

`TEventName`

##### options?

[`GetEventsOptions`](../../index/interfaces/GetEventsOptions.md)\<`TAbi`, `TEventName`\>

#### Returns

`SinonStub`\<\[[`GetEventsParams`](../../index/interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>\], `Promise`\<[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>\>

***

### onGetSignerAddress()

> **onGetSignerAddress**(): `SinonStub`\<\[\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:137](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L137)

#### Returns

`SinonStub`\<\[\], `Promise`\<`` `0x${string}` ``\>\>

***

### onMulticall()

> **onMulticall**\<`TCalls`, `TAllowFailure`\>(`__namedParameters`): `SinonStub`\<\[[`MulticallParams`](../../index/interfaces/MulticallParams.md)\<\{ \[K in string \| number \| symbol\]: \{ abi: TAbi; fn: NonNullable\<TCalls\[K\<K\>\]\["fn"\]\> \} \}, `TAllowFailure`\>\], `Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<\{ \[K in string \| number \| symbol\]: \{ abi: TAbi; fn: NonNullable\<TCalls\[K\<K\>\]\["fn"\]\> \} \}, `TAllowFailure`\>\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:75](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L75)

#### Type Parameters

##### TCalls

`TCalls` *extends* `ContractOnMulticallCall`\<`TAbi`\>[]

##### TAllowFailure

`TAllowFailure` *extends* `boolean` = `true`

#### Parameters

##### \_\_namedParameters

[`ContractOnMulticallParams`](../type-aliases/ContractOnMulticallParams.md)\<`TAbi`, `TCalls`, `TAllowFailure`\>

#### Returns

`SinonStub`\<\[[`MulticallParams`](../../index/interfaces/MulticallParams.md)\<\{ \[K in string \| number \| symbol\]: \{ abi: TAbi; fn: NonNullable\<TCalls\[K\<K\>\]\["fn"\]\> \} \}, `TAllowFailure`\>\], `Promise`\<[`MulticallReturn`](../../index/type-aliases/MulticallReturn.md)\<\{ \[K in string \| number \| symbol\]: \{ abi: TAbi; fn: NonNullable\<TCalls\[K\<K\>\]\["fn"\]\> \} \}, `TAllowFailure`\>\>\>

***

### onRead()

> **onRead**\<`TFunctionName`\>(`fn`, `args?`, `options?`): `SinonStub`\<\[[`ReadParams`](../../index/type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:107](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L107)

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### fn

`TFunctionName`

##### args?

`Partial`\<[`AbiParametersToObject`](../../index/type-aliases/AbiParametersToObject.md)\<[`AbiParameters`](../../index/type-aliases/AbiParameters.md)\<`TAbi`, `"function"`, `TFunctionName`, `"inputs"`\>, `AbiParameterKind`\>\>

##### options?

[`ReadOptions`](../../index/interfaces/ReadOptions.md)

#### Returns

`SinonStub`\<\[[`ReadParams`](../../index/type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

***

### onSimulateWrite()

> **onSimulateWrite**\<`TFunctionName`\>(`fn`, `args?`, `options?`): `SinonStub`\<\[[`SimulateWriteParams`](../../index/type-aliases/SimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:121](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L121)

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### fn

`TFunctionName`

##### args?

`Partial`\<[`AbiParametersToObject`](../../index/type-aliases/AbiParametersToObject.md)\<[`AbiParameters`](../../index/type-aliases/AbiParameters.md)\<`TAbi`, `"function"`, `TFunctionName`, `"inputs"`\>, `AbiParameterKind`\>\>

##### options?

[`TransactionOptions`](../../index/interfaces/TransactionOptions.md)

#### Returns

`SinonStub`\<\[[`SimulateWriteParams`](../../index/type-aliases/SimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>\>

***

### onWrite()

> **onWrite**\<`TFunctionName`\>(`fn?`, `args?`, `options?`): `SinonStub`\<\[[`WriteParams`](../../index/type-aliases/WriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<`` `0x${string}` ``\>\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:141](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L141)

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### fn?

`TFunctionName`

##### args?

`Partial`\<[`AbiParametersToObject`](../../index/type-aliases/AbiParametersToObject.md)\<[`AbiParameters`](../../index/type-aliases/AbiParameters.md)\<`TAbi`, `"function"`, `TFunctionName`, `"inputs"`\>, `AbiParameterKind`\>\>

##### options?

[`WriteOptions`](../../index/interfaces/WriteOptions.md)

#### Returns

`SinonStub`\<\[[`WriteParams`](../../index/type-aliases/WriteParams.md)\<`TAbi`, `TFunctionName`\>\], `Promise`\<`` `0x${string}` ``\>\>

***

### read()

> **read**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:235](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L235)

Reads a specified function from the contract.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractReadArgs`](../../index/type-aliases/ContractReadArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`read`](../../index/classes/ReadWriteContract.md#read)

***

### reset()

> **reset**(`method?`): `boolean` \| `void`

Defined in: [packages/drift/src/client/contract/MockContract.ts:71](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L71)

#### Parameters

##### method?

keyof ReadWriteAdapter

#### Returns

`boolean` \| `void`

***

### simulateWrite()

> **simulateWrite**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:250](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L250)

Simulates a write operation on a specified function of the contract.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractSimulateWriteArgs`](../../index/type-aliases/ContractSimulateWriteArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`AbiSimplifiedType`](../../index/type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`simulateWrite`](../../index/classes/ReadWriteContract.md#simulatewrite)

***

### write()

> **write**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/client/contract/Contract.ts:311](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L311)

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractWriteArgs`](../../index/type-aliases/ContractWriteArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Inherited from

[`ReadWriteContract`](../../index/classes/ReadWriteContract.md).[`write`](../../index/classes/ReadWriteContract.md#write)
