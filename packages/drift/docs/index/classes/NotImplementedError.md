[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / NotImplementedError

# Class: NotImplementedError\<TAdapter\>

Defined in: [packages/drift/src/adapter/errors.ts:17](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/errors.ts#L17)

An error that indicates a method has not been implemented.

## Extends

- [`DriftError`](DriftError.md)

## Type Parameters

### TAdapter

`TAdapter` *extends* [`Adapter`](../interfaces/Adapter.md) = [`Adapter`](../interfaces/Adapter.md)

## Constructors

### Constructor

> **new NotImplementedError**\<`TAdapter`\>(`__namedParameters`): `NotImplementedError`\<`TAdapter`\>

Defined in: [packages/drift/src/adapter/errors.ts:20](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/errors.ts#L20)

#### Parameters

##### \_\_namedParameters

[`NotImplementedErrorParams`](../interfaces/NotImplementedErrorParams.md)\<`TAdapter`\>

#### Returns

`NotImplementedError`\<`TAdapter`\>

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
