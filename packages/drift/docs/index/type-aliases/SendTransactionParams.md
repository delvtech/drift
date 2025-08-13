[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / SendTransactionParams

# Type Alias: SendTransactionParams

> **SendTransactionParams** = `object` & [`OneOf`](OneOf.md)\<[`Eip4844Options`](../interfaces/Eip4844Options.md) & `object` \| \{ `to?`: [`Address`](Address.md); \}\> & [`WriteOptions`](../interfaces/WriteOptions.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:779](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L779)

## Type declaration

### data

> **data**: [`Bytes`](Bytes.md)

The data to send with the transaction.
