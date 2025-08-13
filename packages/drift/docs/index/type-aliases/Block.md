[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Block

# Type Alias: Block\<T\>

> **Block**\<`T`\> = [`Eval`](Eval.md)\<[`Replace`](Replace.md)\<[`BaseBlockProps`](../interfaces/BaseBlockProps.md) & [`BlockStatus`](BlockStatus.md)\<`T`\> *extends* `"mined"` ? `Required`\<[`MinedBlockProps`](../interfaces/MinedBlockProps.md)\<`T`\>\> : [`MinedBlockProps`](../interfaces/MinedBlockProps.md)\<`T`\>, [`BlockOverrides`](../interfaces/BlockOverrides.md)\<`T`\>\>\>

Defined in: [packages/drift/src/adapter/types/Block.ts:72](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Block.ts#L72)

A block in the chain, assumed to be mined unless specified otherwise.

## Type Parameters

### T

`T` *extends* [`BlockIdentifier`](BlockIdentifier.md) \| `undefined` = `undefined`
