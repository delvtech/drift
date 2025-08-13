[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / HookPayload

# Type Alias: HookPayload\<THooks, THook\>

> **HookPayload**\<`THooks`, `THook`\> = `Parameters`\<`THooks`\[`THook`\]\>\[`0`\]

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:136](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L136)

The payload passed to handlers of a specific hook.

## Type Parameters

### THooks

`THooks` *extends* [`HookMap`](HookMap.md) = [`HookMap`](HookMap.md)

A mapping of hook names to their handler function types.

### THook

`THook` *extends* [`HookName`](HookName.md)\<`THooks`\> = [`HookName`](HookName.md)\<`THooks`\>

The name of the hook to get the payload for.
