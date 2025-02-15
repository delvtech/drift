import type { AbiFunction as AbiFunctionType } from "abitype";
import { AbiFunction } from "ox";
import type { Abi, AbiArrayType } from "src/adapter/types/Abi";
import type { DecodeFunctionReturnParams } from "src/adapter/types/Adapter";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import { arrayToFriendly } from "src/adapter/utils/arrayToFriendly";
import { handleError } from "src/adapter/utils/internal/handleError";
import type { Replace } from "src/utils/types";

export function decodeFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({
  abi,
  data,
  fn,
}: DecodeFunctionReturnParams<TAbi, TFunctionName>): FunctionReturn<
  TAbi,
  TFunctionName
> {
  try {
    const abiFn = AbiFunction.fromAbi(abi, fn as any);
    return _decodeFunctionReturn({
      abi,
      data,
      fn: abiFn,
    });
  } catch (e) {
    handleError(e);
  }
}

/**
 * An internal version of {@linkcode decodeFunctionReturn} that takes an
 * {@linkcode AbiFunction} instance instead of just a function name.
 * @internal
 */
export function _decodeFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({
  abi,
  data,
  fn,
}: Replace<
  DecodeFunctionReturnParams<TAbi, TFunctionName>,
  {
    fn: AbiFunctionType;
  }
>): FunctionReturn<TAbi, TFunctionName> {
  try {
    const decoded = AbiFunction.decodeResult(fn, data, {
      // Ox can also decode as "Object", but will still return arrays for tuples
      // with unnamed fields, so we decode as "Array" and run through
      // arrayToFriendly to ensure consistent output
      as: "Array",
    });

    // If there is only one output, Ox will return it as a single value, so we
    // return it directly
    if (fn.outputs.length === 1) {
      return decoded as FunctionReturn<TAbi, TFunctionName>;
    }

    return arrayToFriendly({
      abi,
      name: fn.name as TFunctionName,
      kind: "outputs",
      values: decoded as AbiArrayType<
        TAbi,
        "function",
        TFunctionName,
        "outputs"
      >,
    });
  } catch (e) {
    handleError(e);
  }
}
