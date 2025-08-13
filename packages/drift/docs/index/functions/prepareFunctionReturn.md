[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / prepareFunctionReturn

# Function: prepareFunctionReturn()

> **prepareFunctionReturn**\<`TAbi`, `TFunctionName`\>(`__namedParameters`): `object`

Defined in: [packages/drift/src/adapter/utils/encodeFunctionReturn.ts:21](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/encodeFunctionReturn.ts#L21)

Encodes a function return into [`Bytes`](../type-aliases/Bytes.md) and its ABI.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TFunctionName

`TFunctionName` *extends* `string`

## Parameters

### \_\_namedParameters

[`EncodeFunctionReturnParams`](../interfaces/EncodeFunctionReturnParams.md)\<`TAbi`, `TFunctionName`\>

## Returns

`object`

### abiEntry

> **abiEntry**: `ExtractFiltered`\<`TAbi`\[`number`\], `AbiFilter`\<`"function"`, `TFunctionName`, `any`, `"outputs"`\>\>

### data

> **data**: `` `0x${string}` ``
