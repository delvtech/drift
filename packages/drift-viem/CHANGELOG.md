# @delvtech/drift-viem

## 0.11.0

### Patch Changes

- Updated dependencies [367ff3c]
- Updated dependencies [f65f915]
- Updated dependencies [d426510]
- Updated dependencies [ca01657]
- Updated dependencies [1fe3b74]
- Updated dependencies [47c5bc4]
- Updated dependencies [5462088]
- Updated dependencies [f2ec661]
- Updated dependencies [f2ec661]
  - @delvtech/drift@0.11.0

## 0.10.1

## 0.10.0

### Patch Changes

- cf8eaf1: Added support for accepting any viem client type as the `publicClient`. If the client is missing the minimum required actions, it will be extended with `publicActions`.
- fcab0a8: Patched a bug in the `ViemReadWriteAdapter` related to private method access when trying to use write methods.
- Updated dependencies [1feff53]
- Updated dependencies [319c2aa]
- Updated dependencies [9f63615]
- Updated dependencies [b99ea80]
- Updated dependencies [fcab0a8]
- Updated dependencies [e669f49]
- Updated dependencies [0364ef3]
  - @delvtech/drift@0.10.0

## 0.9.1

## 0.9.0

### Patch Changes

- f6d1320: Patched bug preventing transactions from being signed using local private key accounts.
- Updated dependencies [0d5ff95]
- Updated dependencies [d63b416]
- Updated dependencies [e7ec38c]
- Updated dependencies [e5f80a5]
- Updated dependencies [ce25bb5]
- Updated dependencies [d63b416]
- Updated dependencies [ee0d664]
- Updated dependencies [d63b416]
- Updated dependencies [9a50e41]
- Updated dependencies [893ec5e]
- Updated dependencies [e104263]
- Updated dependencies [48e4a2a]
- Updated dependencies [e104263]
- Updated dependencies [e5f80a5]
- Updated dependencies [f623fff]
- Updated dependencies [e5f80a5]
- Updated dependencies [9a50e41]
  - @delvtech/drift@0.9.0

## 0.8.4

### Patch Changes

- cc7cf63: Fixed `sendTransaction` which was missing the `data` param.

## 0.8.3

## 0.8.2

### Patch Changes

- 253c0d5: Added `sendTransaction` method.

## 0.8.1

### Patch Changes

- e981e26: Added `sendRawTransaction` method.

## 0.8.0

### Patch Changes

- bb25099: Added `deploy` and `encodeDeployData` methods to `Adapter` and clients.

## 0.8.0-next.9

## 0.8.0-next.8

## 0.8.0-next.7

## 0.8.0-next.6

## 0.8.0-next.5

## 0.8.0-next.4

## 0.8.0-next.3

## 0.8.0-next.2

### Patch Changes

- Updated dependencies [4050ec9]
- Updated dependencies [eb818b8]
- Updated dependencies [7427bb6]
- Updated dependencies [bd20749]
  - @delvtech/drift@0.8.0-next.2

## 0.7.2-next.1

## 0.7.2-next.0

### Patch Changes

- bb25099: Added `deploy` and `encodeDeployData` methods to `Adapter` and clients.
- Updated dependencies [bb25099]
  - @delvtech/drift@0.7.2-next.0

## 0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [8163702]
- Updated dependencies [10d4d97]
- Updated dependencies [2eeb5c3]
- Updated dependencies [bf5463d]
- Updated dependencies [0d20425]
- Updated dependencies [bf5463d]
- Updated dependencies [bf5463d]
  - @delvtech/drift@0.7.0

## 0.6.0

### Patch Changes

- Updated dependencies [c52e3fd]
  - @delvtech/drift@0.6.0

## 0.5.0

### Minor Changes

- 94c3c1e: Simplified `getBlock` arguments to just the `BlockIdentifier`.

### Patch Changes

- Updated dependencies [94c3c1e]
- Updated dependencies [94c3c1e]
  - @delvtech/drift@0.5.0

## 0.4.5

## 0.4.4

## 0.4.3

## 0.4.2

## 0.4.1

## 0.4.0

### Patch Changes

- Updated dependencies [1fcfbda]
- Updated dependencies [779898c]
- Updated dependencies [1fcfbda]
- Updated dependencies [1fcfbda]
- Updated dependencies [67fa97c]
  - @delvtech/drift@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [48cbe86]
- Updated dependencies [6080580]
- Updated dependencies [6080580]
  - @delvtech/drift@0.3.0

## 0.2.0

### Patch Changes

