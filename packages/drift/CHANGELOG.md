# @delvtech/drift

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
