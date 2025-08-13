[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / DefaultAdapter

# Class: DefaultAdapter

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:261](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L261)

A read-write interface for interacting with a blockchain network and
its contracts, required by all read-write Drift client APIs.

## Extends

- [`DefaultReadAdapter`](DefaultReadAdapter.md)

## Implements

- [`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md)

## Constructors

### Constructor

> **new DefaultAdapter**(`__namedParameters`): `DefaultAdapter`

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:69](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L69)

#### Parameters

##### \_\_namedParameters

[`DefaultAdapterOptions`](../interfaces/DefaultAdapterOptions.md) = `{}`

#### Returns

`DefaultAdapter`

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`constructor`](DefaultReadAdapter.md#constructor)

## Properties

### multicallAddress

> **multicallAddress**: `undefined` \| `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:80](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L80)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`multicallAddress`](DefaultReadAdapter.md#multicalladdress)

***

### pollingInterval

> **pollingInterval**: `number`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:78](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L78)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`pollingInterval`](DefaultReadAdapter.md#pollinginterval)

***

### pollingTimeout

> **pollingTimeout**: `number`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:79](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L79)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`pollingTimeout`](DefaultReadAdapter.md#pollingtimeout)

***

### provider

> **provider**: `object`

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:67](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L67)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`provider`](DefaultReadAdapter.md#provider)

***

### DEFAULT\_POLLING\_INTERVAL

> `static` **DEFAULT\_POLLING\_INTERVAL**: `4000`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:75](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L75)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`DEFAULT_POLLING_INTERVAL`](DefaultReadAdapter.md#default_polling_interval)

***

### DEFAULT\_TIMEOUT

> `static` **DEFAULT\_TIMEOUT**: `60000`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:76](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L76)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`DEFAULT_TIMEOUT`](DefaultReadAdapter.md#default_timeout)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`call`](../interfaces/ReadWriteAdapter.md#call)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`call`](DefaultReadAdapter.md#call)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`decodeFunctionData`](../interfaces/ReadWriteAdapter.md#decodefunctiondata)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`decodeFunctionData`](DefaultReadAdapter.md#decodefunctiondata)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`decodeFunctionReturn`](../interfaces/ReadWriteAdapter.md#decodefunctionreturn)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`decodeFunctionReturn`](DefaultReadAdapter.md#decodefunctionreturn)

***

### deploy()

> **deploy**\<`TAbi`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:364](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L364)

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

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`deploy`](../interfaces/ReadWriteAdapter.md#deploy)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`encodeDeployData`](../interfaces/ReadWriteAdapter.md#encodedeploydata)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`encodeDeployData`](DefaultReadAdapter.md#encodedeploydata)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`encodeFunctionData`](../interfaces/ReadWriteAdapter.md#encodefunctiondata)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`encodeFunctionData`](DefaultReadAdapter.md#encodefunctiondata)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`encodeFunctionReturn`](../interfaces/ReadWriteAdapter.md#encodefunctionreturn)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`encodeFunctionReturn`](DefaultReadAdapter.md#encodefunctionreturn)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getBalance`](../interfaces/ReadWriteAdapter.md#getbalance)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`getBalance`](DefaultReadAdapter.md#getbalance)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getBlock`](../interfaces/ReadWriteAdapter.md#getblock)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`getBlock`](DefaultReadAdapter.md#getblock)

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:93](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L93)

Get the current block number.

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getBlockNumber`](../interfaces/ReadWriteAdapter.md#getblocknumber)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`getBlockNumber`](DefaultReadAdapter.md#getblocknumber)

***

### getCallsStatus()

> **getCallsStatus**\<`TId`\>(`batchId`): `Promise`\<[`WalletCallsStatus`](../interfaces/WalletCallsStatus.md)\<`TId`\>\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:299](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L299)

Get the status of a call batch that was sent via [`sendCalls`](../interfaces/WriteAdapter.md#sendcalls).

#### Type Parameters

##### TId

`TId` *extends* `` `0x${string}` ``

#### Parameters

##### batchId

`TId`

#### Returns

`Promise`\<[`WalletCallsStatus`](../interfaces/WalletCallsStatus.md)\<`TId`\>\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getCallsStatus`](../interfaces/ReadWriteAdapter.md#getcallsstatus)

***

### getChainId()

> **getChainId**(): `Promise`\<`number`\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:86](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L86)

