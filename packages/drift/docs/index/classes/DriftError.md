[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / DriftError

# Class: DriftError

Defined in: [packages/drift/src/error/DriftError.ts:37](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L37)

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

- `Error`

## Extended by

- [`NotImplementedError`](NotImplementedError.md)
- [`BlockNotFoundError`](BlockNotFoundError.md)
- [`MissingStubError`](../../testing/classes/MissingStubError.md)

## Constructors

### Constructor

> **new DriftError**(`error`, `options?`): `DriftError`

Defined in: [packages/drift/src/error/DriftError.ts:41](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L41)

#### Parameters

##### error

`any`

##### options?

[`DriftErrorOptions`](../interfaces/DriftErrorOptions.md)

#### Returns

`DriftError`

#### Overrides

`Error.constructor`

## Properties

### name

> `static` **name**: `"Drift Error"`

Defined in: [packages/drift/src/error/DriftError.ts:39](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L39)

Returns the name of the function. Function names are read-only and can not be changed.

***

### prefix

> `static` **prefix**: `"✖ "`

Defined in: [packages/drift/src/error/DriftError.ts:38](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L38)
