[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ClientCache

# Class: ClientCache\<T\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:52](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L52)

A cache for drift [`Client`](../type-aliases/Client.md) operations.

## Type Parameters

### T

`T` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

## Constructors

### Constructor

> **new ClientCache**\<`T`\>(`__namedParameters`): `ClientCache`\<`T`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:56](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L56)

#### Parameters

##### \_\_namedParameters

[`ClientCacheOptions`](../type-aliases/ClientCacheOptions.md)\<`T`\>

#### Returns

`ClientCache`\<`T`\>

## Properties

### namespace

> **namespace**: `PropertyKey` \| () => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`PropertyKey`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:53](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L53)

***

### store

> **store**: `T`

Defined in: [packages/drift/src/client/cache/ClientCache.ts:54](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L54)

## Methods

### balanceKey()

> **balanceKey**(`params`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:139](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L139)

Get the key used to store an account's balance.

#### Parameters

##### params

[`GetBalanceParams`](../interfaces/GetBalanceParams.md)

#### Returns

`Promise`\<`string`\>

***

### blockKey()

> **blockKey**(`block?`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:82](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L82)

Get the key used to store a block.

#### Parameters

##### block?

[`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

#### Returns

`Promise`\<`string`\>

***

### callKey()

> **callKey**(`params`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:305](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L305)

Get the key used to store a call result.

#### Parameters

##### params

[`CallParams`](../type-aliases/CallParams.md)

#### Returns

`Promise`\<`string`\>

***

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:73](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L73)

Clear the entire cache.

**Warning**: This operation is not namespaced and will delete everything in
the store. This is a full reset.

#### Returns

`Promise`\<`void`\>

***

### clearBalances()

> **clearBalances**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:177](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L177)

Delete all account balances in the cache to ensure
[`Client.getBalance`](../interfaces/Network.md#getbalance) re-fetches them when called.

#### Returns

`Promise`\<`void`\>

***

### clearBlocks()

> **clearBlocks**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:123](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L123)

Delete all blocks in the cache to ensure `Client.getBlock`
re-fetches them when requested.

#### Returns

`Promise`\<`void`\>

***

### clearCalls()

> **clearCalls**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:362](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L362)

Delete all call results in the cache to ensure [`Client.call`](../interfaces/ReadAdapter.md#call)
re-sends all requests when called.

#### Returns

`Promise`\<`void`\>

***

### clearReads()

> **clearReads**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:508](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L508)

Delete all read results in the cache to ensure [`Client.read`](../interfaces/ReadAdapter.md#read)
re-fetches them when called.

#### Returns

`Promise`\<`void`\>

***

### clearTransactions()

> **clearTransactions**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:233](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L233)

Delete all transactions in the cache to ensure
[`Client.getTransaction`](../interfaces/Network.md#gettransaction) re-fetches them when called.

#### Returns

`Promise`\<`void`\>

***

### eventsKey()

> **eventsKey**\<`TAbi`, `TEventName`\>(`__namedParameters`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:371](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L371)

Get the key used to store an event query.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### \_\_namedParameters

[`GetEventsParams`](../interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<`string`\>

***

### getBalance()

> **getBalance**(`params`): `Promise`\<`undefined` \| `bigint`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:159](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L159)

Get the cached balance for an account.

#### Parameters

##### params

[`GetBalanceParams`](../interfaces/GetBalanceParams.md)

#### Returns

`Promise`\<`undefined` \| `bigint`\>

***

### getBlock()

> **getBlock**\<`T`\>(`block?`): `Promise`\<`undefined` \| \{ \[K in string \| number \| symbol\]: Replace\<BaseBlockProps & (BlockStatus\<T\> extends "mined" ? Required\<MinedBlockProps\<T\>\> : MinedBlockProps\<T\>), BlockOverrides\<T\>\>\[K\] \}\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:103](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L103)

Get a cached block.

#### Type Parameters

##### T

`T` *extends* [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

#### Parameters

##### block?

`T`

#### Returns

`Promise`\<`undefined` \| \{ \[K in string \| number \| symbol\]: Replace\<BaseBlockProps & (BlockStatus\<T\> extends "mined" ? Required\<MinedBlockProps\<T\>\> : MinedBlockProps\<T\>), BlockOverrides\<T\>\>\[K\] \}\>

***

### getCall()

> **getCall**(`params`): `Promise`\<`undefined` \| `` `0x${string}` ``\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:333](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L333)

Get a cached call result.

#### Parameters

##### params

[`CallParams`](../type-aliases/CallParams.md)

#### Returns

`Promise`\<`undefined` \| `` `0x${string}` ``\>

***

### getEvents()

> **getEvents**\<`TAbi`, `TEventName`\>(`params`): `Promise`\<`undefined` \| [`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:403](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L403)

Get a cached event query.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### params

