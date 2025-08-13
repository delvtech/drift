[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ReadParams

# Type Alias: ReadParams\<TAbi, TFunctionName\>

> **ReadParams**\<`TAbi`, `TFunctionName`\> = [`FunctionCallParams`](FunctionCallParams.md)\<`TAbi`, `TFunctionName`\> & [`ReadOptions`](../interfaces/ReadOptions.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:382](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L382)

Params for calling a contract function.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`, `"pure"` \| `"view"`\> = [`FunctionName`](FunctionName.md)\<`TAbi`, `"pure"` \| `"view"`\>