- 6f0e6fd: Modified the viem adapter to extend the new `AbiEncoder` from drift core to ensure consistent encoding/decoding.
- 6f0e6fd: Refactored `read` and `simulateWrite` methods to use `call` to ensure consistent return types via unified decoding logic in `AbiEncoder`.
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

- 1c10e06: Fixed a bug in `simulateWrite` and `decodeFunctionData` that caused only the first element of arrays to be returned.
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

- 8f0d309: Remove forced `simulateContract` from viem adapter `write`
- a5d6b68: Moved `@devltech/drift` dep to peer deps.
- 7bd87cf: Add `Register` type inspired by abitype, change default types back to `0x${string}`
- 13a5b3c: drift
- e7380c6: Update deps
- 6e8712a: Patched `write` function
- a9f4e67: Added `ReadContract` and `ReadWriteContract` types + misc. type patches and polish.
- 8fa67b1: Fixed adapter factory function return type to be `ReadAdapter` when no signer is given.
- 0a288a2: Unified `ReadContract` and `ReadWriteContract` into a single `Contract` client similar to the `Drift` client.
- af4bf45: Updated README
- e52765b: Use the viem version from dev dependencies in peer dependencies
- 13a5b3c: Misc patches and polish
  - Update package.json info
  - Fix exports for CJS
  - Add `AutocompleteKey` util type
  - Patch types for utils to make them more flexible
  - Change `0x${string}` types in ABIs to simple `string` types to work better across web3 libs
- d582c0a: Add `ViemAdapterParams` to exports
- 74eb669: Refactored arrow function properties to methods.
- 8c8d18d: Added a default `PublicClient` type to the `ViemReadAdapter` type param.
- 1a67fd8: Remove default `getEvents` block tags in viem adapter
- 1def3fd: Update package manifests, add `sinon` guidance to README
- b01acd6: Added `call`, `encodeFunctionReturn`, and `decodeFunctionReturn` methods
- bd83437: Fixed bug where tuple return types were only returning the first item.
- 485bb77: Made the adapter types generic with params for the public and wallet clients.
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

## 0.1.0-beta.33

### Patch Changes

- 8c8d18d: Added a default `PublicClient` type to the `ViemReadAdapter` type param.

## 0.1.0-beta.32

### Patch Changes

- Updated dependencies [be1e986]
- Updated dependencies [934d940]
  - @delvtech/drift@0.0.1-beta.27

## 0.1.0-beta.31

### Patch Changes

- b01acd6: Added `call`, `encodeFunctionReturn`, and `decodeFunctionReturn` methods
- Updated dependencies [668eff1]
- Updated dependencies [990c8f1]
- Updated dependencies [ca85ad8]
- Updated dependencies [bb13c66]
- Updated dependencies [416952b]
- Updated dependencies [786cc9f]
- Updated dependencies [81e5362]
  - @delvtech/drift@0.0.1-beta.26

## 0.1.0-beta.30

### Patch Changes

- 1574acb: Patched `write` function

## 0.1.0-beta.29

### Minor Changes

- 8f0d309: Remove forced `simulateContract` from viem adapter `write`

## 0.0.1-beta.28

### Patch Changes

- Updated dependencies [63ee6d2]
  - @delvtech/drift@0.0.1-beta.25

## 0.0.1-beta.27

### Patch Changes

- Updated dependencies [3a95c5c]
- Updated dependencies [c81a29e]
- Updated dependencies [37e993d]
  - @delvtech/drift@0.0.1-beta.24

## 0.0.1-beta.26

### Patch Changes

- Updated dependencies [f103ab3]
  - @delvtech/drift@0.0.1-beta.23

## 0.0.1-beta.25

### Patch Changes

- Updated dependencies [130ddd6]
  - @delvtech/drift@0.0.1-beta.22

## 0.0.1-beta.24

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

## 0.0.1-beta.23

### Patch Changes

- Updated dependencies [769e427]
  - @delvtech/drift@0.0.1-beta.20

## 0.0.1-beta.22

### Patch Changes

- 485bb77: Made the adapter types generic with params for the public and wallet clients.
- Updated dependencies [c560a32]
- Updated dependencies [041ba62]
  - @delvtech/drift@0.0.1-beta.19

## 0.0.1-beta.21

### Patch Changes

- af4bf45: Updated README
- Updated dependencies [af4bf45]
  - @delvtech/drift@0.0.1-beta.18

## 0.0.1-beta.20

### Patch Changes

- 8fa67b1: Fixed adapter factory function return type to be `ReadAdapter` when no wallet client is given.

