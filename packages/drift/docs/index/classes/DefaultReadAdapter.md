[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / DefaultReadAdapter

# Class: DefaultReadAdapter

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:66](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L66)

A read-only interface for interacting with a blockchain network and its
contracts, required by all Drift client APIs.

## Extends

- [`BaseReadAdapter`](BaseReadAdapter.md)

## Extended by

- [`DefaultAdapter`](DefaultAdapter.md)

## Implements

- [`ReadAdapter`](../interfaces/ReadAdapter.md)

## Constructors

### Constructor

> **new DefaultReadAdapter**(`__namedParameters`): `DefaultReadAdapter`

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:69](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L69)

#### Parameters

##### \_\_namedParameters

[`DefaultAdapterOptions`](../interfaces/DefaultAdapterOptions.md) = `{}`

#### Returns

`DefaultReadAdapter`

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`constructor`](BaseReadAdapter.md#constructor)

## Properties

### multicallAddress

> **multicallAddress**: `undefined` \| `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:80](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L80)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`multicallAddress`](BaseReadAdapter.md#multicalladdress)

***

### pollingInterval

> **pollingInterval**: `number`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:78](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L78)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`pollingInterval`](BaseReadAdapter.md#pollinginterval)

***

### pollingTimeout

> **pollingTimeout**: `number`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:79](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L79)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`pollingTimeout`](BaseReadAdapter.md#pollingtimeout)

***

### provider

> **provider**: `object`

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:67](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L67)

***

### DEFAULT\_POLLING\_INTERVAL

> `static` **DEFAULT\_POLLING\_INTERVAL**: `4000`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:75](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L75)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`DEFAULT_POLLING_INTERVAL`](BaseReadAdapter.md#default_polling_interval)

***

### DEFAULT\_TIMEOUT

> `static` **DEFAULT\_TIMEOUT**: `60000`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:76](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L76)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`DEFAULT_TIMEOUT`](BaseReadAdapter.md#default_timeout)

## Methods

### call()

> **call**(`__namedParameters`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:244](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L244)

Executes a new message call immediately without creating a transaction on
the block chain.

#### Parameters

##### \_\_namedParameters

[`CallParams`](../type-aliases/CallParams.md)

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

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`call`](../interfaces/ReadAdapter.md#call)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`call`](BaseReadAdapter.md#call)

***

### decodeFunctionData()

> **decodeFunctionData**\<`TAbi`, `TFunctionName`\>(`params`): [`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/adapter/AbiEncoder.ts:42](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/AbiEncoder.ts#L42)

Decodes the call data for a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi` = `Abi`

##### TFunctionName

`TFunctionName` *extends* `string` = `TAbi`\[`number`\] *extends* `TEntry` ? `ExtractFiltered`\<`TEntry`, `AbiFilter`\<`"function"`, `string`, `AbiStateMutability`, `undefined` \| `AbiParameterKind`\>\> : `never` *extends* `TEntry` ? `TEntry`\[`"name"`\] : `never`

#### Parameters

##### params

[`DecodeFunctionDataParams`](../interfaces/DecodeFunctionDataParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

[`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`decodeFunctionData`](../interfaces/ReadAdapter.md#decodefunctiondata)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`decodeFunctionData`](BaseReadAdapter.md#decodefunctiondata)

***

### decodeFunctionReturn()

> **decodeFunctionReturn**\<`TAbi`, `TFunctionName`\>(`params`): [`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/adapter/AbiEncoder.ts:49](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/AbiEncoder.ts#L49)

Decodes the return value of a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string` = [`FunctionName`](../type-aliases/FunctionName.md)\<`TAbi`\>

#### Parameters

##### params

[`DecodeFunctionReturnParams`](../interfaces/DecodeFunctionReturnParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`decodeFunctionReturn`](../interfaces/ReadAdapter.md#decodefunctionreturn)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`decodeFunctionReturn`](BaseReadAdapter.md#decodefunctionreturn)

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

[`EncodeDeployDataParams`](../type-aliases/EncodeDeployDataParams.md)\<`TAbi`\>

#### Returns

`` `0x${string}` ``

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`encodeDeployData`](../interfaces/ReadAdapter.md#encodedeploydata)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`encodeDeployData`](BaseReadAdapter.md#encodedeploydata)

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

[`EncodeFunctionDataParams`](../type-aliases/EncodeFunctionDataParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`` `0x${string}` ``

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`encodeFunctionData`](../interfaces/ReadAdapter.md#encodefunctiondata)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`encodeFunctionData`](BaseReadAdapter.md#encodefunctiondata)

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

[`EncodeFunctionReturnParams`](../interfaces/EncodeFunctionReturnParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`` `0x${string}` ``

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`encodeFunctionReturn`](../interfaces/ReadAdapter.md#encodefunctionreturn)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`encodeFunctionReturn`](BaseReadAdapter.md#encodefunctionreturn)

***

### getBalance()

> **getBalance**(`params`): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:128](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L128)

Get the balance of native currency for an account.

#### Parameters

##### params

[`GetBalanceParams`](../interfaces/GetBalanceParams.md)

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`getBalance`](../interfaces/ReadAdapter.md#getbalance)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`getBalance`](BaseReadAdapter.md#getbalance)

***

### getBlock()

> **getBlock**\<`T`\>(`blockId?`): `Promise`\<[`GetBlockReturn`](../type-aliases/GetBlockReturn.md)\<`T`\>\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:100](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L100)

Get a block from a block tag, number, or hash. If no argument is provided,
the latest block is returned.

#### Type Parameters

##### T

`T` *extends* `undefined` \| [`BlockIdentifier`](../type-aliases/BlockIdentifier.md) = `undefined`

#### Parameters

##### blockId?

`T`

#### Returns

`Promise`\<[`GetBlockReturn`](../type-aliases/GetBlockReturn.md)\<`T`\>\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`getBlock`](../interfaces/ReadAdapter.md#getblock)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`getBlock`](BaseReadAdapter.md#getblock)

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L93)

Get the current block number.

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`getBlockNumber`](../interfaces/ReadAdapter.md#getblocknumber)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`getBlockNumber`](BaseReadAdapter.md#getblocknumber)

***

### getChainId()

> **getChainId**(): `Promise`\<`number`\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:86](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L86)

Get the chain ID of the network.

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`getChainId`](../interfaces/ReadAdapter.md#getchainid)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`getChainId`](BaseReadAdapter.md#getchainid)

***

### getEvents()

> **getEvents**\<`TAbi`, `TEventName`\>(`__namedParameters`): `Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:200](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L200)

Get a list of logs for a contract event.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### \_\_namedParameters

[`GetEventsParams`](../interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`getEvents`](../interfaces/ReadAdapter.md#getevents)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`getEvents`](BaseReadAdapter.md#getevents)

***

### getTransaction()

> **getTransaction**(`__namedParameters`): `Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:138](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L138)

