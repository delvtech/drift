[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / NamedAbiParameter

# Type Alias: NamedAbiParameter

> **NamedAbiParameter** = `AbiParameter` *extends* infer TAbiParameter ? `TAbiParameter` *extends* `object` ? `TAbiParameter` : [`Replace`](Replace.md)\<`TAbiParameter`, \{ `name`: `string`; \}\> : `never`

Defined in: [packages/drift/src/adapter/types/Abi.ts:74](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Abi.ts#L74)
