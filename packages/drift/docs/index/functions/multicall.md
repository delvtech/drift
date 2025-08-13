[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / multicall

# Function: multicall()

> **multicall**\<`TCalls`, `TAllowFailure`\>(`adapter`, `__namedParameters`): `Promise`\<`NoInfer`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>\>

Defined in: [packages/drift/src/adapter/methods/multicall.ts:13](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/methods/multicall.ts#L13)

## Type Parameters

### TCalls

`TCalls` *extends* readonly `unknown`[]

### TAllowFailure

`TAllowFailure` *extends* `boolean` = `true`

## Parameters

### adapter

[`Adapter`](../interfaces/Adapter.md)

### \_\_namedParameters

[`MulticallParams`](../interfaces/MulticallParams.md)\<`TCalls`, `TAllowFailure`\>

## Returns

`Promise`\<`NoInfer`\<[`MulticallReturn`](../type-aliases/MulticallReturn.md)\<`TCalls`, `TAllowFailure`\>\>\>
