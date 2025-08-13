[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / EventFilter

# Type Alias: EventFilter\<TAbi, TEventName\>

> **EventFilter**\<`TAbi`, `TEventName`\> = `Partial`\<[`AbiParametersToObject`](AbiParametersToObject.md)\<`IndexedEventInput`\<`TAbi`, `TEventName`\>[], `"inputs"`\>\>

Defined in: [packages/drift/src/adapter/types/Event.ts:47](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L47)

Get an object type for an event's indexed fields from an abi

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md)

### TEventName

`TEventName` *extends* [`EventName`](EventName.md)\<`TAbi`\>
