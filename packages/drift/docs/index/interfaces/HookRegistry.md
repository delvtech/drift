[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / HookRegistry

# Interface: HookRegistry\<THooks\>

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:33](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L33)

A registry for managing and executing hook handlers. Handlers are executed
sequentially in registration order.

## Example

```ts
const hooks = new HookRegistry<{
  beforeConnect: (payload: { peerId: string }) => void;
  afterConnect: (payload: { peerId: string; status: string }) => void;
}>();

hooks.on("beforeConnect", ({ peerId }) => {
  console.log("Connecting to peer:", peerId);
});
hooks.on("afterConnect", ({ peerId, status }) => {
  if (status === "success") {
    console.log("Connected to peer:", peerId);
  } else {
    console.log("Failed to connect to peer:", peerId);
  }
});

hooks.call("beforeConnect", { peerId: "123" }); // -> "Connecting to peer: 123"
hooks.call("afterConnect", { peerId: "123", status: "success" }); // -> "Connected to peer: 123"
```

## Type Parameters

### THooks

`THooks` *extends* [`HookMap`](../type-aliases/HookMap.md) = [`HookMap`](../type-aliases/HookMap.md)

An object that maps hook names to their corresponding
handler function types. The handler function type should accept a single
payload argument.

## Methods

### call()

> **call**\<`THook`\>(`hook`, `payload`): [`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:97](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L97)

Call all handlers registered for a hook. Handlers are called sequentially
in registration order.

#### Type Parameters

##### THook

`THook` *extends* `PropertyKey`

#### Parameters

##### hook

`THook`

The hook to call.

##### payload

[`HookPayload`](../type-aliases/HookPayload.md)\<`THooks`, `THook`\>

The payload to pass to each handler.

#### Returns

[`MaybePromise`](../type-aliases/MaybePromise.md)\<`void`\>

***

### off()

> **off**\<`THook`\>(`hook`, `handler`): `boolean`

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:57](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L57)

Remove a previously registered handler.

#### Type Parameters

##### THook

`THook` *extends* `PropertyKey`

#### Parameters

##### hook

`THook`

The hook to remove the handler from.

##### handler

[`HookHandler`](../type-aliases/HookHandler.md)\<`THooks`, `THook`\>

The handler function to remove.

#### Returns

`boolean`

A boolean indicating whether the handler was found and removed.

***

### on()

> **on**\<`THook`\>(`hook`, `handler`): `void`

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:43](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L43)

Register a handler for a hook.

#### Type Parameters

##### THook

`THook` *extends* `PropertyKey`

#### Parameters

##### hook

`THook`

The hook to handle.

##### handler

[`HookHandler`](../type-aliases/HookHandler.md)\<`THooks`, `THook`\>

The function to execute when the hook is called.

#### Returns

`void`

***

### once()

> **once**\<`THook`\>(`hook`, `handler`): `void`

Defined in: [packages/drift/src/client/hooks/HookRegistry.ts:80](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/client/hooks/HookRegistry.ts#L80)

Register a one-time handler that removes itself on execution.

#### Type Parameters

##### THook

`THook` *extends* `PropertyKey`

#### Parameters

##### hook

`THook`

The hook to handle once.

##### handler

[`HookHandler`](../type-aliases/HookHandler.md)\<`THooks`, `THook`\>

The function to execute once when the hook is called.

#### Returns

`void`
