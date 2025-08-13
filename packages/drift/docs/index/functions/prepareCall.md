[**@delvtech/drift**](../../README.md)

***

[@delvtech/drift](../../README.md) / [index](../README.md) / prepareCall

# Function: prepareCall()

> **prepareCall**\<`TCall`\>(`__namedParameters`): \{ \[K in "to" \| "data" \| "abiEntry"\]: PartialByOptional\<\{ abiEntry: TCall extends FunctionCallParams ? ExtractFiltered\<TCall\<TCall\>\["abi"\]\[number\], AbiFilter\<"function", NarrowTo\<\{ fn: (...) extends (...) ? (...) : (...) \}, TCall\<TCall\>\>\["fn"\], undefined \| AbiStateMutability, undefined \| AbiParameterKind\>\> : TCall extends EncodeDeployDataParams\<TAbi\> ? \[AbiEntry\<TAbi, "constructor"\>\] extends \[never\] ? \{ inputs: never\[\]; stateMutability: "nonpayable"; type: "constructor" \} : AbiEntry\<TAbi, "constructor"\> : undefined; data: TCall extends \{ abi: Abi \} \| \{ bytecode: \`0x$\{string\}\` \} \| \{ data: \`0x$\{string\}\` \} ? \`0x$\{string\}\` : undefined; to: TCall extends \{ to: TAddress \} ? TAddress : TCall extends \{ address: TAddress \} ? TAddress : undefined \}\>\[K\] \}

Defined in: [packages/drift/src/adapter/utils/prepareCall.ts:91](https://github.com/delvtech/drift/blob/95370f81f9813e8d583ed884b0b07657be0d8f2c/packages/drift/src/adapter/utils/prepareCall.ts#L91)

Converts a function call, deploy call, or an encoded call into an encoded
call object and an optional abi entry which can be used to decode the
return data.

## Type Parameters

### TCall

`TCall`

## Parameters

### \_\_namedParameters

`NarrowTo`\<\{ `abi`: `Abi`; \}, `TCall`\>\[`"abi"`\] *extends* `TAbi` ? [`OneOf`](../type-aliases/OneOf.md)\<[`EncodedCallParams`](../interfaces/EncodedCallParams.md) \| [`BytecodeCallParams`](../interfaces/BytecodeCallParams.md) \| [`FunctionCallParams`](../type-aliases/FunctionCallParams.md)\<`TAbi`, `NarrowTo`\<\{ `fn`: [`FunctionName`](../type-aliases/FunctionName.md)\<`TAbi`\>; \}, `TCall`\>\[`"fn"`\]\> \| [`EncodeDeployDataParams`](../type-aliases/EncodeDeployDataParams.md)\<`TAbi`\>\> *extends* `TParams` ? `NarrowTo`\<`TParams`, [`Replace`](../type-aliases/Replace.md)\<`TParams`, `TCall`\>\> : `never` : `never`

## Returns

\{ \[K in "to" \| "data" \| "abiEntry"\]: PartialByOptional\<\{ abiEntry: TCall extends FunctionCallParams ? ExtractFiltered\<TCall\<TCall\>\["abi"\]\[number\], AbiFilter\<"function", NarrowTo\<\{ fn: (...) extends (...) ? (...) : (...) \}, TCall\<TCall\>\>\["fn"\], undefined \| AbiStateMutability, undefined \| AbiParameterKind\>\> : TCall extends EncodeDeployDataParams\<TAbi\> ? \[AbiEntry\<TAbi, "constructor"\>\] extends \[never\] ? \{ inputs: never\[\]; stateMutability: "nonpayable"; type: "constructor" \} : AbiEntry\<TAbi, "constructor"\> : undefined; data: TCall extends \{ abi: Abi \} \| \{ bytecode: \`0x$\{string\}\` \} \| \{ data: \`0x$\{string\}\` \} ? \`0x$\{string\}\` : undefined; to: TCall extends \{ to: TAddress \} ? TAddress : TCall extends \{ address: TAddress \} ? TAddress : undefined \}\>\[K\] \}

## Example

```ts
const approveCall = prepareCall({
  abi: erc20.abi,
  address: "0x123...",
  fn: "approve",
  args: { amount: 123n, spender: "0x..." },
});
// -> {
//   to: "0x123...",
//   data: "0x...",
//   abiEntry: { type: "function", name: "approve", ... },
// }}

const bytecodeCall = prepareCall({
  bytecode: "0x...",
  data: "0x...",
});
// -> {
//   data: "0x...",
// }
```
