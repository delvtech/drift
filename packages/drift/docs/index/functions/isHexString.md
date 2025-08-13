[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / isHexString

# Function: isHexString()

> **isHexString**\<`TOptions`\>(`value`, `options`): `value is ConditionalHexStringType<TOptions>`

Defined in: [packages/drift/src/utils/hex.ts:33](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/hex.ts#L33)

Checks if a value is a valid hexadecimal string, optionally checking for
the '0x' prefix.

## Type Parameters

### TOptions

`TOptions` *extends* [`IsHexStringOptions`](../interfaces/IsHexStringOptions.md)

## Parameters

### value

`unknown`

The value to check.

### options

`TOptions` & [`IsHexStringOptions`](../interfaces/IsHexStringOptions.md) = `...`

Options to control the check.

## Returns

`value is ConditionalHexStringType<TOptions>`

## Example

```ts
// Returns true
isHexString("0x123abc");
isHexString("123abc", { prefix: false });

// Returns false
isHexString("123abc");
isHexString("0x123xyz");
isHexString("0x123abc", { prefix: false });
```
