[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MulticallCallResult

# Type Alias: MulticallCallResult\<TCall\>

> **MulticallCallResult**\<`TCall`\> = [`OneOf`](OneOf.md)\<\{ `success`: `true`; `value`: `TCall` *extends* `object` ? [`FunctionReturn`](FunctionReturn.md)\<`TAbi`, `NarrowTo`\<[`FunctionName`](FunctionName.md)\<`TAbi`\>, `TFunctionName`\>\> : [`Bytes`](Bytes.md); \} \| \{ `error`: `Error`; `success`: `false`; \}\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:448](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L448)

The result object for single multicall call.

## Type Parameters

### TCall

`TCall` = `any`
