import { AbiFunction } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeFunctionReturnParams } from "src/adapter/types/Adapter";
import type { FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParams } from "src/adapter/utils/prepareParams";

export function encodeFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({ abi, fn, value }: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes {
  try {
    const { abiEntry, params } = prepareParams({
      abi,
      type: "function",
      name: fn,
      kind: "outputs",
      value,
    });
    return AbiFunction.encodeResult(
      abiEntry as AbiFunction.AbiFunction,
      params,
      { as: "Array" },
    );
  } catch (e) {
    handleError(e);
  }
}
