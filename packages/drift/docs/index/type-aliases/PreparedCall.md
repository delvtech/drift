[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / PreparedCall

# Type Alias: PreparedCall\<TCall\>

> **PreparedCall**\<`TCall`\> = [`Eval`](Eval.md)\<`PartialByOptional`\<\{ `abiEntry`: `TCall` *extends* [`FunctionCallParams`](FunctionCallParams.md) ? [`AbiEntry`](AbiEntry.md)\<`TCall`\[`"abi"`\], `"function"`, `NarrowTo`\<\{ `fn`: [`FunctionName`](FunctionName.md)\<`TCall`\[`"abi"`\]\>; \}, `TCall`\>\[`"fn"`\]\> : `TCall` *extends* [`EncodeDeployDataParams`](EncodeDeployDataParams.md)\<infer TAbi\> ? \[[`AbiEntry`](AbiEntry.md)\<`TAbi`, `"constructor"`\>\] *extends* \[`never`\] ? *typeof* `DEFAULT_CONSTRUCTOR` : [`AbiEntry`](AbiEntry.md)\<`TAbi`, `"constructor"`\> : `undefined`; `data`: `TCall` *extends* \{ `abi`: [`Abi`](Abi.md); \} \| \{ `bytecode`: [`Bytes`](Bytes.md); \} \| \{ `data`: [`Bytes`](Bytes.md); \} ? [`Bytes`](Bytes.md) : `undefined`; `to`: `TCall` *extends* `object` ? `TAddress` : `TCall` *extends* `object` ? `TAddress` : `undefined`; \}\>\>

Defined in: [packages/drift/src/adapter/utils/prepareCall.ts:39](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/prepareCall.ts#L39)

A prepared call object, which includes the `to` address, `data` bytes, and an
optional `abiEntry` for decoding the return data.

## Type Parameters

### TCall

`TCall` = [`PrepareCallParams`](PrepareCallParams.md)
