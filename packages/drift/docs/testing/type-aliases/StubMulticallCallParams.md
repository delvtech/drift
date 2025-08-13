[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / StubMulticallCallParams

# Type Alias: StubMulticallCallParams\<TAbi, TFunctionName\>

> **StubMulticallCallParams**\<`TAbi`, `TFunctionName`\> = [`OneOf`](../../index/type-aliases/OneOf.md)\<[`Replace`](../../index/type-aliases/Replace.md)\<`Partial`\<[`FunctionCallParams`](../../index/type-aliases/FunctionCallParams.md)\<`TAbi`, `TFunctionName`\>\>, \{ `args?`: `Partial`\<[`FunctionArgs`](../../index/type-aliases/FunctionArgs.md)\<`TAbi`, `TFunctionName`\>\>; \}\> \| `Partial`\<[`EncodedCallParams`](../../index/interfaces/EncodedCallParams.md)\>\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:613](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L613)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) = [`Abi`](../../index/type-aliases/Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](../../index/type-aliases/FunctionName.md)\<`TAbi`\> = [`FunctionName`](../../index/type-aliases/FunctionName.md)\<`TAbi`\>
