[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / SendCallsParams

# Interface: SendCallsParams\<TCalls\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:695](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L695)

Parameters for sending a batch of calls to a wallet.

## Extends

- [`SendCallsOptions`](SendCallsOptions.md)

## Type Parameters

### TCalls

`TCalls` *extends* readonly `unknown`[] = `any`[]

## Properties

### atomic?

> `optional` **atomic**: `boolean`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:681](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L681)

Specifies whether the wallet must execute all calls atomically (in a single
transaction) or not. If set to `true`, the wallet MUST execute all calls
atomically and contiguously. If set to `false`, the wallet MUST execute
calls sequentially (one after another), but they need not be contiguous
(other transactions may be interleaved) and some calls may fail
independently.

#### Default

```ts
true
```

#### Inherited from

[`SendCallsOptions`](SendCallsOptions.md).[`atomic`](SendCallsOptions.md#atomic)

***

### calls

> **calls**: \{ \[K in string \| number \| symbol\]: NarrowTo\<\{ abi: Abi \}, TCalls\[K\<K\>\]\>\["abi"\] extends TAbi ? WalletCallParams\<TAbi, NarrowTo\<\{ fn: FunctionName\<TAbi\> \}, TCalls\[K\<K\>\]\>\["fn"\]\> extends TParams ? NarrowTo\<TParams, Replace\<TParams, TCalls\[K\<K\>\]\>\> : never : never \}

Defined in: [packages/drift/src/adapter/types/Adapter.ts:701](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L701)

The calls to send. Each call must be a valid function call for the
specified ABI.

***

### capabilities?

> `optional` **capabilities**: [`WalletCapabilitiesOptions`](../type-aliases/WalletCapabilitiesOptions.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:688](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L688)

An object where the keys are capability names and the values are
capability-specific parameters. The wallet MUST support all non-optional
capabilities requested or reject the request.

#### Inherited from

[`SendCallsOptions`](SendCallsOptions.md).[`capabilities`](SendCallsOptions.md#capabilities)

***

### chainId?

> `optional` **chainId**: `number`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:662](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L662)

The chain ID to send the calls on. Defaults to the chain ID of the network
the wallet is connected to.

#### Inherited from

[`SendCallsOptions`](SendCallsOptions.md).[`chainId`](SendCallsOptions.md#chainid)

***

### from?

> `optional` **from**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:669](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L669)

The address to send the calls from. Defaults to the connected signer if
available. If not provided, the wallet should allow the user to select the
address during confirmation.

#### Inherited from

[`SendCallsOptions`](SendCallsOptions.md).[`from`](SendCallsOptions.md#from)

***

### id?

> `optional` **id**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/types/Adapter.ts:656](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L656)

A unique identifier for this batch of calls. If provided, must be a unique
string up to 4096 bytes (8194 characters including leading 0x). Must be
unique per sender per app. If not provided, the wallet will generate a
random ID.

#### Inherited from

[`SendCallsOptions`](SendCallsOptions.md).[`id`](SendCallsOptions.md#id)

***

### version?

> `optional` **version**: `WalletCallsVersion`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:648](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L648)

The version of the wallet calls API to use.

#### Default

```ts
"2.0.0"
```

#### Inherited from

[`SendCallsOptions`](SendCallsOptions.md).[`version`](SendCallsOptions.md#version)
