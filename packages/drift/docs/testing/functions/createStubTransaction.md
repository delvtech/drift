[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / createStubTransaction

# Function: createStubTransaction()

> **createStubTransaction**\<`T`\>(`overrides`): \{ \[K in string \| number \| symbol\]: Replace\<Transaction, Writable\<T, false\>\>\[K\] \}

Defined in: [packages/drift/src/adapter/utils/testing/createStubTransaction.ts:11](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/testing/createStubTransaction.ts#L11)

Creates a stub transaction for testing.

## Type Parameters

### T

`T` *extends* `Partial`\<[`Transaction`](../../index/interfaces/Transaction.md)\> = [`Transaction`](../../index/interfaces/Transaction.md)

## Parameters

### overrides

`T` = `...`

## Returns

\{ \[K in string \| number \| symbol\]: Replace\<Transaction, Writable\<T, false\>\>\[K\] \}
