[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / BaseReadWriteAdapter

# Abstract Class: BaseReadWriteAdapter

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:146](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L146)

A read-write interface for interacting with a blockchain network and
its contracts, required by all read-write Drift client APIs.

## Extends

- [`BaseReadAdapter`](BaseReadAdapter.md)

## Implements

- [`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md)

## Constructors

### Constructor

> **new BaseReadWriteAdapter**(`__namedParameters`): `BaseReadWriteAdapter`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:82](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L82)

#### Parameters

##### \_\_namedParameters

[`BaseAdapterOptions`](../interfaces/BaseAdapterOptions.md) = `{}`

#### Returns

`BaseReadWriteAdapter`

#### Inherited from

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

> `abstract` **call**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:111](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L111)

Executes a new message call immediately without creating a transaction on
the block chain.

#### Parameters

##### params

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`decodeFunctionData`](../interfaces/ReadWriteAdapter.md#decodefunctiondata)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`decodeFunctionReturn`](../interfaces/ReadWriteAdapter.md#decodefunctionreturn)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`decodeFunctionReturn`](BaseReadAdapter.md#decodefunctionreturn)

***

### deploy()

> **deploy**\<`TAbi`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:169](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L169)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`encodeFunctionData`](../interfaces/ReadWriteAdapter.md#encodefunctiondata)

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`encodeFunctionReturn`](../interfaces/ReadWriteAdapter.md#encodefunctionreturn)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`encodeFunctionReturn`](BaseReadAdapter.md#encodefunctionreturn)

***

### getBalance()

> `abstract` **getBalance**(`params`): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:100](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L100)

Get the balance of native currency for an account.

#### Parameters

##### params

[`GetBalanceParams`](../interfaces/GetBalanceParams.md)

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getBalance`](../interfaces/ReadWriteAdapter.md#getbalance)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`getBalance`](BaseReadAdapter.md#getbalance)

***

### getBlock()

> `abstract` **getBlock**\<`T`\>(`blockId?`): `Promise`\<[`GetBlockReturn`](../type-aliases/GetBlockReturn.md)\<`T`\>\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:97](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L97)

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

[`BaseReadAdapter`](BaseReadAdapter.md).[`getBlock`](BaseReadAdapter.md#getblock)

***

### getBlockNumber()

> `abstract` **getBlockNumber**(): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:96](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L96)

Get the current block number.

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getBlockNumber`](../interfaces/ReadWriteAdapter.md#getblocknumber)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`getBlockNumber`](BaseReadAdapter.md#getblocknumber)

***

### getCallsStatus()

> `abstract` **getCallsStatus**\<`TId`\>(`batchId`): `Promise`\<[`WalletCallsStatus`](../interfaces/WalletCallsStatus.md)\<`TId`\>\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:158](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L158)

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

> `abstract` **getChainId**(): `Promise`\<`number`\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:95](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L95)

Get the chain ID of the network.

#### Returns

`Promise`\<`number`\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getChainId`](../interfaces/ReadWriteAdapter.md#getchainid)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`getChainId`](BaseReadAdapter.md#getchainid)

***

### getEvents()

> `abstract` **getEvents**\<`TAbi`, `TEventName`\>(`params`): `Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:108](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L108)

Get a list of logs for a contract event.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### params

[`GetEventsParams`](../interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getEvents`](../interfaces/ReadWriteAdapter.md#getevents)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`getEvents`](BaseReadAdapter.md#getevents)

***

### getSignerAddress()

> `abstract` **getSignerAddress**(): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:152](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L152)

Gets the address of the account that will be used to sign transactions.

#### Returns

`Promise`\<`` `0x${string}` ``\>

The address of the signer.

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getSignerAddress`](../interfaces/ReadWriteAdapter.md#getsigneraddress)

***

### getTransaction()

> `abstract` **getTransaction**(`params`): `Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:101](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L101)

Get a transaction from a transaction hash.

#### Parameters

##### params

[`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`getTransaction`](../interfaces/ReadWriteAdapter.md#gettransaction)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`getTransaction`](BaseReadAdapter.md#gettransaction)

***

### getWalletCapabilities()

> `abstract` **getWalletCapabilities**\<`TChainIds`\>(`params`): `Promise`\<[`WalletCapabilities`](../type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:153](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L153)

Queries what capabilities a wallet supports.

#### Type Parameters

##### TChainIds

`TChainIds` *extends* readonly `number`[] = \[\]

#### Parameters

##### params

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

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`read`](../interfaces/ReadWriteAdapter.md#read)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`read`](BaseReadAdapter.md#read)

***

### sendCalls()

> `abstract` **sendCalls**\<`TCalls`\>(`params`): `Promise`\<[`SendCallsReturn`](../interfaces/SendCallsReturn.md)\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:163](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L163)

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

> `abstract` **sendRawTransaction**(`transaction`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:107](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L107)

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

[`BaseReadAdapter`](BaseReadAdapter.md).[`sendRawTransaction`](BaseReadAdapter.md#sendrawtransaction)

***

### sendTransaction()

> `abstract` **sendTransaction**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:162](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L162)

Signs and submits a transaction.

#### Parameters

##### params

[`SendTransactionParams`](../type-aliases/SendTransactionParams.md)

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`sendTransaction`](../interfaces/ReadWriteAdapter.md#sendtransaction)

***

### showCallsStatus()

> `abstract` **showCallsStatus**(`batchId`): `Promise`\<`void`\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:161](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L161)

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

[`BaseReadAdapter`](BaseReadAdapter.md).[`simulateWrite`](BaseReadAdapter.md#simulatewrite)

***

### waitForTransaction()

> `abstract` **waitForTransaction**(`params`): `Promise`\<`undefined` \| [`TransactionReceipt`](../interfaces/TransactionReceipt.md)\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:104](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L104)

Wait for a transaction to be mined.

#### Parameters

##### params

[`WaitForTransactionParams`](../interfaces/WaitForTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`TransactionReceipt`](../interfaces/TransactionReceipt.md)\>

The transaction receipt.

#### Implementation of

[`ReadWriteAdapter`](../interfaces/ReadWriteAdapter.md).[`waitForTransaction`](../interfaces/ReadWriteAdapter.md#waitfortransaction)

#### Inherited from

[`BaseReadAdapter`](BaseReadAdapter.md).[`waitForTransaction`](BaseReadAdapter.md#waitfortransaction)

***

### write()

> **write**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:173](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L173)

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
