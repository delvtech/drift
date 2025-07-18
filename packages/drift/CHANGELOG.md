# @delvtech/drift

## 0.11.0

### Minor Changes

- f65f915: Renamed `abiFn` to `abiEntry` in the following return objects for consistency:
  - `prepareDeployData`
  - `prepareFunctionData`
  - `prepareFunctionReturn`
- 5462088: Changed `chainId` from `bigint` to `number` in `TransactionOptions` to be consistent with all other `chainId` param and option types.

### Patch Changes

- 367ff3c: Added automatic call batching via `Multicall3`. This can be controlled with new `batch` and `maxBatchSize` options when creating new clients, e.g., `createDrift({ batch: false })`, or `createDrift({ maxBatchSize: 10 })`.
- d426510: Added `NoInfer` to the return type of `multicall` to avoid widening the inferred args type when the return value is destructured.
- ca01657: Added a `getMulticallAddress` util for known Multicall3 deployments and integrated into `Client.multicall` and the standalone `multicall` adapter method that's used by all adapters via `BaseAdapter.multicall`.
- 1fe3b74: Added an `onMinedTimeout` option to `WriteOptions` to modify the default timeout for the awaited transaction receipt. If the timeout is reached, the receipt with be `undefined`.
- 47c5bc4: Removed block overriding in `Contract.read` when provided a block earlier than the contract's `epochBlock`. If the contract was constructed with an `epochBlock`, it used to overwrite the `block` option passed to `read` to ensure it didn't read from a block where there was no data, but this can misleading by implying that there was data where there wasn't. So, `epochBlock` now only affects the behavior of event queries.
- f2ec661: Added `hexToString` util
- f2ec661: Removed use of `Buffer` node util in `multicall` and `Web3Adapter`.

## 0.10.1

### Patch Changes

