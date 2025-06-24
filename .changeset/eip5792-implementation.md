---
"@delvtech/drift": patch
---
 
EIP-5792 Wallet Call API Implementation

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
  - `OnSendCallsParams`.

**Utility Functions**
- Added `toHexString` utility for flexible hex string conversion
- Enhanced `isHexString` with configurable `prefix` option to control `0x` prefix enforcement.
- Improved `DriftError` to automatically use constructor name for subclasses.

**Adapter Enhancements**
- Refactored Web3 adapter to use injected provider for `getSignerAddress` and EIP-5792 calls.
- Improved internal adapter utilities and type safety.
- Added `NotImplementedError` as a generalized replacement for stub-specific errors.

## 🐛 Bug Fixes

**Package Configuration**
- Fixed `@delvtech/drift-web3` package.json fields to point to correct dist files.
- Updated gitignore files across all packages.

**Type Safety**
- Enhanced `FunctionCallParams` to infer function names even when `address` is missing.
- Improved adapter type definitions and method signatures.
- Better error handling and type checking throughout the codebase.

## 📦 Dependencies

- Upgraded all dependencies to their latest versions.
- Updated Node.js version requirement (`.nvmrc`) to `v24`

## 🔄 Internal Changes

- Restructured examples directory with dedicated Node.js and web folders.
- Updated biome configuration (renamed from `.jsonc` to `.json`).

**Breaking Changes:** None

**Migration Guide:** This release is fully backward compatible. The new EIP-5792 functionality is opt-in and doesn't affect existing adapter usage patterns.
