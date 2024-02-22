# @delvtech/evm-client-viem

## 0.1.1

### Patch Changes

- 23ae786: Add missing `value` field to readWriteContract.write() method arguments
- Updated dependencies [eb6575b]
  - @delvtech/evm-client@0.1.1

## 0.1.0

### Minor Changes

- cc17b3c: Changed the type of all inputs to objects. This means that functions with a single argument (e.g., `balanceOf` will now expect ``{ owner: `0x${string}` }``, not `` `0x${string}` ``). Outputs remain the "Friendly" type which deconstructs to a single primitive type for single outputs values (e.g., `symbol` will return a `string`, not `{ "0": string }`) since many single output return values are unnamed

### Patch Changes

- Updated dependencies [cc17b3c]
  - @delvtech/evm-client@0.1.0

## 0.0.13

### Patch Changes

- Updated dependencies [1098f69]
  - @delvtech/evm-client@0.0.11

## 0.0.12

### Patch Changes

- Updated dependencies [5cf2921]
  - @delvtech/evm-client@0.0.10

## 0.0.11

### Patch Changes

- Updated dependencies [dd129be]
  - @delvtech/evm-client@0.0.9

## 0.0.10

### Patch Changes

- Updated dependencies [593a286]
  - @delvtech/evm-client@0.0.8

## 0.0.9

### Patch Changes

- d6d1829: Fixed the return type for Viem functions that return a single tuple/array.
  Fixed options for ethers functions

## 0.0.8

### Patch Changes

- Updated dependencies [9db4f0f]
  - @delvtech/evm-client@0.0.7

## 0.0.7

### Patch Changes

- Updated dependencies [a2edb5a]
  - @delvtech/evm-client@0.0.6

## 0.0.6

### Patch Changes

- Updated dependencies [6307e1b]
  - @delvtech/evm-client@0.0.5

## 0.0.5

### Patch Changes

- Updated dependencies [cfdf0db]
  - @delvtech/evm-client@0.0.4

## 0.0.4

### Patch Changes

- 46a7309: Fix ReadWriteContract.simulateWrite method

## 0.0.3

### Patch Changes

- 76b1bc8: Fix type resolutions by adding a `typeVersions` field to the `package.json`s
- fdcc9ef: Modify exports
- 3c52903: Locked the patch version of the core evm-client dependency to ensure auto version bumps with each patch
- Updated dependencies [76b1bc8]
- Updated dependencies [fdcc9ef]
  - @delvtech/evm-client@0.0.3

## 0.0.2

### Patch Changes

- c2da7c3: Bump evm-client version

## 0.0.1

### Patch Changes

- e2f697f: Initial release! 🚀
- Updated dependencies [e2f697f]
  - @delvtech/evm-client@0.0.1
