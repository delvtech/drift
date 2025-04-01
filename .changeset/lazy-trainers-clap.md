---
"@delvtech/drift": minor
---

Removed the `getBlockOrThrow` method and added an optional `GetBlockOptions` argument to `getBlock` which accepts a `throws` option. If `throws` is `true`, a `BlockNotFoundError` error will be thrown if the block isn't found and `undefined` will be remove from the return type.
  ```ts
  const maybeBlock = await drift.getBlock(123n); // => Block<123n> | undefined
  const block = await drift.getBlock(123n, { throws: true }); // => Block<123n>
  ```
