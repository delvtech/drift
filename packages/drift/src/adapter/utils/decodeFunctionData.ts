import { AbiFunction, AbiParameters, Hex } from "ox";
import type { Abi } from "src/adapter/types/Abi";
import type { DecodeFunctionDataParams } from "src/adapter/types/Adapter";
import type {
  DecodedFunctionData,
  FunctionArgs,
  FunctionName,
} from "src/adapter/types/Function";
import { arrayToObject } from "src/adapter/utils/arrayToObject";
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
    const argsData = Hex.slice(data, 4);
    const abiFn = AbiFunction.fromAbi(abi, sig);
    const arrayArgs = AbiParameters.decode(abiFn.inputs, argsData, {
      // Ox can also decode as "Object", but will key unnamed params as `''`, so
      // we decode as "Array" and run through arrayToObject to ensure consistent
      // output.
      as: "Array",
      checksumAddress: true,
    }) as any;
    const args: FunctionArgs<TAbi, TFunctionName> = arrayToObject({
      abi,
      name: abiFn.name as TFunctionName,
      kind: "inputs",
      values: arrayArgs,
    });
    return {
      functionName: abiFn.name as TFunctionName,
      args,
    };
  } catch (e) {
    handleError(e);
  }
}
