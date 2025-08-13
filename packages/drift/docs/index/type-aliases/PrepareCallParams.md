[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / PrepareCallParams

# Type Alias: PrepareCallParams\<TAbi, TFunctionName\>

> **PrepareCallParams**\<`TAbi`, `TFunctionName`\> = [`OneOf`](OneOf.md)\<[`FunctionCallParams`](FunctionCallParams.md)\<`TAbi`, `TFunctionName`\> \| [`EncodeDeployDataParams`](EncodeDeployDataParams.md)\<`TAbi`\> \| [`EncodedCallParams`](../interfaces/EncodedCallParams.md) \| [`BytecodeCallParams`](../interfaces/BytecodeCallParams.md)\>

Defined in: [packages/drift/src/adapter/utils/prepareCall.ts:25](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/prepareCall.ts#L25)

Parameters for preparing a call, which can be a function call, deploy call,
or an encoded call.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`\> = [`FunctionName`](FunctionName.md)\<`TAbi`\>
