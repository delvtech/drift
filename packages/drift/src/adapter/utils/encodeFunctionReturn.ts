import { AbiFunction } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeFunctionReturnParams } from "src/adapter/types/Adapter";
import type { FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";

export function encodeFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({ abi, fn, value }: EncodeFunctionReturnParams<TAbi, TFunctionName>): Bytes {
  try {
    const abiFn = AbiFunction.fromAbi(abi, fn as any);
    return AbiFunction.encodeResult(abiFn, value as any, {
      as: "Object",
    });
  } catch (e) {
    handleError(e);
  }
}
