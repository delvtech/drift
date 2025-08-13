[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / multicall3

# Variable: multicall3

> `const` **multicall3**: `object`

Defined in: [packages/drift/src/artifacts/IMulticall3.ts:1](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/artifacts/IMulticall3.ts#L1)

## Type declaration

### abi

> **abi**: readonly \[\{ `inputs`: readonly \[\{ `components`: readonly \[\{ `internalType`: `"address"`; `name`: `"target"`; `type`: `"address"`; \}, \{ `internalType`: `"bytes"`; `name`: `"callData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Call[]"`; `name`: `"calls"`; `type`: `"tuple[]"`; \}\]; `name`: `"aggregate"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"blockNumber"`; `type`: `"uint256"`; \}, \{ `internalType`: `"bytes[]"`; `name`: `"returnData"`; `type`: `"bytes[]"`; \}\]; `stateMutability`: `"payable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `components`: readonly \[\{ `internalType`: `"address"`; `name`: `"target"`; `type`: `"address"`; \}, \{ `internalType`: `"bool"`; `name`: `"allowFailure"`; `type`: `"bool"`; \}, \{ `internalType`: `"bytes"`; `name`: `"callData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Call3[]"`; `name`: `"calls"`; `type`: `"tuple[]"`; \}\]; `name`: `"aggregate3"`; `outputs`: readonly \[\{ `components`: readonly \[\{ `internalType`: `"bool"`; `name`: `"success"`; `type`: `"bool"`; \}, \{ `internalType`: `"bytes"`; `name`: `"returnData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Result[]"`; `name`: `"returnData"`; `type`: `"tuple[]"`; \}\]; `stateMutability`: `"payable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `components`: readonly \[\{ `internalType`: `"address"`; `name`: `"target"`; `type`: `"address"`; \}, \{ `internalType`: `"bool"`; `name`: `"allowFailure"`; `type`: `"bool"`; \}, \{ `internalType`: `"uint256"`; `name`: `"value"`; `type`: `"uint256"`; \}, \{ `internalType`: `"bytes"`; `name`: `"callData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Call3Value[]"`; `name`: `"calls"`; `type`: `"tuple[]"`; \}\]; `name`: `"aggregate3Value"`; `outputs`: readonly \[\{ `components`: readonly \[\{ `internalType`: `"bool"`; `name`: `"success"`; `type`: `"bool"`; \}, \{ `internalType`: `"bytes"`; `name`: `"returnData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Result[]"`; `name`: `"returnData"`; `type`: `"tuple[]"`; \}\]; `stateMutability`: `"payable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `components`: readonly \[\{ `internalType`: `"address"`; `name`: `"target"`; `type`: `"address"`; \}, \{ `internalType`: `"bytes"`; `name`: `"callData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Call[]"`; `name`: `"calls"`; `type`: `"tuple[]"`; \}\]; `name`: `"blockAndAggregate"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"blockNumber"`; `type`: `"uint256"`; \}, \{ `internalType`: `"bytes32"`; `name`: `"blockHash"`; `type`: `"bytes32"`; \}, \{ `components`: readonly \[\{ `internalType`: `"bool"`; `name`: `"success"`; `type`: `"bool"`; \}, \{ `internalType`: `"bytes"`; `name`: `"returnData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Result[]"`; `name`: `"returnData"`; `type`: `"tuple[]"`; \}\]; `stateMutability`: `"payable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getBasefee"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"basefee"`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"blockNumber"`; `type`: `"uint256"`; \}\]; `name`: `"getBlockHash"`; `outputs`: readonly \[\{ `internalType`: `"bytes32"`; `name`: `"blockHash"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getBlockNumber"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"blockNumber"`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getChainId"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"chainid"`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getCurrentBlockCoinbase"`; `outputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"coinbase"`; `type`: `"address"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getCurrentBlockDifficulty"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"difficulty"`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getCurrentBlockGasLimit"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"gaslimit"`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getCurrentBlockTimestamp"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"timestamp"`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"address"`; `name`: `"addr"`; `type`: `"address"`; \}\]; `name`: `"getEthBalance"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"balance"`; `type`: `"uint256"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\]; `name`: `"getLastBlockHash"`; `outputs`: readonly \[\{ `internalType`: `"bytes32"`; `name`: `"blockHash"`; `type`: `"bytes32"`; \}\]; `stateMutability`: `"view"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"bool"`; `name`: `"requireSuccess"`; `type`: `"bool"`; \}, \{ `components`: readonly \[\{ `internalType`: `"address"`; `name`: `"target"`; `type`: `"address"`; \}, \{ `internalType`: `"bytes"`; `name`: `"callData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Call[]"`; `name`: `"calls"`; `type`: `"tuple[]"`; \}\]; `name`: `"tryAggregate"`; `outputs`: readonly \[\{ `components`: readonly \[\{ `internalType`: `"bool"`; `name`: `"success"`; `type`: `"bool"`; \}, \{ `internalType`: `"bytes"`; `name`: `"returnData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Result[]"`; `name`: `"returnData"`; `type`: `"tuple[]"`; \}\]; `stateMutability`: `"payable"`; `type`: `"function"`; \}, \{ `inputs`: readonly \[\{ `internalType`: `"bool"`; `name`: `"requireSuccess"`; `type`: `"bool"`; \}, \{ `components`: readonly \[\{ `internalType`: `"address"`; `name`: `"target"`; `type`: `"address"`; \}, \{ `internalType`: `"bytes"`; `name`: `"callData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Call[]"`; `name`: `"calls"`; `type`: `"tuple[]"`; \}\]; `name`: `"tryBlockAndAggregate"`; `outputs`: readonly \[\{ `internalType`: `"uint256"`; `name`: `"blockNumber"`; `type`: `"uint256"`; \}, \{ `internalType`: `"bytes32"`; `name`: `"blockHash"`; `type`: `"bytes32"`; \}, \{ `components`: readonly \[\{ `internalType`: `"bool"`; `name`: `"success"`; `type`: `"bool"`; \}, \{ `internalType`: `"bytes"`; `name`: `"returnData"`; `type`: `"bytes"`; \}\]; `internalType`: `"struct IMulticall3.Result[]"`; `name`: `"returnData"`; `type`: `"tuple[]"`; \}\]; `stateMutability`: `"payable"`; `type`: `"function"`; \}\]

### methodIdentifiers

> **methodIdentifiers**: `object`

#### methodIdentifiers.aggregate((address,bytes)\[\])

> `readonly` **aggregate((address,bytes)\[\])**: `"252dba42"` = `"252dba42"`

#### methodIdentifiers.aggregate3((address,bool,bytes)\[\])

> `readonly` **aggregate3((address,bool,bytes)\[\])**: `"82ad56cb"` = `"82ad56cb"`

#### methodIdentifiers.aggregate3Value((address,bool,uint256,bytes)\[\])

> `readonly` **aggregate3Value((address,bool,uint256,bytes)\[\])**: `"174dea71"` = `"174dea71"`

#### methodIdentifiers.blockAndAggregate((address,bytes)\[\])

> `readonly` **blockAndAggregate((address,bytes)\[\])**: `"c3077fa9"` = `"c3077fa9"`

#### methodIdentifiers.getBasefee()

> `readonly` **getBasefee()**: `"3e64a696"` = `"3e64a696"`

#### methodIdentifiers.getBlockHash(uint256)

> `readonly` **getBlockHash(uint256)**: `"ee82ac5e"` = `"ee82ac5e"`

#### methodIdentifiers.getBlockNumber()

> `readonly` **getBlockNumber()**: `"42cbb15c"` = `"42cbb15c"`

#### methodIdentifiers.getChainId()

> `readonly` **getChainId()**: `"3408e470"` = `"3408e470"`

#### methodIdentifiers.getCurrentBlockCoinbase()

> `readonly` **getCurrentBlockCoinbase()**: `"a8b0574e"` = `"a8b0574e"`

#### methodIdentifiers.getCurrentBlockDifficulty()

> `readonly` **getCurrentBlockDifficulty()**: `"72425d9d"` = `"72425d9d"`

#### methodIdentifiers.getCurrentBlockGasLimit()

> `readonly` **getCurrentBlockGasLimit()**: `"86d516e8"` = `"86d516e8"`

#### methodIdentifiers.getCurrentBlockTimestamp()

> `readonly` **getCurrentBlockTimestamp()**: `"0f28c97d"` = `"0f28c97d"`

#### methodIdentifiers.getEthBalance(address)

> `readonly` **getEthBalance(address)**: `"4d2301cc"` = `"4d2301cc"`

#### methodIdentifiers.getLastBlockHash()

> `readonly` **getLastBlockHash()**: `"27e86d6e"` = `"27e86d6e"`

#### methodIdentifiers.tryAggregate(bool,(address,bytes)\[\])

> `readonly` **tryAggregate(bool,(address,bytes)\[\])**: `"bce38bd7"` = `"bce38bd7"`

#### methodIdentifiers.tryBlockAndAggregate(bool,(address,bytes)\[\])

> `readonly` **tryBlockAndAggregate(bool,(address,bytes)\[\])**: `"399542e9"` = `"399542e9"`

### name

> **name**: `"IMulticall3"`
