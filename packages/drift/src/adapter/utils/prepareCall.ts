import type { Abi, AbiEntry, Address, Bytes } from "src/adapter/types/Abi";
import type {
  BytecodeCallParams,
  EncodeDeployDataParams,
  EncodedDeployCallParams,
  FunctionCallParams,
  TargetCallParams
} from "src/adapter/types/Adapter";
import type {
  ConstructorArgs,
  FunctionArgs,
  FunctionName,
} from "src/adapter/types/Function";
import { encodeBytecodeCallData } from "src/adapter/utils/encodeBytecodeCallData";
import { prepareDeployData } from "src/adapter/utils/encodeDeployData";
import { prepareFunctionData } from "src/adapter/utils/encodeFunctionData";
import type { DEFAULT_CONSTRUCTOR } from "src/adapter/utils/prepareParams";
import type { Eval, NarrowTo, OneOf } from "src/utils/types";

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
export type PreparedCall<TCall = PrepareCallParams> = Eval<{
  to: TCall extends { to: infer TAddress extends Address }
    ? TAddress
    : TCall extends { address: infer TAddress extends Address }
      ? TAddress
      : undefined;
  data: TCall extends { abi: Abi } | { bytecode: Bytes } | { data: Bytes }
    ? Bytes
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
}>;

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
export function prepareCall<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
  const TCall extends PrepareCallParams<TAbi, TFunctionName>,
>({
  abi,
  address,
  fn,
  args,
  to,
  bytecode,
  data,
}: PrepareCallParams<TAbi, TFunctionName> & TCall): PreparedCall<TCall> {
  // ABI function call
  if (abi && fn) {
    const { abiEntry, data } = prepareFunctionData({
      abi,
      fn,
      args: args as FunctionArgs<TAbi, TFunctionName>,
    });
    return {
      to: address,
      data,
      abiEntry,
    } as PreparedCall as PreparedCall<TCall>;
  }

  // ABI deploy call
  if (abi && bytecode) {
    const { abiEntry, data } = prepareDeployData({
      abi,
      bytecode,
      args: args as ConstructorArgs<TAbi>,
    });
    return {
      to: undefined,
      data,
      abiEntry,
    } as PreparedCall as PreparedCall<TCall>;
  }

  // Bytecode call
  if (bytecode && data) {
    return {
      to: undefined,
      data: encodeBytecodeCallData(bytecode, data),
      abiEntry: undefined,
    } as PreparedCall as PreparedCall<TCall>;
  }

  // Target call
  return {
    to,
    data,
    abiEntry: undefined,
  } as PreparedCall as PreparedCall<TCall>;
}