## 0.0.1-beta.19

### Patch Changes

- 74eb669: Refactored arrow function properties to methods.
- Updated dependencies [933fce5]
  - @delvtech/drift@0.0.1-beta.17

## 0.0.1-beta.18

### Patch Changes

- Updated dependencies
  - @delvtech/drift@0.0.1-beta.16

## 0.0.1-beta.17

### Patch Changes

- Updated dependencies [f1cf7b4]
  - @delvtech/drift@0.0.1-beta.15

## 0.0.1-beta.16

### Patch Changes

- 1def3fd: Update package manifests, add `sinon` guidance to README
- Updated dependencies [1def3fd]
  - @delvtech/drift@0.0.1-beta.14

## 0.0.1-beta.15

### Patch Changes

- e52765b: Use the viem version from dev dependencies in peer dependencies
- Updated dependencies [a60ae6d]
- Updated dependencies [3bb4943]
- Updated dependencies [cd364f4]
- Updated dependencies [3bb4943]
- Updated dependencies [a842e69]
- Updated dependencies [3bb4943]
- Updated dependencies [b5918c6]
  - @delvtech/drift@0.0.1-beta.13

## 0.0.1-beta.14

### Patch Changes

- Updated dependencies [c9f8d8f]
- Updated dependencies [4194108]
- Updated dependencies [f3e9259]
- Updated dependencies [c9f8d8f]
- Updated dependencies [fe64d49]
  - @delvtech/drift@0.0.1-beta.12

## 0.0.1-beta.13

### Patch Changes

- Updated dependencies [a92bcf3]
  - @delvtech/drift@0.0.1-beta.11

## 0.0.1-beta.12

### Patch Changes

- Updated dependencies [af1d24f]
  - @delvtech/drift@0.0.1-beta.10

## 0.0.1-beta.11

### Patch Changes

- Updated dependencies [19aa433]
  - @delvtech/drift@0.0.1-beta.9

## 0.0.1-beta.10

### Patch Changes

- Updated dependencies [e55910e]
- Updated dependencies [2c91009]
  - @delvtech/drift@0.0.1-beta.8

## 0.0.1-beta.9

### Patch Changes

- 1a67fd8: Remove default `getEvents` block tags in viem adapter

## 0.0.1-beta.8

### Patch Changes

- d582c0a: Add `ViemAdapterParams` to exports

## 0.0.1-beta.7

### Patch Changes

- a5d6b68: Moved `@devltech/drift` dep to peer deps.
- Updated dependencies [24bb35a]
- Updated dependencies [119724d]
- Updated dependencies [cd1d206]
- Updated dependencies [119724d]
- Updated dependencies [1cf3f2a]
- Updated dependencies [3525e4f]
- Updated dependencies [79107a6]
  - @delvtech/drift@0.0.1-beta.7

## 0.0.1-beta.6

### Patch Changes

- Updated dependencies [7d5196f]
  - @delvtech/drift@0.0.1-beta.6

## 0.0.1-beta.5

### Patch Changes

- a9f4e67: Added `ReadContract` and `ReadWriteContract` types + misc. type patches and polish.
- Updated dependencies [a9f4e67]
  - @delvtech/drift@0.0.1-beta.5

## 0.0.1-beta.4

### Patch Changes

- 7bd87cf: Add `Register` type inspired by abitype, change default types back to `0x${string}`
- Updated dependencies [7bd87cf]
  - @delvtech/drift@0.0.1-beta.4

## 0.0.1-beta.3

### Patch Changes

- 0a288a2: Unified `ReadContract` and `ReadWriteContract` into a single `Contract` client similar to the `Drift` client.
- Updated dependencies [0a288a2]
  - @delvtech/drift@0.0.1-beta.3

## 0.0.1-beta.2

### Patch Changes

- 4594b6c:
  - Update package.json info
  - Fix exports for CJS
  - Add `AutocompleteKey` util type
  - Patch types for utils to make them more flexible
  - Change `0x${string}` types in ABIs to simple `string` types to work better across web3 libs
  - Misc patches and polish
- Updated dependencies [4594b6c]
  - @delvtech/drift@0.0.1-beta.2

## 0.0.1-beta.1

### Patch Changes

- Add repo info to package manaifest
- Updated dependencies
  - @delvtech/drift@0.0.1-beta.1

## 0.0.1-beta.0

### Patch Changes

- 41602c0: drift
- Updated dependencies [41602c0]
  - @delvtech/drift@0.0.1-beta.0
