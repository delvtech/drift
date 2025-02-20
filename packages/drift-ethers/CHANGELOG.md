# @delvtech/drift-ethers

## 0.3.0

### Patch Changes

- Updated dependencies [48cbe86]
- Updated dependencies [6080580]
- Updated dependencies [6080580]
  - @delvtech/drift@0.3.0

## 0.2.0

### Patch Changes

- 0bac937: Modified the ethers adapters to extend the new `AbiEncoder` from drift core to ensure consistent encoding/decoding.
- 0bac937: Refactored `read` and `simulateWrite` methods to use `call` to ensure consistent return types via unified decoding logic in `AbiEncoder`.
- Updated dependencies [6e91e3b]
- Updated dependencies [100523a]
- Updated dependencies [07ed486]
- Updated dependencies [07ed486]
- Updated dependencies [6e91e3b]
- Updated dependencies [0dc9748]
- Updated dependencies [100523a]
  - @delvtech/drift@0.2.0

## 0.1.5

### Patch Changes

- Updated dependencies [035136d]
  - @delvtech/drift@0.1.5

## 0.1.4

### Patch Changes

- e9ffb14: Patched the return type of `viemAdapter` and `ethersAdapter` to return `ReadAdapter | ReadWriteAdapter` when `walletClient`/`signer` is possibly undefined instead of just returning a `ReadWriteAdapter` any time a `walletClient`/`signer` prop is present.
- Updated dependencies [23245a5]
  - @delvtech/drift@0.1.4

## 0.1.3

### Patch Changes

- bf084c6: Updated READMEs
- Updated dependencies [bf084c6]
- Updated dependencies [02cdc41]
- Updated dependencies [1269538]
  - @delvtech/drift@0.1.3

## 0.1.2

### Patch Changes

- 84b7a6d: Updated all references of the `Abi` type to use the one exported from drift to ensure registery overrides work consistently across the packages.
- Updated dependencies [84b7a6d]
  - @delvtech/drift@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies [85898ae]
- Updated dependencies [934c84f]
  - @delvtech/drift@0.1.1

## 0.1.0

### Patch Changes

- Updated dependencies [e1a0d54]
- Updated dependencies [d5a0493]
- Updated dependencies [2743287]
  - @delvtech/drift@0.1.0

## 0.0.4

### Patch Changes

- Updated dependencies [6d80f97]
  - @delvtech/drift@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies [8eebfdf]
- Updated dependencies [5e0c162]
  - @delvtech/drift@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies [2c59ee0]
- Updated dependencies [9c13b68]
- Updated dependencies [0b1f8f0]
  - @delvtech/drift@0.0.2

## 0.0.1

- 0ef59ad: Made the `ethersAdapter` function argument optional and made the classes generic with type params for the provider and signer.
- e7380c6: Update deps
- 8fa67b1: Fixed adapter factory function return type to be `ReadAdapter` when no signer is given.
- af4bf45: Updated README
- 483d60a: Made `provider` optional, in which case `window.ethereum` is used.
- d362254: Added `call`, `encodeFunctionReturn`, and `decodeFunctionReturn` methods
- f7084e2: Initial release 🚀
- Updated dependencies [24bb35a]
- Updated dependencies [a60ae6d]
- Updated dependencies [668eff1]
- Updated dependencies [3bb4943]
- Updated dependencies [602f1a3]
- Updated dependencies [119724d]
- Updated dependencies [c9f8d8f]
- Updated dependencies [3a95c5c]
- Updated dependencies [be1e986]
- Updated dependencies [cd1d206]
- Updated dependencies [01a8004]
- Updated dependencies [a92bcf3]
- Updated dependencies [d5fff4e]
- Updated dependencies [7bd87cf]
- Updated dependencies [13a5b3c]
- Updated dependencies [01a8004]
- Updated dependencies [f103ab3]
- Updated dependencies [990c8f1]
- Updated dependencies [e7380c6]
- Updated dependencies [e55910e]
- Updated dependencies [1bc7d8e]
- Updated dependencies [119724d]
- Updated dependencies [cd364f4]
- Updated dependencies [4194108]
- Updated dependencies [01a8004]
- Updated dependencies [769e427]
- Updated dependencies [01a8004]
- Updated dependencies [7d5196f]
- Updated dependencies [3bb4943]
- Updated dependencies [d5fff4e]
- Updated dependencies [1cf3f2a]
- Updated dependencies [a9f4e67]
- Updated dependencies [af1d24f]
- Updated dependencies [01a8004]
- Updated dependencies [01a8004]
- Updated dependencies [0a288a2]
- Updated dependencies [c560a32]
- Updated dependencies [01a8004]
- Updated dependencies [a842e69]
- Updated dependencies [f3e9259]
- Updated dependencies [ca85ad8]
- Updated dependencies [af4bf45]
- Updated dependencies [01a8004]
- Updated dependencies [602f1a3]
- Updated dependencies [13a5b3c]
- Updated dependencies [c81a29e]
- Updated dependencies [37e993d]
- Updated dependencies [f1cf7b4]
- Updated dependencies [3bb4943]
- Updated dependencies [933fce5]
- Updated dependencies [b5918c6]
- Updated dependencies [3525e4f]
- Updated dependencies [79107a6]
- Updated dependencies [c9f8d8f]
- Updated dependencies [bb13c66]
- Updated dependencies [2c91009]
- Updated dependencies [041ba62]
- Updated dependencies [416952b]
- Updated dependencies [fe64d49]
- Updated dependencies [63ee6d2]
- Updated dependencies [19aa433]
- Updated dependencies [1def3fd]
- Updated dependencies [01a8004]
- Updated dependencies [602f1a3]
- Updated dependencies [786cc9f]
- Updated dependencies [130ddd6]
- Updated dependencies [934d940]
- Updated dependencies [a8a4f5f]
- Updated dependencies [81e5362]
  - @delvtech/drift@0.0.1

