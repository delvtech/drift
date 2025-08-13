[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ContractWriteArgs

# Type Alias: ContractWriteArgs\<TAbi, TFunctionName\>

> **ContractWriteArgs**\<`TAbi`, `TFunctionName`\> = [`EmptyObject`](EmptyObject.md) *extends* [`FunctionArgs`](FunctionArgs.md)\<`TAbi`, `TFunctionName`\> ? \[`TFunctionName`, [`FunctionArgs`](FunctionArgs.md)\<`TAbi`, `TFunctionName`\>, [`WriteOptions`](../interfaces/WriteOptions.md)\] : \[`TFunctionName`, [`FunctionArgs`](FunctionArgs.md)\<`TAbi`, `TFunctionName`\>, [`WriteOptions`](../interfaces/WriteOptions.md)\]

Defined in: [packages/drift/src/client/contract/Contract.ts:417](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L417)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`, `"nonpayable"` \| `"payable"`\> = [`FunctionName`](FunctionName.md)\<`TAbi`, `"nonpayable"` \| `"payable"`\>
