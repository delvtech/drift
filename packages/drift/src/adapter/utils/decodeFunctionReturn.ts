import type { Abi } from "abitype";
import { AbiFunction } from "ox";
import type { AbiArrayType } from "src/adapter/types/Abi";
import type { DecodeFunctionReturnParams } from "src/adapter/types/Adapter";
import type { FunctionName, FunctionReturn } from "src/adapter/types/Function";
import { arrayToFriendly } from "src/adapter/utils/arrayToFriendly";
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
    const arrayResult = AbiFunction.decodeResult(abiFn, data, {
      as: "Array",
    });

    return arrayToFriendly({
      abi,
      name: fn,
      kind: "outputs",
      values: arrayResult as AbiArrayType<
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