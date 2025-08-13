[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / prepareFunctionData

# Function: prepareFunctionData()

> **prepareFunctionData**\<`TAbi`, `TFunctionName`\>(`__namedParameters`): `object`

Defined in: [packages/drift/src/adapter/utils/encodeFunctionData.ts:21](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/encodeFunctionData.ts#L21)

Encodes a function call into [`Bytes`](../type-aliases/Bytes.md) and its ABI.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TFunctionName

`TFunctionName` *extends* `string`

## Parameters

### \_\_namedParameters

[`EncodeFunctionDataParams`](../type-aliases/EncodeFunctionDataParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`object`

### abiEntry

> **abiEntry**: `ExtractFiltered`\<`TAbi`\[`number`\], `AbiFilter`\<`"function"`, `TFunctionName`, `any`, `"inputs"`\>\>

### data

> **data**: `` `0x${string}` ``
