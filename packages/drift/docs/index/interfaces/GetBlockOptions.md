[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / GetBlockOptions

# Interface: GetBlockOptions

Defined in: [packages/drift/src/client/Client.ts:83](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Client.ts#L83)

## Properties

### throws?

> `optional` **throws**: `boolean`

Defined in: [packages/drift/src/client/Client.ts:89](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/Client.ts#L89)

Whether to throw a [`BlockNotFoundError`](../classes/BlockNotFoundError.md) if the block isn't found.
Setting this to true will remove `undefined` from the return type.

#### Default

```ts
false
```
