[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / WalletCallOptions

# Interface: WalletCallOptions

Defined in: [packages/drift/src/adapter/types/Adapter.ts:615](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L615)

Options for an EIP-5792 call.

## Properties

### capabilities?

> `optional` **capabilities**: [`WalletCapabilitiesOptions`](../type-aliases/WalletCapabilitiesOptions.md)

Defined in: [packages/drift/src/adapter/types/Adapter.ts:624](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L624)

Call-specific capability parameters.

***

### value?

> `optional` **value**: `bigint`

Defined in: [packages/drift/src/adapter/types/Adapter.ts:620](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/types/Adapter.ts#L620)

Value in wei to send with this call.

#### Default

```ts
0n
```