- b9fc425: EIP-5792 Wallet Call API Implementation

  ## 🚀 Features

  **EIP-5792 Wallet Call API Support**

  - Added complete [EIP-5792](https://www.eip5792.xyz) (Wallet Call API) implementation to all adapters with `getWalletCapabilities()`, `getCallsStatus()`, `showCallsStatus()`, and `sendCalls()` methods + comprehensive type definitions.
  - Supports calls in a variety of formats including ABI function calls, ABI deploy calls, raw calldata, and raw bytecode (deployless) calls.
  - Added methods for EIP-5792 functionality to `MockAdapter`:
    - `onGetWalletCapabilities()`
    - `onGetCallsStatus()`
    - `onShowCallsStatus()`
    - `onSendCalls()`
  - Added `getWalletCallsStatusLabel()` util function for generating user-friendly labels for wallet call statuses.

  **New Web Example Application**

  - Added a React + TypeScript + Vite example application.
  - Includes integration examples for all adapter types (default, ethers, viem, web3).
  - Demonstrates EIP-5792 wallet call functionality.

  ## 🔧 Improvements

  **Enhanced Testing Utilities**

  - Added `randomSelection` utility for selecting random items from arrays.
  - Added `createStubWalletCallsStatus` for testing EIP-5792 functionality.
  - Improved `MockAdapter` with better type definitions and expanded functionality.
  - Added method parameter types to exports:
    - `OnReadParams`
    - `OnSimulateWriteParams`
    - `OnMulticallParams`
    - `OnDeployParams`
    - `OnWriteParams`
    - `OnSendCallsParams`
    - `StubMulticallCallParams`
    - `StubWalletCallParams`.

  **Call Preparation and Processing**

  - Added `prepareCall` utility function for unified call preparation across different call types (function calls, deploy calls, encoded calls, bytecode calls).
  - Enhanced multicall functionality to support mixed call types including encoded calls alongside ABI function calls.
  - Improved call processing in all adapters by centralizing call preparation logic.

  **Type System Enhancements**

  - Added `BytecodeCallParams` type for bytecode-based calls without contract addresses.
  - Improved type inference for multicall operations with mixed call types.
  - Added `PartialByOptional` utility type for better optional property handling.

  **Adapter Improvements**

  - Better fallback handling for individual wallet call stub matching in `MockAdapter`.
  - Refactored Web3 adapter to use injected provider for `getSignerAddress` and EIP-5792 calls.
  - Improved internal adapter utilities and type safety.
  - Added `NotImplementedError` as a generalized replacement for stub-specific errors.

  **Client and Caching Enhancements**

  - Enhanced multicall caching to support both function calls and encoded calls.
  - Improved cache key generation for mixed call types.

  **Utility Functions**

  - Added `toHexString` utility for flexible hex string conversion
  - Enhanced `isHexString` with configurable `prefix` option to control `0x` prefix enforcement.
  - Improved `DriftError` to automatically use constructor name for subclasses.

  ## 🐛 Bug Fixes

  **Package Configuration**

  - Fixed `@delvtech/drift-web3` package.json fields to point to correct dist files.
  - Updated gitignore files across all packages.

  **Type Safety**

  - Enhanced `FunctionCallParams` to infer function names even when `address` is missing.
  - Improved adapter type definitions and method signatures.
  - Better error handling and type checking throughout the codebase.
  - Enhanced multicall type inference to support mixed call types (function calls, encoded calls, etc.).
  - Improved readonly array handling for better immutability support.

  ## 📦 Dependencies

  - Upgraded all dependencies to their latest versions.
  - Updated Node.js version requirement (`.nvmrc`) to `v24`

  ## 🔄 Internal Changes

  - Restructured examples directory with dedicated Node.js and web folders.
  - Updated biome configuration (renamed from `.jsonc` to `.json`).
  - Improved internal type utilities for better developer experience.

  **Breaking Changes:** None

  **Migration Guide:** This release is fully backward compatible. The new EIP-5792 functionality is opt-in and doesn't affect existing adapter usage patterns.

## 0.10.0

### Minor Changes

- 319c2aa: Renamed `NotImplementedError` for missing stubs on mock clients to `MissingStubError` for clarity and to avoid confusion with more general use cases that may not be related to stubs.

### Patch Changes

- 1feff53: Added `DynamicProperty` property type to exports.
- 9f63615: Added `erc4626` artifact to exports (abi + method identifiers).
- b99ea80: Added the following types to exports:
  - `FunctionCallParams`
  - `AfterMethodHook`
  - `BeforeMethodHook`
  - `HookMap`
  - `HookPayload`
  - `RequiredValueKey`
- fcab0a8: Patched a bug in the `ViemReadWriteAdapter` related to private method access when trying to use write methods.
- e669f49: Added `encodeDeployData`, `prepareDeployData`, and `prepareFunctionReturn` to exports.
- 0364ef3: Made the `data` property on `EventLog` required.

## 0.9.1

### Patch Changes

- 31952dc: Patched `multicall` to ensure results are returned in the correct order.
- 8a331cc: Patched `multicall` to return the correct format when the cache is hit and `allowFailure` is changed.

## 0.9.0

### Minor Changes

- ce25bb5: Renamed `prepareParamsArray` util to `prepareParams`.
- d63b416: Renamed `convertType` util to `convert`
- 9a50e41: Moved `erc20` export from `@delvtech/drift/testing` to `@delvtech/drift`
- e104263: Renamed `GetBlockReturnType` to `GetBlockReturn` for consistency.

### Patch Changes

- 0d5ff95: Added support for deploying contracts that don't have a `constructor` entry in their ABI.
- d63b416: Added standalone functions for provider agnostic `Adapter` methods: `deploy`, `multicall`, `read`, `simulateWrite`, and `write`.
- e7ec38c: Modified the `simulateWrite` method in the `DefaultAdapter` to use the connected account when available.
- e5f80a5: Added the `block` option to `simulateWrite` via new `SimulateWriteOptions` interface which combines `ReadOptions` and `TransactionOptions`.
- ee0d664: Patched a bug in `getOrSet` which was preventing falsy values from being cached.
- d63b416: Added abstract `BaseReadAdapter` and `BaseReadWriteAdapter` classes which can be extended to pickup default implementations of provider agnostic methods.
- 893ec5e: Added `createStubEvent` and `createStubEvents` testing utils.
- 48e4a2a: Broke out the `ReadAdapter` methods from the `DefaultAdapter` into a new `DefaultReadAdapter` which `DefaultAdapter` now extends.
- e104263: Added `GetBlockOptions` and `GetBlockWithOptionsReturn` to exports.
- e5f80a5: Added a `multicall` method for explicitly batching calls via [Multicall3](https://www.multicall3.com/). Before sending the request, the cache is checked for each individual call to reduce the size of the request when possible. Each fetched result is then cached and the cached and fetched results are merged and returned in the same order they were requested.
- f623fff: Fixed a bug in the `StubStore` where the `create` function wasn't being called unless no key was provided or `matchPartial` was `true`.
- e5f80a5: Added `pollingTimeout` to the `DefaultAdapter` constructor options.
- 9a50e41: Added `erc721`, `erc1155`, and `multicall3` artifacts (abi + methodIdentifiers).

## 0.8.4

### Patch Changes

- cc7cf63: Disabled name minification in build to improve logging and debugging.

## 0.8.3

### Patch Changes

- 15c81a8: Patched `hooks` type in generic contexts.

## 0.8.2

### Patch Changes

- 253c0d5: Added `sendTransaction` method.

## 0.8.1

### Patch Changes

- e981e26: Added `sendRawTransaction` method.
- 21c5a59: Patched `Contract.extend` type.

## 0.8.0

### Minor Changes

- 94b9230: Added missing fields to the return type of `createStub*` utils and renamed `getRandom*` utils to `random*`.
  - `getRandomAddress` => `randomAddress`
  - `getRandomHex` => `randomHex`
  - `getRandomInt` => `randomInt`
- 8c08620: Removed the `find` method from the `Store` interface.
- 1752a54: Removed the `getBlockOrThrow` method and added an optional `GetBlockOptions` argument to `getBlock` which accepts a `throws` option. If `throws` is `true`, a `BlockNotFoundError` error will be thrown if the block isn't found and `undefined` will be remove from the return type.
  ```ts
  const maybeBlock = await drift.getBlock(123n); // => Block<123n> | undefined
  const block = await drift.getBlock(123n, { throws: true }); // => Block<123n>
  ```
- bd20749: Renamed `BaseTypes` interface to be consistent with the precedent set by `BlockOverrides`:
  - `BaseTypes` => `BaseTypeOverrides`
- 4e2a1fc: Renamed the default adapter:
  - `OxAdapter` => `DefaultAdapter`

### Patch Changes

- 4050ec9: Improved type inference for contracts created via `Drift.contract(...)`. A contract created in contexts where `Drift.isReadWrite()` returns `true` will now be properly inferred as a `ReadWriteContract`.
- 2a131a1: Patched extension hook inference in generic contexts.
- bb25099: Added `deploy` and `encodeDeployData` methods to `Adapter` and clients.
- 1a03e83: Added first-class getter methods to `ClientCache` and `ContractCache` which return values from the `store` using their corresponding `*Key` methods. For example: `contract.cache.getRead('name')` gets the value associated with `contract.cache.readKey('name')` from `contract.cache.store`.
- eb818b8: Refactored param types to make more fields optional:
  - All params for `invalidateCallsMatching` are now optional.
  - All args in the `args` param of the following methods are now optional:
    - `invalidateReadsMatching`
    - `onRead`
    - `onSimulateWrite`
    - `onWrite`
    - `onDeploy`
- 7427bb6: Added an `epochBlock` option to contract clients to limit how far back function calls and event queries can go. More details in the doc comment.
- 22a3fb9: Cleaned up cache APIs and added more methods:
  - On the `ClientCache` (i.e. `drift.cache`):
    - `clearBlocks()`
    - `clearBalances()`
    - `clearTransactions()`
    - `clearReads()`
  - On the `ContractCache` (i.e. `contract.cache`):
    - `clearReads()`
- 6e816ad: Added `Client` extension methods to inferred hook names. This means autocompletion for `Client.hooks` will be available for methods added via `extend(...)`, including the `contract(...)` method added by the main `Drift` client.

## 0.8.0-next.9

### Minor Changes

- e5257ca: Added missing fields to the return type of `createStub*` utils and renamed `getRandom*` utils to `random*`.
  - `getRandomAddress` is now `randomAddress`
  - `getRandomHex` is now `randomHex`
  - `getRandomInt` is now `randomInt`

## 0.8.0-next.8

### Minor Changes

- 1752a54: Removed the `getBlockOrThrow` method and added an optional `GetBlockOptions` argument to `getBlock` which accepts a `throws` option. If `throws` is `true`, a `BlockNotFoundError` error will be thrown if the block isn't found and `undefined` will be remove from the return type.
  ```ts
  const maybeBlock = await drift.getBlock(123n); // => Block<123n> | undefined
  const block = await drift.getBlock(123n, { throws: true }); // => Block<123n>
  ```

### Patch Changes

- 22a3fb9: Cleaned up cache APIs and added more methods:
  - On the `ClientCache` (i.e. `drift.cache`):
    - `clearBlocks()`
    - `clearBalances()`
    - `clearTransactions()`
    - `clearReads()`
  - On the `ContractCache` (i.e. `contract.cache`):
    - `clearReads()`

## 0.8.0-next.7

### Patch Changes

- 30612d1: Re-added type inference improvement from 4050ec9 for `Drift.contract` and patched `MockDrift` to be assignable to `Drift`.

## 0.8.0-next.6

### Minor Changes

- 90b67fd: Removed the `find` method from the `Store` interface.

### Patch Changes

- 90b67fd: Reverted type inference improvement in 4050ec9 for `Drift.contract` which makes `MockDrift` unassignable to `Drift`.

## 0.8.0-next.5

### Patch Changes

- 2a131a1: Patched extension hook inference in generic contexts.

## 0.8.0-next.4

### Patch Changes

- 6e816ad: Added `Client` extension methods to inferred hook names. This means autocompletion for `Client.hooks` will be available for methods added via `extend(...)`, including the `contract(...)` method added by the main `Drift` client.

## 0.8.0-next.3

### Patch Changes

- 1a03e83: Added first-class getter methods to `ClientCache` and `ContractCache` which return values from the `store` using their corresponding `*Key` methods. For example: `contract.cache.getRead('name')` gets the value associated with `contract.cache.readKey('name')` from `contract.cache.store`.

## 0.8.0-next.2

### Minor Changes

- bd20749: Renamed the `BaseTypes` export to `BaseTypeOverrides` to be consistent with the precedent set by `BlockOverrides`.

### Patch Changes

- 4050ec9: Improved type inference for contracts created via `Drift.contract(...)`. A contract created in contexts where `Drift.isReadWrite()` returns `true` will now be properly inferred as a `ReadWriteContract`.
- eb818b8: Refactored param types to make more fields optional:
  - All params for `invalidateCallsMatching` are now optional.
  - All args in the `args` param of the following methods are now optional:
    - `invalidateReadsMatching`
    - `onRead`
    - `onSimulateWrite`
    - `onRead`
    - `onSimulateWrite`
    - `onWrite`
    - `onDeploy`
- 7427bb6: Added an `epochBlock` option to contract clients to limit how far back function calls and event queries can go. More details in the doc comment.

## 0.7.2-next.1

### Patch Changes

- 4e2a1fc: Renamed `OxAdapter` to `DefaultAdapter`

## 0.7.2-next.0

### Patch Changes

- bb25099: Added `deploy` and `encodeDeployData` methods to `Adapter` and clients.

## 0.7.1

### Patch Changes

- c2c94c9: Added `clear` method back to `ClientCache` and `ContractCache`.

## 0.7.0

### Minor Changes

### Minor Changes

- 8163702: Simplified option type names:
  - `ContractCallOptions` => `CallOptions`
  - `ContractGetEventsOptions`=> `GetEventsOptions`
  - `ContractReadOptions` => `ReadOptions`
  - `ContractWriteOptions` => `TransactionOptions`
  - `OnMinedParam` => `WriteOptions.["onMined"]`. (`WriteOptions` = `TransactionOptions` + `OnMinedParam`)
  - `Eip4844CallOptions` => `Eip4844Options`
- 10d4d97: Renamed config for clarity and alignment with existing patterns:
  - `*Config` => `*Options`
- 2eeb5c3: Renamed "friendly" type "simplified":
  - `AbiFriendlyType` => `AbiSimplifiedType`
  - `arrayToFriendly` => `arrayToSimplified`
- bf5463d: Removed `Store` operations on the `ClientCache` and made a couple methods private to simplify the API. Store operations can still be accessed via the `store` property on the cache.
- bf5463d: Removed cache operation methods from the `Contract` class, e.g., `preloadRead`. The methods have been moved to a new `ContractCache` class which is accessible on the contract via the `cache` property. This streamlines the API and mirrors the design of the underlying `Client` and `ClientCache`.

### Patch Changes

- 0d20425: Fixed formatting for nested `DriftError`s by filtering out repeated lines.
- bf5463d: Removed unused `ReadClient` and `ReadWriteClient` type aliases.

## 0.6.0

### Minor Changes

- c52e3fd: Polished up caching APIs:
  - Renamed types and associations to better reflect their purposes:
    - `SimpleCache` => `Store`
    - `LruSimpleCache` => `LruStore`
  - Removed unnecessary type parameters from the `Store` interface.
  - Moved key stringifying to the `ClientCache` class and simplified the `LruStore` to extend `LRUCache` directly.
  - Added a `getOrSet` utility function to the exports.

## 0.5.0

### Minor Changes

- 94c3c1e: Simplified `getBlock` arguments to just the `BlockIdentifier`.

### Patch Changes

- 94c3c1e: Added `isHexString` util

## 0.4.5

### Patch Changes

- de81c0d: Added `getBlockOrThrow` method which throws an error if the request block isn't found rather than returning `undefined`.

## 0.4.4

### Patch Changes

- d5cf251: Added `GetBlockReturnType` to remove `undefined` from the return type of `getBlock` in some cases.
- 5ccd468: Added a `BlockIdentifier` type param to the `ContractReadOptions` type

## 0.4.3

### Patch Changes

- 492e5db: Fixed `GetBlockParams` patch

## 0.4.2

### Patch Changes

- c7b5ae7: Patched type error in `GetBlockParams`

## 0.4.1

### Patch Changes

- ae8dd57: Added `RangeBlock` and `MinedRangeBlock` types

## 0.4.0

### Minor Changes

- 1fcfbda: Renamed the `BlockBase` type to `BaseBlockProps`, removed the `MinedBlock` type from exports.

### Patch Changes

- 779898c: Added `BlockIdentifier` type and added it to `ContractReadOptions` and `GetBalanceParams`. This means the `block` option in `read`, `call`, and `getBalance` methods now support block hashes.
- 1fcfbda: Added a `BlockStatus` type which returns `"mined"` or `"pending"` based on a `BlockIdentifier`.
- 1fcfbda: Added a `BlockIdentifier` type param to the `Block` type which makes the `hash`, `logsBloom`, `nonce`, and `number` properties required unless specified as `"pending"`.
- 67fa97c: Added `BlockOverrides` type to exports to support declaration merging for block fields.

## 0.3.0

### Minor Changes

- 6080580: Removed `MergeKeys` and `UnionToIntersection` types.
- 6080580: Replaced `Pretty` type with `Eval` type.

### Patch Changes

- 48cbe86: Patched `OneOf` type to handle keys with conflicting values.

## 0.2.0

### Minor Changes

- 07ed486: Deleted the `objectToArray` util in favor of `prepareParamsArray` which can also handle `AbiFriendlyType` (unwrapped single param values).
- 6e91e3b: Removed mocking features for encoding and decoding methods since they don't require network interactions. Mock classes now extend the new `AbiEncoder`.
- 0dc9748: Renamed util types:
  - `ReplaceProps` => `Replace`
  - `RequiredKeys` => `RequiredBy`
  - `OptionalKeys` => `PartialBy`.
- 100523a: Renamed `prepareBytecodeCallData` to `encodeBytecodeCallData`

### Patch Changes

- 6e91e3b: Added a new `AbiEncoder` class which can be extended by adapters to inherit default implementations of encoding/decoding methods which have been patched to ensure the correct return type logic.
- 100523a: Added `prepareFunctionData` util to exports
- 07ed486: Refactored param parsing to handle more edge cases in encode/decode utils.

## 0.1.5

### Patch Changes

- 035136d: Fixed decoding of unnamed tuples and tuple params

## 0.1.4

### Patch Changes

- 23245a5: Fixed a bug in `OxAdapter` which was incorrectly preparing params for `call`, `simulateWrite`, and `write`.

## 0.1.3

### Patch Changes

- bf084c6: Updated READMEs
- 02cdc41: Added `DriftConfig` to exports
- 1269538: Made the `receipt` argument of the `onMined` param required. The value will either be a receipt or undefined explicitly, but this prevents the function from being called with no arguments.

## 0.1.2

### Patch Changes

- 84b7a6d: Updated all references of the `Abi` type to use the one exported from drift to ensure registery overrides work consistently across the packages.

## 0.1.1

### Patch Changes

- 85898ae: Added `Abi` type to exports and `BaseTypes` register.
- 934c84f: Patched `Client.hooks` type to work when the adapter type is generic

## 0.1.0

### Minor Changes

- d5a0493: Refactored the type params on clients and contracts to improve inference in generic contexts

### Patch Changes

- e1a0d54: Added `ClientConfigType` type to get the `ClientConfig` type from a `Client` type.
- 2743287: Improved utility types

## 0.0.4

### Patch Changes

- 6d80f97: Reverted the autocomplete fix introduced in the last release which actually caused build errors

## 0.0.3

### Patch Changes

- 8eebfdf: Patched hooks type to ensure autocomplete works in contexts where the adapter is generic.
- 5e0c162: Patched `MethodHooks` type to remove unnecessary type param and allow non-promise returns in 'after' hooks.

## 0.0.2

### Patch Changes

- 2c59ee0: Fixed hook forwarding for contracts and extended clients.
- 9c13b68: Removed `extendInstance` utility function
- 0b1f8f0: Fixed a bug where extending clients returned the client without the proxy, causing hooks to be skipped.

## 0.0.1

- 24bb35a: Improve `DriftError` formatting, support minification
- a60ae6d: Added a `method` argument to the `reset` method of all mocks to reset a specific method (e.g., `read`)
- 668eff1: Patched the `objectToArray` util to work with outputs
- 3bb4943: Changed the `hash` field to `transactionHash` on transaction types.
- 602f1a3: Added a default `fromBlock` of `"earliest"` and `toBlock` of `latest` to `getEvents`
- 119724d: Remove unused `AutocompleteKey` type
- c9f8d8f: Added an `OxAdapter` so that drift clients can be instantiated without a web3 client lib already installed.
- 3a95c5c: Narrowed args type for all read functions to ensure they only accept pure and view functions.
- be1e986: Patched `getRandomHex` testing util for better distribution and better byte alignment with odd length prefixes.
- cd1d206: Removed default values from MockAdapter functions
- 01a8004: Added a `BaseClient` class which contains most of the functionality that used to live in the `Drift` class and centralized logic for cache operations and namespace resolution, using the chain id as a default. This also removes a circular dependency between `Drift` and `Contract`.
- a92bcf3: Remove abi from mock keys
- d5fff4e: Replaced the `createClientCache` function with a `ClientCache` class which requires a namespace or namespace resolver. All methods are async to allow for dynamic namespace resolution and external cache implementations.
- 7bd87cf: Add `Register` type inspired by abitype, change default types back to `0x${string}`
- 13a5b3c: drift
- 01a8004: Renamed `ContractEvent` to `EventLog` to be more consistent with other adapter types like `FunctionArgs`.
- f103ab3: Patch `ReadContract` and `ReadWriteContract` types.
- 990c8f1: Added `mockErc20` to testing exports
- e7380c6: Update deps
- e55910e: Add `name` option to `DriftError`
- 1bc7d8e: Bump build
- 119724d: Add support for stubbing functions with partial params and arguments in Mock classes.
- cd364f4: Remove `PendingBlock` type
- 4194108: Add `OneOf` type
- 01a8004: Refactored `Drift` and `MockDrift` to extend `BaseClient` and `MockClient`.
- 769e427: Update README
- 01a8004: Renamed constructor `Param` types to `Config`.
- 7d5196f: Fixed MockDrift to pass it's cache to the contracts it creates via `.contract`
- 3bb4943: Removed `to` and `input` from `ContractWriteOptions`. These will be set via `address` and `args`.
- d5fff4e: Added new testing utils: `getRandomInt`, `getRandomHex`, `getRandomAddress`, `createStubBlock`, `createStubTransaction`, `createStubTransactionReceipt`
- 1cf3f2a: Moved types dep to dev deps.
- a9f4e67: Added `ReadContract` and `ReadWriteContract` types + misc. type patches and polish.
- af1d24f: Fix Drift to ensure it uses the cache namespace given to it in it's options or fallback to fetching the chainId.
- 01a8004: Added a `MockClient` class which mimics `BaseClient`.
- 01a8004: Removed `isReadWriteAdapter` util which simply checked if the `write` property was a function.
- 0a288a2: Unified `ReadContract` and `ReadWriteContract` into a single `Contract` client similar to the `Drift` client.
- c560a32: Add `convertType` util function
- 01a8004: Removed `Adapter` and `Network` prefix from param types, e.g. `AdapterReadParams` to just `ReadParams`, `NetworkGetBlockParams` to just `GetBlockParams`. Removed redundant types.
- a842e69: Changed the `OneOf` type to unions of objects
- f3e9259: Add support for overloaded functions
- ca85ad8: Added `encodeFunctionData`, `encodeFunctionReturn`, `deocodeFunctionData`, and `decodeFunctionReturn` utils
- af4bf45: Updated README
- 01a8004: Replaced the `createLruSimpleCache` function with a `LruSimpleCache` class.
- 602f1a3: BREAKING CHANGE: Switched all clients to factory functions, e.g., `new Drift()` -> `createDrift()`.
- 13a5b3c: Misc patches and polish
  - Update package.json info
  - Fix exports for CJS
  - Add `AutocompleteKey` util type
  - Patch types for utils to make them more flexible
  - Change `0x${string}` types in ABIs to simple `string` types to work better across web3 libs
- c81a29e: Simplified `FunctionKey` type.
- 37e993d: Patched `AbiFriendlyType` to return `unknown` instead of `undefined` when the abi is unknown.
- f1cf7b4: Patch overload matching `objectToArray` type
- 3bb4943: Changed the `transactionIndex` type to `bigint`
- 933fce5: Refactored arrow function properties to methods on `Drift`, `Contract`, `OxAdapter`, and mock classes.
- b5918c6: Improved error handling for drift
- 3525e4f: Added `onMined` to `ContractWriteOptions`
- 79107a6: Fix deps, switch to `safe-stable-stringify`
- c9f8d8f: Patched types
- bb13c66: Added `encodeFunctionReturn` and `decodeFunctionReturn` methods
- 2c91009: Add `prefix` option and doc comments to `DriftError`
- 041ba62: Renamed `Register` to `BaseTypes` and made it more flexible.
- 416952b: Added an `arrayToFriendly` util
- fe64d49: Remove `Pretty` from `ReplaceProps` type
- 63ee6d2: Added hooks to `BaseClient` (and `Drift`) to add custom bahevior before or after adapter method calls.
- 19aa433: Cleanup errors
- 1def3fd: Update package manifests, add `sinon` guidance to README
- 01a8004: Refactored `Contract` to go through a `BaseClient` instead of repeating cache and adapter logic.
- 602f1a3: BREAKING CHANGE: Refactored the Contract clients and added a `createContract` factory
- 786cc9f: Patched overloaded function handling in `objectToArray`
- 130ddd6: Update README
- 934d940: Fixed bigint parsing bug in `createStubBlock`
- a8a4f5f: Patched a bug with the built-in `OxAdapter` in which `onMined` was never called after write operations.
- 81e5362: Added a `call` method to `Drift` and adapters with support for bytecode (deployless) calls.

## 0.0.1-beta.27

### Patch Changes

- be1e986: Patched `getRandomHex` testing util for better distribution and better byte alignment with odd length prefixes.
- 934d940: Fixed bigint parsing bug in `createStubBlock`

## 0.0.1-beta.26

### Patch Changes

- 668eff1: Patched the `objectToArray` util to work with outputs
- 990c8f1: Added `mockErc20` to `/testing` exports
- ca85ad8: Added `encodeFunctionData`, `encodeFunctionReturn`, `deocodeFunctionData`, and `decodeFunctionReturn` utils
- bb13c66: Added `encodeFunctionReturn` and `decodeFunctionReturn` methods
- 416952b: Added an `arrayToFriendly` util
- 786cc9f: Patched overloaded function handling in `objectToArray`
- 81e5362: Added a `call` method to `Drift` and adapters with support for bytecode (deployless) calls.

## 0.0.1-beta.25

### Patch Changes

- 63ee6d2: Added hooks to `BaseClient` (and `Drift`) to add custom behavior before or after adapter method calls.

## 0.0.1-beta.24

### Patch Changes

- 3a95c5c: Narrowed args type for all read functions to ensure they only accept pure and view functions.
- c81a29e: Simplified `FunctionKey` type.
- 37e993d: Patched `AbiFriendlyType` to return `unknown` instead of `undefined` when the abi is unknown.

## 0.0.1-beta.23

### Patch Changes

- f103ab3: Patch `ReadContract` and `ReadWriteContract` types.

## 0.0.1-beta.22

### Patch Changes

- 130ddd6: Update README

## 0.0.1-beta.21

### Patch Changes

- a8a4f5f: Patched a bug with the built-in `OxAdapter` in which `onMined` was never called after write operations.
- 01a8004: Added a `BaseClient` class which contains most of the functionality that used to live in the `Drift` class and centralized logic for cache operations and namespace resolution, using the chain id as a default. This also removes a circular dependency between `Drift` and `Contract`.
- 01a8004: Added a `MockClient` class which mimics `BaseClient`.
- 01a8004: Refactored `Drift` and `MockDrift` to extend `BaseClient` and `MockClient`.
- 01a8004: Refactored `Contract` to go through a `BaseClient` instead of repeating cache and adapter logic.
- 01a8004: Removed `isReadWriteAdapter` util which simply checked if the `write` property was a function.
- 01a8004: Removed `Adapter` and `Network` prefix from param types, e.g. `AdapterReadParams` to just `ReadParams`, `NetworkGetBlockParams` to just `GetBlockParams`. Removed redundant types.
- 01a8004: Renamed constructor `Param` types to `Config`.
- 01a8004: Renamed `ContractEvent` to `EventLog` to be more consistent with other adapter types like `FunctionArgs`.
- 01a8004: Replaced the `createLruSimpleCache` function with a `LruSimpleCache` class.
- d5fff4e: Replaced the `createClientCache` function with a `ClientCache` class which requires a namespace or namespace resolver. All methods are async to allow for dynamic namespace resolution and external cache implementations.
- d5fff4e: Added new testing utils:
  - `getRandomInt`
  - `getRandomHex`
  - `getRandomAddress`
  - `createStubBlock`
  - `createStubTransaction`
  - `createStubTransactionReceipt`
- e7380c6: Update deps

## 0.0.1-beta.20

### Patch Changes

- 769e427: Update README, polish types,

## 0.0.1-beta.19

### Patch Changes

- c560a32: Add `convertType` util function
- 041ba62: Renamed `Register` to `BaseTypes` and made it more flexible.

## 0.0.1-beta.18

### Patch Changes

- af4bf45: Updated README

## 0.0.1-beta.17

### Patch Changes

- 933fce5: Refactored arrow function properties to methods on `Drift`, `Contract`, `OxAdapter`, and mock classes.

## 0.0.1-beta.16

### Patch Changes

- Bump build

## 0.0.1-beta.15

### Patch Changes

- f1cf7b4: Patch overload matching `objectToArray` type

## 0.0.1-beta.14

### Patch Changes

- 1def3fd: Update package manifests, add `sinon` guidance to README

## 0.0.1-beta.13

### Patch Changes

- a60ae6d: Added a `method` argument to the `reset` method of all mocks to reset a specific method (e.g., `read`)
- 3bb4943: Changed the `hash` field to `transactionHash` on transaction types.
- cd364f4: Removed `PendingBlock` type
- 3bb4943: Removed `to` and `input` from `ContractWriteOptions`. These will be set via `address` and `args`.
- a842e69: Changed the `OneOf` type to unions of objects
- 3bb4943: Changed the `transactionIndex` type to `bigint`
- b5918c6: Improved error handling for drift

## 0.0.1-beta.12

### Patch Changes

- c9f8d8f: Added an `OxAdapter` so that drift clients can be instantiated without a web3 client lib already installed.
- 4194108: Add `OneOf` type
- f3e9259: Add support for overloaded functions
- c9f8d8f: Patched types
- fe64d49: Remove `Pretty` from `ReplaceProps` type

## 0.0.1-beta.11

### Patch Changes

- a92bcf3: Remove abi from mock keys

## 0.0.1-beta.10

### Patch Changes

- af1d24f: Fix Drift to ensure it uses the cache namespace given to it in it's options or fallback to fetching the chainId.

## 0.0.1-beta.9

### Patch Changes

- 19aa433: Cleanup errors

## 0.0.1-beta.8

### Patch Changes

- e55910e: Add `name` option to `DriftError`
- 2c91009: Add `prefix` option and doc comments to `DriftError`

## 0.0.1-beta.7

### Patch Changes

- 24bb35a: Improve `DriftError` formatting, support minification
- 119724d: Remove unused `AutocompleteKey` type
- cd1d206: Removed default values from MockAdapter functions
- 119724d: Add support for stubbing functions with partial params and arguments in Mock classes.
- 1cf3f2a: Moved types dep to dev deps.
- 3525e4f: Added `onMined` to `ContractWriteOptions`
- 79107a6: Fix deps, switch to `safe-stable-stringify`

## 0.0.1-beta.6

### Patch Changes

- 7d5196f: Fixed MockDrift to pass it's cache to the contracts it creates via `.contract`

## 0.0.1-beta.5

### Patch Changes

- a9f4e67: Added `ReadContract` and `ReadWriteContract` types + misc. type patches and polish.

## 0.0.1-beta.4

### Patch Changes

- 7bd87cf: Add `Register` type inspired by abitype, change default types back to `0x${string}`

## 0.0.1-beta.3

### Patch Changes

- 0a288a2: Unified `ReadContract` and `ReadWriteContract` into a single `Contract` client similar to the `Drift` client.

## 0.0.1-beta.2

### Patch Changes

- 4594b6c:
  - Update package.json info
  - Fix exports for CJS
  - Add `AutocompleteKey` util type
  - Patch types for utils to make them more flexible
  - Change `0x${string}` types in ABIs to simple `string` types to work better across web3 libs
  - Misc patches and polish

## 0.0.1-beta.1

### Patch Changes

- Add repo info to package manaifest

## 0.0.1-beta.0

### Patch Changes

- 41602c0: drift
