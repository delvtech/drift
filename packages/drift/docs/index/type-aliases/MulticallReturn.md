[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MulticallReturn

# Type Alias: MulticallReturn\<TCalls, TAllowFailure\>

> **MulticallReturn**\<`TCalls`, `TAllowFailure`\> = `{ [K in keyof TCalls]: TAllowFailure extends true ? MulticallCallResult<TCalls[K]> : Extract<MulticallCallResult<TCalls[K]>, { value: unknown }>["value"] }`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:464](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L464)

## Type Parameters

### TCalls

`TCalls` *extends* readonly `unknown`[] = `unknown`[]

### TAllowFailure

`TAllowFailure` *extends* `boolean` = `boolean`
