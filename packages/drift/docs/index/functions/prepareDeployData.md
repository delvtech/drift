[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / prepareDeployData

# Function: prepareDeployData()

> **prepareDeployData**\<`TAbi`\>(`__namedParameters`): `object`

Defined in: [packages/drift/src/adapter/utils/encodeDeployData.ts:19](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/encodeDeployData.ts#L19)

Encodes a contract deploy call into [`Bytes`](../type-aliases/Bytes.md) and its ABI.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

## Parameters

### \_\_namedParameters

[`EncodeDeployDataParams`](../type-aliases/EncodeDeployDataParams.md)\<`TAbi`\>

## Returns

`object`

### abiEntry

> **abiEntry**: `ExtractFiltered`\<`TAbi`\[`number`\], `AbiFilter`\<`"constructor"`, `undefined`, `any`, `"inputs"`\>\>

### data

> **data**: `` `0x${string}` ``
