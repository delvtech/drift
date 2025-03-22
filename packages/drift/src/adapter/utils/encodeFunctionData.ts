import { AbiFunction } from "ox";
import type { Abi, Bytes } from "src/adapter/types/Abi";
import type { EncodeFunctionDataParams } from "src/adapter/types/Adapter";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { prepareParamsArray } from "src/adapter/utils/prepareParamsArray";

/**
 * Encodes a function call into {@linkcode Bytes}.
 */
export function encodeFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({ abi, fn, args }: EncodeFunctionDataParams<TAbi, TFunctionName>): Bytes {
  const { data } = prepareFunctionData({
    abi,
    fn,
    args: args as FunctionArgs<TAbi, TFunctionName>,
  });
  return data;
}

/**
 * Encodes a function call into {@linkcode Bytes} and its ABI.
 */
export function prepareFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
>({
  abi,
  args,
  fn,
}: { abi: TAbi; fn: TFunctionName; args: FunctionArgs<TAbi, TFunctionName> }) {
  try {
    const { abiEntry, params } = prepareParamsArray({
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
