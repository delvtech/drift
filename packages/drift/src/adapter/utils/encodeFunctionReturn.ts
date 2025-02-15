import { AbiFunction, type AbiItem } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeFunctionReturnParams } from "src/adapter/types/Adapter";
import type { FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { toArrayParams } from "src/adapter/utils/toArrayParams";

export function encodeFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({ abi, fn, value }: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes {
  try {
    const paramsArray = toArrayParams({
      abi,
      type: "function",
      name: fn,
      kind: "outputs",
      value,
    });
    const abiFn = AbiFunction.fromAbi(
      abi,
      fn as any,
      {
        args: paramsArray,
      } as AbiItem.fromAbi.Options,
    );
    return AbiFunction.encodeResult(abiFn, paramsArray, {
      as: "Array",
    });
  } catch (e) {
    handleError(e);
  }
}
