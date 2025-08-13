[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Adapter

# Interface: Adapter

Defined in: [packages/drift/src/adapter/types/Adapter.ts:36](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L36)

An interface for interacting with a blockchain network and its contracts,
required by all Drift client APIs.

## Extends

- [`ReadAdapter`](ReadAdapter.md).`Partial`\<[`WriteAdapter`](WriteAdapter.md)\>

## Properties

### deploy()?

> `optional` **deploy**: \<`TAbi`\>(`params`) => `Promise`\<`` `0x${string}` ``\>

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

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`deploy`](WriteAdapter.md#deploy)

***

### getCallsStatus()?

> `optional` **getCallsStatus**: \<`TId`\>(`batchId`) => `Promise`\<[`WalletCallsStatus`](WalletCallsStatus.md)\<`TId`\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:193](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L193)

Get the status of a call batch that was sent via [`sendCalls`](WriteAdapter.md#sendcalls).

#### Type Parameters

##### TId

`TId` *extends* `` `0x${string}` ``

#### Parameters

##### batchId

`TId`

#### Returns

`Promise`\<[`WalletCallsStatus`](WalletCallsStatus.md)\<`TId`\>\>

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`getCallsStatus`](WriteAdapter.md#getcallsstatus)

***

### getSignerAddress()?

> `optional` **getSignerAddress**: () => `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:181](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L181)

Gets the address of the account that will be used to sign transactions.

#### Returns

`Promise`\<`` `0x${string}` ``\>

The address of the signer.

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`getSignerAddress`](WriteAdapter.md#getsigneraddress)

***

### getWalletCapabilities()?

> `optional` **getWalletCapabilities**: \<`TChainIds`\>(`params?`) => `Promise`\<[`WalletCapabilities`](../type-aliases/WalletCapabilities.md)\<`TChainIds`\>\>

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

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`getWalletCapabilities`](WriteAdapter.md#getwalletcapabilities)

***

### sendCalls()?

> `optional` **sendCalls**: \<`TCalls`\>(`params`) => `Promise`\<[`SendCallsReturn`](SendCallsReturn.md)\>

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

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`sendCalls`](WriteAdapter.md#sendcalls)

***

### sendTransaction()?

> `optional` **sendTransaction**: (`params`) => `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:207](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L207)

Signs and submits a transaction.

#### Parameters

##### params

[`SendTransactionParams`](../type-aliases/SendTransactionParams.md)

#### Returns

`Promise`\<`` `0x${string}` ``\>

The transaction hash of the submitted transaction.

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`sendTransaction`](WriteAdapter.md#sendtransaction)

***

### showCallsStatus()?

> `optional` **showCallsStatus**: (`batchId`) => `Promise`\<`void`\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:201](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L201)

Requests that a wallet shows information about a given call batch that was
sent via [`sendCalls`](WriteAdapter.md#sendcalls).

#### Parameters

##### batchId

`` `0x${string}` ``

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`showCallsStatus`](WriteAdapter.md#showcallsstatus)

***

### write()?

> `optional` **write**: \<`TAbi`, `TFunctionName`\>(`params`) => `Promise`\<`` `0x${string}` ``\>

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

#### Inherited from

[`WriteAdapter`](WriteAdapter.md).[`write`](WriteAdapter.md#write)

## Methods

### call()

> **call**(`params`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:141](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L141)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`call`](ReadAdapter.md#call)

***

### decodeFunctionData()

> **decodeFunctionData**\<`TAbi`, `TFunctionName`\>(`params`): [`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:78](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L78)

Decodes the call data for a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`DecodeFunctionDataParams`](DecodeFunctionDataParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

[`DecodedFunctionData`](../type-aliases/DecodedFunctionData.md)\<`TAbi`, `TFunctionName`\>

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`decodeFunctionData`](ReadAdapter.md#decodefunctiondata)

***

### decodeFunctionReturn()

> **decodeFunctionReturn**\<`TAbi`, `TFunctionName`\>(`params`): [`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:88](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L88)

Decodes the return value of a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`DecodeFunctionReturnParams`](DecodeFunctionReturnParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`decodeFunctionReturn`](ReadAdapter.md#decodefunctionreturn)

***

### encodeDeployData()

> **encodeDeployData**\<`TAbi`\>(`params`): `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:55](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L55)

Encodes the constructor call data for a contract deployment.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

#### Parameters

##### params

[`EncodeDeployDataParams`](../type-aliases/EncodeDeployDataParams.md)\<`TAbi`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`encodeDeployData`](ReadAdapter.md#encodedeploydata)

***

### encodeFunctionData()

> **encodeFunctionData**\<`TAbi`, `TFunctionName`\>(`params`): `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:62](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L62)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`encodeFunctionData`](ReadAdapter.md#encodefunctiondata)

***

### encodeFunctionReturn()

> **encodeFunctionReturn**\<`TAbi`, `TFunctionName`\>(`params`): `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:70](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L70)

Encodes the return value of a function on a contract.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`EncodeFunctionReturnParams`](EncodeFunctionReturnParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`` `0x${string}` ``

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`encodeFunctionReturn`](ReadAdapter.md#encodefunctionreturn)

***

### getBalance()

> **getBalance**(`params`): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/types/Network.ts:35](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L35)

Get the balance of native currency for an account.

#### Parameters

##### params

[`GetBalanceParams`](GetBalanceParams.md)

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`getBalance`](ReadAdapter.md#getbalance)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`getBlock`](ReadAdapter.md#getblock)

***

### getBlockNumber()

> **getBlockNumber**(): `Promise`\<`bigint`\>

Defined in: [packages/drift/src/adapter/types/Network.ts:22](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L22)

Get the current block number.

#### Returns

`Promise`\<`bigint`\>

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`getBlockNumber`](ReadAdapter.md#getblocknumber)

***

### getChainId()

> **getChainId**(): `Promise`\<`number`\>

Defined in: [packages/drift/src/adapter/types/Network.ts:17](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L17)

Get the chain ID of the network.

#### Returns

`Promise`\<`number`\>

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`getChainId`](ReadAdapter.md#getchainid)

***

### getEvents()

> **getEvents**\<`TAbi`, `TEventName`\>(`params`): `Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:98](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L98)

Get a list of logs for a contract event.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### params

[`GetEventsParams`](GetEventsParams.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<[`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`getEvents`](ReadAdapter.md#getevents)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`getTransaction`](ReadAdapter.md#gettransaction)

***

### multicall()

> **multicall**\<`TCalls`, `TAllowFailure`\>(`params`): `Promise`\<`NoInfer`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:165](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L165)

#### Type Parameters

##### TCalls

`TCalls` *extends* readonly `unknown`[] = `any`[]

##### TAllowFailure

`TAllowFailure` *extends* `boolean` = `true`

#### Parameters

##### params

[`MulticallParams`](MulticallParams.md)\<`TCalls`, `TAllowFailure`\>

#### Returns

`Promise`\<`NoInfer`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>\>

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`multicall`](ReadAdapter.md#multicall)

***

### read()

> **read**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:147](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L147)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`read`](ReadAdapter.md#read)

***

### sendRawTransaction()

> **sendRawTransaction**(`transaction`): `Promise`\<`` `0x${string}` ``\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:50](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L50)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`sendRawTransaction`](ReadAdapter.md#sendrawtransaction)

***

### simulateWrite()

> **simulateWrite**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:158](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L158)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`simulateWrite`](ReadAdapter.md#simulatewrite)

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

#### Inherited from

[`ReadAdapter`](ReadAdapter.md).[`waitForTransaction`](ReadAdapter.md#waitfortransaction)