## 0.0.0-beta.12

### Patch Changes

- Updated dependencies [be1e986]
- Updated dependencies [934d940]
  - @delvtech/drift@0.0.1-beta.27

## 0.0.0-beta.11

### Patch Changes

- d362254: Added `call`, `encodeFunctionReturn`, and `decodeFunctionReturn` methods
- Updated dependencies [668eff1]
- Updated dependencies [990c8f1]
- Updated dependencies [ca85ad8]
- Updated dependencies [bb13c66]
- Updated dependencies [416952b]
- Updated dependencies [786cc9f]
- Updated dependencies [81e5362]
  - @delvtech/drift@0.0.1-beta.26

## 0.0.0-beta.10

### Patch Changes

- Updated dependencies [63ee6d2]
  - @delvtech/drift@0.0.1-beta.25

## 0.0.0-beta.9

### Patch Changes

- Updated dependencies [3a95c5c]
- Updated dependencies [c81a29e]
- Updated dependencies [37e993d]
  - @delvtech/drift@0.0.1-beta.24

## 0.0.0-beta.8

### Patch Changes

- Updated dependencies [f103ab3]
  - @delvtech/drift@0.0.1-beta.23

## 0.0.0-beta.7

### Patch Changes

- Updated dependencies [130ddd6]
  - @delvtech/drift@0.0.1-beta.22

## 0.0.0-beta.6

### Patch Changes

- e7380c6: Update deps
- Updated dependencies [01a8004]
- Updated dependencies [d5fff4e]
- Updated dependencies [01a8004]
- Updated dependencies [e7380c6]
- Updated dependencies [01a8004]
- Updated dependencies [01a8004]
- Updated dependencies [d5fff4e]
- Updated dependencies [01a8004]
- Updated dependencies [01a8004]
- Updated dependencies [01a8004]
- Updated dependencies [01a8004]
- Updated dependencies [01a8004]
- Updated dependencies [a8a4f5f]
  - @delvtech/drift@0.0.1-beta.21

## 0.0.0-beta.5

### Patch Changes

- Updated dependencies [769e427]
  - @delvtech/drift@0.0.1-beta.20

## 0.0.0-beta.4

### Patch Changes

- 0ef59ad: Made the `ethersAdapter` function argument optional and made the classes generic with type params for the provider and signer.
- Updated dependencies [c560a32]
- Updated dependencies [041ba62]
  - @delvtech/drift@0.0.1-beta.19

## 0.0.0-beta.3

### Patch Changes

- af4bf45: Updated README
- 483d60a: Made `provider` optional, in which case `window.ethereum` is used.
- Updated dependencies [af4bf45]
  - @delvtech/drift@0.0.1-beta.18

## 0.0.0-beta.2

### Patch Changes

- 8fa67b1: Fixed adapter factory function return type to be `ReadAdapter` when no signer is given.

## 0.0.0-beta.1

### Patch Changes

- f7084e2: Initial release 🚀
- Updated dependencies [933fce5]
  - @delvtech/drift@0.0.1-beta.17
