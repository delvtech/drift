[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ReadWriteContract

# Class: ReadWriteContract\<TAbi, TAdapter, TStore, TClient\>

Defined in: [packages/drift/src/client/contract/Contract.ts:295](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L295)

A read-write [`Contract`](../type-aliases/Contract.md) with access to a signer for fetching data
and submitting transactions through a drift [`Client`](../type-aliases/Client.md).

## Extends

- [`ReadContract`](ReadContract.md)\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

## Extended by

- [`MockContract`](../../testing/classes/MockContract.md)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../type-aliases/Abi.md) = [`Abi`](../type-aliases/Abi.md)

### TAdapter

`TAdapter` *extends* [`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md) = [`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

### TClient

`TClient` *extends* [`Client`](../type-aliases/Client.md)\<`TAdapter`, `TStore`\> = [`Client`](../type-aliases/Client.md)\<`TAdapter`, `TStore`\>

## Constructors

### Constructor

> **new ReadWriteContract**\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>(`__namedParameters`): `ReadWriteContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:114](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L114)

#### Parameters

##### \_\_namedParameters

[`ContractOptions`](../type-aliases/ContractOptions.md)\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

#### Returns

`ReadWriteContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`constructor`](ReadContract.md#constructor)

## Properties

### abi

> **abi**: `TAbi`

Defined in: [packages/drift/src/client/contract/Contract.ts:108](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L108)

#### Inherited from

[`ReadContract`](ReadContract.md).[`abi`](ReadContract.md#abi)

***

### address

> **address**: `` `0x${string}` ``

Defined in: [packages/drift/src/client/contract/Contract.ts:109](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L109)

#### Inherited from

[`ReadContract`](ReadContract.md).[`address`](ReadContract.md#address)

***

### cache

> **cache**: [`ContractCache`](ContractCache.md)\<`TAbi`, `TStore`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L111)

#### Inherited from

[`ReadContract`](ReadContract.md).[`cache`](ReadContract.md#cache)

***

### client

> **client**: `TClient`

Defined in: [packages/drift/src/client/contract/Contract.ts:110](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L110)

#### Inherited from

[`ReadContract`](ReadContract.md).[`client`](ReadContract.md#client)

***

### epochBlock?

> `optional` **epochBlock**: `bigint`

Defined in: [packages/drift/src/client/contract/Contract.ts:112](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L112)

#### Inherited from

[`ReadContract`](ReadContract.md).[`epochBlock`](ReadContract.md#epochblock)

## Methods

### decodeFunctionData()

> **decodeFunctionData**\<`TFunctionName`\>(`data`): [`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

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

[`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`decodeFunctionData`](ReadContract.md#decodefunctiondata)

***

### decodeFunctionReturn()

> **decodeFunctionReturn**\<`TFunctionName`\>(`fn`, `data`): [`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`\>

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

[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`decodeFunctionReturn`](ReadContract.md#decodefunctionreturn)

***

### encodeDeployData()

> **encodeDeployData**(...`__namedParameters`): `` `0x${string}` ``

Defined in: [packages/drift/src/client/contract/Contract.ts:145](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L145)

Encodes a contract deploy call into calldata.

#### Parameters

##### \_\_namedParameters

...[`ContractEncodeDeployDataArgs`](../type-aliases/ContractEncodeDeployDataArgs.md)\<`TAbi`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadContract`](ReadContract.md).[`encodeDeployData`](ReadContract.md#encodedeploydata)

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

...[`ContractEncodeFunctionDataArgs`](../type-aliases/ContractEncodeFunctionDataArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadContract`](ReadContract.md).[`encodeFunctionData`](ReadContract.md#encodefunctiondata)

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

[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadContract`](ReadContract.md).[`encodeFunctionReturn`](ReadContract.md#encodefunctionreturn)

***

### extend()

> **extend**\<`T`\>(`props`): `T` & `ReadWriteContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:136](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L136)

#### Type Parameters

##### T

`T` *extends* `Partial`\<[`Extended`](../type-aliases/Extended.md)\<`ReadWriteContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\>\>

#### Parameters

##### props

`T` & `Partial`\<`ReadWriteContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\> & `ThisType`\<`T` & `ReadWriteContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\>

#### Returns

`T` & `ReadWriteContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`extend`](ReadContract.md#extend)

***

### getEvents()

> **getEvents**\<`TEventName`\>(`event`, `__namedParameters`): `Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/client/contract/Contract.ts:211](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L211)

Retrieves specified events from the contract.

#### Type Parameters

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### event

`TEventName`

##### \_\_namedParameters

[`GetEventsOptions`](../interfaces/GetEventsOptions.md)\<`TAbi`, `TEventName`\> = `{}`

#### Returns

`Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`getEvents`](ReadContract.md#getevents)

***

### getSignerAddress()

> **getSignerAddress**(): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/client/contract/Contract.ts:304](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L304)

Get the address of the signer for this contract.

#### Returns

`Promise`\<`` `0x${string}` ``\>

***

### isReadWrite()

> **isReadWrite**(): `this is ReadWriteContract<TAbi, ReadWriteAdapter, Store, Client<ReadWriteAdapter, Store>>`

Defined in: [packages/drift/src/client/contract/Contract.ts:132](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L132)

#### Returns

`this is ReadWriteContract<TAbi, ReadWriteAdapter, Store, Client<ReadWriteAdapter, Store>>`

#### Inherited from

[`ReadContract`](ReadContract.md).[`isReadWrite`](ReadContract.md#isreadwrite)

***

### multicall()

> **multicall**\<`TCalls`, `TAllowFailure`\>(`__namedParameters`): `Promise`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<\{ \[K in string \| number \| symbol\]: ContractParams\<TAbi\> & TCalls\[K\<K\>\] \}, `TAllowFailure`\>\>

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

[`ContractMulticallParams`](../type-aliases/ContractMulticallParams.md)\<`TAbi`, `TCalls`, `TAllowFailure`\>

#### Returns

`Promise`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<\{ \[K in string \| number \| symbol\]: ContractParams\<TAbi\> & TCalls\[K\<K\>\] \}, `TAllowFailure`\>\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`multicall`](ReadContract.md#multicall)

***

### read()

> **read**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:235](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L235)

Reads a specified function from the contract.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractReadArgs`](../type-aliases/ContractReadArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`read`](ReadContract.md#read)

***

### simulateWrite()

> **simulateWrite**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:250](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L250)

Simulates a write operation on a specified function of the contract.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractSimulateWriteArgs`](../type-aliases/ContractSimulateWriteArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

#### Inherited from

[`ReadContract`](ReadContract.md).[`simulateWrite`](ReadContract.md#simulatewrite)

***

### write()

> **write**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/client/contract/Contract.ts:311](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L311)

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractWriteArgs`](../type-aliases/ContractWriteArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.
