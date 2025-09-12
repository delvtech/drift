import type { Abi, AbiEntry, Address, Bytes } from "src/adapter/types/Abi";
import type {
  BytecodeCallParams,
  EncodeDeployDataParams,
  EncodedDeployCallParams,
  FunctionCallParams,
  TargetCallParams,
} from "src/adapter/types/Adapter";
import type { FunctionName } from "src/adapter/types/Function";
import { encodeBytecodeCallData } from "src/adapter/utils/encodeBytecodeCallData";
import { prepareDeployData } from "src/adapter/utils/encodeDeployData";
import { prepareFunctionData } from "src/adapter/utils/encodeFunctionData";
import type { DEFAULT_CONSTRUCTOR } from "src/adapter/utils/prepareParams";
import type {
  Eval,
  NarrowTo,
  OneOf,
  PartialByOptional,
  Replace,
} from "src/utils/types";

/**
 * Parameters for preparing a call, which can be a function call, deploy call,
 * or an encoded call.
 */
export type PrepareCallParams<
  TAbi extends Abi = Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
> = OneOf<
  | TargetCallParams
  | BytecodeCallParams
  | FunctionCallParams<TAbi, TFunctionName>
  | EncodeDeployDataParams<TAbi>
  | EncodedDeployCallParams
>;

/**
 * A prepared call object, which includes the `to` address, `data` bytes, and an
 * optional `abiEntry` for decoding the return data.
 */
export type PreparedCall<TCall = PrepareCallParams> = Eval<
  PartialByOptional<{
    data: TCall extends { abi: Abi } | { bytecode: Bytes } | { data: Bytes }
      ? Bytes
      : undefined;
    to: TCall extends { to: infer TAddress extends Address }
      ? TAddress
      : TCall extends { address: infer TAddress extends Address }
        ? TAddress
        : undefined;
    abiEntry: TCall extends FunctionCallParams
      ? AbiEntry<
          TCall["abi"],
          "function",
          NarrowTo<{ fn: FunctionName<TCall["abi"]> }, TCall>["fn"]
        >
      : TCall extends EncodeDeployDataParams<infer TAbi>
        ? [AbiEntry<TAbi, "constructor">] extends [never]
          ? typeof DEFAULT_CONSTRUCTOR
          : AbiEntry<TAbi, "constructor">
        : undefined;
  }>
>;

/**
 * Converts a function call, deploy call, or an encoded call into an encoded
 * call object and an optional abi entry which can be used to decode the
 * return data.
 *
 * @example
 * ```ts
 * const approveCall = prepareCall({
 *   abi: erc20.abi,
 *   address: "0x123...",
 *   fn: "approve",
 *   args: { amount: 123n, spender: "0x..." },
 * });
 * // -> {
 * //   to: "0x123...",
 * //   data: "0x...",
 * //   abiEntry: { type: "function", name: "approve", ... },
 * // }}
 *
 * const bytecodeCall = prepareCall({
 *   bytecode: "0x...",
 *   data: "0x...",
 * });
 * // -> {
 * //   data: "0x...",
 * // }
 * ```
 */
export function prepareCall<TCall>({
  abi,
  address,
  fn,
  args,
  to = address,
  bytecode,
  data,
  // Progressive narrowing for precise inference and auto-completion
}: NarrowTo<{ abi: Abi }, TCall>["abi"] extends infer TAbi extends Abi
  ? PrepareCallParams<
      TAbi,
      NarrowTo<{ fn: FunctionName<TAbi> }, TCall>["fn"]
    > extends infer TParams
    ? NarrowTo<TParams, Replace<TParams, TCall>>
    : never
  : never): PreparedCall<TCall> {
  // ABI function call
  if (abi && fn) {
    const { abiEntry, data } = prepareFunctionData({ abi, fn, args });
    return { to, data, abiEntry } as PreparedCall as PreparedCall<TCall>;
  }

  // ABI deploy call
  if (abi && bytecode) {
    const { abiEntry, data } = prepareDeployData({ abi, bytecode, args });
    return { data, abiEntry } as PreparedCall as PreparedCall<TCall>;
  }

  // Bytecode call
  if (bytecode && data) {
    return {
      data: encodeBytecodeCallData(bytecode, data),
    } as PreparedCall as PreparedCall<TCall>;
  }

  // Encoded call
  return { to, data } as PreparedCall as PreparedCall<TCall>;
}
