[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / deleteMatches

# Function: deleteMatches()

> **deleteMatches**(`__namedParameters`): `Promise`\<`void`\>

Defined in: [packages/drift/src/store/utils/deleteMatches.ts:13](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/utils/deleteMatches.ts#L13)

Deletes all entries in the store whose keys match the provided key.

**Important**: This assumes that the keys in the store were stringified using
[`stringifyKey`](stringifyKey.md) or `JSON.stringify`.

## Parameters

### \_\_namedParameters

#### matchKey

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`string`\>

The key to match against.

#### store

[`Store`](../interfaces/Store.md)

The store to delete entries from.

## Returns

`Promise`\<`void`\>
