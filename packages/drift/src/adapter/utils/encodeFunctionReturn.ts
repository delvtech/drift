import { AbiFunction } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeFunctionReturnParams } from "src/adapter/types/Adapter";
import type { FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParams } from "src/adapter/utils/prepareParams";

/**
 * Encodes a function return into {@linkcode Bytes}.
 */
export function encodeFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>(params: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes {
  return prepareFunctionReturn(params).data;
}

/**
 * Encodes a function return into {@linkcode Bytes} and its ABI.
 */
export function prepareFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>({ abi, fn, value }: EncodeFunctionReturnParams<TAbi, TFunctionName>) {
  try {
    const { abiEntry, params } = prepareParams({
      abi,
      type: "function",
      name: fn,
      kind: "outputs",
      value,
    });
    return {
      abiFn: abiEntry,
      data: AbiFunction.encodeResult(abiEntry, params as any, { as: "Array" }),
    };
  } catch (e) {
    handleError(e);
  }
}
