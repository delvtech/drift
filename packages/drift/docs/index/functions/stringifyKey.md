[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / stringifyKey

# Function: stringifyKey()

> **stringifyKey**\<`T`\>(`rawKey`): `Stringified`\<`T`\>

Defined in: [packages/drift/src/utils/keys.ts:13](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/keys.ts#L13)

Converts a raw key to a stringified version, handling `BigInt` values by
appending 'n'. This is useful for ensuring that keys can be safely serialized
and deserialized.

## Type Parameters

### T

`T`

## Parameters

### rawKey

`T`

The raw key to be stringified.

## Returns

`Stringified`\<`T`\>

A stringified version of the key.
