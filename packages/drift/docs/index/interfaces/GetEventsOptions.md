[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / GetEventsOptions

# Interface: GetEventsOptions\<TAbi, TEventName\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:323](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L323)

Options for narrowing an event query.

## Extended by

- [`GetEventsParams`](GetEventsParams.md)

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../type-aliases/Abi.md) = [`Abi`](../type-aliases/Abi.md)

### TEventName

`TEventName` *extends* [`EventName`](../type-aliases/EventName.md)\<`TAbi`\> = [`EventName`](../type-aliases/EventName.md)\<`TAbi`\>

## Properties

### filter?

> `optional` **filter**: `Partial`\<\{ \[K in string \| number \| symbol\]: (\{ \[TName in never\]: AbiParameterToPrimitiveType\<Extract\<Extract\<Extract\<(...), (...)\>, \{ indexed: ... \}\>, \{ name: TName \}\>, "inputs"\> extends TPrimitive ? unknown extends TPrimitive ? any : TPrimitive : never \} & (Extract\<Extract\<Extract\<AbiParameters\<(...), (...), (...), (...)\>\[number\], Replace\<(...), (...)\> \| Replace\<(...), (...)\>\>, \{ indexed: true \}\>, \{ name: "" \}\> extends never ? \{\} : \{ \[index: number\]: AbiParameterToPrimitiveType\<Extract\<Extract\<Extract\<(...), (...)\>, \{ indexed: ... \}\>, \{ name: "" \}\>, "inputs"\> \}))\[K\] \}\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:327](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L327)

***

### fromBlock?

> `optional` **fromBlock**: [`RangeBlock`](../type-aliases/RangeBlock.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:328](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L328)

***

### toBlock?

> `optional` **toBlock**: [`RangeBlock`](../type-aliases/RangeBlock.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:329](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L329)
