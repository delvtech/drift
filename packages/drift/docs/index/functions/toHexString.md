[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / toHexString

# Function: toHexString()

> **toHexString**\<`TOptions`\>(`value`, `options`): `ConditionalHexStringType`\<`TOptions`\>

Defined in: [packages/drift/src/utils/hex.ts:71](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/hex.ts#L71)

Converts a value to a hexadecimal string, optionally prefixed with '0x'.

## Type Parameters

### TOptions

`TOptions` *extends* [`ToHexStringOptions`](../interfaces/ToHexStringOptions.md)

## Parameters

### value

The value to convert. If a string is provided, and it's not
already a valid hex string, it will be encoded to bytes then converted.

`string` | `number` | `bigint` | `Uint8Array`\<`ArrayBufferLike`\>

### options

`TOptions` & [`ToHexStringOptions`](../interfaces/ToHexStringOptions.md) = `...`

Options to control the output format.

## Returns

`ConditionalHexStringType`\<`TOptions`\>

## Example

```ts
toHexString(255); // '0xff'
toHexString(255n); // '0xff'
toHexString("hello"); // '0x68656c6c6f'
toHexString(new Uint8Array([104, 101, 108, 108, 111])); // '0x68656c6c6f'

toHexString(255, { prefix: false }); // 'ff'

// Valid hex strings are returned as-is:
toHexString("0xff"); // '0xff'
toHexString("ff", { prefix: false }); // 'ff'
```
