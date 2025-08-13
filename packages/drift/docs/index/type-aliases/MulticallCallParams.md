[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MulticallCallParams

# Type Alias: MulticallCallParams\<TAbi, TFunctionName\>

> **MulticallCallParams**\<`TAbi`, `TFunctionName`\> = `TAbi` *extends* [`Abi`](Abi.md) ? [`FunctionCallParams`](FunctionCallParams.md)\<`TAbi`, `TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`\> ? `TFunctionName` : [`FunctionName`](FunctionName.md)\<`TAbi`\>\> & `Partial`\<`Record`\<keyof [`EncodedCallParams`](../interfaces/EncodedCallParams.md), `undefined`\>\> : [`EncodedCallParams`](../interfaces/EncodedCallParams.md) & `Partial`\<`Record`\<keyof [`FunctionCallParams`](FunctionCallParams.md), `undefined`\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:396](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L396)

Parameters for a multicall call, which can be a function call or an encoded
call.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) \| `undefined` = [`Abi`](Abi.md) \| `undefined`

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`NarrowTo`\<[`Abi`](Abi.md), `TAbi`\>\> \| `undefined` = [`FunctionName`](FunctionName.md)\<`NarrowTo`\<[`Abi`](Abi.md), `TAbi`\>\> \| `undefined`