[`GetEventsParams`](../interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<`undefined` \| [`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

***

### getRead()

> **getRead**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<`undefined` \| [`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:463](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L463)

Get a cached read result.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`ReadParams`](../type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`undefined` \| [`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

***

### getTransaction()

> **getTransaction**(`params`): `Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:213](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L213)

Get a cached transaction.

#### Parameters

##### params

[`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

***

### getTransactionReceipt()

> **getTransactionReceipt**(`params`): `Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:265](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L265)

Get a cached transaction receipt.

#### Parameters

##### params

[`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`undefined` \| [`Transaction`](../interfaces/Transaction.md)\>

***

### invalidateBalance()

> **invalidateBalance**(`params`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:168](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L168)

Delete an account's balance in the cache to ensure
[`Client.getBalance`](../interfaces/Network.md#getbalance) re-fetches it when called.

#### Parameters

##### params

[`GetBalanceParams`](../interfaces/GetBalanceParams.md)

#### Returns

`Promise`\<`void`\>

***

### invalidateBlock()

> **invalidateBlock**\<`T`\>(`block?`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:114](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L114)

Delete a block in the cache to ensure `Client.getBlock`
re-fetches it when requested.

#### Type Parameters

##### T

`T` *extends* [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

#### Parameters

##### block?

`T`

#### Returns

`Promise`\<`void`\>

***

### invalidateCall()

> **invalidateCall**(`params`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:342](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L342)

Delete a call result in the cache to ensure [`Client.call`](../interfaces/ReadAdapter.md#call)
re-sends the request when called.

#### Parameters

##### params

[`CallParams`](../type-aliases/CallParams.md)

#### Returns

`Promise`\<`void`\>

***

### invalidateCallsMatching()

> **invalidateCallsMatching**(`params?`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:351](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L351)

Delete all call results in the cache that match partial params to ensure
[`Client.call`](../interfaces/ReadAdapter.md#call) re-sends matching requests when called.

#### Parameters

##### params?

`Partial`\<[`CallParams`](../type-aliases/CallParams.md)\>

#### Returns

`Promise`\<`void`\>

***

### invalidateRead()

> **invalidateRead**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:477](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L477)

Delete a read result in the cache to ensure [`Client.read`](../interfaces/ReadAdapter.md#read)
re-fetches it when called.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`ReadParams`](../type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`void`\>

***

### invalidateReadsMatching()

> **invalidateReadsMatching**\<`TAbi`, `TFunctionName`\>(`params?`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:489](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L489)

Delete all read results in the cache that match partial params to ensure
[`Client.read`](../interfaces/ReadAdapter.md#read) re-fetches matching reads when called.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params?

[`Replace`](../type-aliases/Replace.md)\<`Partial`\<[`ReadParams`](../type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>\>, \{ `args?`: `Partial`\<[`FunctionArgs`](../type-aliases/FunctionArgs.md)\<`TAbi`, `TFunctionName`\>\>; \}\>

#### Returns

`Promise`\<`void`\>

***

### invalidateTransaction()

> **invalidateTransaction**(`params`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:224](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L224)

Delete a transaction in the cache to ensure
[`Client.getTransaction`](../interfaces/Network.md#gettransaction) re-fetches it when called.

#### Parameters

##### params

[`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`void`\>

***

### preloadBalance()

> **preloadBalance**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:146](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L146)

Add an account's balance to the cache.

#### Parameters

##### \_\_namedParameters

`object` & [`GetBalanceParams`](../interfaces/GetBalanceParams.md)

#### Returns

`Promise`\<`void`\>

***

### preloadBlock()

> **preloadBlock**\<`T`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:89](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L89)

Add a block to the cache.

#### Type Parameters

##### T

`T` *extends* [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

#### Parameters

##### \_\_namedParameters

###### block?

`T`

###### value

\{ \[K in string \| number \| symbol\]: Replace\<BaseBlockProps & (BlockStatus\<T\> extends "mined" ? Required\<MinedBlockProps\<T\>\> : MinedBlockProps\<T\>), BlockOverrides\<T\>\>\[K\] \}

#### Returns

`Promise`\<`void`\>

***

### preloadCall()

> **preloadCall**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:312](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L312)

Add a call result to the cache.

#### Parameters

##### \_\_namedParameters

`object` & [`CallParams`](../type-aliases/CallParams.md)

#### Returns

`Promise`\<`void`\>

***

### preloadEvents()

> **preloadEvents**\<`TAbi`, `TEventName`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:390](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L390)

Add an event query to the cache.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### \_\_namedParameters

`object` & [`GetEventsParams`](../interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<`void`\>

***

### preloadRead()

> **preloadRead**\<`TAbi`, `TFunctionName`\>(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:447](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L447)

Add a read result to the cache.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

`object` & `object` & [`DynamicProperty`](../type-aliases/DynamicProperty.md)\<`"args"`, [`AbiParametersToObject`](../type-aliases/AbiParametersToObject.md)\<[`AbiParameters`](../type-aliases/AbiParameters.md)\<`TAbi`, `"function"`, `TFunctionName`, `"inputs"`\>, `AbiParameterKind`\>\> & [`ReadOptions`](../interfaces/ReadOptions.md)

#### Returns

`Promise`\<`void`\>

***

### preloadTransaction()

> **preloadTransaction**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:200](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L200)

Add a transaction to the cache.

#### Parameters

##### \_\_namedParameters

`object` & [`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`void`\>

***

### preloadTransactionReceipt()

> **preloadTransactionReceipt**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:252](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L252)

Add a transaction receipt to the cache.

#### Parameters

##### \_\_namedParameters

`object` & [`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`void`\>

***

### readKey()

> **readKey**\<`TAbi`, `TFunctionName`\>(`params`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:437](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L437)

Get the key used to store a read result.

#### Type Parameters

##### TAbi

`TAbi` *extends* `Abi`

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

[`ReadParams`](../type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`string`\>

***

### transactionKey()

> **transactionKey**(`__namedParameters`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:193](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L193)

Get the key used to store a transaction.

#### Parameters

##### \_\_namedParameters

[`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`string`\>

***

### transactionReceiptKey()

> **transactionReceiptKey**(`__namedParameters`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:245](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L245)

Get the key used to store a transaction receipt.

#### Parameters

##### \_\_namedParameters

[`GetTransactionParams`](../interfaces/GetTransactionParams.md)

#### Returns

`Promise`\<`string`\>
