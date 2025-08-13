[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / HookMap

# Type Alias: HookMap\<THookName, THookHandler\>

> **HookMap**\<`THookName`, `THookHandler`\> = `Record`\<`THookName`, `THookHandler`\>

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:119](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L119)

An object mapping hook names to handler function types.

## Type Parameters

### THookName

`THookName` *extends* `PropertyKey` = `PropertyKey`

### THookHandler

`THookHandler` *extends* (`payload`) => `any` = (`payload`) => `any`
