[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / BeforeMethodHook

# Type Alias: BeforeMethodHook()\<T\>

> **BeforeMethodHook**\<`T`\> = (`payload`) => `ReturnType`\<`T`\> *extends* `Promise`\<`any`\> ? [`MaybePromise`](MaybePromise.md)\<`void`\> : `void`

Defined in: [packages/drift/src/client/hooks/MethodInterceptor.ts:149](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/MethodInterceptor.ts#L149)

A hook that's called before a method is executed to inspect and modify its
arguments and/or skip its execution.

## Type Parameters

### T

`T` *extends* [`AnyFunction`](AnyFunction.md) = [`AnyFunction`](AnyFunction.md)

## Parameters

### payload

#### args

`Parameters`\<`T`\>

The arguments passed to the method.

#### resolve

#### setArgs

## Returns

`ReturnType`\<`T`\> *extends* `Promise`\<`any`\> ? [`MaybePromise`](MaybePromise.md)\<`void`\> : `void`
