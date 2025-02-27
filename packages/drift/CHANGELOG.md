# @delvtech/drift

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

- 07ed486: Deleted the `objectToArray` type in favor of `prepareParamsArray` which can also handle `AbiFriendlyType` (unwrapped single param values).
- 6e91e3b: Removed mocking features for encoding and decoding methods since they don't require network interactions. Mock classes now extend the new `AbiEncoder`.
- 0dc9748: Renamed util types: `ReplaceProps` -> `Replace`, `RequiredKeys` -> `RequiredBy`, `OptionalKeys` -> `PartialBy`.
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
