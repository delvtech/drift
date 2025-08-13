[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Client

# Type Alias: Client\<TAdapter, TStore, TExtension\>

> **Client**\<`TAdapter`, `TStore`, `TExtension`\> = `object` & `TAdapter` & `TExtension`

Defined in: [packages/drift/src/client/Client.ts:27](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Client.ts#L27)

A client for interacting with a network through an [`Adapter`](../interfaces/Adapter.md) with
[caching](../classes/ClientCache.md) and [hooks](../interfaces/HookRegistry.md).

## Type declaration

### adapter

> **adapter**: `TAdapter`

The [`Adapter`](../interfaces/Adapter.md) used by the client for network interactions.

### cache

> **cache**: [`ClientCache`](../classes/ClientCache.md)\<`TStore`\>

A cache for storing responses from the adapter using the provided
[`Store`](../interfaces/Store.md).

### hooks

> **hooks**: [`HookRegistry`](../interfaces/HookRegistry.md)\<[`MethodHooks`](MethodHooks.md)\<`TAdapter` & `TExtension`\>\> & [`HookRegistry`](../interfaces/HookRegistry.md)\<[`MethodHooks`](MethodHooks.md)\<[`Adapter`](../interfaces/Adapter.md)\>\>

Hooks for intercepting and modifying method calls or responses on the
client.

### extend()

> **extend**\<`T`\>(`props`): `Client`\<`TAdapter`, `TStore`, \{ \[K in string \| number \| symbol\]: (TExtension & T)\[K\] \}\>

Extends the client with additional properties.

#### Type Parameters

##### T

`T` *extends* `object`

#### Parameters

##### props

`T` *extends* `T` ? `Omit`\<`T`, keyof Adapter \| `"adapter"` \| `"cache"` \| keyof `TExtension` \| `"hooks"` \| `"isReadWrite"` \| `"extend"`\> : `T` & `Record`\<`Exclude`\<`string`, keyof `T` *extends* `T` ? `Omit`\<`T`, keyof Adapter \| `"adapter"` \| `"cache"` \| keyof ... \| `"hooks"` \| `"isReadWrite"` \| `"extend"`\> : `T`\> \| `Exclude`\<`number`, keyof `T` *extends* `T` ? `Omit`\<`T`, keyof Adapter \| `"adapter"` \| `"cache"` \| keyof ... \| `"hooks"` \| `"isReadWrite"` \| `"extend"`\> : `T`\> \| `Exclude`\<`symbol`, keyof `T` *extends* `T` ? `Omit`\<`T`, keyof Adapter \| `"adapter"` \| `"cache"` \| keyof ... \| `"hooks"` \| `"isReadWrite"` \| `"extend"`\> : `T`\>, `any`\> & `Partial`\<`object` & [`Adapter`](../interfaces/Adapter.md) & `TExtension`\> & `ThisType`\<`Client`\<`TAdapter`, `TStore`, `TExtension` & `T`\>\>

#### Returns

`Client`\<`TAdapter`, `TStore`, \{ \[K in string \| number \| symbol\]: (TExtension & T)\[K\] \}\>

### getBlock()

> **getBlock**\<`T`, `TOptions`\>(`block?`, `options?`): `Promise`\<[`GetBlockWithOptionsReturn`](GetBlockWithOptionsReturn.md)\<`T`, `TOptions`\>\>

#### Type Parameters

##### T

`T` *extends* `undefined` \| [`BlockIdentifier`](BlockIdentifier.md) = `undefined`

##### TOptions

`TOptions` *extends* [`GetBlockOptions`](../interfaces/GetBlockOptions.md) = \{ \}

#### Parameters

##### block?

`T`

##### options?

\{ \[K in string \| number \| symbol\]: (GetBlockOptions & TOptions)\[K\] \}

#### Returns

`Promise`\<[`GetBlockWithOptionsReturn`](GetBlockWithOptionsReturn.md)\<`T`, `TOptions`\>\>

### isReadWrite()

> **isReadWrite**(): `this is Client<ReadWriteAdapter, TStore, TExtension>`

Returns `true` if the client can send transactions.

#### Returns

`this is Client<ReadWriteAdapter, TStore, TExtension>`

## Type Parameters

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`Adapter`](../interfaces/Adapter.md)

### TStore

`TStore` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

### TExtension

`TExtension` *extends* `object` = \{ \}
