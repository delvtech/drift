[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MethodInterceptor

# Class: MethodInterceptor\<T\>

Defined in: [packages/drift/src/client/hooks/MethodInterceptor.ts:14](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/MethodInterceptor.ts#L14)

A class for intercepting method calls and running hooks before and after
execution. Uses a Proxy to automatically intercept method calls.

## Type Parameters

### T

`T` *extends* [`AnyObject`](../type-aliases/AnyObject.md) = [`AnyObject`](../type-aliases/AnyObject.md)

## Constructors

### Constructor

> **new MethodInterceptor**\<`T`\>(): `MethodInterceptor`\<`T`\>

#### Returns

`MethodInterceptor`\<`T`\>

## Accessors

### hooks

#### Get Signature

> **get** **hooks**(): [`HookRegistry`](../interfaces/HookRegistry.md)\<[`MethodHooks`](../type-aliases/MethodHooks.md)\<`T`, `T`\>\>

Defined in: [packages/drift/src/client/hooks/MethodInterceptor.ts:19](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/MethodInterceptor.ts#L19)

##### Returns

[`HookRegistry`](../interfaces/HookRegistry.md)\<[`MethodHooks`](../type-aliases/MethodHooks.md)\<`T`, `T`\>\>

## Methods

### createProxy()

> **createProxy**\<`U`\>(`target`): `U`

Defined in: [packages/drift/src/client/hooks/MethodInterceptor.ts:29](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/MethodInterceptor.ts#L29)

Creates a proxy that automatically intercepts method calls and runs
hooks registered with the interceptor.

#### Type Parameters

##### U

`U` *extends* [`AnyObject`](../type-aliases/AnyObject.md)

#### Parameters

##### target

`U`

The object whose methods should be intercepted.

#### Returns

`U`

A proxied version of the target object.
