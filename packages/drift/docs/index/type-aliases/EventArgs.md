[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / EventArgs

# Type Alias: EventArgs\<TAbi, TEventName\>

> **EventArgs**\<`TAbi`, `TEventName`\> = [`AbiObjectType`](AbiObjectType.md)\<`TAbi`, `"event"`, `TEventName`, `"inputs"`\>

Defined in: [packages/drift/src/adapter/types/Event.ts:31](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L31)

Get an object type for an event's arguments from an abi.

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md)

### TEventName

`TEventName` *extends* [`EventName`](EventName.md)\<`TAbi`\>
