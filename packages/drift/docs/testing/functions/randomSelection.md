[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / randomSelection

# Function: randomSelection()

> **randomSelection**\<`T`\>(`values`): `T` *extends* readonly \[\] ? `undefined` : `T`\[`number`\]

Defined in: [packages/drift/src/utils/testing/randomSelection.ts:9](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/testing/randomSelection.ts#L9)

Get a random selection from an array.

## Type Parameters

### T

`T` *extends* readonly `any`[]

## Parameters

### values

`T`

The array of values to select from.

## Returns

`T` *extends* readonly \[\] ? `undefined` : `T`\[`number`\]

A random value from the array, or `undefined` if the array is empty.
