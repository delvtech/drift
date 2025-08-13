[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / FunctionReturn

# Type Alias: FunctionReturn\<TAbi, TFunctionName\>

> **FunctionReturn**\<`TAbi`, `TFunctionName`\> = [`AbiSimplifiedType`](AbiSimplifiedType.md)\<`TAbi`, `"function"`, `TFunctionName`, `"outputs"`\>

Defined in: [packages/drift/src/adapter/types/Function.ts:42](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Function.ts#L42)

Get a return type for an abi function, which is determined by it's outputs:
- __Single output:__ the primitive type of the single output.
- __Multiple outputs:__ an object with the output names as keys and the
  output types as values.
- __No outputs:__ `undefined`.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`\> = [`FunctionName`](FunctionName.md)\<`TAbi`\>
