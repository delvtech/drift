[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / BytecodeCallParams

# Interface: BytecodeCallParams

Defined in: [packages/drift/src/adapter/types/Adapter.ts:356](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L356)

## Extends

- `Pick`\<[`EncodedCallParams`](EncodedCallParams.md), `"data"`\>

## Properties

### bytecode

> **bytecode**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:360](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L360)

A contract bytecode to temporarily deploy and call.

***

### data?

> `optional` **data**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:353](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L353)

The hash of the invoked method signature and encoded parameters.

#### Inherited from

[`EncodedCallParams`](EncodedCallParams.md).[`data`](EncodedCallParams.md#data)
