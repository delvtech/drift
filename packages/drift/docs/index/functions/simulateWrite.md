[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / simulateWrite

# Function: simulateWrite()

> **simulateWrite**\<`TAbi`, `TFunctionName`\>(`adapter`, `__namedParameters`): `Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

Defined in: [packages/drift/src/adapter/methods/simulateWrite.ts:14](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/methods/simulateWrite.ts#L14)

Call a state-mutating function on a contract without sending a transaction.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TFunctionName

`TFunctionName` *extends* `string`

## Parameters

### adapter

[`Adapter`](../interfaces/Adapter.md)

### \_\_namedParameters

[`SimulateWriteParams`](../type-aliases/SimulateWriteParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`Promise`\<[`FunctionReturn`](../type-aliases/FunctionReturn.md)\<`TAbi`, `TFunctionName`\>\>

The decoded return value of the function.
