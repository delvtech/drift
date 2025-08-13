[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / EventLog

# Type Alias: EventLog\<TAbi, TEventName\>

> **EventLog**\<`TAbi`, `TEventName`\> = `object`

Defined in: [packages/drift/src/adapter/types/Event.ts:58](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L58)

A strongly typed event object based on an abi

## Type Parameters

### TAbi

`TAbi` *extends* [`Abi`](Abi.md) = [`Abi`](Abi.md)

### TEventName

`TEventName` *extends* [`EventName`](EventName.md)\<`TAbi`\> = [`EventName`](EventName.md)\<`TAbi`\>

## Properties

### args

> **args**: [`EventArgs`](EventArgs.md)\<`TAbi`, `TEventName`\>

Defined in: [packages/drift/src/adapter/types/Event.ts:69](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L69)

The decoded arguments of the event.

***

### blockHash

> **blockHash**: [`Hash`](Hash.md) \| `undefined`

Defined in: [packages/drift/src/adapter/types/Event.ts:77](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L77)

The hash of the block this log was in or `undefined` if pending.

***

### blockNumber

> **blockNumber**: `bigint` \| `undefined`

Defined in: [packages/drift/src/adapter/types/Event.ts:81](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L81)

The block number this log was in or `undefined` if pending.

***

### data

> **data**: [`Bytes`](Bytes.md)

Defined in: [packages/drift/src/adapter/types/Event.ts:73](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L73)

Zero or more 32 Bytes non-indexed arguments of the event.

***

### eventName

> **eventName**: `TEventName`

Defined in: [packages/drift/src/adapter/types/Event.ts:65](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L65)

The name of the emitted event.

***

### logIndex

> **logIndex**: `number` \| `undefined`

Defined in: [packages/drift/src/adapter/types/Event.ts:85](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L85)

The index of the log in the block or `undefined` if pending.

***

### transactionHash

> **transactionHash**: [`Hash`](Hash.md) \| `undefined`

Defined in: [packages/drift/src/adapter/types/Event.ts:89](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Event.ts#L89)

The hash of the transaction this event was created from or `undefined` if pending.
