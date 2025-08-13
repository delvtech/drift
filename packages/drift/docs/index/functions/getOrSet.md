[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / getOrSet

# Function: getOrSet()

> **getOrSet**\<`T`\>(`__namedParameters`): `Promise`\<`AwaitedReturnType`\<`T`\>\>

Defined in: [packages/drift/src/store/utils/getOrSet.ts:8](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/store/utils/getOrSet.ts#L8)

Checks the store for the key and returns the value if found, otherwise
executes the function and stores the result before returning it.

## Type Parameters

### T

`T` *extends* (...`args`) => `any`

## Parameters

### \_\_namedParameters

#### fn

`T`

#### key

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`string`\>

#### store

[`Store`](../interfaces/Store.md)

## Returns

`Promise`\<`AwaitedReturnType`\<`T`\>\>
