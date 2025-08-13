[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / HookHandler

# Type Alias: HookHandler()\<THooks, THook\>

> **HookHandler**\<`THooks`, `THook`\> = (`payload`) => [`MaybePromise`](MaybePromise.md)\<`void`\>

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:146](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L146)

A handler function for a specific hook.

## Type Parameters

### THooks

`THooks` *extends* [`HookMap`](HookMap.md) = [`HookMap`](HookMap.md)

A mapping of hook names to their handler function types.

### THook

`THook` *extends* [`HookName`](HookName.md)\<`THooks`\> = [`HookName`](HookName.md)\<`THooks`\>

The name of the hook being handled.

## Parameters

### payload

[`Eval`](Eval.md)\<[`HookPayload`](HookPayload.md)\<`THooks`, `THook`\>\>

## Returns

[`MaybePromise`](MaybePromise.md)\<`void`\>
