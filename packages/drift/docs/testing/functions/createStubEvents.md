[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / createStubEvents

# Function: createStubEvents()

> **createStubEvents**\<`TAbi`, `TEventName`\>(`params`): [`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]

Defined in: [packages/drift/src/adapter/utils/testing/createStubEvent.ts:54](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/testing/createStubEvent.ts#L54)

Creates multiple stub event logs for testing.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TEventName

`TEventName` *extends* `string` = [`EventName`](../../index/type-aliases/EventName.md)\<`TAbi`\>

## Parameters

### params

#### abi

`TAbi`

#### eventName

`TEventName`

#### events

readonly `object`[]

## Returns

[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>[]
