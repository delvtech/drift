[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [testing](../README.md) / randomHex

# Function: randomHex()

> **randomHex**(`bytes`, `prefix`): `` `0x${string}` ``

Defined in: [packages/drift/src/utils/testing/randomHex.ts:16](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/testing/randomHex.ts#L16)

Get a random hex string of a given byte length.

## Parameters

### bytes

`number` = `32`

The number of bytes to generate.

### prefix

`string` = `""`

The prefix to add to the hex string after the 0x.

## Returns

`` `0x${string}` ``

## Example

```ts
const data = randomHex(32, "d00d");
// -> "0xd00dffe96681c09cc931e1d059a7eddf729ef9e58eebc412bd6f167cb7ecfe88"
```
