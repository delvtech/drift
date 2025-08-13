[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / createStubBlock

# Function: createStubBlock()

> **createStubBlock**\<`T`\>(`overrides`): \{ \[K in string \| number \| symbol\]: Replace\<\{ extraData?: \`0x$\{string\}\`; gasLimit: bigint; gasUsed: bigint; hash: \`0x$\{string\}\`; logsBloom: \`0x$\{string\}\`; miner: \`0x$\{string\}\`; mixHash: \`0x$\{string\}\`; nonce: bigint; number: bigint; parentHash: \`0x$\{string\}\`; receiptsRoot: \`0x$\{string\}\`; sha3Uncles: \`0x$\{string\}\`; size: bigint; stateRoot: \`0x$\{string\}\`; timestamp: bigint; transactions: \`0x$\{string\}\`\[\]; transactionsRoot: \`0x$\{string\}\` \}, Writable\<T, false\>\>\[K\] \}

Defined in: [packages/drift/src/adapter/utils/testing/createStubBlock.ts:10](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/testing/createStubBlock.ts#L10)

Creates a stub block for testing.

## Type Parameters

### T

`T` *extends* `Partial`\<\{ `extraData?`: `` `0x${string}` ``; `gasLimit`: `bigint`; `gasUsed`: `bigint`; `hash`: `` `0x${string}` ``; `logsBloom`: `` `0x${string}` ``; `miner`: `` `0x${string}` ``; `mixHash`: `` `0x${string}` ``; `nonce`: `bigint`; `number`: `bigint`; `parentHash`: `` `0x${string}` ``; `receiptsRoot`: `` `0x${string}` ``; `sha3Uncles`: `` `0x${string}` ``; `size`: `bigint`; `stateRoot`: `` `0x${string}` ``; `timestamp`: `bigint`; `transactions`: `` `0x${string}` ``[]; `transactionsRoot`: `` `0x${string}` ``; \}\> = \{ `extraData?`: `` `0x${string}` ``; `gasLimit`: `bigint`; `gasUsed`: `bigint`; `hash`: `` `0x${string}` ``; `logsBloom`: `` `0x${string}` ``; `miner`: `` `0x${string}` ``; `mixHash`: `` `0x${string}` ``; `nonce`: `bigint`; `number`: `bigint`; `parentHash`: `` `0x${string}` ``; `receiptsRoot`: `` `0x${string}` ``; `sha3Uncles`: `` `0x${string}` ``; `size`: `bigint`; `stateRoot`: `` `0x${string}` ``; `timestamp`: `bigint`; `transactions`: `` `0x${string}` ``[]; `transactionsRoot`: `` `0x${string}` ``; \}

## Parameters

### overrides

`T` = `...`

## Returns

\{ \[K in string \| number \| symbol\]: Replace\<\{ extraData?: \`0x$\{string\}\`; gasLimit: bigint; gasUsed: bigint; hash: \`0x$\{string\}\`; logsBloom: \`0x$\{string\}\`; miner: \`0x$\{string\}\`; mixHash: \`0x$\{string\}\`; nonce: bigint; number: bigint; parentHash: \`0x$\{string\}\`; receiptsRoot: \`0x$\{string\}\`; sha3Uncles: \`0x$\{string\}\`; size: bigint; stateRoot: \`0x$\{string\}\`; timestamp: bigint; transactions: \`0x$\{string\}\`\[\]; transactionsRoot: \`0x$\{string\}\` \}, Writable\<T, false\>\>\[K\] \}