Get a transaction from a transaction hash.

#### Parameters

##### \_\_namedParameters

[`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`getTransaction`](../interfaces/ReadAdapter.md#gettransaction)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`getTransaction`](BaseReadAdapter.md#gettransaction)

***

### multicall()

> **multicall**\<`TCalls`, `TAllowFailure`\>(`__namedParameters`): `Promise`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:133](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L133)

#### Type Parameters

##### TCalls

`TCalls` *extends* readonly `unknown`[]

##### TAllowFailure

`TAllowFailure` *extends* `boolean` = `true`

#### Parameters

##### \_\_namedParameters

[`MulticallParams`](../interfaces/MulticallParams.md)\<`TCalls`, `TAllowFailure`\>

#### Returns

`Promise`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`multicall`](../interfaces/ReadAdapter.md#multicall)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`multicall`](BaseReadAdapter.md#multicall)

***

### read()

> **read**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:115](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L115)

Calls a `pure` or `view` function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`ReadParams`](../type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

The decoded return value of the function.

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`read`](../interfaces/ReadAdapter.md#read)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`read`](BaseReadAdapter.md#read)

***

### sendRawTransaction()

> **sendRawTransaction**(`transaction`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:193](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L193)

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

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`sendRawTransaction`](../interfaces/ReadAdapter.md#sendrawtransaction)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`sendRawTransaction`](BaseReadAdapter.md#sendrawtransaction)

***

### simulateWrite()

> **simulateWrite**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:124](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L124)

Call a state-mutating function on a contract without sending a transaction.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`SimulateWriteParams`](../type-aliases/SimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

The decoded return value of the function.

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`simulateWrite`](../interfaces/ReadAdapter.md#simulatewrite)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`simulateWrite`](BaseReadAdapter.md#simulatewrite)

***

### waitForTransaction()

> **waitForTransaction**(`__namedParameters`): `Promise`\<`undefined` \| [`TransactionReceipt`](../interfaces/TransactionReceipt.md)\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:159](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L159)

Wait for a transaction to be mined.

#### Parameters

##### \_\_namedParameters

[`WaitForTransactionParams`](../interfaces/WaitForTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`TransactionReceipt`](../interfaces/TransactionReceipt.md)\>

The transaction receipt.

#### Implementation of

[`ReadAdapter`](../interfaces/ReadAdapter.md).[`waitForTransaction`](../interfaces/ReadAdapter.md#waitfortransaction)

#### Overrides

[`BaseReadAdapter`](BaseReadAdapter.md).[`waitForTransaction`](BaseReadAdapter.md#waitfortransaction)
