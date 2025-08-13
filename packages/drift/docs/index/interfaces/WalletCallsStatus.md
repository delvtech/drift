[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WalletCallsStatus

# Interface: WalletCallsStatus\<TId\>

Defined in: [packages/drift/src/adapter/types/Adapter.ts:528](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L528)

The status of a wallet call batch, as defined by EIP-5792.

## Type Parameters

### TId

`TId` *extends* [`HexString`](../type-aliases/HexString.md) = [`HexString`](../type-aliases/HexString.md)

## Properties

### atomic

> **atomic**: `boolean`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:570](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L570)

Whether the wallet executed the calls atomically or not. If `true`, the
wallet executed all calls in a single transaction. If `false`, the wallet
executed the calls in multiple transactions.

***

### capabilities?

> `optional` **capabilities**: `object`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:585](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L585)

Capability-specific metadata.

#### Index Signature

\[`capability`: `string`\]: `unknown`

***

### chainId

> **chainId**: `number`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:533](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L533)

***

### id

> **id**: `TId`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:538](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L538)

The call batch identifier.

***

### receipts?

> `optional` **receipts**: [`WalletCallsReceipt`](WalletCallsReceipt.md)[]

Defined in: [packages/drift/src/adapter/types/Adapter.ts:580](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L580)

The receipts associated with the call batch, if available. The structure
depends on the atomic field:
- If atomic is `true`, this may be a single receipt or an array of
  receipts, corresponding to how the batch was included onchain.
- If atomic is `false`, this must be an array of receipts for all
  transactions containing batch calls that were included onchain.

***

### status

> **status**: `"pending"` \| `"reverted"` \| `"confirmed"` \| `"failed"` \| `"partially-reverted"`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:543](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L543)

Current state of the batch.

***

### statusCode

> **statusCode**: `number`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:563](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L563)

The actual status code of the batch.
- `1xx`: Pending states
  - `100`: Batch has been received by the wallet but has not completed execution onchain
- `2xx`: Confirmed states
  - `200`: Batch has been included onchain without reverts
- ``4xx``: Offchain failures
  - `400`: Batch has not been included onchain and wallet will not retry
- `5xx`: Chain rules failures
  - `500`: Batch reverted completely and only changes related to gas charge may have been included onchain
- `6xx`: Partial chain rules failures
  - `600`: Batch reverted partially and some changes related to batch calls may have been included onchain

***

### version

> **version**: `WalletCallsVersion`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:532](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L532)

The version of the API being used.
