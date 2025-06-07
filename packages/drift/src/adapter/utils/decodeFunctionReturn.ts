import { AbiFunction } from "ox";
import type { Abi, AbiArrayType } from "src/adapter/types/Abi";
import type { DecodeFunctionReturnParams } from "src/adapter/types/Adapter";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import { arrayToSimplified } from "src/adapter/utils/arrayToSimplified";
import { handleError } from "src/adapter/utils/internal/handleError";

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
    const decoded = AbiFunction.decodeResult(abiFn, data, {
      // Ox can also decode as "Object", but will still return arrays for tuples
      // with unnamed fields, so we decode as "Array" and run through
      // arrayToSimplified to ensure consistent output
      as: "Array",
    });

    // If there is only one output, Ox will return it as a single value, so we
    // return it directly
    if (abiFn.outputs.length === 1) {
      return decoded as FunctionReturn<TAbi, TFunctionName>;
    }

    return arrayToSimplified({
      abi,
      name: abiFn.name as TFunctionName,
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
