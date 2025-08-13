[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / getWalletCallsStatusLabel

# Function: getWalletCallsStatusLabel()

> **getWalletCallsStatusLabel**(`statusCode`): `"pending"` \| `"reverted"` \| `"confirmed"` \| `"failed"` \| `"partially-reverted"`

Defined in: [packages/drift/src/adapter/utils/getWalletCallsStatusLabel.ts:16](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/getWalletCallsStatusLabel.ts#L16)

Returns the status label for a given wallet calls status code.

## Parameters

### statusCode

`number`

## Returns

`"pending"` \| `"reverted"` \| `"confirmed"` \| `"failed"` \| `"partially-reverted"`

## Example

```ts
getWalletCallsStatusLabel(100); // "pending"
getWalletCallsStatusLabel(200); // "confirmed"
getWalletCallsStatusLabel(400); // "failed"
getWalletCallsStatusLabel(500); // "reverted"
getWalletCallsStatusLabel(600); // "partially-reverted"
```
