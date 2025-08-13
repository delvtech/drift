[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / ContractOnMulticallParams

# Type Alias: ContractOnMulticallParams\<TAbi, TCalls, TAllowFailure\>

> **ContractOnMulticallParams**\<`TAbi`, `TCalls`, `TAllowFailure`\> = `object` & [`MulticallOptions`](../../index/interfaces/MulticallOptions.md)\<`TAllowFailure`\>

Defined in: [packages/drift/src/client/contract/MockContract.ts:174](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/MockContract.ts#L174)

## Type declaration

### calls

> **calls**: `TCalls`

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../../index/type-aliases/Abi.md) = [`Abi`](../../index/type-aliases/Abi.md)

### TCalls

`TCalls` *extends* `ContractOnMulticallCall`\<`TAbi`\>[] = `ContractOnMulticallCall`\<`TAbi`\>[]

### TAllowFailure

`TAllowFailure` *extends* `boolean` = `boolean`
