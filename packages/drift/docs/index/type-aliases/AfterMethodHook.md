[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / AfterMethodHook

# Type Alias: AfterMethodHook()\<T\>

> **AfterMethodHook**\<`T`\> = (`payload`) => `ReturnType`\<`T`\> *extends* `Promise`\<`any`\> ? [`MaybePromise`](MaybePromise.md)\<`void`\> : `void`

Defined in: [packages/drift/src/client/hooks/MethodInterceptor.ts:168](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/MethodInterceptor.ts#L168)

A hook that's called after a method is executed to inspect and modify its
result.

## Type Parameters

### T

`T` *extends* [`AnyFunction`](AnyFunction.md) = [`AnyFunction`](AnyFunction.md)

## Parameters

### payload

#### args

`Parameters`\<`T`\>

The arguments that were passed to the method.

#### result

[`MaybeAwaited`](MaybeAwaited.md)\<`ReturnType`\<`T`\>\>

The result returned by the method.

#### setResult

## Returns

`ReturnType`\<`T`\> *extends* `Promise`\<`any`\> ? [`MaybePromise`](MaybePromise.md)\<`void`\> : `void`
