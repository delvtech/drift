[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / NotImplementedErrorParams

# Interface: NotImplementedErrorParams\<TAdapter\>

Defined in: [packages/drift/src/adapter/errors.ts:5](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/errors.ts#L5)

## Extends

- [`DriftErrorOptions`](DriftErrorOptions.md)

## Type Parameters

### TAdapter

`TAdapter` *extends* [`Adapter`](Adapter.md) = [`Adapter`](Adapter.md)

## Properties

### message?

> `optional` **message**: `string`

Defined in: [packages/drift/src/adapter/errors.ts:11](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/errors.ts#L11)

***

### method

> **method**: `string` & `object` \| keyof \{ \[K in string \| number \| symbol as Required\<TAdapter\>\[K\] extends Function ? K : never\]: never \}

Defined in: [packages/drift/src/adapter/errors.ts:10](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/errors.ts#L10)

The method that has not been implemented.

***

### name?

> `optional` **name**: `string`

Defined in: [packages/drift/src/error/DriftError.ts:10](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L10)

A custom name to use in place of the default.

#### Inherited from

[`DriftErrorOptions`](DriftErrorOptions.md).[`name`](DriftErrorOptions.md#name)

***

### prefix?

> `optional` **prefix**: `string`

Defined in: [packages/drift/src/error/DriftError.ts:5](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/error/DriftError.ts#L5)

A custom prefix to use in place of the default.

#### Inherited from

[`DriftErrorOptions`](DriftErrorOptions.md).[`prefix`](DriftErrorOptions.md#prefix)
