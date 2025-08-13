[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / MissingStubError

# Class: MissingStubError\<T\>

Defined in: [packages/drift/src/utils/testing/StubStore.ts:223](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/testing/StubStore.ts#L223)

An error thrown by Drift.

This error is designed to ensure clean stack trace formatting even when
minified and can be extended to create other error types with the same
behavior.

## Example

```ts
class MySdkError extends DriftError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, {
      prefix: "👺 ",
      name: "SDK Error",
      ...options,
    });
  }
}

throw new MySdkError("Something went wrong");
// 👺 SDK Error: Something went wrong
//     at ...
```

## Extends

- [`DriftError`](../../index/classes/DriftError.md)

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new MissingStubError**\<`T`\>(`__namedParameters`): `MissingStubError`\<`T`\>

Defined in: [packages/drift/src/utils/testing/StubStore.ts:224](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/testing/StubStore.ts#L224)

#### Parameters

##### \_\_namedParameters

`MissingStubErrorParams`\<`T`\>

#### Returns

`MissingStubError`\<`T`\>

#### Overrides

[`DriftError`](../../index/classes/DriftError.md).[`constructor`](../../index/classes/DriftError.md#constructor)

## Properties

### name

> `static` **name**: `"Drift Error"`

Defined in: [packages/drift/src/error/DriftError.ts:39](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L39)

Returns the name of the function. Function names are read-only and can not be changed.

#### Inherited from

[`DriftError`](../../index/classes/DriftError.md).[`name`](../../index/classes/DriftError.md#name)

***

### prefix

> `static` **prefix**: `"✖ "`

Defined in: [packages/drift/src/error/DriftError.ts:38](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L38)

#### Inherited from

[`DriftError`](../../index/classes/DriftError.md).[`prefix`](../../index/classes/DriftError.md#prefix)
