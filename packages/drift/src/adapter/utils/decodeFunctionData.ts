import { AbiFunction, AbiParameters, Hex } from "ox";
import type { Abi } from "src/adapter/types/Abi";
import type { DecodeFunctionDataParams } from "src/adapter/types/Adapter";
import type {
  DecodedFunctionData,
  FunctionName,
} from "src/adapter/types/Function";
import { arrayToFriendly } from "src/adapter/utils/arrayToFriendly";
import { handleError } from "src/adapter/utils/internal/handleError";

export function decodeFunctionData<
  TAbi extends Abi,
  TFunctionName extends FunctionName<TAbi> = FunctionName<TAbi>,
>({
  abi,
  data,
}: DecodeFunctionDataParams<TAbi, TFunctionName>): DecodedFunctionData<
  TAbi,
  TFunctionName
> {
  try {
    const sig = Hex.slice(data, 0, 4);
    const abiFn = AbiFunction.fromAbi(abi, sig);
    const argsData = Hex.slice(data, 4);

    let args: any = AbiParameters.decode(abiFn.inputs, argsData, {
      // Ox can also decode as "Object", but will key unnamed params as `''`, so
      // we decode as "Array" and run through arrayToFriendly to ensure
      // consistent output.
      as: "Array",
    });

    if (Array.isArray(args)) {
      args = arrayToFriendly({
        abi,
        name: abiFn.name as any,
        kind: "inputs",
        values: args as any,
      });
    }

    return {
      functionName: abiFn.name as TFunctionName,
      args,
    };
  } catch (e) {
    handleError(e);
  }
}
