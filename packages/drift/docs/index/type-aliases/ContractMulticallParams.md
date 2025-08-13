[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ContractMulticallParams

# Type Alias: ContractMulticallParams\<TAbi, TCalls, TAllowFailure\>

> **ContractMulticallParams**\<`TAbi`, `TCalls`, `TAllowFailure`\> = `object` & [`MulticallOptions`](../interfaces/MulticallOptions.md)\<`TAllowFailure`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:435](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L435)

## Type declaration

### calls

> **calls**: `{ [K in keyof TCalls]: NarrowTo<{ fn: TCalls[K]["fn"] } & DynamicProperty<"args", FunctionArgs<TAbi, TCalls[K]["fn"]>>, TCalls[K]> }`

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TCalls

`TCalls` *extends* `object`[] = `object`[]

### TAllowFailure

`TAllowFailure` *extends* `boolean` = `boolean`