Get the chain ID of the network.

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getChainId`](../interfaces/ReadWriteAdapter.md#getchainid)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`getChainId`](DefaultReadAdapter.md#getchainid)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getEvents`](../interfaces/ReadWriteAdapter.md#getevents)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`getEvents`](DefaultReadAdapter.md#getevents)

***

### getSignerAddress()

> **getSignerAddress**(): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:265](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L265)

Gets the address of the account that will be used to sign transactions.

#### Returns

`Promise`\<`` `0x${string}` ``\>

The address of the signer.

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getSignerAddress`](../interfaces/ReadWriteAdapter.md#getsigneraddress)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getTransaction`](../interfaces/ReadWriteAdapter.md#gettransaction)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`getTransaction`](DefaultReadAdapter.md#gettransaction)

***

### getWalletCapabilities()

> **getWalletCapabilities**\<`TChainIds`\>(`params?`): `Promise`\<[`WalletCapabilities`](../type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:275](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L275)

Queries what capabilities a wallet supports.

#### Type Parameters

##### TChainIds

`TChainIds` *extends* readonly `number`[]

#### Parameters

##### params?

[`GetWalletCapabilitiesParams`](../interfaces/GetWalletCapabilitiesParams.md)\<`TChainIds`\>

#### Returns

`Promise`\<[`WalletCapabilities`](../type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getWalletCapabilities`](../interfaces/ReadWriteAdapter.md#getwalletcapabilities)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`multicall`](../interfaces/ReadWriteAdapter.md#multicall)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`multicall`](DefaultReadAdapter.md#multicall)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`read`](../interfaces/ReadWriteAdapter.md#read)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`read`](DefaultReadAdapter.md#read)

***

### sendCalls()

> **sendCalls**\<`TCalls`\>(`params`): `Promise`\<[`SendCallsReturn`](../interfaces/SendCallsReturn.md)\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:375](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L375)

Requests that a wallet submits a batch of calls.

#### Type Parameters

##### TCalls

`TCalls` *extends* readonly `unknown`[] = `any`[]

#### Parameters

##### params

[`SendCallsParams`](../interfaces/SendCallsParams.md)\<`TCalls`\>

#### Returns

`Promise`\<[`SendCallsReturn`](../interfaces/SendCallsReturn.md)\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`sendCalls`](../interfaces/ReadWriteAdapter.md#sendcalls)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`sendRawTransaction`](../interfaces/ReadWriteAdapter.md#sendrawtransaction)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`sendRawTransaction`](DefaultReadAdapter.md#sendrawtransaction)

***

### sendTransaction()

> **sendTransaction**(`__namedParameters`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:338](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L338)

Signs and submits a transaction.

#### Parameters

##### \_\_namedParameters

[`SendTransactionParams`](../type-aliases/SendTransactionParams.md)

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`sendTransaction`](../interfaces/ReadWriteAdapter.md#sendtransaction)

***

### showCallsStatus()

> **showCallsStatus**(`batchId`): `Promise`\<`void`\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:329](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L329)

Requests that a wallet shows information about a given call batch that was
sent via [`sendCalls`](../interfaces/WriteAdapter.md#sendcalls).

#### Parameters

##### batchId

`` `0x${string}` ``

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`showCallsStatus`](../interfaces/ReadWriteAdapter.md#showcallsstatus)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`simulateWrite`](../interfaces/ReadWriteAdapter.md#simulatewrite)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`simulateWrite`](DefaultReadAdapter.md#simulatewrite)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`waitForTransaction`](../interfaces/ReadWriteAdapter.md#waitfortransaction)

#### Inherited from

[`DefaultReadAdapter`](DefaultReadAdapter.md).[`waitForTransaction`](DefaultReadAdapter.md#waitfortransaction)

***

### write()

> **write**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/DefaultAdapter.ts:368](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/DefaultAdapter.ts#L368)

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

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`write`](../interfaces/ReadWriteAdapter.md#write)
