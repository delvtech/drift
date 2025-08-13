[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / BaseAdapterOptions

# Interface: BaseAdapterOptions

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:48](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L48)

## Extended by

- [`DefaultAdapterOptions`](DefaultAdapterOptions.md)

## Properties

### multicallAddress?

> `optional` **multicallAddress**: `` `0x${string}` ``

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:68](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L68)

The default Multicall3 address to use for the
[`multicall`](ReadAdapter.md#multicall) method.

#### Default

```ts
"0xcA11bde05977b3631167028862bE2a173976CA11"
```

#### See

[Multicall3](https://www.multicall3.com)

***

### pollingInterval?

> `optional` **pollingInterval**: `number`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:54](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L54)

The default polling frequency for polling calls (e.g.
[`waitForTransaction`](Network.md#waitfortransaction)) in milliseconds.

#### Default

```ts
4_000 // 4 seconds
```

***

### pollingTimeout?

> `optional` **pollingTimeout**: `number`

Defined in: [packages/drift/src/adapter/BaseAdapter.ts:60](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/BaseAdapter.ts#L60)

The default timeout for polling calls (e.g.
[`waitForTransaction`](Network.md#waitfortransaction)) in milliseconds.

#### Default

```ts
60_000 // 1 minute
```
