import { AbiFunction } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeFunctionDataParams } from "src/adapter/types/Adapter";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParams } from "src/adapter/utils/prepareParams";

/**
 * Encodes a function call into {@linkcode Bytes}.
 */
export function encodeFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>(params: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes {
  return prepareFunctionData(params).data;
}

/**
 * Encodes a function call into {@linkcode Bytes} and its ABI.
 */
export function prepareFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi>,
>({ abi, args, fn }: EncodeFunctionDataParams<TAbi, TFunctionName>) {
  try {
    const { abiEntry, params } = prepareParams({
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
