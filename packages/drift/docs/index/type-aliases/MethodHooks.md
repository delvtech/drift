[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / MethodHooks

# Type Alias: MethodHooks\<T, U\>

> **MethodHooks**\<`T`, `U`\> = `U` *extends* `U` ? `` { [K in FunctionKey<U> as `before:${K & string}`]: BeforeMethodHook<T[K]> } `` & `` { [K in FunctionKey<U> as `after:${K & string}`]: AfterMethodHook<T[K]> } `` : `never`

Defined in: [packages/drift/src/client/hooks/MethodInterceptor.ts:134](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/MethodInterceptor.ts#L134)

Hooks for modifying the behavior of an object's methods.

## Type Parameters

### T

`T` *extends* [`AnyObject`](AnyObject.md) = [`AnyObject`](AnyObject.md)

### U

`U` *extends* `T` = `T`

## Example

```ts
class Dev {
  wakeUp() {}
  code() {}
  sleep() {}
}

type DevHooks = MethodHooks<Dev>;
// => {
//   "before:wakeUp": (payload: {...}) => void;
//   "before:code": (payload: {...}) => void;
//   "before:sleep": (payload: {...}) => void;
//   "after:wakeUp": (payload: {...}) => void;
//   "after:code": (payload: {...}) => void;
//   "after:sleep": (payload: {...}) => void;
// }
```
