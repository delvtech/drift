import { AbiFunction } from "ox";
import type { Abi, AbiEntry, Bytes } from "src/adapter/types/Abi";
import type { EncodeFunctionDataParams } from "src/adapter/types/Adapter";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { _toParamsArray } from "src/adapter/utils/toParamsArray";

/**
 * Encodes a function call into {@linkcode Bytes}.
 */
export function encodeFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({ abi, fn, args }: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes {
  const { data } = _encodeFunctionData({
    abi,
    fn,
    args: args as FunctionArgs<TAbi, TFunctionName>,
  });
  return data;
}

/**
 * An internal version of {@linkcode encodeFunctionData} that includes the
 * {@linkcode AbiEntry} in the return object.
 * @internal
 */
export function _encodeFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
>({
  abi,
  args,
  fn,
}: { abi: TAbi; fn: TFunctionName; args: FunctionArgs<TAbi, TFunctionName> }) {
  try {
    const { abiEntry, params } = _toParamsArray({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args as FunctionArgs<TAbi, TFunctionName>,
    });
    return {
      abiFn: abiEntry,
      data: AbiFunction.encodeData(abiEntry, params),
    };
  } catch (e) {
    handleError(e);
  }
}
