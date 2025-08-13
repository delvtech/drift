[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ReadContract

# Class: ReadContract\<TAbi, TAdapter, TStore, TClient\>

Defined in: [packages/drift/src/client/contract/Contract.ts:102](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L102)

A read-only [`Contract`](../type-aliases/Contract.md) instance for fetching data from a smart
contract through a drift [`Client`](../type-aliases/Client.md).

## Extended by

- [`ReadWriteContract`](ReadWriteContract.md)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../type-aliases/Abi.md) = [`Abi`](../type-aliases/Abi.md)

### TAdapter

`TAdapter` *extends* [`ReadAdapter`](../interfaces/ReadAdapter.md) = [`ReadAdapter`](../interfaces/ReadAdapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

### TClient

`TClient` *extends* [`Client`](../type-aliases/Client.md)\<`TAdapter`, `TStore`\> = [`Client`](../type-aliases/Client.md)\<`TAdapter`, `TStore`\>

## Constructors

### Constructor

> **new ReadContract**\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>(`__namedParameters`): `ReadContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:114](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L114)

#### Parameters

##### \_\_namedParameters

[`ContractOptions`](../type-aliases/ContractOptions.md)\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

#### Returns

`ReadContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

## Properties

### abi

> **abi**: `TAbi`

Defined in: [packages/drift/src/client/contract/Contract.ts:108](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L108)

***

### address

> **address**: `` `0x${string}` ``

Defined in: [packages/drift/src/client/contract/Contract.ts:109](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L109)

***

### cache

> **cache**: [`ContractCache`](ContractCache.md)\<`TAbi`, `TStore`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L111)

***

### client

> **client**: `TClient`

Defined in: [packages/drift/src/client/contract/Contract.ts:110](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L110)

***

### epochBlock?

> `optional` **epochBlock**: `bigint`

Defined in: [packages/drift/src/client/contract/Contract.ts:112](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L112)

## Methods

### decodeFunctionData()

> **decodeFunctionData**\<`TFunctionName`\>(`data`): [`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:186](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L186)

Decodes a string of function calldata into it's arguments and function
name.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string` = [`FunctionName`](../type-aliases/FunctionName.md)\<`TAbi`\>

#### Parameters

##### data

`` `0x${string}` ``

#### Returns

[`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

***

### decodeFunctionReturn()

> **decodeFunctionReturn**\<`TFunctionName`\>(`fn`, `data`): [`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:198](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L198)

Decodes a string of function return data into it's return value.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string` = [`FunctionName`](../type-aliases/FunctionName.md)\<`TAbi`\>

#### Parameters

##### fn

`TFunctionName`

##### data

`` `0x${string}` ``

#### Returns

[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

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

***

### extend()

> **extend**\<`T`\>(`props`): `T` & `ReadContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:136](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L136)

#### Type Parameters

##### T

`T` *extends* `Partial`\<[`Extended`](../type-aliases/Extended.md)\<`ReadContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\>\>

#### Parameters

##### props

`T` & `Partial`\<`ReadContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\> & `ThisType`\<`T` & `ReadContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>\>

#### Returns

`T` & `ReadContract`\<`TAbi`, `TAdapter`, `TStore`, `TClient`\>

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

***

### isReadWrite()

> **isReadWrite**(): `this is ReadWriteContract<TAbi, ReadWriteAdapter, Store, Client<ReadWriteAdapter, Store>>`

Defined in: [packages/drift/src/client/contract/Contract.ts:132](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L132)

#### Returns

`this is ReadWriteContract<TAbi, ReadWriteAdapter, Store, Client<ReadWriteAdapter, Store>>`

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

***

### read()

> **read**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:235](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L235)

Reads a specified function from the contract.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractReadArgs`](../type-aliases/ContractReadArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

***

### simulateWrite()

> **simulateWrite**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/client/contract/Contract.ts:250](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L250)

Simulates a write operation on a specified function of the contract.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractSimulateWriteArgs`](../type-aliases/ContractSimulateWriteArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>
