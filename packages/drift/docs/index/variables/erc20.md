[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / erc20

# Variable: erc20

> `const` **erc20**: `object`

Defined in: [packages/drift/src/artifacts/IERC20.ts:1](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/artifacts/IERC20.ts#L1)

## Type declaration

### abi

> **abi**: readonly \[\{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"owner"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"spender"`; `type`: `"address"`; \}\]; `name`: `"allowance"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"spender"`; `type`: `"address"`; \}, \{ `internalType`: `"uint256"`; `name`: `"amount"`; `type`: `"uint256"`; \}\]; `name`: `"approve"`; `outputs`: readonly \[\{ `internalType`: `"bool"`; `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"account"`; `type`: `"address"`; \}\]; `name`: `"balanceOf"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"decimals"`; `outputs`: readonly \[\{ `internalType`: `"uint8"`; `name`: `""`; `type`: `"uint8"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"name"`; `outputs`: readonly \[\{ `internalType`: `"string"`; `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"symbol"`; `outputs`: readonly \[\{ `internalType`: `"string"`; `name`: `""`; `type`: `"string"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"totalSupply"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `""`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"uint256"`; `name`: `"amount"`; `type`: `"uint256"`; \}\]; `name`: `"transfer"`; `outputs`: readonly \[\{ `internalType`: `"bool"`; `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `internalType`: `"uint256"`; `name`: `"amount"`; `type`: `"uint256"`; \}\]; `name`: `"transferFrom"`; `outputs`: readonly \[\{ `internalType`: `"bool"`; `name`: `""`; `type`: `"bool"`; \}\]; `stateMutability`: `"nonpayable"`; `type`: `"function"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"owner"`; `type`: `"address"`; \}, \{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"spender"`; `type`: `"address"`; \}, \{ `indexed`: `false`; `internalType`: `"uint256"`; `name`: `"value"`; `type`: `"uint256"`; \}\]; `name`: `"Approval"`; `type`: `"event"`; \}, \{ `anonymous`: `false`; `inputs`: readonly \[\{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"from"`; `type`: `"address"`; \}, \{ `indexed`: `true`; `internalType`: `"address"`; `name`: `"to"`; `type`: `"address"`; \}, \{ `indexed`: `false`; `internalType`: `"uint256"`; `name`: `"value"`; `type`: `"uint256"`; \}\]; `name`: `"Transfer"`; `type`: `"event"`; \}\]

### methodIdentifiers

> **methodIdentifiers**: `object`

#### methodIdentifiers.allowance(address,address)

> `readonly` **allowance(address,address)**: `"dd62ed3e"` = `"dd62ed3e"`

#### methodIdentifiers.approve(address,uint256)

> `readonly` **approve(address,uint256)**: `"095ea7b3"` = `"095ea7b3"`

#### methodIdentifiers.balanceOf(address)

> `readonly` **balanceOf(address)**: `"70a08231"` = `"70a08231"`

#### methodIdentifiers.decimals()

> `readonly` **decimals()**: `"313ce567"` = `"313ce567"`

#### methodIdentifiers.name()

> `readonly` **name()**: `"06fdde03"` = `"06fdde03"`

#### methodIdentifiers.symbol()

> `readonly` **symbol()**: `"95d89b41"` = `"95d89b41"`

#### methodIdentifiers.totalSupply()

> `readonly` **totalSupply()**: `"18160ddd"` = `"18160ddd"`

#### methodIdentifiers.transfer(address,uint256)

> `readonly` **transfer(address,uint256)**: `"a9059cbb"` = `"a9059cbb"`

#### methodIdentifiers.transferFrom(address,address,uint256)

> `readonly` **transferFrom(address,address,uint256)**: `"23b872dd"` = `"23b872dd"`

### name

> **name**: `"IERC20"`
