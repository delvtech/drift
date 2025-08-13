[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ReadOptions

# Interface: ReadOptions

Defined in: [packages/drift/src/adapter/types/Adapter.ts:377](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L377)

Options for reading contract state.

## Extends

- `Pick`\<[`CallOptions`](CallOptions.md), `"block"`\>

## Extended by

- [`MulticallOptions`](MulticallOptions.md)
- [`SimulateWriteOptions`](SimulateWriteOptions.md)

## Properties

### block?

> `optional` **block**: [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:365](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L365)

#### Inherited from

[`CallOptions`](CallOptions.md).[`block`](CallOptions.md#block)
