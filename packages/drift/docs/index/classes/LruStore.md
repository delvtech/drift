[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / LruStore

# Class: LruStore

Defined in: [packages/drift/src/store/LruStore.ts:16](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/LruStore.ts#L16)

Least Recently Used (LRU) implementation of the [`Store`](../interfaces/Store.md) interface.

## Param

The options to pass to the underlying `LRUCache`.
Default: `{ max: 500 }`.

## See

[NPM - lru-cache](https://www.npmjs.com/package/lru-cache).

## Extends

- `LRUCache`\<`string`, `any`, `unknown`\>

## Implements

- [`Store`](../interfaces/Store.md)

## Constructors

### Constructor

> **new LruStore**(`options`): `LruStore`

Defined in: [packages/drift/src/store/LruStore.ts:17](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/LruStore.ts#L17)

#### Parameters

##### options

[`LruStoreOptions`](../type-aliases/LruStoreOptions.md) = `...`

#### Returns

`LruStore`

#### Overrides

`LRUCache<string, any, unknown>.constructor`
