[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ContractCache

# Class: ContractCache\<TAbi, TStore\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:42](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L42)

A cache for Drift [`Contract`](../type-aliases/Contract.md) operations.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../type-aliases/Abi.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

## Constructors

### Constructor

> **new ContractCache**\<`TAbi`, `TStore`\>(`__namedParameters`): `ContractCache`\<`TAbi`, `TStore`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:47](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L47)

#### Parameters

##### \_\_namedParameters

[`ContractCacheOptions`](../type-aliases/ContractCacheOptions.md)\<`TAbi`, `TStore`\>

#### Returns

`ContractCache`\<`TAbi`, `TStore`\>

## Accessors

### store

#### Get Signature

> **get** **store**(): `TStore`

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:60](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L60)

##### Returns

`TStore`

## Methods

### clear()

> **clear**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:70](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L70)

Clear the entire cache.

**Warning**: This operation is not scoped to the contract and will delete
everything in the store. This is a full reset.

#### Returns

`Promise`\<`void`\>

***

### clearReads()

> **clearReads**(): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:215](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L215)

Delete all read results in the cache for this contract to ensure
`Contract.read` re-fetches them when called.

#### Returns

`Promise`\<`void`\>

***

### eventsKey()

> **eventsKey**\<`TEventName`\>(`event`, `options?`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:79](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L79)

Get the key used to store an event query.

#### Type Parameters

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### event

`TEventName`

##### options?

[`GetEventsOptions`](../interfaces/GetEventsOptions.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<`string`\>

***

### getEvents()

> **getEvents**\<`TEventName`\>(`event`, `options?`): `Promise`\<`undefined` \| [`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:112](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L112)

Get a cached event query.

#### Type Parameters

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### event

`TEventName`

##### options?

[`GetEventsOptions`](../interfaces/GetEventsOptions.md)\<`TAbi`, `TEventName`\>

#### Returns

`Promise`\<`undefined` \| [`EventLog`](../type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]\>

***

### getRead()

> **getRead**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<`undefined` \| [`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:162](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L162)

Get a cached read result.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractReadArgs`](../type-aliases/ContractReadArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`undefined` \| [`AbiSimplifiedType`](../type-aliases/AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`, `AbiStateMutability`\>\>

***

### invalidateRead()

> **invalidateRead**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:178](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L178)

Delete a read result in the cache to ensure `Contract.read`
re-fetches it when called.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractReadArgs`](../type-aliases/ContractReadArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`void`\>

***

### invalidateReadsMatching()

> **invalidateReadsMatching**\<`TFunctionName`\>(`fn?`, `args?`, `options?`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:195](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L195)

Delete all read results in the cache for this contract that match partial
params to ensure Client.read re-fetches matching reads when
called.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### fn?

`TFunctionName`

##### args?

`Partial`\<[`AbiParametersToObject`](../type-aliases/AbiParametersToObject.md)\<[`AbiParameters`](../type-aliases/AbiParameters.md)\<`TAbi`, `"function"`, `TFunctionName`, `"inputs"`\>, `AbiParameterKind`\>\>

##### options?

[`ReadOptions`](../interfaces/ReadOptions.md)

#### Returns

`Promise`\<`void`\>

***

### preloadEvents()

> **preloadEvents**\<`TEventName`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:94](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L94)

Add an event query to the cache.

#### Type Parameters

##### TEventName

`TEventName` *extends* `string`

#### Parameters

##### params

`Omit`\<[`GetEventsParams`](../interfaces/GetEventsParams.md)\<`TAbi`, `TEventName`\>, keyof [`ContractParams`](../interfaces/ContractParams.md)\<`TAbi`\>\> & `object`

#### Returns

`Promise`\<`void`\>

***

### preloadRead()

> **preloadRead**\<`TFunctionName`\>(`params`): `Promise`\<`void`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:144](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L144)

Add a read result to the cache.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### params

`Omit`\<[`ReadParams`](../type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>, keyof [`ContractParams`](../interfaces/ContractParams.md)\<`TAbi`\>\> & `object`

#### Returns

`Promise`\<`void`\>

***

### readKey()

> **readKey**\<`TFunctionName`\>(...`__namedParameters`): `Promise`\<`string`\>

Defined in: [packages/drift/src/client/contract/cache/ContractCache.ts:129](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/cache/ContractCache.ts#L129)

Get the key used to store a read result.

#### Type Parameters

##### TFunctionName

`TFunctionName` *extends* `string`

#### Parameters

##### \_\_namedParameters

...[`ContractReadArgs`](../type-aliases/ContractReadArgs.md)\<`TAbi`, `TFunctionName`\>

#### Returns

`Promise`\<`string`\>
