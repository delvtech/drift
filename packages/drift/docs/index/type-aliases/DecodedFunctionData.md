[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / DecodedFunctionData

# Type Alias: DecodedFunctionData\<TAbi, TFunctionName\>

> **DecodedFunctionData**\<`TAbi`, `TFunctionName`\> = `{ [K in TFunctionName]: { args: FunctionArgs<TAbi, K>; functionName: K } }`\[`TFunctionName`\]

Defined in: [packages/drift/src/adapter/types/Function.ts:50](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Function.ts#L50)

Get an object representing decoded function or constructor data from an ABI.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`\> = [`FunctionName`](FunctionName.md)\<`TAbi`\>
