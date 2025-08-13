[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / EncodeFunctionDataParams

# Type Alias: EncodeFunctionDataParams\<TAbi, TFunctionName\>

> **EncodeFunctionDataParams**\<`TAbi`, `TFunctionName`\> = `object` & [`DynamicProperty`](DynamicProperty.md)\<`"args"`, [`FunctionArgs`](FunctionArgs.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:270](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L270)

## Type declaration

### abi

> **abi**: `TAbi`

### fn

> **fn**: `TFunctionName`

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`\> = [`FunctionName`](FunctionName.md)\<`TAbi`\>
