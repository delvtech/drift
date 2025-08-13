[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / SendCallsReturn

# Interface: SendCallsReturn

Defined in: [packages/drift/src/adapter/types/Adapter.ts:716](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L716)

## Properties

### capabilities?

> `optional` **capabilities**: `object`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:724](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L724)

Capability-specific response data.

#### Index Signature

\[`capability`: `string`\]: `unknown`

***

### id

> **id**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:720](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L720)

A call batch identifier that can be used to track the status of the calls.
