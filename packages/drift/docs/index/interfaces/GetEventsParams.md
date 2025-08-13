[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / GetEventsParams

# Interface: GetEventsParams\<TAbi, TEventName\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:335](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L335)

Params for getting events.

## Extends

- [`ContractParams`](ContractParams.md)\<`TAbi`\>.[`GetEventsOptions`](GetEventsOptions.md)\<`TAbi`, `TEventName`\>

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](../type-aliases/Abi.md) = [`Abi`](../type-aliases/Abi.md)

### TEventName

`TEventName` *extends* [`EventName`](../type-aliases/EventName.md)\<`TAbi`\> = [`EventName`](../type-aliases/EventName.md)\<`TAbi`\>

## Properties

### abi

> **abi**: `TAbi`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:246](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L246)

#### Inherited from

[`ContractParams`](ContractParams.md).[`abi`](ContractParams.md#abi)

***

### address

> **address**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:247](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L247)

#### Inherited from

[`ContractParams`](ContractParams.md).[`address`](ContractParams.md#address)

***

### event

> **event**: `TEventName`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:340](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L340)

***

### filter?

> `optional` **filter**: `Partial`\<\{ \[K in string \| number \| symbol\]: (\{ \[TName in never\]: AbiParameterToPrimitiveType\<Extract\<Extract\<Extract\<(...), (...)\>, \{ indexed: ... \}\>, \{ name: TName \}\>, "inputs"\> extends TPrimitive ? unknown extends TPrimitive ? any : TPrimitive : never \} & (Extract\<Extract\<Extract\<AbiParameters\<(...), (...), (...), (...)\>\[number\], Replace\<(...), (...)\> \| Replace\<(...), (...)\>\>, \{ indexed: true \}\>, \{ name: "" \}\> extends never ? \{\} : \{ \[index: number\]: AbiParameterToPrimitiveType\<Extract\<Extract\<Extract\<(...), (...)\>, \{ indexed: ... \}\>, \{ name: "" \}\>, "inputs"\> \}))\[K\] \}\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:327](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L327)

#### Inherited from

[`GetEventsOptions`](GetEventsOptions.md).[`filter`](GetEventsOptions.md#filter)

***

### fromBlock?

> `optional` **fromBlock**: [`RangeBlock`](../type-aliases/RangeBlock.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:328](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L328)

#### Inherited from

[`GetEventsOptions`](GetEventsOptions.md).[`fromBlock`](GetEventsOptions.md#fromblock)

***

### toBlock?

> `optional` **toBlock**: [`RangeBlock`](../type-aliases/RangeBlock.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:329](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L329)

#### Inherited from

[`GetEventsOptions`](GetEventsOptions.md).[`toBlock`](GetEventsOptions.md#toblock)
