[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / DynamicProperty

# Type Alias: DynamicProperty\<TKey, TValue\>

> **DynamicProperty**\<`TKey`, `TValue`\> = `object` *extends* `TValue` \| `Pick`\<`{ [K in TKey]: TValue }`, [`RequiredValueKey`](RequiredValueKey.md)\<`{ [K in TKey]: TValue }`\>\> ? `{ [K in TKey]?: TValue }` : `{ [K in TKey]: TValue }`

Defined in: [packages/drift/src/utils/types.ts:201](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/types.ts#L201)

Creates an object type with a single property `TKey`, which is made optional
if `TValue` is an "emptiable" type (e.g., `undefined`, `never`, `{}`, or an
object with only optional properties), Otherwise, the property is required.

## Type Parameters

### TKey

`TKey` *extends* `PropertyKey`

### TValue

`TValue`

## Example

```ts
type Params1 = DynamicProperty<'options', { optional?: boolean }>;
// => { options?: { optional?: boolean } | undefined }

type Params2 = DynamicProperty<'config', { required: string }>;
// => { config: { required: string } }
```
