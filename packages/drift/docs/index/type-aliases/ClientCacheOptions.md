[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ClientCacheOptions

# Type Alias: ClientCacheOptions\<T\>

> **ClientCacheOptions**\<`T`\> = `object`

Defined in: [packages/drift/src/client/cache/ClientCache.ts:30](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L30)

## Type Parameters

### T

`T` *extends* [`Store`](../interfaces/Store.md) = [`Store`](../interfaces/Store.md)

## Properties

### namespace

> **namespace**: `PropertyKey` \| () => [`MaybePromise`](MaybePromise.md)\<`PropertyKey`\>

Defined in: [packages/drift/src/client/cache/ClientCache.ts:35](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L35)

The namespace to use for client operations or a function that returns the
namespace.

***

### store?

> `optional` **store**: `T`

Defined in: [packages/drift/src/client/cache/ClientCache.ts:46](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/cache/ClientCache.ts#L46)

The underlying cache implementation.

#### Default

```ts
// in-memory Least Recently Used (LRU) cache
new LruStore()
```

#### See

[`LruStore`](../classes/LruStore.md)
