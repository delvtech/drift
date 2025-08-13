[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / OnReadParams

# Type Alias: OnReadParams\<TAbi, TFunctionName\>

> **OnReadParams**\<`TAbi`, `TFunctionName`\> = [`Replace`](../../index/type-aliases/Replace.md)\<`Partial`\<[`ReadParams`](../../index/type-aliases/ReadParams.md)\<`TAbi`, `TFunctionName`\>\>, \{ `args?`: `Partial`\<[`FunctionArgs`](../../index/type-aliases/FunctionArgs.md)\<`TAbi`, `TFunctionName`\>\>; \}\>

Defined in: [packages/drift/src/adapter/MockAdapter.ts:583](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/MockAdapter.ts#L583)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) = [`Abi`](../../index/type-aliases/Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](../../index/type-aliases/FunctionName.md)\<`TAbi`, `"pure"` \| `"view"`\> = [`FunctionName`](../../index/type-aliases/FunctionName.md)\<`TAbi`, `"pure"` \| `"view"`\>
