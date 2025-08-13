[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WaitForTransactionParams

# Interface: WaitForTransactionParams

Defined in: [packages/drift/src/adapter/types/Network.ts:69](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L69)

## Extends

- [`GetTransactionParams`](GetTransactionParams.md)

## Properties

### hash

> **hash**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Network.ts:59](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L59)

#### Inherited from

[`GetTransactionParams`](GetTransactionParams.md).[`hash`](GetTransactionParams.md#hash)

***

### timeout?

> `optional` **timeout**: `number`

Defined in: [packages/drift/src/adapter/types/Network.ts:74](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Network.ts#L74)

The number of milliseconds to wait for the transaction until rejecting
the promise.
