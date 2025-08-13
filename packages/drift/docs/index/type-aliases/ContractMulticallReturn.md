[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / ContractMulticallReturn

# Type Alias: ContractMulticallReturn\<TAbi, TCalls, TAllowFailure\>

> **ContractMulticallReturn**\<`TAbi`, `TCalls`, `TAllowFailure`\> = [`MulticallReturn`](MulticallReturn.md)\<`{ [K in keyof TCalls]: ContractParams<TAbi> & TCalls[K] }`, `TAllowFailure`\>

Defined in: [packages/drift/src/client/contract/Contract.ts:450](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/contract/Contract.ts#L450)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TCalls

`TCalls` *extends* `object`[] = `object`[]

### TAllowFailure

`TAllowFailure` *extends* `boolean` = `boolean`
