[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / createStubTransactionReceipt

# Function: createStubTransactionReceipt()

> **createStubTransactionReceipt**\<`T`\>(`overrides`): \{ \[K in string \| number \| symbol\]: Replace\<TransactionReceipt, Writable\<T, false\>\>\[K\] \}

Defined in: [packages/drift/src/adapter/utils/testing/createStubTransactionReceipt.ts:10](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/testing/createStubTransactionReceipt.ts#L10)

Creates a stub transaction receipt for testing.

## Type Parameters

### T

`T` *extends* `Partial`\<[`TransactionReceipt`](../../index/interfaces/TransactionReceipt.md)\> = [`TransactionReceipt`](../../index/interfaces/TransactionReceipt.md)

## Parameters

### overrides

`T` = `...`

## Returns

\{ \[K in string \| number \| symbol\]: Replace\<TransactionReceipt, Writable\<T, false\>\>\[K\] \}
