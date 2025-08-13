[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WalletCallParams

# Type Alias: WalletCallParams\<TAbi, TFunctionName\>

> **WalletCallParams**\<`TAbi`, `TFunctionName`\> = [`OneOf`](OneOf.md)\<[`FunctionCallParams`](FunctionCallParams.md)\<`TAbi`, `TFunctionName`\> \| [`EncodeDeployDataParams`](EncodeDeployDataParams.md)\<`TAbi`\> \| [`EncodedCallParams`](../interfaces/EncodedCallParams.md) \| [`BytecodeCallParams`](../interfaces/BytecodeCallParams.md)\> & [`WalletCallOptions`](../interfaces/WalletCallOptions.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:631](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L631)

Parameters for a wallet call, which can be a function call, deploy call, or
an encoded call.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TFunctionName

`TFunctionName` *extends* [`FunctionName`](FunctionName.md)\<`TAbi`\> = [`FunctionName`](FunctionName.md)\<`TAbi`\>
