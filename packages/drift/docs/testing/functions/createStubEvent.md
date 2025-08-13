[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / createStubEvent

# Function: createStubEvent()

> **createStubEvent**\<`TAbi`, `TEventName`\>(`params`): [`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>

Defined in: [packages/drift/src/adapter/utils/testing/createStubEvent.ts:27](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/testing/createStubEvent.ts#L27)

Creates a stub event log for testing.

## Type Parameters

### TAbi

`TAbi` *extends* `Abi`

### TEventName

`TEventName` *extends* `string` = [`EventName`](../../index/type-aliases/EventName.md)\<`TAbi`\>

## Parameters

### params

#### abi?

`TAbi`

#### args

[`AbiParametersToObject`](../../index/type-aliases/AbiParametersToObject.md)\<[`AbiParameters`](../../index/type-aliases/AbiParameters.md)\<`TAbi`, `"event"`, `TEventName`, `"inputs"`\>, `AbiParameterKind`\>

The decoded arguments of the event.

#### blockHash?

`` `0x${string}` ``

The hash of the block this log was in or `undefined` if pending.

#### blockNumber?

`bigint`

The block number this log was in or `undefined` if pending.

#### data?

`` `0x${string}` ``

Zero or more 32 Bytes non-indexed arguments of the event.

#### eventName

`TEventName`

The name of the emitted event.

#### logIndex?

`number`

The index of the log in the block or `undefined` if pending.

#### transactionHash?

`` `0x${string}` ``

The hash of the transaction this event was created from or `undefined` if pending.

## Returns

[`EventLog`](../../index/type-aliases/EventLog.md)\<`TAbi`, `TEventName`\>
