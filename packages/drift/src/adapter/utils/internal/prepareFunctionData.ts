import type { Abi } from "abitype";
import { AbiFunction, type AbiItem } from "ox";
import type { FunctionArgs, FunctionName } from "src/adapter/types/Function";
import { handleError } from "src/adapter/utils/internal/handleError";
import { objectToArray } from "src/adapter/utils/objectToArray";

/** @internal */
export function prepareFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">,
>({
  abi,
  args,
  fn,
}: { abi: TAbi; fn: TFunctionName; args: FunctionArgs<TAbi, TFunctionName> }) {
  try {
    const argsArray = objectToArray({
      abi,
      type: "function",
      name: fn,
      kind: "inputs",
      value: args as FunctionArgs<TAbi, TFunctionName>,
    });
    const abiFn = AbiFunction.fromAbi(
      abi,
      fn as any,
      {
        args: argsArray,
      } as AbiItem.fromAbi.Options,
    );
    return {
      abiFn,
      data: AbiFunction.encodeData(abiFn, argsArray),
    };
  } catch (e) {
    handleError(e);
  }
}
