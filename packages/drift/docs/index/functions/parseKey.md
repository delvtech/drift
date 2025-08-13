[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / parseKey

# Function: parseKey()

> **parseKey**\<`T`\>(`stringifiedKey`): `T`

Defined in: [packages/drift/src/utils/keys.ts:30](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/keys.ts#L30)

Parses a stringified key back to its original form, converting 'n' suffixed
integer strings back to `BigInt`. This is useful for retrieving keys that were
previously stringified with [`stringifyKey`](stringifyKey.md).

## Type Parameters

### T

`T` = `any`

## Parameters

### stringifiedKey

`string`

The stringified key to be parsed.

## Returns

`T`

The original key, with `BigInt` values restored.
