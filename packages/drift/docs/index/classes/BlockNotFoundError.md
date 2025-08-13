[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / BlockNotFoundError

# Class: BlockNotFoundError

Defined in: [packages/drift/src/client/errors.ts:4](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/errors.ts#L4)

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

- [`DriftError`](DriftError.md)

## Constructors

### Constructor

> **new BlockNotFoundError**(`block`, `options?`): `BlockNotFoundError`

Defined in: [packages/drift/src/client/errors.ts:5](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/errors.ts#L5)

#### Parameters

##### block

`undefined` | [`BlockIdentifier`](../type-aliases/BlockIdentifier.md)

##### options?

[`DriftErrorOptions`](../interfaces/DriftErrorOptions.md)

#### Returns

`BlockNotFoundError`

#### Overrides

[`DriftError`](DriftError.md).[`constructor`](DriftError.md#constructor)

## Properties

### name

> `static` **name**: `"Drift Error"`

Defined in: [packages/drift/src/error/DriftError.ts:39](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L39)

Returns the name of the function. Function names are read-only and can not be changed.

#### Inherited from

[`DriftError`](DriftError.md).[`name`](DriftError.md#name)

***

### prefix

> `static` **prefix**: `"✖ "`

Defined in: [packages/drift/src/error/DriftError.ts:38](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L38)

#### Inherited from

[`DriftError`](DriftError.md).[`prefix`](DriftError.md#prefix)
