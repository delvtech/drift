[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Store

# Interface: Store

Defined in: [packages/drift/src/store/Store.ts:7](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/Store.ts#L7)

A minimal interface for storing and retrieving values in a cache. The methods
may be synchronous or asynchronous.

## Properties

### clear()

> **clear**: () => `any`

Defined in: [packages/drift/src/store/Store.ts:38](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/Store.ts#L38)

Removes all of the mappings from this store.

#### Returns

`any`

***

### delete()

> **delete**: (`key`) => `any`

Defined in: [packages/drift/src/store/Store.ts:33](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/Store.ts#L33)

Removes the mapping for the specified key from this store if present.

#### Parameters

##### key

`string`

#### Returns

`any`

***

### entries()

> **entries**: () => `Iterable`\<\[`string`, `any`\], `any`, `any`\> \| `AsyncIterable`\<\[`string`, `any`\], `any`, `any`\>

Defined in: [packages/drift/src/store/Store.ts:11](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/Store.ts#L11)

Returns an iterable of key-value pairs for every entry in the store.

#### Returns

`Iterable`\<\[`string`, `any`\], `any`, `any`\> \| `AsyncIterable`\<\[`string`, `any`\], `any`, `any`\>

***

### get()

> **get**: (`key`) => `any`

Defined in: [packages/drift/src/store/Store.ts:21](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/Store.ts#L21)

Retrieves the value associated with the specified key.

#### Parameters

##### key

`string`

#### Returns

`any`

***

### has()

> **has**: (`key`) => [`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

Defined in: [packages/drift/src/store/Store.ts:16](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/Store.ts#L16)

Returns a boolean indicating whether an entry exists for the specified key.

#### Parameters

##### key

`string`

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`boolean`\>

***

### set()

> **set**: (`key`, `value`) => `any`

Defined in: [packages/drift/src/store/Store.ts:28](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/Store.ts#L28)

Associates the specified value with the specified key in the store. If the
store previously contained a mapping for the key, the old value is
replaced.

#### Parameters

##### key

`string`

##### value

`any`

#### Returns

`any`
