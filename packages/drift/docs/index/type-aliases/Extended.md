[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / Extended

# Type Alias: Extended\<T\>

> **Extended**\<`T`\> = `T` & `Record`\<`Exclude`\<`PropertyKey`, keyof `T`\>, `any`\>

Defined in: [packages/drift/src/utils/types.ts:121](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/utils/types.ts#L121)

Get a superset of `T` that allows additional arbitrary properties.

## Type Parameters

### T

`T` *extends* [`AnyObject`](AnyObject.md)

## Example

```ts
interface Order {
  account: `0x${string}`;
  amount: bigint;
}

const order1: Order = {
  account: "0x123",
  amount: 100n,
  getStatus() { ... }
  // ^ Error: Object literal may only specify known properties, and 'getStatus' does not exist in type 'Order'.
};

// No errors! 🎉
const order2: Extended<Order> = {
  account: "0x123",
  amount: 100n,
  getStatus() { ... }
};
```
