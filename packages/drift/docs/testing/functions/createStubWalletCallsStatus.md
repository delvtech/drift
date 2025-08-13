[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / createStubWalletCallsStatus

# Function: createStubWalletCallsStatus()

> **createStubWalletCallsStatus**\<`T`\>(`overrides`): \{ \[K in string \| number \| symbol\]: Replace\<WalletCallsStatus\<\`0x$\{string\}\`\>, Writable\<T, true\>\>\[K\] \}

Defined in: [packages/drift/src/adapter/utils/testing/createStubWalletCallsStatus.ts:20](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/testing/createStubWalletCallsStatus.ts#L20)

Creates a stub wallet calls status for testing.

## Type Parameters

### T

`T` *extends* `Partial`\<[`WalletCallsStatus`](../../index/interfaces/WalletCallsStatus.md)\<`` `0x${string}` ``\>\> = [`WalletCallsStatus`](../../index/interfaces/WalletCallsStatus.md)\<`` `0x${string}` ``\>

## Parameters

### overrides

`T` = `...`

## Returns

\{ \[K in string \| number \| symbol\]: Replace\<WalletCallsStatus\<\`0x$\{string\}\`\>, Writable\<T, true\>\>\[K\] \}
